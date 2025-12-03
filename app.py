import os
import uuid
import tempfile
import shutil
import threading
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-123')
CORS(app)

DOWNLOAD_DIR = '/tmp/video-downloader'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

download_status = {}
status_lock = threading.Lock()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Video Downloader API'})

@app.route('/api/info', methods=['POST'])
def video_info():
    try:
        data = request.json
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'URL required'}), 400
            
        ydl_opts = {'quiet': True, 'no_warnings': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return jsonify({
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'uploader': info.get('uploader'),
                'success': True
            })
            
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    # Development
    if os.environ.get('DEBUG') == 'True':
        app.run(host='0.0.0.0', port=port, debug=True)
    else:
        # Production
        from waitress import serve
        serve(app, host='0.0.0.0', port=port)
