import os
import uuid
import json
import tempfile
import shutil
import threading
import time
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file, render_template, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import yt_dlp
import humanize
from urllib.parse import urlparse

# ========== INITIALIZATION ==========
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-' + str(uuid.uuid4()))
app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_FILE_SIZE', 500 * 1024 * 1024))  # 500MB default
CORS(app)

# Rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour", "20 per minute"],
    storage_uri="memory://",
    strategy="fixed-window",
)

# ========== CONFIGURATION ==========
DOWNLOAD_DIR = os.path.join(tempfile.gettempdir(), 'video-downloader')
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Cleanup settings
CLEANUP_AGE_MINUTES = 60  # Clean files after 1 hour
MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 500 * 1024 * 1024))  # 500MB

# Status tracking
download_status = {}
status_lock = threading.Lock()

# ========== HELPER FUNCTIONS ==========
def is_valid_url(url):
    """Validate URL format"""
    try:
        result = urlparse(url)
        return all([result.scheme in ['http', 'https'], result.netloc])
    except:
        return False

def format_file_size(size_bytes):
    """Convert bytes to human readable format"""
    if size_bytes:
        return humanize.naturalsize(size_bytes)
    return "Unknown size"

def format_duration(seconds):
    """Format duration in seconds to readable format"""
    if not seconds:
        return "Unknown"
    return humanize.precisedelta(timedelta(seconds=seconds), minimum_unit="seconds")

def cleanup_old_files():
    """Remove files older than CLEANUP_AGE_MINUTES"""
    try:
        cutoff = datetime.now() - timedelta(minutes=CLEANUP_AGE_MINUTES)
        for item in os.listdir(DOWNLOAD_DIR):
            item_path = os.path.join(DOWNLOAD_DIR, item)
            if os.path.isdir(item_path):
                try:
                    dir_time = datetime.fromtimestamp(os.path.getmtime(item_path))
                    if dir_time < cutoff:
                        shutil.rmtree(item_path, ignore_errors=True)
                        with status_lock:
                            if item in download_status:
                                del download_status[item]
                except Exception as e:
                    app.logger.error(f"Cleanup error for {item_path}: {e}")
    except Exception as e:
        app.logger.error(f"Cleanup error: {e}")

def update_progress(download_id, data):
    """Update download progress in status"""
    if data['status'] == 'downloading':
        with status_lock:
            if download_id in download_status:
                download_status[download_id].update({
                    'status': 'downloading',
                    'progress': data.get('_percent_str', '0%').strip(),
                    'speed': data.get('_speed_str', 'N/A'),
                    'eta': data.get('_eta_str', 'N/A'),
                    'downloaded': data.get('downloaded_bytes', 0),
                    'total': data.get('total_bytes', 0),
                    'updated_at': datetime.now().isoformat()
                })

def get_ydl_options(format_type, quality=None):
    """Get yt-dlp options based on format"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'socket_timeout': 30,
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web']
            }
        },
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    }
    
    if format_type == 'mp3':
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'writethumbnail': True,
            'postprocessor_args': [
                '-metadata', 'title=%(title)s',
                '-metadata', 'artist=%(uploader)s'
            ],
            'keepvideo': False,
        })
    elif format_type == 'mp4':
        if quality == 'best':
            ydl_opts['format'] = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
        elif quality and quality.isdigit():
            ydl_opts['format'] = f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]'
        else:
            ydl_opts['format'] = 'best[ext=mp4]/best'
    elif format_type == 'webm':
        ydl_opts['format'] = 'bestvideo[ext=webm]+bestaudio[ext=webm]/best[ext=webm]/best'
    
    return ydl_opts

# ========== DOWNLOAD THREAD ==========
def download_thread(url, options, download_id):
    """Background thread for downloading videos"""
    try:
        download_path = os.path.join(DOWNLOAD_DIR, download_id)
        os.makedirs(download_path, exist_ok=True)
        
        ydl_opts = get_ydl_options(options.get('format', 'mp4'), options.get('quality'))
        ydl_opts['outtmpl'] = os.path.join(download_path, '%(title)s.%(ext)s')
        ydl_opts['progress_hooks'] = [lambda d: update_progress(download_id, d)]
        
        with status_lock:
            download_status[download_id] = {
                'status': 'downloading',
                'url': url,
                'format': options.get('format', 'mp4'),
                'quality': options.get('quality'),
                'progress': '0%',
                'speed': 'N/A',
                'eta': 'N/A',
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            # Find downloaded file
            files = os.listdir(download_path)
            if files:
                filename = files[0]
                filepath = os.path.join(download_path, filename)
                filesize = os.path.getsize(filepath)
                
                with status_lock:
                    download_status[download_id] = {
                        'status': 'completed',
                        'filename': filename,
                        'filepath': filepath,
                        'filesize': filesize,
                        'title': info.get('title', 'Unknown'),
                        'duration': info.get('duration', 0),
                        'thumbnail': info.get('thumbnail'),
                        'uploader': info.get('uploader', 'Unknown'),
                        'completed_at': datetime.now().isoformat(),
                        'webpage_url': info.get('webpage_url', url)
                    }
                
                app.logger.info(f"Download completed: {filename} ({format_file_size(filesize)})")
            else:
                raise Exception("No file was downloaded")
                
    except Exception as e:
        app.logger.error(f"Download error for {download_id}: {e}")
        with status_lock:
            download_status[download_id] = {
                'status': 'error',
                'error': str(e),
                'failed_at': datetime.now().isoformat()
            }

# ========== ROUTES ==========
@app.route('/')
def index():
    """Serve main page"""
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('static', filename)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Video Downloader API',
        'version': '1.0.0'
    })

@app.route('/api/info', methods=['POST'])
@limiter.limit("30 per minute")
def get_video_info():
    """Get video information"""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'success': False, 'error': 'URL is required'}), 400
        
        url = data['url'].strip()
        if not is_valid_url(url):
            return jsonify({'success': False, 'error': 'Invalid URL format'}), 400
        
        # Check if URL is from supported site
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'socket_timeout': 15,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract available formats
            formats = []
            if '_type' in info and info['_type'] == 'playlist':
                return jsonify({
                    'success': True,
                    'type': 'playlist',
                    'title': info.get('title'),
                    'entries': len(info.get('entries', [])),
                    'uploader': info.get('uploader'),
                    'webpage_url': info.get('webpage_url')
                })
            
            # For single video
            if 'formats' in info:
                video_formats = []
                audio_formats = []
                
                for fmt in info['formats']:
                    format_info = {
                        'id': fmt.get('format_id'),
                        'ext': fmt.get('ext'),
                        'resolution': fmt.get('resolution', 'N/A'),
                        'filesize': fmt.get('filesize'),
                        'format_note': fmt.get('format_note', ''),
                        'vcodec': fmt.get('vcodec'),
                        'acodec': fmt.get('acodec'),
                        'has_video': fmt.get('vcodec') not in [None, 'none'],
                        'has_audio': fmt.get('acodec') not in [None, 'none'],
                    }
                    
                    if format_info['has_video'] and format_info['has_audio']:
                        video_formats.append(format_info)
                    elif format_info['has_audio'] and not format_info['has_video']:
                        audio_formats.append(format_info)
                
                # Sort video formats by resolution
                video_formats.sort(key=lambda x: (
                    int(x['resolution'].split('x')[1]) if 'x' in x['resolution'] else 0
                ), reverse=True)
                
                formats = video_formats + audio_formats[:3]  # Top 3 audio formats
            
            response = {
                'success': True,
                'id': info.get('id'),
                'title': info.get('title', 'Unknown'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'uploader': info.get('uploader', 'Unknown'),
                'upload_date': info.get('upload_date'),
                'view_count': info.get('view_count'),
                'like_count': info.get('like_count'),
                'description': info.get('description', '')[:500] + ('...' if len(info.get('description', '')) > 500 else ''),
                'formats': formats[:20],  # Limit to 20 formats
                'webpage_url': info.get('webpage_url', url),
                'extractor': info.get('extractor_key', 'unknown').title(),
                'categories': info.get('categories', []),
                'tags': info.get('tags', [])[:10]
            }
            
            return jsonify(response)
            
    except yt_dlp.utils.DownloadError as e:
        return jsonify({'success': False, 'error': f'Download error: {str(e)}'}), 400
    except Exception as e:
        app.logger.error(f"Info error: {e}")
        return jsonify({'success': False, 'error': f'Failed to get video info: {str(e)}'}), 500

@app.route('/api/download', methods=['POST'])
@limiter.limit("10 per hour")
def start_download():
    """Start a video download"""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'success': False, 'error': 'URL is required'}), 400
        
        url = data['url'].strip()
        if not is_valid_url(url):
            return jsonify({'success': False, 'error': 'Invalid URL format'}), 400
        
        format_type = data.get('format', 'mp4')
        quality = data.get('quality', 'best')
        
        # Validate format
        valid_formats = ['mp4', 'mp3', 'webm', 'best']
        if format_type not in valid_formats:
            return jsonify({'success': False, 'error': f'Invalid format. Valid: {", ".join(valid_formats)}'}), 400
        
        # Generate download ID
        download_id = str(uuid.uuid4())
        
        # Start download in background thread
        thread = threading.Thread(
            target=download_thread,
            args=(url, {'format': format_type, 'quality': quality}, download_id),
            daemon=True
        )
        thread.start()
        
        # Schedule cleanup
        cleanup_old_files()
        
        return jsonify({
            'success': True,
            'download_id': download_id,
            'message': 'Download started in background',
            'status_url': f'/api/status/{download_id}'
        })
        
    except Exception as e:
        app.logger.error(f"Download start error: {e}")
        return jsonify({'success': False, 'error': f'Failed to start download: {str(e)}'}), 500

@app.route('/api/status/<download_id>', methods=['GET'])
def get_status(download_id):
    """Get download status"""
    try:
        with status_lock:
            status = download_status.get(download_id, {})
        
        if not status:
            return jsonify({'error': 'Download not found'}), 404
        
        # Don't expose internal paths
        response = status.copy()
        if 'filepath' in response:
            del response['filepath']
        
        # Add formatted sizes if available
        if 'filesize' in response:
            response['filesize_formatted'] = format_file_size(response['filesize'])
        if 'duration' in response:
            response['duration_formatted'] = format_duration(response['duration'])
        
        return jsonify(response)
        
    except Exception as e:
        app.logger.error(f"Status error: {e}")
        return jsonify({'error': f'Failed to get status: {str(e)}'}), 500

@app.route('/api/download-file/<download_id>', methods=['GET'])
def download_file(download_id):
    """Download the completed file"""
    try:
        with status_lock:
            status = download_status.get(download_id, {})
        
        if not status or status.get('status') != 'completed':
            return jsonify({'error': 'File not ready or not found'}), 404
        
        filepath = status.get('filepath')
        filename = status.get('filename', 'download')
        
        if not filepath or not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404
        
        # Check file size limit
        filesize = os.path.getsize(filepath)
        if filesize > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large'}), 413
        
        # Determine MIME type
        ext = os.path.splitext(filename)[1].lower()
        mime_types = {
            '.mp4': 'video/mp4',
            '.mp3': 'audio/mpeg',
            '.webm': 'video/webm',
            '.m4a': 'audio/mp4',
            '.mkv': 'video/x-matroska',
            '.avi': 'video/x-msvideo',
            '.mov': 'video/quicktime',
        }
        mimetype = mime_types.get(ext, 'application/octet-stream')
        
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename,
            mimetype=mimetype
        )
        
    except Exception as e:
        app.logger.error(f"Download file error: {e}")
        return jsonify({'error': f'Failed to download file: {str(e)}'}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get server statistics"""
    try:
        with status_lock:
            active = sum(1 for s in download_status.values() if s.get('status') in ['downloading'])
            completed = sum(1 for s in download_status.values() if s.get('status') == 'completed')
            failed = sum(1 for s in download_status.values() if s.get('status') == 'error')
            
            # Calculate directory size
            total_size = 0
            for root, dirs, files in os.walk(DOWNLOAD_DIR):
                for file in files:
                    filepath = os.path.join(root, file)
                    if os.path.exists(filepath):
                        total_size += os.path.getsize(filepath)
        
        return jsonify({
            'active_downloads': active,
            'completed_downloads': completed,
            'failed_downloads': failed,
            'total_downloads': len(download_status),
            'storage_used': format_file_size(total_size),
            'cleanup_age_minutes': CLEANUP_AGE_MINUTES,
            'max_file_size': format_file_size(MAX_FILE_SIZE),
            'server_time': datetime.now().isoformat(),
            'uptime': time.time() - app_start_time
        })
        
    except Exception as e:
        app.logger.error(f"Stats error: {e}")
        return jsonify({'error': f'Failed to get stats: {str(e)}'}), 500

@app.route('/api/supported-sites', methods=['GET'])
def supported_sites():
    """Get list of supported sites"""
    sites = [
        "YouTube", "Facebook", "Instagram", "TikTok", "Twitter",
        "Reddit", "Vimeo", "Dailymotion", "Twitch", "SoundCloud",
        "Bandcamp", "Vine", "Imgur", "Flickr", "Tumblr",
        "LiveLeak", "Metacafe", "9GAG", "Bilibili", "Likee",
        "Douyin", "Kuaishou", "Naver TV", "Niconico", "Ok.ru",
        "Rutube", "VK", "YouTube Music", "Spotify", "Apple Music"
    ]
    return jsonify({
        'sites': sites,
        'count': len(sites),
        'note': 'yt-dlp supports 1000+ sites. This is a partial list.'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(429)
def ratelimit_handler(error):
    return jsonify({
        'error': 'Rate limit exceeded',
        'message': 'Please wait before making more requests'
    }), 429

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"Internal error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

# ========== STARTUP ==========
app_start_time = time.time()

# Initial cleanup
cleanup_old_files()

# Schedule periodic cleanup
def periodic_cleanup():
    while True:
        time.sleep(300)  # Every 5 minutes
        cleanup_old_files()

cleanup_thread = threading.Thread(target=periodic_cleanup, daemon=True)
cleanup_thread.start()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    if debug:
        app.run(host='0.0.0.0', port=port, debug=debug)
    else:
        # Production server
        from waitress import serve
        serve(app, host='0.0.0.0', port=port)
