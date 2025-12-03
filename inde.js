<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎥 Video Downloader - Download from 1000+ Sites</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #667eea;
            --primary-dark: #5a67d8;
            --secondary: #764ba2;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --dark: #1f2937;
            --light: #f9fafb;
            --gray: #6b7280;
            --border: #e5e7eb;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Header Styles */
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            padding: 30px 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 800px;
            margin: 0 auto 20px;
        }
        
        .tagline {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        
        /* Card Styles */
        .card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-title {
            font-size: 1.5rem;
            color: var(--dark);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card-title i {
            color: var(--primary);
        }
        
        /* Input Styles */
        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .input-group {
                flex-direction: column;
            }
        }
        
        .url-input {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid var(--border);
            border-radius: 12px;
            font-size: 16px;
            font-family: inherit;
            transition: all 0.3s ease;
        }
        
        .url-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .url-input::placeholder {
            color: var(--gray);
        }
        
        /* Button Styles */
        .btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
        
        .btn-secondary {
            background: var(--light);
            color: var(--dark);
            border: 2px solid var(--border);
        }
        
        .btn-secondary:hover {
            background: var(--border);
        }
        
        .btn-success {
            background: var(--success);
        }
        
        .btn-danger {
            background: var(--danger);
        }
        
        .btn-small {
            padding: 8px 16px;
            font-size: 14px;
        }
        
        /* Video Info Styles */
        .video-info {
            display: none;
            animation: fadeIn 0.5s ease;
        }
        
        .video-preview {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .thumbnail-container {
            position: relative;
            flex-shrink: 0;
        }
        
        .thumbnail {
            width: 320px;
            height: 180px;
            border-radius: 12px;
            object-fit: cover;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .duration-badge {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .video-details {
            flex: 1;
            min-width: 300px;
        }
        
        .video-title {
            font-size: 1.8rem;
            margin-bottom: 15px;
            color: var(--dark);
            line-height: 1.3;
        }
        
        .video-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 15px;
            color: var(--gray);
            font-size: 0.9rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .video-description {
            color: var(--gray);
            line-height: 1.6;
            max-height: 100px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        /* Formats Grid */
        .formats-section {
            margin-top: 30px;
        }
        
        .formats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .format-btn {
            padding: 15px;
            border: 2px solid var(--border);
            border-radius: 10px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
        }
        
        .format-btn:hover {
            border-color: var(--primary);
            background: rgba(102, 126, 234, 0.05);
            transform: translateY(-2px);
        }
        
        .format-btn.selected {
            border-color: var(--primary);
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            color: var(--primary-dark);
        }
        
        .format-icon {
            font-size: 24px;
            margin-bottom: 10px;
            color: var(--primary);
        }
        
        .format-name {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .format-details {
            font-size: 0.85rem;
            color: var(--gray);
            line-height: 1.4;
        }
        
        /* Download Section */
        .download-section {
            display: none;
            margin-top: 30px;
            animation: fadeIn 0.5s ease;
        }
        
        .progress-container {
            background: var(--light);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border: 2px solid var(--border);
        }
        
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .progress-bar {
            height: 12px;
            background: var(--border);
            border-radius: 6px;
            overflow: hidden;
            margin: 20px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 6px;
        }
        
        .progress-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: var(--gray);
            margin-top: 10px;
        }
        
        /* Status Messages */
        .status-message {
            margin: 20px 0;
            padding: 15px 20px;
            border-radius: 10px;
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .status-success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .status-error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .status-info {
            background: rgba(102, 126, 234, 0.1);
            color: var(--primary);
            border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .status-warning {
            background: rgba(245, 158, 11, 0.1);
            color: var(--warning);
            border: 1px solid rgba(245, 158, 11, 0.2);
        }
        
        /* Loader */
        .loader {
            display: none;
            text-align: center;
            padding: 40px;
        }
        
        .spinner {
            border: 4px solid rgba(0,0,0,0.1);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        /* Stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            color: white;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .stat-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            color: white;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        
        .footer-link:hover {
            opacity: 1;
        }
        
        /* Animations */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        /* Utility Classes */
        .text-center { text-align: center; }
        .mt-20 { margin-top: 20px; }
        .mt-30 { margin-top: 30px; }
        .mb-20 { margin-bottom: 20px; }
        .hidden { display: none; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .gap-10 { gap: 10px; }
        .gap-20 { gap: 20px; }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .video-preview {
                flex-direction: column;
            }
            
            .thumbnail {
                width: 100%;
                height: auto;
                max-height: 200px;
            }
            
            .formats-grid {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1><i class="fas fa-download"></i> Video Downloader</h1>
            <p>Download videos from YouTube, Facebook, Instagram, TikTok, and 1000+ other websites</p>
            <span class="tagline">
                <i class="fas fa-bolt"></i> Fast • <i class="fas fa-shield-alt"></i> Secure • <i class="fas fa-infinity"></i> Unlimited
            </span>
        </div>
        
        <!-- Main Card -->
        <div class="card">
            <h2 class="card-title">
                <i class="fas fa-link"></i> Enter Video URL
            </h2>
            
            <div class="input-group">
                <input type="url" 
                       class="url-input" 
                       id="videoUrl"
                       placeholder="https://youtube.com/watch?v=... or https://www.tiktok.com/@user/video/..."
                       autocomplete="off">
                <button class="btn" id="infoBtn" onclick="getVideoInfo()">
                    <i class="fas fa-search"></i> Analyze Video
                </button>
            </div>
            
            <div class="text-center">
                <small style="color: var(--gray);">
                    <i class="fas fa-info-circle"></i> Supports: YouTube, Facebook, Instagram, TikTok, Twitter, Reddit, and 1000+ more
                </small>
            </div>
            
            <!-- Loader -->
            <div class="loader" id="loader">
                <div class="spinner"></div>
                <p>Fetching video information...</p>
            </div>
            
            <!-- Status Message -->
            <div class="status-message" id="statusMessage"></div>
            
            <!-- Video Information -->
            <div class="video-info" id="videoInfo">
                <div class="video-preview">
                    <div class="thumbnail-container">
                        <img id="thumbnail" class="thumbnail" src="" alt="Video thumbnail">
                        <div class="duration-badge" id="durationBadge"></div>
                    </div>
                    <div class="video-details">
                        <h2 class="video-title" id="videoTitle"></h2>
                        <div class="video-meta">
                            <span class="meta-item" id="uploaderMeta">
                                <i class="fas fa-user"></i> <span id="videoUploader"></span>
                            </span>
                            <span class="meta-item" id="viewsMeta">
                                <i class="fas fa-eye"></i> <span id="videoViews"></span>
                            </span>
                            <span class="meta-item" id="dateMeta">
                                <i class="fas fa-calendar"></i> <span id="uploadDate"></span>
                            </span>
                            <span class="meta-item" id="platformMeta">
                                <i class="fas fa-globe"></i> <span id="videoPlatform"></span>
                            </span>
                        </div>
                        <p class="video-description" id="videoDescription"></p>
                    </div>
                </div>
                
                <!-- Available Formats -->
                <div class="formats-section">
                    <h3 class="card-title">
                        <i class="fas fa-file-video"></i> Available Formats
                    </h3>
                    <div class="formats-grid" id="formatsGrid"></div>
                </div>
                
                <!-- Download Section -->
                <div class="download-section" id="downloadSection">
                    <h3 class="card-title">
                        <i class="fas fa-download"></i> Download Progress
                    </h3>
                    
                    <div class="progress-container">
                        <div class="progress-header">
                            <span id="downloadTitle">Preparing download...</span>
                            <span id="progressPercent">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="progress-info">
                            <span id="downloadSpeed">
                                <i class="fas fa-tachometer-alt"></i> Speed: N/A
                            </span>
                            <span id="downloadETA">
                                <i class="fas fa-clock"></i> ETA: N/A
                            </span>
                            <span id="downloadSize">
                                <i class="fas fa-database"></i> Size: N/A
                            </span>
                        </div>
                    </div>
                    
                    <div class="status-message" id="downloadMessage"></div>
                    
                    <div class="flex gap-10" style="flex-wrap: wrap;">
                        <button class="btn" id="downloadBtn" onclick="startDownload()">
                            <i class="fas fa-download"></i> Start Download
                        </button>
                        <button class="btn btn-secondary" onclick="resetForm()">
                            <i class="fas fa-redo"></i> New Download
                        </button>
                        <button class="btn btn-secondary" onclick="showSupportedSites()">
                            <i class="fas fa-question-circle"></i> Help
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Stats -->
        <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-server"></i>
                </div>
                <div class="stat-value" id="serverStatus">Online</div>
                <div class="stat-label">Server Status</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-hdd"></i>
                </div>
                <div class="stat-value" id="storageUsed">0 MB</div>
                <div class="stat-label">Storage Used</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="stat-value" id="cleanupTime">1 hour</div>
                <div class="stat-label">Cleanup Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <div class="stat-value" id="maxSize">500 MB</div>
                <div class="stat-label">Max File Size</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Powered by yt-dlp • Built with Flask • Hosted on Railway</p>
            <p>Files are automatically deleted after 1 hour for privacy and storage management</p>
            
            <div class="footer-links">
                <a href="#" class="footer-link" onclick="showAbout()">
                    <i class="fas fa-info-circle"></i> About
                </a>
                <a href="#" class="footer-link" onclick="showPrivacy()">
                    <i class="fas fa-shield-alt"></i> Privacy
                </a>
                <a href="#" class="footer-link" onclick="showTerms()">
                    <i class="fas fa-file-contract"></i> Terms
                </a>
                <a href="https://github.com/yourusername/video-downloader" class="footer-link" target="_blank">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
        </div>
    </div>

    <script>
        // Configuration
        const API_BASE = window.location.origin;
        let currentVideoInfo = null;
        let selectedFormat = null;
        let downloadId = null;
        let progressInterval = null;
        let currentFormatType = 'mp4';
        
        // DOM Elements
        const videoUrlInput = document.getElementById('videoUrl');
        const infoBtn = document.getElementById('infoBtn');
        const loader = document.getElementById('loader');
        const statusMessage = document.getElementById('statusMessage');
        const videoInfo = document.getElementById('videoInfo');
        const videoTitle = document.getElementById('videoTitle');
        const thumbnail = document.getElementById('thumbnail');
        const durationBadge = document.getElementById('durationBadge');
        const videoUploader = document.getElementById('videoUploader');
        const videoViews = document.getElementById('videoViews');
        const uploadDate = document.getElementById('uploadDate');
        const videoPlatform = document.getElementById('videoPlatform');
        const videoDescription = document.getElementById('videoDescription');
        const formatsGrid = document.getElementById('formatsGrid');
        const downloadSection = document.getElementById('downloadSection');
        const downloadTitle = document.getElementById('downloadTitle');
        const progressPercent = document.getElementById('progressPercent');
        const progressFill = document.getElementById('progressFill');
        const downloadSpeed = document.getElementById('downloadSpeed');
        const downloadETA = document.getElementById('downloadETA');
        const downloadSize = document.getElementById('downloadSize');
        const downloadMessage = document.getElementById('downloadMessage');
        const downloadBtn = document.getElementById('downloadBtn');
        
        // Stats Elements
        const serverStatus = document.getElementById('serverStatus');
        const storageUsed = document.getElementById('storageUsed');
        const cleanupTime = document.getElementById('cleanupTime');
        const maxSize = document.getElementById('maxSize');
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            checkServerHealth();
            loadStats();
            setInterval(loadStats, 30000); // Update stats every 30 seconds
            
            // Enter key support
            videoUrlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    getVideoInfo();
                }
            });
        });
        
        // Check server health
        async function checkServerHealth() {
            try {
                const response = await fetch(`${API_BASE}/api/health`);
                if (response.ok) {
                    serverStatus.textContent = 'Online';
                    serverStatus.style.color = '#10b981';
                } else {
                    serverStatus.textContent = 'Offline';
                    serverStatus.style.color = '#ef4444';
                }
            } catch (error) {
                serverStatus.textContent = 'Offline';
                serverStatus.style.color = '#ef4444';
            }
        }
        
        // Load stats
        async function loadStats() {
            try {
                const response = await fetch(`${API_BASE}/api/stats`);
                if (response.ok) {
                    const data = await response.json();
                    storageUsed.textContent = data.storage_used || '0 B';
                    cleanupTime.textContent = `${data.cleanup_age_minutes || 60} min`;
                    maxSize.textContent = data.max_file_size || '500 MB';
                }
            } catch (error) {
                console.error('Failed to load stats:', error);
            }
        }
        
        // Format duration
        function formatDuration(seconds) {
            if (!seconds) return 'N/A';
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            }
        }
        
        // Format number with commas
        function formatNumber(num) {
            if (!num) return 'N/A';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        // Format date
        function formatDate(dateStr) {
            if (!dateStr) return 'N/A';
            try {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (e) {
                return dateStr;
            }
        }
        
        // Show message
        function showMessage(message, type = 'info', duration = 5000) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message status-${type}`;
            statusMessage.style.display = 'block';
            
            if (duration > 0) {
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, duration);
            }
        }
        
        // Show download message
        function showDownloadMessage(message, type = 'info', duration = 0) {
            downloadMessage.textContent = message;
            downloadMessage.className = `status-message status-${type}`;
            downloadMessage.style.display = 'block';
            
            if (duration > 0) {
                setTimeout(() => {
                    downloadMessage.style.display = 'none';
                }, duration);
            }
        }
        
        // Get video information
        async function getVideoInfo() {
            const url = videoUrlInput.value.trim();
            if (!url) {
                showMessage('Please enter a video URL', 'error');
                videoUrlInput.focus();
                return;
            }
            
            // Validate URL format
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                showMessage('Please enter a valid URL starting with http:// or https://', 'error');
                return;
            }
            
            // Show loader
            loader.style.display = 'block';
            videoInfo.style.display = 'none';
            downloadSection.style.display = 'none';
            statusMessage.style.display = 'none';
            infoBtn.disabled = true;
            infoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            
            try {
                const response = await fetch(`${API_BASE}/api/info`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    currentVideoInfo = data;
                    displayVideoInfo(data);
                    showMessage('Video information loaded successfully!', 'success');
                } else {
                    showMessage(`Error: ${data.error}`, 'error');
                }
            } catch (error) {
                showMessage('Failed to fetch video information. Please check your connection.', 'error');
                console.error('Error:', error);
            } finally {
                loader.style.display = 'none';
                infoBtn.disabled = false;
                infoBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Video';
            }
        }
        
        // Display video information
        function displayVideoInfo(info) {
            // Set basic info
            videoTitle.textContent = info.title || 'Unknown Title';
            
            if (info.thumbnail) {
                thumbnail.src = info.thumbnail;
                thumbnail.style.display = 'block';
            } else {
                thumbnail.style.display = 'none';
            }
            
            // Duration
            if (info.duration) {
                durationBadge.textContent = formatDuration(info.duration);
                durationBadge.style.display = 'block';
            } else {
                durationBadge.style.display = 'none';
            }
            
            // Uploader
            videoUploader.textContent = info.uploader || 'Unknown';
            
            // Views
            if (info.view_count) {
                videoViews.textContent = formatNumber(info.view_count) + ' views';
                document.getElementById('viewsMeta').style.display = 'flex';
            } else {
                document.getElementById('viewsMeta').style.display = 'none';
            }
            
            // Upload date
            if (info.upload_date) {
                const dateStr = info.upload_date;
                const formattedDate = `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
                uploadDate.textContent = formatDate(formattedDate);
                document.getElementById('dateMeta').style.display = 'flex';
            } else {
                document.getElementById('dateMeta').style.display = 'none';
            }
            
            // Platform
            videoPlatform.textContent = info.extractor || 'Unknown Platform';
            
            // Description
            if (info.description) {
                videoDescription.textContent = info.description;
                videoDescription.style.display = 'block';
            } else {
                videoDescription.style.display = 'none';
            }
            
            // Display formats
            displayFormats(info.formats || []);
            
            // Show video info
            videoInfo.style.display = 'block';
            
            // Scroll to video info
            videoInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Display available formats
        function displayFormats(formats) {
            formatsGrid.innerHTML = '';
            selectedFormat = null;
            
            // Add MP3 option
            formatsGrid.innerHTML += `
                <div class="format-btn" onclick="selectFormat('mp3', this, 'mp3')">
                    <div class="format-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="format-name">MP3 Audio</div>
                    <div class="format-details">
                        Best audio quality • 192kbps<br>
                        Perfect for music and podcasts
                    </div>
                </div>
            `;
            
            // Add Best Quality option
            formatsGrid.innerHTML += `
                <div class="format-btn" onclick="selectFormat('best', this, 'mp4')">
                    <div class="format-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="format-name">Best Quality</div>
                    <div class="format-details">
                        Highest available quality<br>
                        Recommended for most users
                    </div>
                </div>
            `;
            
            // Add video formats
            let videoCount = 0;
            formats.forEach(format => {
                if (format.has_video && format.has_audio && videoCount < 6) {
                    const resolution = format.resolution || format.format_note || 'Unknown';
                    const size = format.filesize ? ` • ${formatFileSize(format.filesize)}` : '';
                    const codec = format.ext ? format.ext.toUpperCase() : 'MP4';
                    
                    formatsGrid.innerHTML += `
                        <div class="format-btn" onclick="selectFormat('${format.id}', this, 'mp4')">
                            <div class="format-icon">
                                <i class="fas fa-video"></i>
                            </div>
                            <div class="format-name">${resolution} ${codec}</div>
                            <div class="format-details">
                                ${resolution} • ${codec}${size}<br>
                                ${format.format_note || 'Good quality'}
                            </div>
                        </div>
                    `;
                    videoCount++;
                }
            });
            
            // If no video formats found, add default options
            if (videoCount === 0) {
                formatsGrid.innerHTML += `
                    <div class="format-btn" onclick="selectFormat('18', this, 'mp4')">
                        <div class="format-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <div class="format-name">360p MP4</div>
                        <div class="format-details">
                            Standard quality • Small file size<br>
                            Fast download
                        </div>
                    </div>
                    
                    <div class="format-btn" onclick="selectFormat('22', this, 'mp4')">
                        <div class="format-icon">
                            <i class="fas fa-hd"></i>
                        </div>
                        <div class="format-name">720p MP4</div>
                        <div class="format-details">
                            HD quality • Good balance<br>
                            Recommended for most users
                        </div>
                    </div>
                `;
            }
        }
        
        // Format file size
        function formatFileSize(bytes) {
            if (!bytes || bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }
        
        // Select format
        function selectFormat(formatId, element, formatType) {
            // Remove selection from all buttons
            document.querySelectorAll('.format-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selection to clicked button
            element.classList.add('selected');
            
            // Set selected format
            selectedFormat = formatId;
            currentFormatType = formatType;
            
            // Show download section
            downloadSection.style.display = 'block';
            downloadTitle.textContent = `Ready to download: ${currentVideoInfo?.title?.substring(0, 50)}${currentVideoInfo?.title?.length > 50 ? '...' : ''}`;
            
            // Reset progress
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
            downloadSpeed.innerHTML = '<i class="fas fa-tachometer-alt"></i> Speed: N/A';
            downloadETA.innerHTML = '<i class="fas fa-clock"></i> ETA: N/A';
            downloadSize.innerHTML = '<i class="fas fa-database"></i> Size: N/A';
            downloadMessage.style.display = 'none';
            
            // Enable download button
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Start Download';
            
            // Scroll to download section
            downloadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Start download
        async function startDownload() {
            if (!selectedFormat || !currentVideoInfo) {
                showDownloadMessage('Please select a format first', 'error');
                return;
            }
            
            const url = videoUrlInput.value.trim();
            if (!url) {
                showDownloadMessage('Please enter a video URL', 'error');
                return;
            }
            
            // Disable download button
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
            
            // Reset progress display
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
            downloadMessage.style.display = 'none';
            
            try {
                const response = await fetch(`${API_BASE}/api/download`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: url,
                        format: currentFormatType,
                        quality: currentFormatType === 'mp3' ? null : selectedFormat
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    downloadId = data.download_id;
                    showDownloadMessage('Download started! Tracking progress...', 'success');
                    
                    // Start progress tracking
                    startProgressTracking();
                } else {
                    showDownloadMessage(`Error: ${data.error}`, 'error');
                    downloadBtn.disabled = false;
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Start Download';
                }
            } catch (error) {
                showDownloadMessage('Failed to start download. Please try again.', 'error');
                console.error('Error:', error);
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Start Download';
            }
        }
        
        // Start progress tracking
        function startProgressTracking() {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            
            progressInterval = setInterval(async () => {
                if (!downloadId) return;
                
                try {
                    const response = await fetch(`${API_BASE}/api/status/${downloadId}`);
                    const status = await response.json();
                    
                    if (status.error) {
                        showDownloadMessage(`Error: ${status.error}`, 'error');
                        clearInterval(progressInterval);
                        resetDownloadButton();
                        return;
                    }
                    
                    if (status.status === 'completed') {
                        // Download complete
                        progressFill.style.width = '100%';
                        progressPercent.textContent = '100%';
                        downloadSpeed.innerHTML = '<i class="fas fa-tachometer-alt"></i> Speed: Completed';
                        downloadETA.innerHTML = '<i class="fas fa-clock"></i> ETA: 00:00';
                        
                        if (status.filesize) {
                            downloadSize.innerHTML = `<i class="fas fa-database"></i> Size: ${formatFileSize(status.filesize)}`;
                        }
                        
                        // Show download link
                        showDownloadMessage('Download completed! Click the link below to download your file.', 'success');
                        
                        const downloadLink = document.createElement('a');
                        downloadLink.href = `${API_BASE}/api/download-file/${downloadId}`;
                        downloadLink.className = 'btn btn-success';
                        downloadLink.innerHTML = '<i class="fas fa-file-download"></i> Download File';
                        downloadLink.download = status.filename || 'video.mp4';
                        downloadLink.style.marginTop = '10px';
                        downloadLink.style.display = 'inline-block';
                        
                        downloadMessage.appendChild(document.createElement('br'));
                        downloadMessage.appendChild(downloadLink);
                        
                        clearInterval(progressInterval);
                        
                    } else if (status.status === 'error') {
                        // Download error
                        showDownloadMessage(`Error: ${status.error}`, 'error');
                        clearInterval(progressInterval);
                        resetDownloadButton();
                        
                    } else if (status.status === 'downloading') {
                        // Update progress
                        const progress = parseFloat(status.progress) || 0;
                        const speed = status.speed || 'N/A';
                        const eta = status.eta || 'N/A';
                        
                        progressFill.style.width = `${progress}%`;
                        progressPercent.textContent = `${progress}%`;
                        downloadSpeed.innerHTML = `<i class="fas fa-tachometer-alt"></i> Speed: ${speed}`;
                        downloadETA.innerHTML = `<i class="fas fa-clock"></i> ETA: ${eta}`;
                        
                        if (status.total) {
                            downloadSize.innerHTML = `<i class="fas fa-database"></i> Size: ${formatFileSize(status.total)}`;
                        }
                    }
                } catch (error) {
                    console.error('Progress tracking error:', error);
                }
            }, 1000); // Check every second
        }
        
        // Reset download button
        function resetDownloadButton() {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Start Download';
        }
        
        // Reset form
        function resetForm() {
            videoUrlInput.value = '';
            videoInfo.style.display = 'none';
            downloadSection.style.display = 'none';
            statusMessage.style.display = 'none';
            downloadMessage.style.display = 'none';
            selectedFormat = null;
            downloadId = null;
            currentVideoInfo = null;
            
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            
            // Reset format selection
            document.querySelectorAll('.format-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Focus on URL input
            videoUrlInput.focus();
            
            showMessage('Ready for new download!', 'info', 3000);
        }
        
        // Show supported sites
        function showSupportedSites() {
            alert('Supported sites include:\n\n• YouTube\n• Facebook\n• Instagram\n• TikTok\n• Twitter\n• Reddit\n• Vimeo\n• Dailymotion\n• Twitch\n• SoundCloud\n\nAnd 1000+ more sites!');
        }
        
        // Show about
        function showAbout() {
            alert('Video Downloader\n\nVersion: 1.0.0\n\nA web application for downloading videos from various platforms. Built with Flask and yt-dlp. Files are automatically deleted after 1 hour for privacy.');
        }
        
        // Show privacy
        function showPrivacy() {
            alert('Privacy Policy\n\n• We do not store any downloaded videos\n• Files are automatically deleted after 1 hour\n• We do not collect personal information\n• URLs are only used for downloading\n• No tracking or analytics');
        }
        
        // Show terms
        function showTerms() {
            alert('Terms of Service\n\n• Only download content you have rights to\n• Respect copyright laws\n• Do not abuse the service\n• The service is provided "as is"\n• Use at your own risk\n• Developers are not responsible for misuse');
        }
        
        // Handle beforeunload
        window.addEventListener('beforeunload', function(e) {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        });
    </script>
</body>
</html>
