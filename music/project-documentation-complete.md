# Project Documentation for music
## 统计摘要
- **扫描目录:** `/Users/ygs/ygs/yuangs/music`
- **文件总数:** 18
- **包含文件数:** 12 (将被写入本文档)
- **排除文件数:** 6
- **项目总大小:** 702.12 KB

<details>
<summary>点击展开/折叠完整文件列表 (18 个文件)</summary>

### **包含的文件 (12):**
- `YouTubePlayerManager.js` (5.89 KB)
- `index.html` (204.58 KB)
- `manifest.json` (763 Bytes)
- `sw.js` (8.84 KB)
- `youtube/README.md` (8.12 KB)
- `youtube/artist.py` (443 Bytes)
- `youtube/data_api.py` (85.51 KB)
- `youtube/flask_example.py` (1.58 KB)
- `youtube/lyrics.py` (474 Bytes)
- `youtube/test_halfscreen.html` (8.87 KB)
- `youtube/youtube_service.py` (9.76 KB)
- `youtube/youtubeapi.py` (600 Bytes)

### **排除的文件 (6):**
- `icon/android-chrome-512x512.png` (254.12 KB)
- `icon/apple-touch-icon.png` (44.51 KB)
- `icon/favicon.ico` (15.04 KB)
- `icon/icon-16x16.png` (875 Bytes)
- `icon/icon-192x192.png` (49.81 KB)
- `icon/icon-32x32.png` (2.39 KB)

</details>

---

---

## index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>广山音乐</title>

    <!-- PWA  核心配置 -->
    <link rel="manifest" href="./manifest.json">
    <meta name="theme-color" content="#0a0a0a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="广山音乐">

    <!-- 图标配置 -->
    <link rel="icon" type="image/x-icon" href="./icon/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="./icon/icon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="./icon/icon-16x16.png">
    <link rel="apple-touch-icon" href="./icon/apple-touch-icon.png">

    <style>
        :root {
            --primary: #1db954;
            --primary-dark: #1aa34a;
            --accent: #ff6b6b;
            --bg: #0a0a0a;
            --card: #161616;
            --card-hover: #1f1f1f;
            --text: #ffffff;
            --text-secondary: #a0a0a0;
            --glass: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --safe-top: env(safe-area-inset-top);
            --safe-bottom: env(safe-area-inset-bottom);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        /* Ensure input elements work properly in PWA */
        input, textarea, select {
            -webkit-user-select: auto;
            -moz-user-select: auto;
            -ms-user-select: auto;
            user-select: auto;
            -webkit-touch-callout: default;
            -webkit-tap-highlight-color: rgba(0,0,0,0.1);
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            min-height: 100dvh;
            overflow-x: hidden;
            position: relative;
        }

        /* 动态背景 */
        .bg-gradient {
            position: fixed;
            inset: 0;
            z-index: 0;
            opacity: 0.6;
            transition: opacity 0.8s ease;
            background: radial-gradient(ellipse at 50% 0%, var(--primary) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 50%, #6366f1 0%, transparent 40%),
                radial-gradient(ellipse at 20% 80%, #ec4899 0%, transparent 40%);
            filter: blur(80px) saturate(150%);
        }

        .bg-album {
            position: fixed;
            inset: 0;
            z-index: 0;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 1s ease;
            filter: blur(60px) brightness(0.4) saturate(120%);
        }

        .bg-album.active {
            opacity: 0.7;
        }

        /* 顶部搜索栏  */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: calc(8px + var(--safe-top)) 16px 8px;
            background: linear-gradient(to bottom, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.8) 70%, transparent 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }

        .search-box {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .search-input {
            width: 100%;
            height: 40px;
            padding: 0 40px 0 18px;
            /* Add padding on the right to make space for clear button */
            border-radius: 20px;
            border: 1px solid var(--glass-border);
            background: var(--glass);
            color: var(--text);
            font-size: 16px;
            /* Minimum 16px to prevent iOS auto-zoom */
            outline: none;
            transition: all 0.3s ease;
            -webkit-appearance: none;
            -moz-appearance: textfield;
            appearance: none;
            /* Ensure it works properly in PWA mode */
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
            /* Add important properties for mobile input */
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            /* Prevent double-tap zoom, ensure keyboard opens */
            cursor: text;
        }

        .search-input:focus {
            border-color: var(--primary);
            background: rgba(29, 185, 84, 0.1);
            outline: 2px solid var(--primary);
            outline-offset: -1px;
        }

        /* Ensure the input container is also clickable */
        .search-input-container {
            position: relative;
            cursor: text;
            flex: 1;
            min-width: 120px;
            max-width: 300px;
        }

        .search-input-container:focus-within {
            z-index: 2;
        }

        .search-input::placeholder {
            color: var(--text-secondary);
        }

        .search-clear-btn {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        }

        .search-clear-btn:hover {
            background: var(--glass-border);
            color: var(--text);
        }

        .btn {
            height: 40px;
            padding: 0 18px;
            border-radius: 20px;
            border: none;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .btn:active {
            transform: scale(0.95);
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-icon {
            width: 40px;
            height: 40px;
            padding: 0;
            background: var(--glass);
            border: 1px solid var(--glass-border);
            color: var(--text);
            font-size: 18px;
        }

        .btn-icon:hover {
            background: var(--glass-border);
        }

        /* 内容区 */
        .content {
            position: relative;
            z-index: 1;
            padding: calc(72px + var(--safe-top)) 16px calc(200px + var(--safe-bottom));
            min-height: 100vh;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
        }

        /* 歌曲卡片 */
        .song-card {
            background: var(--card);
            border-radius: 12px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            position: relative;
        }

        .song-options {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--glass);
            border: 1px solid var(--glass-border);
            color: var(--text);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .song-card:hover .song-options {
            opacity: 1;
        }

        .song-duration {
            position: absolute;
            top: 8px;
            right: 36px; /* 在选项按钮的左侧，避免重叠 */
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 10px;
            z-index: 5;
            pointer-events: none;
        }

        .song-card:hover {
            background: var(--card-hover);
            transform: translateY(-4px);
            border-color: var(--glass-border);
        }

        .song-card:active {
            transform: scale(0.98);
        }

        .song-card.playing {
            border-color: var(--primary);
            box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
        }

        .song-cover {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 12px;
            object-fit: cover;
            background: #222;
            margin-bottom: 8px;
            position: relative;
            overflow: hidden;
        }

        .song-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .song-card:hover .song-cover img {
            transform: scale(1.05);
        }

        .play-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .song-card:hover .play-overlay,
        .song-card.playing .play-overlay {
            opacity: 1;
        }

        .play-overlay-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .song-title {
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
        }

        .song-artist {
            font-size: 11px;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* 两列结果布局 */
        .results-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            width: 100%;
        }

        .results-column {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .simple-header {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-secondary);
            padding-left: 4px;
        }

        .empty-message {
            grid-column: 1/-1;
            text-align: center;
            padding: 40px 20px;
            color: var(--text-secondary);
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .results-columns {
                gap: 12px;
                /* 减小移动端间距 */
            }

            /* 移动端每列内部的网格调整 */
            .results-column .grid {
                grid-template-columns: 1fr;
                /* 移动端每列内部单列显示 */
            }
        }

        /* 底部播放器 - 全新设计 */
        .player {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 0 16px calc(16px + var(--safe-bottom));
            background: linear-gradient(to top, rgba(10, 10, 10, 1) 0%, rgba(10, 10, 10, 0.95) 50%, transparent 100%);
            pointer-events: none;
        }

        /* 嵌入式播放器模式 */
        .player.embedded {
            position: relative;
            bottom: auto;
            top: 0;
            padding: 20px;
            margin: 0 auto;
            max-width: 400px; /* 设置最大宽度，适合嵌入式播放器 */
            background: var(--bg);
        }

        .player.embedded .player-card {
            border-radius: 16px;
            margin: 0 auto;
        }

        body.embedded-mode {
            background: var(--bg);
            overflow: hidden; /* 隐藏滚动条 */
        }

        .player-card {
            background: var(--card);
            border-radius: 24px;
            padding: 12px 16px 16px;
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
            pointer-events: auto;
        }

        /* 顶部信息栏 */
        .player-info-bar {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 12px;
            padding: 8px 12px;
            background: var(--glass);
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            /* Allow proper alignment of the wiki button */
        }

        .player-label {
            font-size: 12px;
            color: var(--text-secondary);
            flex-shrink: 0;
        }

        .player-text-wrapper {
            overflow: hidden;
            white-space: nowrap;
            flex-shrink: 1;
            min-width: 0;
            position: relative;
        }

        .title-wrapper {
            max-width: 200px;
        }

        .artist-wrapper {
            max-width: 150px;
        }

        .player-title-text {
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
            cursor: pointer;
            transition: color 0.2s ease;
            white-space: nowrap;
        }

        .player-title-text:hover {
            color: var(--primary);
        }

        .player-separator {
            font-size: 12px;
            color: var(--text-secondary);
            flex-shrink: 0;
        }

        .player-artist-text {
            display: inline-block;
            font-size: 13px;
            color: var(--text-secondary);
            cursor: pointer;
            transition: color 0.2s ease;
            white-space: nowrap;
        }

        .player-artist-text:hover {
            color: var(--primary);
        }

        /* 响应式调整 */
        @media (max-width: 767px) {
            .title-wrapper {
                max-width: 120px;
            }

            .artist-wrapper {
                max-width: 100px;
            }
        }

        .player-wiki-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--glass);
            border: 1px solid var(--glass-border);
            color: var(--text-secondary);
            /* Default not highlighted */
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            flex-shrink: 0;
            padding: 0;
            margin-left: auto;
            /* Push to the right */
        }

        .player-wiki-btn:hover {
            background: var(--primary);
            color: white;
            transform: scale(1.1);
        }

        /* 滚动动画 */
        .scroll-text {
            animation: scroll-left var(--duration, 10s) linear infinite alternate;
        }

        @keyframes scroll-left {

            0%,
            10% {
                transform: translateX(0);
            }

            90%,
            100% {
                transform: translateX(var(--scroll-distance, -50%));
            }
        }

        /* 主控制区 */
        .player-main {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .player-cover {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            object-fit: cover;
            background: #222;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            cursor: pointer;
        }

        .player-cover.spinning {
            animation: spin 8s linear infinite;
            border-radius: 50%;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(-360deg);
            }
        }

        .player-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
            margin-left: auto;
        }

        .ctrl-btn {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: var(--text);
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            opacity: 0.6;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ctrl-btn:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
            opacity: 1;
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(29, 185, 84, 0.5);
        }

        .ctrl-btn:active {
            transform: scale(0.95);
        }

        .ctrl-btn.play {
            width: 56px;
            height: 56px;
            background: var(--primary);
            color: white;
            font-size: 24px;
            opacity: 0.9;
            box-shadow: 0 0 25px rgba(29, 185, 84, 0.3);
        }

        .ctrl-btn.play:hover {
            background: var(--primary-dark);
            opacity: 1;
            transform: scale(1.08);
            box-shadow: 0 0 30px rgba(29, 185, 84, 0.6);
        }

        .ctrl-btn.play:active {
            transform: scale(0.95);
        }

        /* 进度条 */
        .progress-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .time {
            font-size: 11px;
            color: var(--text-secondary);
            min-width: 36px;
            text-align: center;
        }

        .progress-bar {
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: var(--primary);
            width: 0%;
            border-radius: 2px;
            transition: width 0.1s linear;
        }

        .progress-bar:hover .progress-fill {
            background: #1ed760;
        }

        /* 歌词详情页 */
        .lyrics-modal {
            position: fixed;
            inset: 0;
            z-index: 200;
            background: var(--bg);
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
            padding: calc(60px + var(--safe-top)) 24px calc(24px + var(--safe-bottom));
        }

        .lyrics-modal.show {
            transform: translateY(0);
        }

        .lyrics-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: calc(16px + var(--safe-top)) 24px 16px;
            background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
            z-index: 10;
        }

        .lyrics-close {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--glass);
            border: none;
            color: var(--text);
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lyrics-cover {
            width: 200px;
            height: 200px;
            border-radius: 20px;
            margin: 0 auto 24px;
            display: block;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        }

        .lyrics-title {
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 8px;
        }

        .lyrics-artist {
            font-size: 16px;
            color: var(--text-secondary);
            text-align: center;
            margin-bottom: 32px;
            display: inline-block;
        }

        .lyrics-artist-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 32px;
        }

        .lyrics-artist.clickable:hover {
            color: var(--primary);
        }

        .lyrics-wiki {
            background: var(--card);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            border-left: 3px solid var(--primary);
            display: none;
        }

        .lyrics-wiki.show {
            display: block;
        }

        .lyrics-wiki-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 8px;
        }

        .lyrics-wiki-text {
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-secondary);
        }

        .lyrics-text {
            font-size: 18px;
            line-height: 2;
            color: var(--text-secondary);
            text-align: center;
            white-space: pre-wrap;
        }

        /* 弹幕 */
        .danmaku {
            position: fixed;
            top: calc(100px + var(--safe-top));
            left: 0;
            right: 0;
            height: 200px;
            z-index: 50;
            pointer-events: none;
            overflow: hidden;
            mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
            display: none;
        }

        .danmaku.show {
            display: block;
        }

        .danmaku-item {
            position: absolute;
            left: 100%;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid var(--glass-border);
            white-space: nowrap;
            animation: danmaku-slide linear forwards;
        }

        .danmaku-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
        }

        .danmaku-name {
            color: var(--primary);
            font-weight: 600;
            font-size: 13px;
        }

        .danmaku-text {
            font-size: 13px;
            color: var(--text);
        }

        @keyframes danmaku-slide {
            from {
                transform: translateX(0);
            }

            to {
                transform: translateX(calc(-100% - 100vw));
            }
        }

        /* 空状态 */
        .empty-state {
            text-align: center;
            padding: 80px 20px;
            color: var(--text-secondary);
        }

        .empty-icon {
            font-size: 64px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 8px;
        }

        .empty-desc {
            font-size: 14px;
            line-height: 1.6;
        }

        /* 加载状态 */
        .loading {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--glass-border);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: loading-spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes loading-spin {
            to {
                transform: rotate(360deg);
            }
        }

        /* PWA 安装提示 */
        .install-prompt {
            position: fixed;
            bottom: calc(200px + var(--safe-bottom));
            left: 16px;
            right: 16px;
            z-index: 150;
            background: var(--card);
            border-radius: 16px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            animation: slide-up 0.4s ease;
        }

        @keyframes slide-up {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
        }

        /* 推荐标签样式 */
        .recommendation-tag {
            background: var(--glass);
            border: 1px solid var(--glass-border);
            color: var(--text);
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .recommendation-tag:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
            transform: scale(1.05);
        }

        .install-icon {
            font-size: 32px;
        }

        .install-text {
            flex: 1;
        }

        .install-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .install-desc {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .install-btn {
            padding: 10px 20px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
        }

        .install-close {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--glass);
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* 收藏按钮样式 */
        .favorite-btn {
            font-size: 22px;
            transition: all 0.3s ease;
            border: none;
            box-shadow: none !important;
        }

        .ctrl-btn.favorite-btn:hover,
        .favorite-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            box-shadow: none !important;
            transform: scale(1.1);
        }

        .favorite-btn.favorited {
            color: #ff6b6b;
            animation: heartBeat 0.3s ease;
        }

        /* Ensure favorite button maintains consistent styling in all states */
        .ctrl-btn.favorite-btn {
            box-shadow: none !important;
        }

        /* More specific rules to override default hover behavior */
        .ctrl-btn.favorite-btn:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: none !important;
        }

        .ctrl-btn.favorite-btn.favorited:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: none !important;
        }

        @keyframes heartBeat {

            0%,
            100% {
                transform: scale(1);
            }

            25% {
                transform: scale(1.3);
            }

            50% {
                transform: scale(1.1);
            }

            75% {
                transform: scale(1.2);
            }
        }

        /* 收藏和历史弹窗 */
        .collection-modal {
            position: fixed;
            inset: 0;
            z-index: 200;
            background: var(--bg);
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .collection-modal.show {
            transform: translateY(0);
        }

        .collection-header {
            position: sticky;
            top: 0;
            padding: calc(20px + var(--safe-top)) 24px 20px;
            background: linear-gradient(to bottom, var(--bg) 0%, rgba(10, 10, 10, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--glass-border);
        }

        .collection-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--text);
        }

        .collection-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .btn-action {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--glass);
            border: 1px solid var(--glass-border);
            color: var(--text);
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .btn-action:hover {
            background: var(--glass-border);
            transform: scale(1.1);
        }

        .btn-action:active {
            transform: scale(0.95);
        }

        .collection-close {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: var(--glass);
            border: none;
            color: var(--text);
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .collection-close:hover {
            background: var(--accent);
            color: white;
        }

        .collection-content {
            flex: 1;
            padding: 24px;
            padding-bottom: calc(24px + var(--safe-bottom));
        }

        .collection-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
        }

        .collection-item {
            background: var(--card);
            border-radius: 12px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            position: relative;
        }

        .collection-item:hover {
            background: var(--card-hover);
            transform: translateY(-4px);
            border-color: var(--glass-border);
        }

        .collection-item-cover {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 12px;
            object-fit: cover;
            background: #222;
            margin-bottom: 8px;
        }

        .collection-item-title {
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 2px;
        }

        .collection-item-artist {
            font-size: 11px;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .collection-item-time {
            font-size: 10px;
            color: var(--text-secondary);
            margin-top: 4px;
        }

        .collection-item-remove {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(255, 107, 107, 0.9);
            color: white;
            border: none;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .collection-item:hover .collection-item-remove {
            opacity: 1;
        }

        /* 响应式 */
        @media (max-width: 767px) {
            .grid {
                /* 使用 minmax(0, 1fr) 强制两列平分，防止被内容撑大 */
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
            }

            .song-card {
                padding: 6px;
                /* 确保卡片不会超出网格单元 */
                width: 100%;
                min-width: 0;
            }

            /* 确保内容区左右边距适中 */
            .content {
                padding-left: 12px;
                padding-right: 12px;
            }
        }

        @media (min-width: 768px) {
            .grid {
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            }

            .player-card {
                max-width: 600px;
                margin: 0 auto;
            }
        }
    </style>
</head>

<body>
    <!-- 背景 -->
    <div class="bg-gradient"></div>
    <div class="bg-album" id="bg-album"></div>

    <!-- 顶部搜索 -->
    <header class="header">
        <div class="search-box">
            <div class="search-input-container" id="search-input-container" style="display: none;">
                <input type="search" class="search-input" id="search-input" placeholder="歌手/歌曲..." inputmode="text" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" required>
                <button class="search-clear-btn" id="search-clear-btn" title="清空搜索" style="display: none;">✕</button>
            </div>
            <button class="btn btn-icon" title="搜索" id="search-toggle-btn">🔍</button>
            <button class="btn btn-icon" onclick="searchByWeather()" title="看天听歌">🌤️</button>
            <button class="btn btn-icon" onclick="smartRandomSearch()" title="智能探索">🎲</button>
            <button class="btn btn-icon" onclick="openHistory()" title="播放历史">📖</button>
            <button class="btn btn-icon" onclick="openFavorites()" title="我的收藏">❤️</button>
        </div>
    </header>

    <!-- 内容区 -->
    <main class="content">
        <div class="grid" id="results">
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">🎧</div>
                <div class="empty-title">发现音乐</div>
                <div class="empty-desc">点击 🎲 随机探索，或搜索你喜欢的歌曲</div>
            </div>
        </div>
    </main>

    <!-- 弹幕 -->
    <div class="danmaku" id="danmaku"></div>

    <!-- 底部播放器 -->
    <div class="player">
        <div class="player-card">
            <!-- 顶部歌曲信息栏 -->
            <div class="player-info-bar">
                <span class="player-label">正在播放：</span>
                <div class="player-text-wrapper title-wrapper">
                    <span class="player-title-text" id="player-title-text">广山音乐</span>
                </div>
                <span class="player-separator">-</span>
                <div class="player-text-wrapper artist-wrapper">
                    <span class="player-artist-text" id="player-artist-text">等待播放</span>
                </div>
                <button class="player-wiki-btn" id="player-tag-btn" title="查看歌曲标签推荐"
                    style="display: none; margin-right: 8px;">🏷️</button>
                <button class="player-wiki-btn" id="player-wiki-btn" title="查看艺术家维基百科"
                    style="display: none;">📖</button>
            </div>

            <!-- 主控制区 -->
            <div class="player-main">
                <img class="player-cover" id="player-cover"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23222' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23333' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23333'/%3E%3C/svg%3E"
                    alt="Cover">
                <button class="ctrl-btn favorite-btn" id="favorite-btn" onclick="toggleFavorite()"
                    title="收藏">🤍</button>
                <div class="player-controls">
                    <button class="ctrl-btn" id="mode-btn" onclick="togglePlayMode()" title="列表循环">🔁</button>
                    <button class="ctrl-btn" onclick="playPrevious()">⏮</button>
                    <button class="ctrl-btn play" id="play-btn" onclick="togglePlay()">▶</button>
                    <button class="ctrl-btn" onclick="playNext()">⏭</button>
                </div>
            </div>

            <!-- 进度条 -->
            <div class="progress-container">
                <span class="time" id="current-time">0:00</span>
                <div class="progress-bar" id="progress-bar" onclick="seek(event)">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <span class="time" id="total-time">0:30</span>
            </div>

            <!-- 推荐标签区 -->
            <div class="recommendation-tags" id="recommendation-tags" style="margin-top: 12px; display: none;">
                <div class="player-label" style="margin-bottom: 6px;">相关推荐：</div>
                <div class="recommendation-tags-container" id="recommendation-tags-container"
                    style="display: flex; flex-wrap: wrap; gap: 6px; max-height: 40px; overflow-y: auto;"></div>
                <div class="show-more-recommendations" id="show-more-recommendations"
                    style="margin-top: 6px; color: var(--primary); font-size: 12px; cursor: pointer; display: none;">
                    展开更多推荐</div>
            </div>
        </div>
    </div>

    <!-- 歌词详情 -->
    <div class="lyrics-modal" id="lyrics-modal">
        <div class="lyrics-header">
            <button class="lyrics-close" onclick="closeLyrics()">✕</button>
        </div>
        <img class="lyrics-cover" id="lyrics-cover" src="" alt="">
        <h2 class="lyrics-title" id="lyrics-title"></h2>
        <div class="lyrics-artist-container">
            <p class="lyrics-artist clickable" id="lyrics-artist" style="cursor: pointer; text-decoration: underline;"
                title="点击访问维基百科"></p>
        </div>
        <div class="lyrics-wiki" id="lyrics-wiki">
            <div class="lyrics-wiki-title" id="wiki-title"></div>
            <div class="lyrics-wiki-text" id="wiki-text"></div>
        </div>
        <div class="lyrics-text" id="lyrics-text">加载中...</div>
    </div>

    <!-- 历史记录弹窗 -->
    <div class="collection-modal" id="history-modal">
        <div class="collection-header">
            <h2 class="collection-title">📖 播放历史</h2>
            <div class="collection-actions">
                <button class="btn-action" onclick="exportHistory()" title="导出历史">📤</button>
                <button class="btn-action" onclick="importHistory()" title="导入历史">📥</button>
                <button class="btn-action" onclick="clearHistory()" title="清空历史">🗑️</button>
                <button class="collection-close" onclick="closeHistory()">✕</button>
            </div>
        </div>
        <div class="collection-content" id="history-content">
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <div class="empty-title">暂无播放历史</div>
                <div class="empty-desc">开始播放音乐后会自动记录</div>
            </div>
        </div>
    </div>

    <!-- 收藏列表弹窗 -->
    <div class="collection-modal" id="favorites-modal">
        <div class="collection-header">
            <h2 class="collection-title">❤️ 我的收藏</h2>
            <div class="collection-actions">
                <button class="btn-action" onclick="exportFavorites()" title="导出收藏">📤</button>
                <button class="btn-action" onclick="importFavorites()" title="导入收藏">📥</button>
                <button class="btn-action" onclick="clearFavorites()" title="清空收藏">🗑️</button>
                <button class="collection-close" onclick="closeFavorites()">✕</button>
            </div>
        </div>
        <div class="collection-content" id="favorites-content">
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <div class="empty-title">暂无收藏</div>
                <div class="empty-desc">点击播放器中的爱心按钮收藏歌曲</div>
            </div>
        </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input type="file" id="import-file-input" accept=".json" style="display: none;">

    <audio id="audio" crossorigin="anonymous"></audio>

    <!-- YouTube Player Manager -->
    <script src="YouTubePlayerManager.js"></script>

    <script>
        // 状态管理
        const state = {
            currentTrack: null,
            playlist: [],
            currentIndex: -1,
            isPlaying: false,
            playMode: 'sequence', // sequence, random, single
            danmakuInterval: null,
            danmakuCache: [],
            tracks: [false, false, false, false, false],
            displayedDanmaku: new Set(),  // Track currently displayed danmaku content to prevent duplicates
            youtubePlayer: null,  // YouTube player instance
            isYouTubePlaying: false,  // Track if YouTube player is currently playing
            youtubeProgressInterval: null,  // Interval for YouTube progress updates
            lastPosition: 0  // Store last playback position when app goes to background
        };

        // URL参数解析函数
        function getUrlParams() {
            const params = new URLSearchParams(window.location.search);
            return {
                apple: params.get('apple') === 'true',
                youtube: params.get('youtube') === 'true'
            };
        }

        // 缓存系统
        const CacheManager = {
            // 获取缓存的数据
            get: (key) => {
                try {
                    const cached = localStorage.getItem(key);
                    if (!cached) return null;

                    const parsed = JSON.parse(cached);
                    const now = Date.now();

                    // 检查是否过期
                    if (parsed.expiry && now > parsed.expiry) {
                        localStorage.removeItem(key);
                        return null;
                    }

                    return parsed.data;
                } catch (e) {
                    console.warn('Cache get error:', e);
                    return null;
                }
            },

            // 设置缓存数据
            set: (key, data, expiryHours = 24) => {
                try {
                    const expiry = Date.now() + (expiryHours * 60 * 60 * 1000);
                    const cacheObj = {
                        data: data,
                        expiry: expiry
                    };
                    localStorage.setItem(key, JSON.stringify(cacheObj));
                } catch (e) {
                    console.warn('Cache set error:', e);
                }
            },

            // 删除缓存数据
            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    console.warn('Cache remove error:', e);
                }
            }
        };

        // 收藏管理器
        const FavoritesManager = {
            STORAGE_KEY: 'music_favorites',

            // 获取所有收藏
            getAll: () => {
                try {
                    const data = localStorage.getItem(FavoritesManager.STORAGE_KEY);
                    return data ? JSON.parse(data) : [];
                } catch (e) {
                    console.error('Failed to get favorites:', e);
                    return [];
                }
            },

            // 保存收藏
            save: (favorites) => {
                try {
                    localStorage.setItem(FavoritesManager.STORAGE_KEY, JSON.stringify(favorites));
                } catch (e) {
                    console.error('Failed to save favorites:', e);
                }
            },

            // 添加收藏
            add: (song) => {
                const favorites = FavoritesManager.getAll();
                const exists = favorites.some(f => f.trackId === song.trackId);
                if (!exists) {
                    favorites.unshift({
                        ...song,
                        favoritedAt: Date.now()
                    });
                    FavoritesManager.save(favorites);
                    return true;
                }
                return false;
            },

            // 移除收藏
            remove: (trackId) => {
                const favorites = FavoritesManager.getAll();
                const filtered = favorites.filter(f => f.trackId !== trackId);
                FavoritesManager.save(filtered);
            },

            // 检查是否已收藏
            isFavorited: (trackId) => {
                const favorites = FavoritesManager.getAll();
                return favorites.some(f => f.trackId === trackId);
            },

            // 清空收藏
            clear: () => {
                FavoritesManager.save([]);
            },

            // 导出收藏
            export: () => {
                const favorites = FavoritesManager.getAll();
                const dataStr = JSON.stringify(favorites, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `music-favorites-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            },

            // 导入收藏
            import: (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            if (Array.isArray(data)) {
                                FavoritesManager.save(data);
                                resolve(data.length);
                            } else {
                                reject(new Error('Invalid format'));
                            }
                        } catch (err) {
                            reject(err);
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsText(file);
                });
            }
        };

        // 历史记录管理器
        const HistoryManager = {
            STORAGE_KEY: 'music_history',
            MAX_ITEMS: 100,

            // 获取所有历史
            getAll: () => {
                try {
                    const data = localStorage.getItem(HistoryManager.STORAGE_KEY);
                    return data ? JSON.parse(data) : [];
                } catch (e) {
                    console.error('Failed to get history:', e);
                    return [];
                }
            },

            // 保存历史
            save: (history) => {
                try {
                    localStorage.setItem(HistoryManager.STORAGE_KEY, JSON.stringify(history));
                } catch (e) {
                    console.error('Failed to save history:', e);
                }
            },

            // 添加历史记录
            add: (song) => {
                let history = HistoryManager.getAll();
                // 移除重复项
                history = history.filter(h => h.trackId !== song.trackId);
                // 添加到开头
                history.unshift({
                    ...song,
                    playedAt: Date.now()
                });
                // 限制数量
                if (history.length > HistoryManager.MAX_ITEMS) {
                    history = history.slice(0, HistoryManager.MAX_ITEMS);
                }
                HistoryManager.save(history);
            },

            // 移除历史记录
            remove: (trackId) => {
                const history = HistoryManager.getAll();
                const filtered = history.filter(h => h.trackId !== trackId);
                HistoryManager.save(filtered);
            },

            // 清空历史
            clear: () => {
                HistoryManager.save([]);
            },

            // 导出历史
            export: () => {
                const history = HistoryManager.getAll();
                const dataStr = JSON.stringify(history, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `music-history-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            },

            // 导入历史
            import: (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            if (Array.isArray(data)) {
                                HistoryManager.save(data);
                                resolve(data.length);
                            } else {
                                reject(new Error('Invalid format'));
                            }
                        } catch (err) {
                            reject(err);
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsText(file);
                });
            }
        };

        // 生成缓存键
        const generateCacheKey = (artist, title) => {
            return `song_${encodeURIComponent(artist)}_${encodeURIComponent(title)}`;
        };

        // DOM 元素
        const $ = id => document.getElementById(id);
        const audio = $('audio');

        // 绑定事件
        $('search-toggle-btn').addEventListener('click', (e) => toggleSearchInput(e));
        $('search-input-container').addEventListener('click', () => {
            setTimeout(() => $('search-input').focus(), 150);
        });

        // 切换搜索框可见性
        function toggleSearchInput(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const searchContainer = $('search-input-container');
            const searchInput = $('search-input');
            const searchToggleBtn = $('search-toggle-btn');
            const isVisible = searchContainer.style.display !== 'none';

            if (isVisible) {
                searchContainer.style.display = 'none';
                searchToggleBtn.title = '搜索';
            } else {
                searchContainer.style.display = 'block';
                setTimeout(() => {
                    searchInput.focus();
                }, 150); // 增加延迟
                searchToggleBtn.title = '关闭搜索';
            }
        }


        // 层次化音乐标签系统
        const musicTags = {
            // 一级分类：音乐属性
            attributes: {
                // 二级分类：情绪与氛围 (Vibes & Moods)
                moods: {
                    positive: ["Happy", "Joy", "Cheerful", "Uplifting", "Energetic", "Upbeat", "Euphoria", "Peaceful", "Calm", "Serene", "Chill", "Relax", "Cozy", "Mellow", "Groovy", "Cool", "Fresh"],
                    romantic: ["Love", "Romantic", "Heart", "Kiss", "Miss", "Baby", "Intimate", "Affection", "Passion", "Sensual", "Sexy"],
                    melancholy: ["Sad", "Melancholy", "Nostalgia", "Sentimental", "Blue", "Tears", "Lonely", "Gloomy", "Melancholic", "Heartbreak"],
                    intense: ["Drama", "Intense", "Power", "Epic", "Cinematic", "Dark", "Mystery", "Mysterious", "Heavy", "Spooky", "Creepy", "Mysterious", "Supernatural"],
                    spiritual: ["Faith", "Believe", "Angels", "Heaven", "Paradise", "Divine", "Sacred", "Spiritual", "Transcendent", "Soulful"]
                },
                // 二级分类：音乐风格 (Stylistic Elements)
                styles: {
                    sonic: ["Acoustic", "Electric", "Instrumental", "Acapella", "Live", "Studio", "Remix", "Cover", "Original"],
                    aesthetic: ["Vintage", "Retro", "Classic", "Modern", "Futuristic", "Cyberpunk", "Aesthetic", "Pastel", "Neon", "Funky"]
                }
            },
            // 一级分类：音乐类型
            genres: {
                // 二级分类：主要流派 (Main Genres)
                main: {
                    pop: ["Pop", "Mandopop", "Cantopop", "K-Pop", "J-Pop", "Jazz", "Soul", "R&B"],
                    rock: ["Rock", "Alternative", "Indie", "Punk", "Grunge", "Emo", "Metal", "Heavy Metal"],
                    electronic: ["EDM", "House", "Techno", "Trance", "Dubstep", "Drum and Bass", "Garage", "Ambient"],
                    hip_hop: ["Hip Hop", "Rap", "Trap", "R&B"],
                    traditional: ["Country", "Folk", "Classical", "Opera", "Blues"],
                    world: ["Latin", "Reggae", "Dancehall", "Salsa", "Bachata", "Reggaeton", "Anime", "Ghibli"]
                },
                // 三级分类：衍生流派 (Sub-Genres)
                sub_genres: {
                    pop_sub: ["Synthpop", "Electropop", "Dance-pop", "Indie Pop", "Art Pop"],
                    rock_sub: ["Glam Rock", "Progressive Rock", "Punk Rock", "Hard Rock", "Grunge Rock", "Alternative Rock"],
                    electronic_sub: ["Lo-Fi", "Lofi Hip Hop", "Synthwave", "Vaporwave", "Retrowave", "Deep House", "Future Bass"],
                    hip_hop_sub: ["Old School Hip Hop", "Trap", "Drill", "Conscious Rap", "Mumble Rap"],
                    traditional_sub: ["Bluegrass", "Folk Rock", "Baroque", "Chamber Music", "Contemporary Classical"]
                }
            },
            // 一级分类：场景活动
            scenarios: {
                // 二级分类：时间场景 (Time-based)
                time_based: {
                    daily_routine: ["Morning", "Wake Up", "Afternoon", "Evening", "Late Night", "Midnight", "Sunrise", "Sunset"],
                    weekly: ["Weekend", "Friday", "Sunday", "Monday", "Workday"],
                    seasonal: ["Spring", "Summer", "Autumn", "Winter", "Holiday", "New Year", "Valentine", "Christmas", "Halloween"],
                    special_occasions: ["Birthday", "Wedding", "Graduation", "Travel", "Vacation", "Beach", "Camping", "Festival"]
                },
                // 二级分类：活动场景 (Activity-based)
                activity_based: {
                    exercise: ["Workout", "Gym", "Running", "Jogging", "Yoga", "Meditation", "Stretching"],
                    work_study: ["Study", "Coding", "Reading", "Focus", "Background", "Concentration", "Deep Work"],
                    travel: ["Driving", "Road Trip", "Car Music", "Commuting", "Long Drive"],
                    social: ["Party", "Club", "Bar", "Lounge", "Dinner", "Cooking", "Cleaning"],
                    relaxation: ["Sleep", "Meditation", "Spa", "Shower", "Bath", "Coffee Shop", "Cafe"]
                }
            },
            // 一级分类：文化元素
            culture: {
                // 二级分类：地域文化 (Regional Culture)
                regional: {
                    western: ["American", "British", "European", "African", "Caribbean"],
                    asian: ["Chinese", "Korean", "Japanese", "Taiwanese", "Hong Kong", "Southeast Asian"],
                    latin: ["Latin America", "Brazil", "Mexico", "Caribbean"]
                },
                // 二级分类：艺术家与作品 (Artists & Works)
                artists: {
                    western_mainstream: [
                        "Taylor Swift", "Ed Sheeran", "Ariana Grande", "Justin Bieber", "The Weeknd", "Dua Lipa",
                        "Billie Eilish", "Harry Styles", "Bruno Mars", "Adele", "Rihanna", "Beyonce", "Lady Gaga",
                        "Katy Perry", "Miley Cyrus", "Post Malone", "Coldplay", "Imagine Dragons", "OneRepublic",
                        "Drake", "Kendrick Lamar", "Eminem", "Jay-Z", "Travis Scott", "Kanye West", "J. Cole",
                        "Beatles", "Queen", "Pink Floyd", "Led Zeppelin", "AC/DC", "Red Hot Chili Peppers",
                        "Linkin Park", "Arctic Monkeys", "Tame Impala", "Oasis", "David Bowie", "Prince",
                        "Elton John", "Bob Dylan", "Beyoncé", "Alicia Keys", "John Legend"
                    ],
                    korean: ["BTS", "Blackpink", "Twice", "EXO", "Big Bang", "NewJeans", "Stray Kids", "IU", "SEVENTEEN"],
                    chinese: ["周杰伦", "林俊杰", "陈奕迅", "王力宏", "陶喆", "蔡依林", "孙燕姿", "梁静茹", "五月天",
                        "Beyond", "邓丽君", "张国荣", "王菲", "张学友", "刘德华", "黎明", "郭富城", "罗大佑",
                        "李宗盛", "崔健", "窦唯", "伍佰", "张雨生", "邓紫棋", "李荣浩", "薛之谦", "周深",
                        "毛不易", "华晨宇", "张杰", "许嵩", "告五人", "痛仰", "陈粒", "赵雷"],
                    japanese: ["安室奈美恵", "宇多田ヒカル", "米津玄師", "RADWIMPS", "YOASOBI"],
                    instrumental: ["Hans Zimmer", "John Williams", "Joe Hisaishi", "Ennio Morricone", "Ludwig Göransson"]
                },
                // 二级分类：影视文化 (Media Culture)
                media: {
                    franchises: ["Marvel", "DC", "Star Wars", "Harry Potter", "Lord of the Rings", "Game of the Thrones"],
                    shows: ["Stranger Things", "Friends", "Simpsons", "Breaking Bad", "The Office"],
                    games: ["Cyberpunk 2077", "GTA", "FIFA", "Mario", "Zelda", "Pokemon", "Fortnite"],
                    other: ["Disney", "Musical", "Broadway", "Anime OST", "Video Game Music"]
                }
            },
            // 一级分类：自然与抽象
            nature_abstract: {
                // 二级分类：自然元素 (Natural Elements)
                nature: {
                    weather: ["Rain", "Storm", "Thunder", "Snow", "Wind", "Sun", "Moon", "Stars"],
                    landscapes: ["Ocean", "Sea", "River", "Forest", "Jungle", "Mountain", "Desert"],
                    locations: ["California", "New York", "London", "Paris", "Tokyo", "Seoul", "Hong Kong", "Shanghai", "Miami", "Ibiza", "Hawaii", "Space", "Galaxy", "Universe", "City", "Street", "Highway"]
                },
                // 二级分类：抽象概念 (Abstract Concepts)
                abstract: {
                    transcendental: ["Dream", "Night", "Fire", "Gold", "Wild", "Free", "Magic", "Legend", "Hero", "Angel", "Devil", "King", "Queen", "Life", "Time", "Eternity"],
                    emotions: ["Hope", "Smile", "Believe", "Together", "Alone", "Lost", "Forever", "Secret", "Promise"]
                }
            }
        };

        // 从层次化标签系统中提取所有标签词，用于随机搜索
        function getAllKeywords() {
            const keywords = [];

            function collectKeywords(obj) {
                for (const key in obj) {
                    if (Array.isArray(obj[key])) {
                        // 先检查是否为数组
                        obj[key].forEach(item => keywords.push(item));
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        // 再检查是否为对象（排除null）
                        collectKeywords(obj[key]);
                    }
                }
            }

            collectKeywords(musicTags);
            return keywords;
        }

        // 获取标签推荐
        function getRecommendationsByTag(tag, limit = 20) {
            const recommendations = [];

            function findRelatedTags(obj, currentPath = []) {
                for (const key in obj) {
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        findRelatedTags(obj[key], [...currentPath, key]);
                    } else if (Array.isArray(obj[key])) {
                        // 检查当前标签是否在数组中
                        if (obj[key].includes(tag)) {
                            // 添加同级的其他标签
                            obj[key].forEach(item => {
                                if (item !== tag && !recommendations.includes(item)) {
                                    recommendations.push(item);
                                }
                            });

                            // 添加同组的其他标签（如果有）
                            if (currentPath.length > 0) {
                                const parentPath = currentPath.slice(0, -1);
                                const parentObj = getParentObject(musicTags, parentPath);

                                for (const parentKey in parentObj) {
                                    if (Array.isArray(parentObj[parentKey]) && parentObj[parentKey] !== obj[key]) {
                                        parentObj[parentKey].forEach(item => {
                                            if (!recommendations.includes(item)) {
                                                recommendations.push(item);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function getParentObject(obj, path) {
                let current = obj;
                for (const key of path) {
                    current = current[key];
                }
                return current;
            }

            findRelatedTags(musicTags);

            // 只返回指定数量的推荐
            return recommendations.slice(0, limit);
        }

        // 获取标签的层次信息
        function getTagHierarchy(tag) {
            const hierarchy = [];

            function findTag(obj, currentPath = []) {
                for (const key in obj) {
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                        if (findTag(obj[key], [...currentPath, key])) {
                            return true;
                        }
                    } else if (Array.isArray(obj[key])) {
                        if (obj[key].includes(tag)) {
                            hierarchy.push(...currentPath, key);
                            return true;
                        }
                    }
                }
                return false;
            }

            findTag(musicTags);
            return hierarchy;
        }

        // 获取当前播放歌曲的相关标签推荐
        function getSongRecommendations(song) {
            // 检查歌曲对象是否有效
            if (!song || !song.artistName || !song.trackName) {
                return [];
            }

            // 确保字符串属性存在且不为空
            const artistName = song.artistName || '';
            const trackName = song.trackName || '';

            // 基于艺术家的推荐
            const artistRecommendations = [];
            for (const category in musicTags.culture.artists) {
                if (musicTags.culture.artists[category].includes(artistName)) {
                    // 添加同类型艺术家
                    musicTags.culture.artists[category].forEach(artist => {
                        if (artist !== artistName && !artistRecommendations.includes(artist)) {
                            artistRecommendations.push(artist);
                        }
                    });
                }
            }

            // 基于流派的推荐
            const genreRecommendations = [];
            for (const category in musicTags.genres.main) {
                if (musicTags.genres.main[category].some(genre =>
                    trackName.toLowerCase().includes(genre.toLowerCase()) ||
                    artistName.toLowerCase().includes(genre.toLowerCase()))) {
                    // 添加同类流派
                    musicTags.genres.main[category].forEach(genre => {
                        if (!genreRecommendations.includes(genre) &&
                            !artistRecommendations.includes(genre)) {
                            genreRecommendations.push(genre);
                        }
                    });

                    // 添加子流派
                    if (musicTags.genres.sub_genres[`${category}_sub`]) {
                        musicTags.genres.sub_genres[`${category}_sub`].forEach(subGenre => {
                            if (!genreRecommendations.includes(subGenre)) {
                                genreRecommendations.push(subGenre);
                            }
                        });
                    }
                }
            }

            // 合并所有推荐并限制数量
            const allRecommendations = [...artistRecommendations, ...genreRecommendations];
            return [...new Set(allRecommendations)].slice(0, 10);
        }

        // 从层次化标签中获取所有关键词
        const keywords = getAllKeywords();

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            // 检查URL参数，如果包含youtube_embed，则显示嵌入式播放器
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('youtube_embed') === 'true') {
                // 显示嵌入式播放器
                const videoId = urlParams.get('video_id');
                const title = urlParams.get('title') || 'Unknown Title';
                const artist = urlParams.get('artist') || 'Unknown Artist';

                if (videoId) {
                    // 添加嵌入式模式类到body
                    document.body.classList.add('embedded-mode');
                    // 隐藏不必要的UI元素
                    document.querySelector('.header').style.display = 'none';
                    document.querySelector('.content').style.display = 'none';
                    const playerElement = document.querySelector('.player');
                    playerElement.style.display = 'block';
                    playerElement.classList.add('embedded'); // 添加嵌入式样式类
                    document.querySelector('.bg-gradient').style.display = 'none';
                    document.querySelector('.bg-album').style.display = 'none';
                    $('danmaku').style.display = 'none';

                    // 初始化播放器UI
                    const cover = 'https://i.ytimg.com/img/no_thumbnail.jpg'; // 默认封面
                    $('player-cover').src = cover;

                    const titleTextEl = $('player-title-text');
                    const artistTextEl = $('player-artist-text');

                    titleTextEl.textContent = title;
                    artistTextEl.textContent = artist;

                    // 设置维基百科按钮
                    const wikiBtn = $('player-wiki-btn');
                    const cleanArtistName = artist.split(/&|,|feat\.|ft\./i)[0].trim();
                    wikiBtn.style.display = 'flex';
                    wikiBtn.onclick = () => {
                        const wikiUrl = `https://zh.wikipedia.org/wiki/${encodeURIComponent(cleanArtistName)}`;
                        window.open(wikiUrl, '_blank');
                    };
                    wikiBtn.title = `查看 ${cleanArtistName} 的维基百科`;

                    // 设置标签推荐按钮
                    const tagBtn = $('player-tag-btn');
                    tagBtn.style.display = 'flex';
                    tagBtn.onclick = () => {
                        showCurrentSongTags();
                    };
                    tagBtn.title = '查看歌曲标签推荐';

                    // 检查是否需要滚动
                    const checkScroll = (el) => {
                        el.classList.remove('scroll-text');
                        el.style.transform = 'none';

                        const containerWidth = el.parentElement.clientWidth;
                        const textWidth = el.scrollWidth;

                        if (textWidth > containerWidth) {
                            const distance = containerWidth - textWidth;
                            const duration = Math.abs(distance) / 30 + 2;

                            el.style.setProperty('--scroll-distance', `${distance}px`);
                            el.style.setProperty('--duration', `${duration}s`);
                            el.classList.add('scroll-text');
                        }
                    };

                    setTimeout(() => {
                        checkScroll(titleTextEl);
                        checkScroll(artistTextEl);
                    }, 50);

                    // 播放YouTube歌曲
                    playYouTubeSong(videoId, title, artist, cover);
                }
            } else {
                // 正常模式：执行搜索并显示界面
                randomSearch();
                // 确保body不包含嵌入式模式类
                document.body.classList.remove('embedded-mode');
            }

            const searchInput = $('search-input');
            const searchClearBtn = $('search-clear-btn');
            let searchTimeout;

            // Remove problematic event listeners and simplify focus handling
            // Standard input handling for PWA mode
            searchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    clearTimeout(searchTimeout);
                    searchMusic();
                }
            });

            // Handle focus event properly without forcing focus
            searchInput.addEventListener('focus', () => {
                // Do not prevent default or stop propagation here as it interferes with input method
                console.log('Search input focused');
            });

            // Handle input event with debounce
            searchInput.addEventListener('input', () => {
                searchClearBtn.style.display = searchInput.value ? 'flex' : 'none';

                // 防抖搜索
                clearTimeout(searchTimeout);
                if (searchInput.value.trim()) {
                    searchTimeout = setTimeout(() => {
                        searchMusic();
                    }, 800);
                }
            });

            // Show clear button if search input already has value on load
            searchClearBtn.style.display = searchInput.value ? 'flex' : 'none';

            // Clear search input when clear button is clicked
            searchClearBtn.addEventListener('click', () => {
                clearTimeout(searchTimeout);
                searchInput.value = '';
                searchClearBtn.style.display = 'none';
                // Simply focus input without interfering with input methods
                setTimeout(() => {
                    searchInput.focus();
                    if (typeof searchInput.select === 'function') {
                        searchInput.select();
                    }
                }, 50);
            });

            // Simplified click handler on container
            const searchInputContainer = document.querySelector('.search-input-container');
            if (searchInputContainer) {
                searchInputContainer.addEventListener('click', (e) => {
                    // Do not prevent default or stop propagation to allow proper input method handling
                    if (e.target === searchInputContainer || e.target.closest('.search-input-container')) {
                        // Just ensure the input gets focus naturally
                        setTimeout(() => {
                            searchInput.focus();
                        }, 0);
                    }
                });
            }

            // 双击封面打开歌词
            $('player-cover').addEventListener('dblclick', openLyrics);
        });

        // 搜索艺术家
        function searchByArtist(artistName) {
            const cleanArtist = artistName.split(/&|,|feat\.|ft\./i)[0].trim();
            $('search-input').value = cleanArtist;
            searchMusic();
        }

        // 搜索歌曲
        function searchBySong(songName) {
            // Remove parentheses and brackets with their contents from song name
            let cleanSongName = songName.replace(/\([^)]*\)|\[[^\]]*\]/g, '').trim();
            $('search-input').value = cleanSongName;
            searchMusic();
        }

        // 随机搜索
        function randomSearch() {
            $('search-input').value = keywords[Math.floor(Math.random() * keywords.length)];
            searchMusic();
        }

        // 智能随机搜索 - 基于标签层次结构
        function smartRandomSearch() {
            // 从标签的顶层类别中随机选择一个
            const topLevelCategories = Object.keys(musicTags);
            if (topLevelCategories.length === 0) {
                randomSearch(); // 回退到普通随机搜索
                return;
            }
            const randomCategory = topLevelCategories[Math.floor(Math.random() * topLevelCategories.length)];

            // 从该类别中随机选择一个子类别
            const subCategories = Object.keys(musicTags[randomCategory]);
            if (subCategories.length === 0) {
                randomSearch(); // 回退到普通随机搜索
                return;
            }
            const randomSubCategory = subCategories[Math.floor(Math.random() * subCategories.length)];

            // 从子类别中随机选择一个标签
            const tagsInSubCategory = musicTags[randomCategory][randomSubCategory];
            if (Array.isArray(tagsInSubCategory) && tagsInSubCategory.length > 0) {
                const randomTag = tagsInSubCategory[Math.floor(Math.random() * tagsInSubCategory.length)];
                if (randomTag) {  // 确保标签不为undefined或null
                    $('search-input').value = randomTag;
                    searchMusic();
                    showToast(`智能推荐：${randomTag} (${randomCategory} > ${randomSubCategory})`);
                } else {
                    randomSearch(); // 回退到普通随机搜索
                }
            } else {
                // 如果子类别不是数组而是更深层结构，则继续深入
                const deeperCategories = Object.keys(musicTags[randomCategory][randomSubCategory]);
                if (deeperCategories && deeperCategories.length > 0) {
                    const randomDeeperCategory = deeperCategories[Math.floor(Math.random() * deeperCategories.length)];
                    const tagsInDeeperCategory = musicTags[randomCategory][randomSubCategory][randomDeeperCategory];
                    if (Array.isArray(tagsInDeeperCategory) && tagsInDeeperCategory.length > 0) {
                        const randomTag = tagsInDeeperCategory[Math.floor(Math.random() * tagsInDeeperCategory.length)];
                        if (randomTag) {  // 确保标签不为undefined或null
                            $('search-input').value = randomTag;
                            searchMusic();
                            showToast(`智能推荐：${randomTag} (${randomCategory} > ${randomSubCategory} > ${randomDeeperCategory})`);
                        } else {
                            randomSearch(); // 回退到普通随机搜索
                        }
                    } else {
                        // 回退到普通随机搜索
                        randomSearch();
                    }
                } else {
                    // 回退到普通随机搜索
                    randomSearch();
                }
            }
        }

        // 搜索音乐
        async function searchMusic() {
            const query = $('search-input').value?.trim();
            if (!query) return;

            // 解析URL参数
            const urlParams = getUrlParams();
            const isAppleOnly = urlParams.apple && !urlParams.youtube;
            const isYouTubeOnly = urlParams.youtube && !urlParams.apple;
            const isBoth = !isAppleOnly && !isYouTubeOnly; // 默认情况，显示两个来源

            // 尝试从缓存获取搜索结果
            const cacheKey = `search_${query}`;
            let cachedResults = CacheManager.get(cacheKey);

            if (cachedResults) {
                console.log('Using cached search results for:', query);
                state.playlist = cachedResults;
                renderResults(cachedResults);
                return;
            }

            $('results').innerHTML = `
                <div class="loading" style="grid-column: 1/-1;">
                    <div class="loading-spinner"></div>
                    <div>正在搜索...</div>
                </div>
            `;

            let iTunesResults = [];
            let youTubeResults = [];

            // 根据URL参数决定搜索哪个来源
            if (!isYouTubeOnly) {
                // 搜索 iTunes API (如果未指定只用YouTube)
                try {
                    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=48&country=cn`);
                    if (res.ok) {
                        const iTunesData = await res.json();
                        iTunesResults = iTunesData.results || [];
                    } else {
                        console.error('iTunes API 请求失败，状态码:', res.status);
                        iTunesResults = [];
                    }
                } catch (e) {
                    console.error('iTunes API 搜索失败:', e);
                    iTunesResults = [];
                }
            }

            if (!isAppleOnly) {
                // 搜索 YouTube (如果未指定只用iTunes)
                try {
                    const youTubeRes = await fetch(`https://api.yuangs.cc/youtubeapi/search/song?q=${encodeURIComponent(query)}&limit=48`);
                    if (youTubeRes.ok) {
                        const youTubeJson = await youTubeRes.json();
                        // console.log('YouTube API 响应:', youTubeJson); // Debug log

                        // Check if response has the expected structure
                        if (youTubeJson && youTubeJson.data) {
                            // If the API returns data in the expected format
                            youTubeResults = youTubeJson.data.map(item => ({
                                // 将 YouTube 数据转换为 iTunes 格式
                                trackId: item.video_id || item.id,
                                trackName: item.title || item.name,
                                artistName: Array.isArray(item.artists) ? item.artists.join(', ') : (item.artist || item.author || 'Unknown Artist'),
                                collectionName: item.album || 'YouTube Music',
                                artworkUrl100: item.thumbnail || item.thumbnails?.[1]?.url || item.image || 'https://i.ytimg.com/img/no_thumbnail.jpg',
                                previewUrl: `https://www.youtube.com/watch?v=${item.video_id || item.id}`,
                                kind: 'youtube',  // 标记为 YouTube 来源
                                genre: item.category || item.genre || 'YouTube',
                                releaseDate: item.publish_date || item.publishedAt || new Date().toISOString(),
                                duration: item.duration || 'Unknown Duration'  // 添加时长信息
                            }));
                        } else {
                            console.warn('YouTube API 响应格式不正确:', youTubeJson);
                        }
                    } else {
                        console.error('YouTube API 请求失败，状态码:', youTubeRes.status);
                    }
                } catch (e) {
                    console.error('YouTube API 搜索失败:', e);
                    // 可能是 CORS 或网络问题，不中断整个搜索流程
                }
            }

            // 根据URL参数决定最终展示的歌曲数量（总共48首）
            if (isAppleOnly) {
                // 只展示iTunes来源，取前48首
                iTunesResults = iTunesResults.slice(0, 48);
                youTubeResults = [];
            } else if (isYouTubeOnly) {
                // 只展示YouTube来源，取前48首
                youTubeResults = youTubeResults.slice(0, 48);
                iTunesResults = [];
            } else {
                // 默认情况，每个来源展示24首（总共48首）
                iTunesResults = iTunesResults.slice(0, 24);
                youTubeResults = youTubeResults.slice(0, 24);
            }

            // 缓存搜索结果（有效期1小时）
            CacheManager.set(cacheKey, { itunes: iTunesResults, youtube: youTubeResults }, 1);

            // 保存到 state，用于播放
            state.playlist = [...iTunesResults, ...youTubeResults];

            // 渲染两列结果
            renderSeparateResults(iTunesResults, youTubeResults);

            // 同时缓存每个歌曲的元数据
            [...iTunesResults, ...youTubeResults].forEach(song => {
                const songCacheKey = generateCacheKey(song.artistName, song.trackName);
                CacheManager.set(songCacheKey, {
                    trackName: song.trackName,
                    artistName: song.artistName,
                    artworkUrl: song.artworkUrl100,
                    previewUrl: song.previewUrl,
                    collectionName: song.collectionName,
                    kind: song.kind  // 保存来源类型
                }, 24); // 24小时有效期
            });
        }

        // 渲染分离的结果（iTunes 和 YouTube 分列显示）
        function renderSeparateResults(iTunesSongs, youTubeSongs) {
            if (iTunesSongs.length === 0 && youTubeSongs.length === 0) {
                $('results').innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-icon">🔍</div>
                        <div class="empty-title">未找到结果</div>
                        <div class="empty-desc">换个关键词试试</div>
                    </div>
                `;
                return;
            }

            // 解析URL参数来确定显示模式
            const urlParams = getUrlParams();
            const isAppleOnly = urlParams.apple && !urlParams.youtube;
            const isYouTubeOnly = urlParams.youtube && !urlParams.apple;

            const renderSongList = (songs, startIndex) => {
                return songs.map((song, index) => {
                    const actualIndex = startIndex + index;
                    const songCacheKey = generateCacheKey(song.artistName, song.trackName);
                    const cachedSong = CacheManager.get(songCacheKey);
                    const coverUrl = (cachedSong?.artworkUrl || song.artworkUrl100).replace('100x100bb', '300x300bb');
                    const isYouTube = song.kind === 'youtube' || song.previewUrl?.includes('youtube.com');

                    return `
                        <div class="song-card" data-index="${actualIndex}" onclick="playSong(${actualIndex})">
                            <div class="song-cover">
                                <img src="${coverUrl}" loading="lazy" alt="">
                                <div class="play-overlay">
                                    <div class="play-overlay-btn">▶</div>
                                </div>
                                ${song.trackId ? `<div class="song-options" onclick="event.stopPropagation(); toggleOptionsMenu(event, '${song.trackId}', '${escapeHtml(song.trackName)}', '${escapeHtml(song.artistName)}', '${coverUrl}', ${isYouTube})">⋯</div>` : ''}
                                ${isYouTube && song.duration ? `<div class="song-duration">${escapeHtml(song.duration)}</div>` : ''}
                            </div>
                            <div class="song-title">${isYouTube ? '<span style="color: #ff6b6b;">▶</span> ' : ''}${escapeHtml(song.trackName)}</div>
                            <div class="song-artist">${escapeHtml(song.artistName)}</div>
                        </div>
                    `;
                }).join('');
            };

            // 根据URL参数决定渲染模式
            if (isAppleOnly || isYouTubeOnly) {
                // 只显示一个来源，但让网格布局仍然显示歌曲为多列
                const sourceName = isAppleOnly ? 'Apple Music' : 'YouTube Music';
                const songsToDisplay = isAppleOnly ? iTunesSongs : youTubeSongs;

                $('results').innerHTML = `
                    <div class="results-columns" style="grid-column: 1 / -1;">
                        <div class="results-column" style="grid-column: 1 / -1;"> <!-- Use full width -->
                            <div class="simple-header">${sourceName}</div>
                            <div class="grid">
                                ${songsToDisplay.length > 0 ? renderSongList(songsToDisplay, 0) : '<div class="empty-message">暂无结果</div>'}
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // 默认显示两个来源
                $('results').innerHTML = `
                    <div class="results-columns" style="grid-column: 1 / -1;">
                        <div class="results-column">
                            <div class="simple-header">iTunes</div>
                            <div class="grid">
                                ${iTunesSongs.length > 0 ? renderSongList(iTunesSongs, 0) : '<div class="empty-message">暂无结果</div>'}
                            </div>
                        </div>
                        <div class="results-column">
                            <div class="simple-header">YouTube</div>
                            <div class="grid">
                                ${youTubeSongs.length > 0 ? renderSongList(youTubeSongs, iTunesSongs.length) : '<div class="empty-message">暂无结果</div>'}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // 渲染结果
        function renderResults(songs) {
            if (songs.length === 0) {
                $('results').innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-icon">🔍</div>
                        <div class="empty-title">未找到结果</div>
                        <div class="empty-desc">换个关键词试试</div>
                    </div>
                `;
                return;
            }

            $('results').innerHTML = songs.map((song, index) => {
                // 检查是否有缓存的元数据
                const songCacheKey = generateCacheKey(song.artistName, song.trackName);
                const cachedSong = CacheManager.get(songCacheKey);

                // 使用缓存的或原始的封面URL
                const coverUrl = (cachedSong?.artworkUrl || song.artworkUrl100).replace('100x100bb', '300x300bb');

                // 检查是否是 YouTube 来源
                const isYouTube = song.kind === 'youtube' || song.previewUrl?.includes('youtube.com');

                return `
                    <div class="song-card" data-index="${index}" onclick="playSong(${index})">
                        <div class="song-cover">
                            <img src="${coverUrl}" loading="lazy" alt="">
                            <div class="play-overlay">
                                <div class="play-overlay-btn">▶</div>
                            </div>
                            ${song.trackId ? `<div class="song-options" onclick="event.stopPropagation(); toggleOptionsMenu(event, '${song.trackId}', '${escapeHtml(song.trackName)}', '${escapeHtml(song.artistName)}', '${coverUrl}', ${isYouTube})">⋯</div>` : ''}
                            ${isYouTube && song.duration ? `<div class="song-duration">${escapeHtml(song.duration)}</div>` : ''}
                        </div>
                        <div class="song-title">${isYouTube ? '<span style="color: #ff6b6b;">▶</span> ' : ''}${escapeHtml(song.trackName)}</div>
                        <div class="song-artist">${escapeHtml(song.artistName)}</div>
                    </div>
                `;
            }).join('');
        }

        // HTML 转义
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // 播放歌曲
        function playSong(index) {
            const song = state.playlist[index];
            if (!song) return;

            // 检查是否是 YouTube 来源的歌曲
            const isYouTube = song.kind === 'youtube' || song.previewUrl?.includes('youtube.com');

            if (isYouTube) {
                // 如果是 YouTube 歌曲，使用 YouTube 播放函数
                playYouTubeSong(
                    song.trackId,
                    song.trackName || '未知歌曲',
                    song.artistName || '未知艺术家',
                    song.artworkUrl100 || song.thumbnails?.[1]?.url || 'https://i.ytimg.com/img/no_thumbnail.jpg'
                );
                return;
            }

            state.currentTrack = song;
            state.currentIndex = index;

            // 从缓存获取完整数据，如果有的话
            const songCacheKey = generateCacheKey(song.artistName, song.trackName);
            const cachedSong = CacheManager.get(songCacheKey);

            // 使用缓存数据或原始数据
            const trackName = cachedSong?.trackName || song.trackName;
            const artistName = cachedSong?.artistName || song.artistName;
            const artworkUrl = cachedSong?.artworkUrl || song.artworkUrl100;
            const previewUrl = cachedSong?.previewUrl || song.previewUrl;
            const collectionName = cachedSong?.collectionName || song.collectionName || song.collectionName;

            const cover = artworkUrl.replace('100x100bb', '600x600bb');

            // 更新顶部信息栏
            const titleTextEl = $('player-title-text');
            const artistTextEl = $('player-artist-text');
            const wikiBtn = $('player-wiki-btn');

            titleTextEl.textContent = trackName;
            artistTextEl.textContent = artistName;
            $('player-cover').src = cover;

            // 添加点击事件到标题（搜索歌曲名）
            titleTextEl.onclick = () => {
                searchBySong(trackName);
            };
            titleTextEl.title = '点击搜索该歌曲';

            // 添加点击事件到艺术家名称（搜索艺术家）
            artistTextEl.onclick = () => {
                searchByArtist(artistName);
            };
            artistTextEl.title = '点击搜索该艺术家的歌曲';

            // 设置维基百科按钮
            const cleanArtistName = artistName.split(/&|,|feat\.|ft\./i)[0].trim();
            wikiBtn.style.display = 'flex';
            wikiBtn.onclick = () => {
                const wikiUrl = `https://zh.wikipedia.org/wiki/${encodeURIComponent(cleanArtistName)}`;
                window.open(wikiUrl, '_blank');
            };
            wikiBtn.title = `查看 ${cleanArtistName} 的维基百科`;

            // 设置标签推荐按钮
            const tagBtn = $('player-tag-btn');
            tagBtn.style.display = 'flex';
            tagBtn.onclick = () => {
                showCurrentSongTags();
            };
            tagBtn.title = '查看歌曲标签推荐';

            // 检查是否需要滚动
            const checkScroll = (el) => {
                // 先重置，以便准确测量
                el.classList.remove('scroll-text');
                el.style.transform = 'none';

                // 比较内部文本宽度和外部容器宽度
                const containerWidth = el.parentElement.clientWidth;
                const textWidth = el.scrollWidth;

                if (textWidth > containerWidth) {
                    const distance = containerWidth - textWidth; // 负值，向左移动
                    const duration = Math.abs(distance) / 30 + 2; // 速度控制：每秒30px，基础2s

                    el.style.setProperty('--scroll-distance', `${distance}px`);
                    el.style.setProperty('--duration', `${duration}s`);
                    el.classList.add('scroll-text');
                }
            };

            // 稍微延时一点，确保 DOM 渲染完成
            setTimeout(() => {
                checkScroll(titleTextEl);
                checkScroll(artistTextEl);
            }, 50);

            // 背景
            $('bg-album').style.backgroundImage = `url(${cover})`;
            $('bg-album').classList.add('active');

            // 标记当前播放
            document.querySelectorAll('.song-card').forEach((card, i) => {
                card.classList.toggle('playing', i === index);
            });

            // 播放
            audio.src = previewUrl;
            audio.play()
                .then(() => updatePlayState(true))
                .catch(() => updatePlayState(false));

            // 弹幕
            startDanmaku();

            // 预加载歌词
            $('lyrics-title').textContent = trackName;
            $('lyrics-artist').textContent = artistName;
            // Set up Wikipedia link for artist name
            setupWikipediaLink(artistName);
            $('lyrics-cover').src = cover;
            $('lyrics-text').textContent = '加载中...';
            $('lyrics-wiki').classList.remove('show');

            fetchLyrics(artistName, trackName);
            fetchArtistWiki(artistName);

            // Add click event to artist name to search for artist's songs (left click)
            // and open Wikipedia (Ctrl/Cmd+click)
            $('lyrics-artist').onclick = function (event) {
                if (event.ctrlKey || event.metaKey) {
                    // Ctrl/Cmd + click: open Wikipedia
                    const wikiUrl = $('lyrics-artist').dataset.wikiUrl || `https://zh.wikipedia.org/wiki/${encodeURIComponent(artistName.split(/&|,|feat\.|ft\./i)[0].trim())}`;
                    window.open(wikiUrl, '_blank');
                } else {
                    // Regular click: search for artist's songs
                    searchByArtist(artistName);
                }
            };
            $('lyrics-artist').style.cursor = 'pointer';
            $('lyrics-artist').title = '点击搜索该艺术家的歌曲 (Ctrl/Cmd+点击访问维基百科)';

            // 添加到历史记录
            HistoryManager.add(song);

            // 更新系统媒体中心控制 (Media Session API)
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: trackName,
                    artist: artistName,
                    album: collectionName || '广山音乐',
                    artwork: [
                        { src: artworkUrl.replace('100x100bb', '96x96bb'), sizes: '96x96', type: 'image/jpeg' },
                        { src: artworkUrl.replace('100x100bb', '128x128bb'), sizes: '128x128', type: 'image/jpeg' },
                        { src: artworkUrl.replace('100x100bb', '192x192bb'), sizes: '192x192', type: 'image/jpeg' },
                        { src: artworkUrl.replace('100x100bb', '256x256bb'), sizes: '256x256', type: 'image/jpeg' },
                        { src: cover, sizes: '512x512', type: 'image/jpeg' }
                    ]
                });

                navigator.mediaSession.setActionHandler('play', togglePlay);
                navigator.mediaSession.setActionHandler('pause', togglePlay);
                navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
                navigator.mediaSession.setActionHandler('nexttrack', () => playNext(false));
            }

            // 更新收藏按钮状态
            updateFavoriteButton();

            // 更新推荐标签
            updateRecommendationTags(song);
        }

        // 更新推荐标签
        function updateRecommendationTags(song) {
            const recommendations = getSongRecommendations(song);
            const container = $('recommendation-tags-container');
            const tagsElement = $('recommendation-tags');
            const showMoreBtn = $('show-more-recommendations');

            if (!recommendations || recommendations.length === 0) {
                tagsElement.style.display = 'none';
                return;
            }

            // 过滤掉无效的推荐标签
            const validRecommendations = recommendations.filter(tag => tag && typeof tag === 'string');

            if (validRecommendations.length === 0) {
                tagsElement.style.display = 'none';
                return;
            }

            // 只显示前5个推荐
            const displayRecommendations = validRecommendations.slice(0, 5);

            // 渲染推荐标签
            container.innerHTML = displayRecommendations.map(tag => `
                <span class="recommendation-tag" onclick="searchByTag('${tag}')">${escapeHtml(tag)}</span>
            `).join('');

            // 如果还有更多推荐，显示"展开更多"按钮
            if (validRecommendations.length > 5) {
                showMoreBtn.style.display = 'block';
                showMoreBtn.onclick = () => {
                    // 显示所有推荐
                    container.innerHTML = validRecommendations.map(tag => `
                        <span class="recommendation-tag" onclick="searchByTag('${tag}')">${escapeHtml(tag)}</span>
                    `).join('');
                    showMoreBtn.style.display = 'none';
                };
            } else {
                showMoreBtn.style.display = 'none';
            }

            // 显示推荐区域
            tagsElement.style.display = 'block';
        }

        // YouTube 音乐 API 搜索函数
        async function searchYouTubeMusic(query) {
            try {
                const response = await fetch(`https://api.yuangs.cc/youtubeapi/search/song?q=${encodeURIComponent(query)}&limit=10`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('YouTube search API 响应:', data); // Debug log

                    if (data && data.data && data.data.length > 0) {
                        // 确保返回的数据格式一致
                        return data.data.map(item => ({
                            ...item,
                            // 确保艺术家字段正确映射
                            artist: Array.isArray(item.artists) ? item.artists.join(', ') : item.artist,
                            // 如果需要 iTunes 兼容格式
                            artistName: Array.isArray(item.artists) ? item.artists.join(', ') : (item.artist || item.author || 'Unknown Artist'),
                            trackName: item.title || item.name
                        }));
                    }
                } else {
                    console.error('YouTube API 请求失败，状态码:', response.status);
                }
                return [];
            } catch (error) {
                console.error('YouTube API 搜索失败:', error);
                return [];
            }
        }

        // 从 YouTube 搜索并播放歌曲
        async function searchAndPlayYouTubeSong(query) {
            const results = await searchYouTubeMusic(query);
            if (results && results.length > 0) {
                const song = results[0]; // 使用第一个结果
                playYouTubeSong(
                    song.video_id,
                    song.title || '未知歌曲',
                    song.artist || '未知艺术家',
                    song.thumbnail || song.thumbnails?.[1]?.url || ''
                );
                return true;
            }
            return false;
        }

        // 按标签搜索
        function searchByTag(tag) {
            if (!tag) {
                return;
            }
            $('search-input').value = tag;
            searchMusic();
        }

        // 显示当前播放歌曲的标签层次结构
        function showCurrentSongTags() {
            if (!state.currentTrack) {
                showToast('请先播放一首歌曲');
                return;
            }

            const song = state.currentTrack;
            const recommendations = getSongRecommendations(song);

            if (!recommendations || recommendations.length === 0) {
                showToast('未找到相关标签');
                return;
            }

            // 过滤掉无效的推荐标签
            const validRecommendations = recommendations.filter(tag => tag && typeof tag === 'string');

            if (validRecommendations.length === 0) {
                showToast('未找到有效标签');
                return;
            }

            // 创建标签详情弹窗
            const modal = document.createElement('div');
            modal.className = 'tag-details-modal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="this.parentElement.remove()">
                    <div class="modal-content" onclick="event.stopPropagation()">
                        <h3>相关标签推荐</h3>
                        <div class="tags-list">
                            ${validRecommendations.map(tag => `
                                <div class="tag-item" onclick="searchByTag('${tag}')">
                                    <span class="tag-name">${escapeHtml(tag)}</span>
                                    <span class="tag-search-btn">🔍</span>
                                </div>
                            `).join('')}
                        </div>
                        <button class="modal-close-btn" onclick="this.parentElement.parentElement.remove()">关闭</button>
                    </div>
                </div>
            `;

            // 添加样式
            if (!document.querySelector('#tag-details-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'tag-details-modal-styles';
                styles.textContent = `
                    .tag-details-modal .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                    }
                    .tag-details-modal .modal-content {
                        background: var(--card);
                        border-radius: 16px;
                        padding: 24px;
                        max-width: 400px;
                        width: 90%;
                        max-height: 80vh;
                        overflow-y: auto;
                        border: 1px solid var(--glass-border);
                        backdrop-filter: blur(20px);
                    }
                    .tag-details-modal h3 {
                        margin: 0 0 16px;
                        color: var(--text);
                        text-align: center;
                    }
                    .tags-list {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        margin-bottom: 16px;
                    }
                    .tag-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 12px;
                        background: var(--glass);
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .tag-item:hover {
                        background: var(--primary);
                        color: white;
                    }
                    .tag-search-btn {
                        opacity: 0.7;
                        transition: opacity 0.2s ease;
                    }
                    .tag-item:hover .tag-search-btn {
                        opacity: 1;
                    }
                    .modal-close-btn {
                        width: 100%;
                        padding: 12px;
                        background: var(--glass);
                        border: 1px solid var(--glass-border);
                        color: var(--text);
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    }
                    .modal-close-btn:hover {
                        background: var(--card-hover);
                    }
                `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(modal);
        }

        // 更新播放状态
        function updatePlayState(playing) {
            state.isPlaying = playing;
            const btn = $('play-btn');
            btn.textContent = playing ? '⏸' : '▶';
            btn.setAttribute('data-playing', playing); // 用于 CSS 样式修正
            $('player-cover').classList.toggle('spinning', playing);
        }

        // 隐藏播放器按钮
        function hidePlayerButtons() {
            const wikiBtn = $('player-wiki-btn');
            const tagBtn = $('player-tag-btn');
            if (wikiBtn) wikiBtn.style.display = 'none';
            if (tagBtn) tagBtn.style.display = 'none';
        }

        // 播放/暂停
        function togglePlay() {
            if (!state.currentTrack && state.playlist.length > 0) {
                // 如果没有当前播放的歌曲但有播放列表，则播放第一首
                playSong(0);
            } else if (state.currentTrack) {
                // 检查是否是 YouTube 来源的歌曲
                const isYouTube = state.currentTrack.kind === 'youtube' ||
                    (state.currentTrack.previewUrl && state.currentTrack.previewUrl.includes('youtube.com'));

                if (isYouTube) {
                    toggleYouTubePlay();
                } else {
                    // 对于 iTunes 歌曲，继续使用标准音频元素
                    if (audio.src) {
                        if (audio.paused) {
                            audio.play()
                                .then(() => updatePlayState(true))
                                .catch(error => {
                                    console.error('无法播放音频:', error);
                                    // If standard audio fails, try to initialize YouTube player if it's a YouTube source
                                    if (isYouTube) {
                                        toggleYouTubePlay();
                                    }
                                });
                        } else {
                            audio.pause();
                            updatePlayState(false);
                        }
                    }
                }
            }
        }

        // 在 YouTube 播放器中播放下一首
        function playNextForYouTube() {
            if (state.playMode === 'single') {
                // 单曲循环，重新播放当前歌曲
                if (youtubePlayerManager.getPlayer()) {
                    youtubePlayerManager.seekTo(0);
                    youtubePlayerManager.playVideo();
                }
                return;
            }

            if (state.playlist.length === 0) return;

            let newIndex;
            if (state.playMode === 'random') {
                newIndex = Math.floor(Math.random() * state.playlist.length);
                // 尽量避免随机到同一首（除非只有一首）
                if (state.playlist.length > 1 && newIndex === state.currentIndex) {
                    newIndex = (newIndex + 1) % state.playlist.length;
                }
            } else {
                newIndex = (state.currentIndex + 1) % state.playlist.length;
            }
            playSong(newIndex);
        }

        // 切换播放模式
        function togglePlayMode() {
            const modes = ['sequence', 'random', 'single'];
            const currentIdx = modes.indexOf(state.playMode);
            const nextIdx = (currentIdx + 1) % modes.length;
            state.playMode = modes[nextIdx];

            const btn = $('mode-btn');
            switch (state.playMode) {
                case 'sequence':
                    btn.textContent = '🔁';
                    btn.title = '列表循环';
                    showToast('列表循环');
                    break;
                case 'random':
                    btn.textContent = '🔀';
                    btn.title = '随机播放';
                    showToast('随机播放');
                    break;
                case 'single':
                    btn.textContent = '🔂';
                    btn.title = '单曲循环';
                    showToast('单曲循环');
                    break;
            }
        }

        // 上一首/下一首
        function playPrevious() {
            if (state.playlist.length === 0) return;

            let newIndex;
            if (state.playMode === 'random') {
                newIndex = Math.floor(Math.random() * state.playlist.length);
            } else {
                newIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
            }
            playSong(newIndex);
        }

        function playNext(auto = false) {
            if (state.playlist.length === 0) return;

            // 如果是自动播放（播放结束触发）且是单曲循环
            if (auto && state.playMode === 'single') {
                audio.currentTime = 0;
                audio.play();
                return;
            }

            let newIndex;
            if (state.playMode === 'random') {
                newIndex = Math.floor(Math.random() * state.playlist.length);
                // 尽量避免随机到同一首（除非只有一首）
                if (state.playlist.length > 1 && newIndex === state.currentIndex) {
                    newIndex = (newIndex + 1) % state.playlist.length;
                }
            } else {
                newIndex = (state.currentIndex + 1) % state.playlist.length;
            }
            playSong(newIndex);
        }

        // 进度条
        audio.ontimeupdate = () => {
            // Only update progress bar for non-YouTube sources (iTunes previews)
            if (!state.currentTrack || !(state.currentTrack.kind === 'youtube' ||
                (state.currentTrack.previewUrl && state.currentTrack.previewUrl.includes('youtube.com')))) {
                if (isNaN(audio.duration)) return;
                const pct = (audio.currentTime / audio.duration) * 100;
                $('progress-fill').style.width = pct + '%';
                $('current-time').textContent = formatTime(audio.currentTime);
            }
        };

        audio.onloadedmetadata = () => {
            // Only update duration for non-YouTube sources
            if (!state.currentTrack || !(state.currentTrack.kind === 'youtube' ||
                (state.currentTrack.previewUrl && state.currentTrack.previewUrl.includes('youtube.com')))) {
                $('total-time').textContent = formatTime(audio.duration);
            }
        };

        audio.onended = () => {
            // For YouTube, we rely on the YouTube player's onStateChange event
            if (!state.currentTrack || !(state.currentTrack.kind === 'youtube' ||
                (state.currentTrack.previewUrl && state.currentTrack.previewUrl.includes('youtube.com')))) {
                updatePlayState(false);
                playNext(true); // 传入 true 表示自动播放
            }
        };

        // 为 YouTube 播放器创建定时器来更新进度 - 使用更频繁的更新
        // Using a more robust interval that can continue in background
        let youtubeProgressInterval = setInterval(() => {
            if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                try {
                    const currentTime = youtubePlayerManager.getCurrentTime();
                    const duration = youtubePlayerManager.getDuration();

                    if (!isNaN(duration) && !isNaN(currentTime) && duration > 0) {
                        const pct = (currentTime / duration) * 100;
                        $('progress-fill').style.width = pct + '%';
                        $('current-time').textContent = formatTime(currentTime);
                        $('total-time').textContent = formatTime(duration);

                        // Update media session position state for background playback controls
                        if ('setPositionState' in navigator.mediaSession) {
                            navigator.mediaSession.setPositionState({
                                duration: duration,
                                playbackRate: 1.0,
                                position: currentTime
                            });
                        }
                    }
                } catch (e) {
                    // 如果 YouTube 播放器还没准备好，忽略错误
                }
            }
        }, 500); // 每0.5秒更新一次进度，使时间轴更流畅

        // Store the interval ID so we can clear it if needed
        state.youtubeProgressInterval = youtubeProgressInterval;

        // Additional progress update function specifically for PWA compatibility
        let pwaProgressInterval = null;

        function startPWAProgressUpdates() {
            if (pwaProgressInterval) {
                clearInterval(pwaProgressInterval);
            }

            pwaProgressInterval = setInterval(() => {
                if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                    updateYouTubeProgress();
                }
            }, 800); // Slightly longer than the main interval to avoid conflicts
        }

        function stopPWAProgressUpdates() {
            if (pwaProgressInterval) {
                clearInterval(pwaProgressInterval);
                pwaProgressInterval = null;
            }
        }

        function updateYouTubeProgress() {
            if (youtubePlayerManager.getPlayer()) {
                try {
                    const currentTime = youtubePlayerManager.getCurrentTime();
                    const duration = youtubePlayerManager.getDuration();

                    if (!isNaN(duration) && !isNaN(currentTime) && duration > 0) {
                        const pct = (currentTime / duration) * 100;
                        $('progress-fill').style.width = pct + '%';
                        $('current-time').textContent = formatTime(currentTime);
                        $('total-time').textContent = formatTime(duration);

                        // Update media session position state for background playback controls
                        if ('setPositionState' in navigator.mediaSession) {
                            navigator.mediaSession.setPositionState({
                                duration: duration,
                                playbackRate: 1.0,
                                position: currentTime
                            });
                        }
                    }
                } catch (e) {
                    // 如果 YouTube 播放器还没准备好，忽略错误
                }
            }
        }

        // 停止弹幕系统
        function stopDanmaku() {
            if (state.danmakuInterval) {
                clearInterval(state.danmakuInterval);
                state.danmakuInterval = null;
            }
            $('danmaku').classList.remove('show');
            $('danmaku').innerHTML = '';
            // Clear the displayed danmaku set
            state.displayedDanmaku.clear();
            // Clear recent danmaku indices
            if (state.recentDanmakuIndices) {
                state.recentDanmakuIndices = [];
            }
            // Reset tracks
            state.tracks = [false, false, false, false, false];
            // 停止定期刷新弹幕数据
            DanmakuManager.stopRefresh();
        }

        function seek(e) {
            if (!audio.src) return;
            const rect = $('progress-bar').getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pct * audio.duration;
        }

        function formatTime(sec) {
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m}:${s.toString().padStart(2, '0')}`;
        }

        // 播放完整歌曲（在Apple Music中）
        function playFullSong(trackId, trackName, artistName) {
            const song = state.playlist.find(s => s.trackId == trackId);
            const albumId = song?.collectionId || trackId;

            const musicAppUrl = `music://music.apple.com/cn/album/${albumId}?i=${trackId}`;
            const webUrl = `https://music.apple.com/cn/album/${albumId}?i=${trackId}`;

            // 检测设备类型
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isMac = /Macintosh/.test(navigator.userAgent);
            const isAppleDevice = isIOS || isMac;

            if (isAppleDevice) {
                // Apple 设备：尝试打开 App
                const startTime = Date.now();

                // 使用 visibilitychange 检测是否成功跳转到 App 
                const handleVisibilityChange = () => {
                    if (document.hidden) {
                        // 页面被隐藏，说明成功打开了 App
                        clearTimeout(fallbackTimer);
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                    }
                };
                document.addEventListener('visibilitychange', handleVisibilityChange);

                // 尝试打开 App
                window.location.href = musicAppUrl;

                // 设置降级定时器
                const fallbackTimer = setTimeout(() => {
                    document.removeEventListener('visibilitychange', handleVisibilityChange);

                    // 如果页面还可见且时间很短，说明 App 没打开
                    if (!document.hidden && Date.now() - startTime < 2000) {
                        showFallbackOptions(trackName, artistName, webUrl);
                    }
                }, 1500);

            } else {
                // 非 Apple 设备：直接打开网页版
                window.open(webUrl, '_blank');
                showToast(`正在打开 "${trackName}" - ${artistName}`);
            }
        }

        // 播放 YouTube 完整歌曲（选项菜单调用）
        function playYouTubeFullSong(videoId, trackName, artistName, coverUrl) {
            playYouTubeSong(videoId, trackName, artistName, coverUrl);
        }

        // 打开 iTunes 歌曲在 Apple Music 应用或网页中
        function openAppleMusic(trackId, trackName, artistName) {
            const song = state.playlist.find(s => s.trackId == trackId);
            const albumId = song?.collectionId || trackId;

            const musicAppUrl = `music://music.apple.com/cn/album/${albumId}?i=${trackId}`;
            const webUrl = `https://music.apple.com/cn/album/${albumId}?i=${trackId}`;

            // 检测设备类型
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isMac = /Macintosh/.test(navigator.userAgent);
            const isAppleDevice = isIOS || isMac;

            if (isAppleDevice) {
                // Apple 设备：尝试打开 App
                const startTime = Date.now();

                // 使用 visibilitychange 检测是否成功跳转到 App
                const handleVisibilityChange = () => {
                    if (document.hidden) {
                        // 页面被隐藏，说明成功打开了 App
                        clearTimeout(fallbackTimer);
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                    }
                };
                document.addEventListener('visibilitychange', handleVisibilityChange);

                // 尝试打开 App
                window.location.href = musicAppUrl;

                // 设置降级定时器
                const fallbackTimer = setTimeout(() => {
                    document.removeEventListener('visibilitychange', handleVisibilityChange);

                    // 如果页面还可见且时间很短，说明 App 没打开
                    if (!document.hidden && Date.now() - startTime < 2000) {
                        showFallbackOptions(trackName, artistName, webUrl);
                    }
                }, 1500);

            } else {
                // 非 Apple 设备：直接打开网页版
                window.open(webUrl, '_blank');
                showToast(`正在打开 "${trackName}" - ${artistName}`);
            }
        }

            // 打开 YouTube 歌曲在 YouTube 应用或网页中
            function openYouTubeApp(videoId, trackName, artistName) {
                const webUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // Android Intent (Chrome 推荐方式)
        // S.browser_fallback_url 指定了如果没安装 App 跳转的地址
        const androidIntent = `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
        // iOS Scheme (不推荐，推荐直接用 webUrl，但在某些场景可用)
        const iosScheme = `youtube://watch?v=${videoId}`;

        // 1. 更精准的设备检测
        const u = navigator.userAgent;
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        // 兼容 iPad Desktop Mode 的检测
        const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        showToast(`正在打开 "${trackName}" - ${artistName}`);

        if (isAndroid) {
            // Android 最佳实践: 使用 Intent
            // 如果已安装 App，系统直接打开；没安装，Chrome 会自动处理 fallback 到网页
            window.location.href = androidIntent;
        } else if (isIOS) {
            // iOS 最佳实践: 直接访问 Universal Link (HTTPS)
            // iOS 系统会自动拦截这个链接并询问是否在 App 中打开
            // 强行用 Scheme 往往体验不好，且很难准确判断是否安装
            window.location.href = webUrl;
            
            // --- 如果你非要强行尝试 Scheme (不推荐) ---
            // window.location.href = iosScheme; 
            // setTimeout(() => {
            //    // iOS 上不能在 timeout 里 window.open，只能改变 location
            //    window.location.href = webUrl; 
            // }, 2000);
            // ----------------------------------------
        } else {
            // 桌面端
            window.open(webUrl, '_blank');
        }
    }
        // 打开 YouTube 歌曲在 YouTube Music 应用或网页中
        function openYouTubeMusic(videoId, trackName, artistName) {
            const webUrl = `https://music.youtube.com/watch?v=${videoId}`;
            const ytmusicUrl = `https://www.youtube.com/watch?v=${videoId}`; // YouTube Music app scheme
            const youtubemusicUrl = `https://www.youtube.com/watch?v=${videoId}`; // Alternative scheme

            // 检测设备类型
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            const isMobile = isIOS || isAndroid;

            if (isMobile) {
                // 移动设备：尝试打开 YouTube Music App with multiple fallbacks
                const startTime = Date.now();

                // Try YouTube Music specific schemes first
                const schemesToTry = [ytmusicUrl, youtubemusicUrl];

                let schemeIndex = 0;
                const tryNextScheme = () => {
                    if (schemeIndex < schemesToTry.length) {
                        const schemeUrl = schemesToTry[schemeIndex];
                        schemeIndex++;

                        // 使用 iframe 方式尝试打开，这样不会被拦截
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = schemeUrl;
                        document.body.appendChild(iframe);

                        // Remove the iframe after a short time
                        setTimeout(() => {
                            if (iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }

                            // Check if app opened by measuring elapsed time
                            if (Date.now() - startTime < 2000 && schemeIndex < schemesToTry.length) {
                                // If still on page, try next scheme
                                tryNextScheme();
                            } else if (Date.now() - startTime < 2000) {
                                // If still on page and all schemes tried, fallback to web
                                window.open(webUrl, '_blank');
                                showToast(`正在打开 "${trackName}" - ${artistName}`);
                            }
                        }, 800); // Reduced timeout to try schemes faster
                    } else {
                        // All schemes tried, fallback to web
                        if (Date.now() - startTime < 2000) {
                            window.open(webUrl, '_blank');
                            showToast(`正在打开 "${trackName}" - ${artistName}`);
                        }
                    }
                };

                tryNextScheme();

            } else {
                // 桌面设备：直接打开网页版
                window.open(webUrl, '_blank');
                showToast(`正在打开 "${trackName}" - ${artistName}`);
            }
        }

        // 显示歌曲选项菜单
        function toggleOptionsMenu(event, trackId, trackName, artistName, coverUrl, isYouTube) {
            event.stopPropagation();

            // 移除已存在的选项菜单
            const existingMenu = document.querySelector('.song-options-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            // 创建选项菜单
            const menu = document.createElement('div');
            menu.className = 'song-options-menu';
            menu.style.cssText = `
                position: absolute;
                top: 32px;
                right: 8px;
                background: var(--card);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                padding: 8px 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 100;
                min-width: 160px;
            `;

            // 根据来源构建菜单项
            if (isYouTube) {
                menu.innerHTML = `
                    <div class="option-item" onclick="playYouTubeSong('${trackId}', '${trackName}', '${artistName}', '${coverUrl}'); this.closest('.song-options-menu').remove();">
                        <span>🎵 在此播放</span>
                    </div>
                    <div class="option-item" onclick="openYouTubeApp('${trackId}', '${trackName}', '${artistName}'); this.closest('.song-options-menu').remove();">
                        <span>▶️ 打开 YouTube 应用</span>
                    </div>
                    <div class="option-item" onclick="openJumpLink('${escapeHtml(trackName)}', '${escapeHtml(artistName)}'); this.closest('.song-options-menu').remove();">
                        <span>🔗 跳转链接</span>
                    </div>
                `;
            } else {
                menu.innerHTML = `
                    <div class="option-item" onclick="playFullSong('${trackId}', '${trackName}', '${artistName}'); this.closest('.song-options-menu').remove();">
                        <span>🎵 在此播放</span>
                    </div>
                    <div class="option-item" onclick="openAppleMusic('${trackId}', '${trackName}', '${artistName}'); this.closest('.song-options-menu').remove();">
                        <span>📱 打开 Apple Music</span>
                    </div>
                `;
            }

            // 添加选项项的样式
            if (!document.querySelector('#song-options-menu-styles')) {
                const styles = document.createElement('style');
                styles.id = 'song-options-menu-styles';
                styles.textContent = `
                    .option-item {
                        padding: 10px 16px;
                        cursor: pointer;
                        transition: background 0.2s ease;
                        font-size: 14px;
                        color: var(--text);
                    }
                    .option-item:hover {
                        background: var(--glass-border);
                    }
                    .song-options-menu {
                        position: absolute;
                        top: 32px;
                        right: 8px;
                        background: var(--card);
                        border: 1px solid var(--glass-border);
                        border-radius: 12px;
                        padding: 8px 0;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        z-index: 100;
                        min-width: 160px;
                    }
                `;
                document.head.appendChild(styles);
            }

            // 添加菜单到页面
            document.body.appendChild(menu);

            // 定位菜单（相对于点击的目标元素）
            const targetRect = event.target.getBoundingClientRect();
            menu.style.top = `${targetRect.bottom + window.scrollY - 8}px`;
            menu.style.right = `${window.innerWidth - targetRect.right - 16}px`;

            // 点击其他地方关闭菜单
            setTimeout(() => {
                const closeMenu = (e) => {
                    if (!menu.contains(e.target) && e.target !== event.target) {
                        menu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                };
                document.addEventListener('click', closeMenu);
            }, 10);
        }

        // 显示降级选项
        function showFallbackOptions(trackName, artistName, webUrl) {
            // 创建一个更友好的提示框
            const modal = document.createElement('div');
            modal.className = 'apple-music-modal';
            modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-icon">🎵</div>
                <h3>打开 Apple Music</h3>
                <p>即将播放 "${trackName}"<br><span class="artist">${artistName}</span></p>
                <div class="modal-buttons">
                    <a href="${webUrl}" target="_blank" class="btn-primary" onclick="this.closest('.apple-music-modal').remove()">
                        在网页中打开
                    </a>
                    <button class="btn-secondary" onclick="this.closest('.apple-music-modal').remove()">
                        取消
                    </button>
                </div>
                <p class="hint">提示：安装 Apple Music 应用可获得更好体验</p>
            </div>
        </div>
    `;

            // 添加样式
            if (!document.querySelector('#apple-music-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'apple-music-modal-styles';
                styles.textContent = `
            .apple-music-modal .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease;
            }
            .apple-music-modal .modal-content {
                background: white;
                border-radius: 16px;
                padding: 24px;
                max-width: 320px;
                width: 90%;
                text-align: center;
                animation: slideUp 0.3s ease;
            }
            .apple-music-modal .modal-icon {
                font-size: 48px;
                margin-bottom: 12px;
            }
            .apple-music-modal h3 {
                margin: 0 0 8px;
                font-size: 18px;
                color: #1a1a1a;
            }
            .apple-music-modal p {
                margin: 0 0 16px;
                color: #666;
                font-size: 14px;
                line-height: 1.5;
            }
            .apple-music-modal .artist {
                color: #999;
            }
            .apple-music-modal .modal-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .apple-music-modal .btn-primary {
                background: linear-gradient(135deg, #fc3c44, #d93a41);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                text-decoration: none;
                display: block;
            }
            .apple-music-modal .btn-secondary {
                background: #f0f0f0;
                color: #333;
                border: none;
                padding: 12px 24px;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
            }
            .apple-music-modal .hint {
                font-size: 12px;
                color: #999;
                margin-top: 16px;
                margin-bottom: 0;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(modal);
        }

        // Initialize YouTube player manager
        const youtubePlayerManager = new YouTubePlayerManager();

        // Set up event listeners for YouTube player events
        document.addEventListener('youtubePlayerReady', (e) => {
            console.log('Event caught: Player is ready.');
            // Update UI and initialize PWA progress updates
            updatePlayState(true);
        });

        document.addEventListener('youtubePlayerPlaying', (e) => {
            console.log('Event caught: Player is playing.');
            // Update global state
            state.isYouTubePlaying = true;
            updatePlayState(true);
            // Start PWA progress updates
            startPWAProgressUpdates();
        });

        document.addEventListener('youtubePlayerPaused', (e) => {
            console.log('Event caught: Player is paused.');
            state.isYouTubePlaying = false;
            updatePlayState(false);
            stopPWAProgressUpdates();
        });

        document.addEventListener('youtubePlayerEnded', (e) => {
            console.log('Event caught: Player has ended.');
            state.isYouTubePlaying = false;
            updatePlayState(false);
            stopPWAProgressUpdates();
            setTimeout(playNextForYouTube, 300);
        });

        document.addEventListener('youtubePlayerError', (e) => {
            console.log('Event caught: Player error.', e.detail.error);
            // Handle error appropriately
            state.isYouTubePlaying = false;
            updatePlayState(false);
            stopPWAProgressUpdates();
            showToast('YouTube 播放出现错误，请稍后重试');
        });

        // Update the playYouTubeSong function to use YouTube player
        async function playYouTubeSong(videoId, title, artist, coverUrl = '') {
            if (!videoId) return;

            try {
                // Update state and UI first
                state.currentTrack = {
                    trackId: videoId,
                    trackName: title,
                    artistName: artist,
                    artworkUrl100: coverUrl || 'https://i.ytimg.com/img/no_thumbnail.jpg',
                    kind: 'youtube'
                };

                // Update player UI
                const cover = coverUrl || 'https://i.ytimg.com/img/no_thumbnail.jpg';
                $('player-cover').src = cover;

                const titleTextEl = $('player-title-text');
                const artistTextEl = $('player-artist-text');

                titleTextEl.textContent = title;
                artistTextEl.textContent = artist;

                // Add search functionality to title and artist
                titleTextEl.onclick = () => searchBySong(title);
                artistTextEl.onclick = () => searchByArtist(artist);
                titleTextEl.style.cursor = 'pointer';
                artistTextEl.style.cursor = 'pointer';

                // Update top info bar
                $('player-cover').src = cover;
                $('bg-album').style.backgroundImage = `url(${cover})`;
                $('bg-album').classList.add('active');

                // Setup Wikipedia button
                const wikiBtn = $('player-wiki-btn');
                const cleanArtistName = artist.split(/&|,|feat\.|ft\./i)[0].trim();
                wikiBtn.style.display = 'flex';
                wikiBtn.onclick = () => {
                    const wikiUrl = `https://zh.wikipedia.org/wiki/${encodeURIComponent(cleanArtistName)}`;
                    window.open(wikiUrl, '_blank');
                };
                wikiBtn.title = `查看 ${cleanArtistName} 的维基百科`;

                // Setup tag recommendation button
                const tagBtn = $('player-tag-btn');
                tagBtn.style.display = 'flex';
                tagBtn.onclick = () => {
                    showCurrentSongTags();
                };
                tagBtn.title = '查看歌曲标签推荐';

                // Check if text needs scrolling
                const checkScroll = (el) => {
                    el.classList.remove('scroll-text');
                    el.style.transform = 'none';

                    const containerWidth = el.parentElement.clientWidth;
                    const textWidth = el.scrollWidth;

                    if (textWidth > containerWidth) {
                        const distance = containerWidth - textWidth;
                        const duration = Math.abs(distance) / 30 + 2;

                        el.style.setProperty('--scroll-distance', `${distance}px`);
                        el.style.setProperty('--duration', `${duration}s`);
                        el.classList.add('scroll-text');
                    }
                };

                setTimeout(() => {
                    checkScroll(titleTextEl);
                    checkScroll(artistTextEl);
                }, 50);


                // Danmaku
                startDanmaku();

                // Preload lyrics
                $('lyrics-title').textContent = title;
                $('lyrics-artist').textContent = artist;
                setupWikipediaLink(artist);
                $('lyrics-cover').src = cover;
                $('lyrics-text').textContent = '加载中...';
                $('lyrics-wiki').classList.remove('show');

                fetchLyrics(artist, title);
                fetchArtistWiki(artist);

                // Add to history
                HistoryManager.add({
                    trackId: videoId,
                    trackName: title,
                    artistName: artist,
                    artworkUrl100: cover,
                    kind: 'youtube'
                });

                // Update media session (with updated metadata)
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: title,
                        artist: artist,
                        album: 'YouTube Music',
                        artwork: [
                            { src: cover, sizes: '96x96', type: 'image/jpeg' },
                            { src: cover, sizes: '128x128', type: 'image/jpeg' },
                            { src: cover, sizes: '192x192', type: 'image/jpeg' },
                            { src: cover, sizes: '256x256', type: 'image/jpeg' },
                            { src: cover, sizes: '512x512', type: 'image/jpeg' }
                        ]
                    });

                    navigator.mediaSession.setActionHandler('play', toggleYouTubePlay);
                    navigator.mediaSession.setActionHandler('pause', toggleYouTubePlay);
                    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
                    navigator.mediaSession.setActionHandler('nexttrack', () => playNext(false));
                }

                // Update favorite button state
                updateFavoriteButton();

                // Update recommendation tags
                updateRecommendationTags(state.currentTrack);

                // 检测是否为移动设备
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                // Use the YouTubePlayerManager to initialize and play the video
                try {
                    // Ensure the YouTube API is loaded
                    await youtubePlayerManager.loadAPI();

                    // Set up container if it doesn't exist
                    let playerContainer = document.getElementById('youtube-player-container');
                    if (!playerContainer) {
                        playerContainer = document.createElement('div');
                        playerContainer.id = 'youtube-player-container';
                        document.body.appendChild(playerContainer);
                    }
                    
                    // Always ensure correct styling to avoid display:none issues
                    playerContainer.style.position = 'absolute';
                    playerContainer.style.top = '-9999px';
                    playerContainer.style.left = '-9999px';
                    playerContainer.style.width = '1px';
                    playerContainer.style.height = '1px';
                    playerContainer.style.opacity = '0';
                    playerContainer.style.pointerEvents = 'none';
                    playerContainer.style.display = 'block'; // Explicitly override any display:none

                    // Configure player parameters
                    const playerOptions = {
                        videoId: videoId,
                        playerVars: {
                            'playsinline': 1,
                            'controls': 0,
                            'disablekb': 1,
                            'fs': 0,
                            'iv_load_policy': 3,
                            'modestbranding': 1,
                            'rel': 0,
                            'autoplay': 1,
                            'mute': 0,
                            'enablejsapi': 1,
                            'origin': window.location.origin
                        }
                    };

                    // Initialize the player with the manager
                    const player = await youtubePlayerManager.initPlayer('youtube-player-container', playerOptions);

                    // Update state to indicate that YouTube player is being used
                    youtubePlayerManager.setState({ shouldAutoplayYouTube: true });

                    if (isMobile) {
                        showToast('播放器已就绪...');
                    }
                } catch (error) {
                    console.error('Error initializing YouTube player with manager:', error);
                    showToast('YouTube 播放器初始化失败...');

                    // Fallback: use the audio element with YouTube video URL (may not work in all browsers due to CORS)
                    const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    audio.src = audioUrl;
                    audio.load();
                    audio.play()
                        .then(() => {
                            updatePlayState(true);
                            state.isYouTubePlaying = true;
                        })
                        .catch(err => {
                            console.error('Fallback also failed:', err);
                            showToast('即将准备就绪，别着急');
                            updatePlayState(false);
                            state.isYouTubePlaying = false;
                        });
                }
            } catch (error) {
                console.error('Error initializing YouTube player:', error);
                showToast('YouTube 播放器初始化失败...');

                // Fallback: use the audio element with YouTube video URL (may not work in all browsers)
                const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;
                audio.src = audioUrl;
                audio.load();
                audio.play()
                    .then(() => {
                        updatePlayState(true);
                        state.isYouTubePlaying = true;
                    })
                    .catch(err => {
                        console.error('Fallback also failed:', err);
                        showToast('即将准备就绪，别着急');
                        updatePlayState(false);
                        state.isYouTubePlaying = false;
                    });
            }
        }

        // Toggle play/pause for YouTube player
        function toggleYouTubePlay() {
            if (youtubePlayerManager && youtubePlayerManager.getPlayer()) {
                if (youtubePlayerManager.isPlaying()) {
                    // 暂停播放
                    youtubePlayerManager.pauseVideo();
                    // State will be updated via event listener
                } else {
                    // 开始播放 - 确保在用户交互上下文中
                    // 检测是否为移动设备
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                    if (isMobile) {
                        showToast('正在准备播放，请稍候...');
                    }

                    // 立即尝试播放（在用户交互的上下文中）
                    try {
                        // 确保音频上下文就绪
                        requestAudioPlayback().then(() => {
                            // 立即播放视频
                            youtubePlayerManager.playVideo();
                            // State will be updated via event listener
                            if (isMobile) {
                                showToast('开始播放');
                            }
                        }).catch(err => {
                            console.warn('Audio context playback request failed:', err);
                            // 即使音频上下文有问题，仍然尝试播放视频
                            youtubePlayerManager.playVideo();
                            // State will be updated via event listener
                            if (isMobile) {
                                showToast('开始播放');
                            }
                        });
                    } catch (error) {
                        console.error('Failed to play YouTube video:', error);

                        // 检测是否为移动设备并提供更具体的提示
                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                        if (isMobile) {
                            // 对于移动设备，提供更多的等待时间
                            setTimeout(() => {
                                try {
                                    youtubePlayerManager.playVideo();
                                    // State will be updated via event listener
                                    showToast('开始播放');
                                } catch (retryError) {
                                    console.error('重试播放失败:', retryError);
                                    // Show more helpful message about browser autoplay restrictions
                                    showToast('首次播放可能需要用户交互，请点击播放按钮重试');
                                    updatePlayState(false);
                                }
                            }, 500); // 减少延迟时间
                        } else {
                            // Show more helpful message about browser autoplay restrictions
                            showToast('首次播放可能需要用户交互，请点击播放按钮重试');
                            updatePlayState(false);
                        }
                    }
                }
            }
        }

        // 打开跳转链接，使用标题和作者作为查询参数
        function openJumpLink(trackName, artistName) {
            // 组合标题和作者，用空格分隔
            const query = `${trackName} ${artistName}`;
            // 创建目标URL，使用提供的格式
            const jumpUrl = `https://wealth.want.biz/pages/youtubeMusic.html?query=${encodeURIComponent(query)}`;

            // 检查是否已存在半屏模态框，如果存在则移除
            const existingModal = document.querySelector('.half-screen-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // 创建半屏模态框
            const modal = document.createElement('div');
            modal.className = 'half-screen-modal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="closeHalfScreenModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-drag-bar"></div>
                        <div class="modal-actions">
                            <button class="modal-close-btn" onclick="closeHalfScreenModal()">✕</button>
                        </div>
                    </div>
                    <iframe src="${jumpUrl}" class="modal-iframe" allow="autoplay; fullscreen"></iframe>
                </div>
            `;

            // 添加模态框样式（如果尚未添加）
            if (!document.querySelector('#half-screen-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'half-screen-modal-styles';
                styles.textContent = `
                    .half-screen-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10000;
                        display: flex;
                        flex-direction: column;
                    }

                    .modal-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.6);
                        z-index: 1;
                        opacity: 0;
                        animation: fadeIn 0.3s ease forwards;
                    }

                    .modal-content {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 50vh;
                        background: var(--bg);
                        border-top-left-radius: 20px;
                        border-top-right-radius: 20px;
                        z-index: 2;
                        transform: translateY(100%);
                        animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                    }

                    .modal-header {
                        padding: 12px 16px 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: relative;
                        z-index: 3;
                        background: var(--bg);
                        border-bottom: 1px solid var(--glass-border);
                    }

                    .modal-drag-bar {
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40px;
                        height: 4px;
                        background: var(--text-secondary);
                        border-radius: 2px;
                    }

                    .modal-actions {
                        display: flex;
                        gap: 8px;
                        z-index: 4;
                    }

                    .modal-close-btn {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: var(--glass);
                        border: 1px solid var(--glass-border);
                        color: var(--text);
                        font-size: 18px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    }

                    .modal-close-btn:hover {
                        background: var(--glass-border);
                        transform: scale(1.1);
                    }

                    .modal-iframe {
                        flex: 1;
                        border: none;
                        width: 100%;
                        height: calc(100% - 60px); /* Account for header height */
                    }

                    @keyframes slideUp {
                        from {
                            transform: translateY(100%);
                        }
                        to {
                            transform: translateY(0);
                        }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }

                    /* 响应式适配 */
                    @media (min-width: 768px) {
                        .modal-content {
                            height: 60vh;
                            max-height: 700px;
                        }
                    }
                `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(modal);
        }

        // 关闭半屏模态框
        function closeHalfScreenModal() {
            const modal = document.querySelector('.half-screen-modal');
            if (modal) {
                // 添加关闭动画
                const content = modal.querySelector('.modal-content');
                const overlay = modal.querySelector('.modal-overlay');

                content.style.animation = 'slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                content.style.animationDirection = 'reverse';

                overlay.style.animation = 'fadeIn 0.3s ease forwards';
                overlay.style.animationDirection = 'reverse';

                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        }

        // Audio context for maintaining background audio across browsers
        let backgroundAudioContext = null;

        // Initialize audio context for background playback with better approach
        function initializeBackgroundAudio() {
            if (backgroundAudioContext) return;

            if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
                backgroundAudioContext = new (AudioContext || webkitAudioContext)();

                // Create a very low-volume oscillator to keep context active without audible output
                const oscillator = backgroundAudioContext.createOscillator();
                const gainNode = backgroundAudioContext.createGain();

                // Set gain to extremely low value (nearly silent but keeps context active)
                gainNode.gain.value = 0.00001;

                oscillator.connect(gainNode);
                gainNode.connect(backgroundAudioContext.destination);
                oscillator.start(0);

                // Stop after a brief moment to avoid continuous processing
                if (backgroundAudioContext.currentTime) {
                    oscillator.stop(backgroundAudioContext.currentTime + 0.01);
                }

                // Resume if suspended
                if (backgroundAudioContext.state === 'suspended') {
                    backgroundAudioContext.resume();
                }
            }
        }

        // More aggressive audio context initialization on user interaction
        function aggressiveAudioContextInit() {
            if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
                if (!backgroundAudioContext) {
                    backgroundAudioContext = new (AudioContext || webkitAudioContext)();
                }

                // Try to resume if suspended, regardless of whether we've created it before
                if (backgroundAudioContext.state === 'suspended') {
                    backgroundAudioContext.resume().catch(err => {
                        console.warn('Audio context resume failed:', err);
                    });
                }

                // Create and start a very brief audio source to fully activate context
                try {
                    const source = backgroundAudioContext.createBufferSource();
                    const silentBuffer = backgroundAudioContext.createBuffer(1, 1, 22050);
                    source.buffer = silentBuffer;
                    source.connect(backgroundAudioContext.destination);
                    source.start(0);
                    if (backgroundAudioContext.currentTime) {
                        source.stop(backgroundAudioContext.currentTime + 0.001);
                    }
                } catch (e) {
                    console.warn('Could not create silent buffer:', e);
                }
            }
        }

        // Request audio playback permission on mobile devices
        function requestAudioPlayback() {
            return new Promise((resolve, reject) => {
                // Initialize background audio context
                initializeBackgroundAudio();

                // Try to resume in all possible ways
                const resumePromises = [];

                if (backgroundAudioContext && backgroundAudioContext.state === 'suspended') {
                    resumePromises.push(backgroundAudioContext.resume());
                }

                if (resumePromises.length > 0) {
                    Promise.all(resumePromises)
                        .then(() => resolve())
                        .catch(() => {
                            // Even if resume fails, we proceed - the YouTube player might still work
                            // due to being called from user interaction
                            resolve();
                        });
                } else {
                    resolve();
                }
            });
        }

        // Initialize audio context immediately on any user interaction
        function initAudioOnInteraction() {
            // Initialize audio context aggressively on first user interaction
            aggressiveAudioContextInit();

            // Remove the event listener after first interaction to avoid repeated initialization
            ['click', 'touchstart', 'keydown', 'mousedown'].forEach(eventType => {
                document.removeEventListener(eventType, initAudioOnInteraction, { passive: true });
            });
        }

        // Add event listeners for immediate audio context initialization
        ['click', 'touchstart', 'keydown', 'mousedown'].forEach(eventType => {
            document.addEventListener(eventType, initAudioOnInteraction, { passive: true });
        });

        // Handle visibility changes for mobile background audio
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                // When returning to foreground, ensure audio is properly resumed
                if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                    // Small delay to ensure YouTube player is ready
                    setTimeout(() => {
                        if (youtubePlayerManager.getPlayerState() !== YT.PlayerState.PLAYING) {
                            toggleYouTubePlay();
                        } else {
                            // If already playing, make sure PWA updates are running
                            startPWAProgressUpdates();
                        }
                    }, 100);
                }
            } else {
                // When going to background, ensure PWA updates continue if needed
                if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                    // PWA updates should continue in background, so no need to stop them here
                }
            }
        });

        // Additional mobile-specific handling
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', toggleYouTubePlay);
            navigator.mediaSession.setActionHandler('pause', toggleYouTubePlay);

            // Handle seek actions to maintain audio session
            try {
                navigator.mediaSession.setActionHandler('seekbackward', () => {
                    if (youtubePlayerManager.getPlayer()) {
                        const currentTime = youtubePlayerManager.getCurrentTime();
                        youtubePlayerManager.seekTo(Math.max(0, currentTime - 10), true);
                    }
                });

                navigator.mediaSession.setActionHandler('seekforward', () => {
                    if (youtubePlayerManager.getPlayer()) {
                        const currentTime = youtubePlayerManager.getCurrentTime();
                        const duration = youtubePlayerManager.getDuration();
                        youtubePlayerManager.seekTo(Math.min(duration, currentTime + 10), true);
                    }
                });
            } catch (error) {
                console.log('Seek actions not supported:', error);
            }
        }

        // Additional event listeners to handle app lifecycle and backgrounding
        window.addEventListener('pagehide', function () {
            // Try to maintain audio when page is hidden (e.g., switching apps)
            if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                // Store the current time to resume from when returning
                state.lastPosition = youtubePlayerManager.getCurrentTime();
            }
        });

        // Handle page visibility changes more comprehensively
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                // When returning to foreground, resume audio if needed
                if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                    // Small delay to ensure YouTube player is ready after page becomes visible
                    setTimeout(() => {
                        const playerState = youtubePlayerManager.getPlayerState();
                        if (playerState !== YT.PlayerState.PLAYING) {
                            // Try to resume playback
                            youtubePlayerManager.playVideo();
                            startPWAProgressUpdates(); // Ensure PWA updates start when resuming
                        } else {
                            // If already playing, make sure PWA updates are running
                            startPWAProgressUpdates();
                        }
                    }, 500);
                }
            } else {
                // When going to background, ensure PWA updates continue if playing
                if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                    // Ensure PWA updates are running when going to background
                    startPWAProgressUpdates();
                }
            }
        });

        // Handle focus/blur events which can affect audio on mobile
        window.addEventListener('focus', function () {
            // On iOS Safari especially, audio may need to be resumed when window regains focus
            if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying() && youtubePlayerManager.getPlayerState() !== YT.PlayerState.PLAYING) {
                setTimeout(() => {
                    youtubePlayerManager.playVideo();
                }, 100);
            }
        });

        window.addEventListener('blur', function () {
            // Store position when leaving the page
            if (youtubePlayerManager.getPlayer() && youtubePlayerManager.isPlaying()) {
                state.lastPosition = youtubePlayerManager.getCurrentTime();
            }
        });

        // Toast 提示
        function showToast(message) {
            const toast = document.createElement('div');
            toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, 500);
        }

        // 歌词
        async function fetchLyrics(artist, title) {
            // 生成缓存键
            const cacheKey = `lyrics_${encodeURIComponent(artist)}_${encodeURIComponent(title)}`;
            const cachedLyrics = CacheManager.get(cacheKey);

            if (cachedLyrics) {
                console.log('Using cached lyrics for:', artist, title);
                $('lyrics-text').textContent = cachedLyrics;
                return;
            }

            try {
                const cleanTitle = title.split('(')[0].split('-')[0].trim();
                const cleanArtist = artist.split('&')[0].split(',')[0].trim();

                // 尝试使用 YouTube API 获取歌词（如果当前播放的是 YouTube 歌曲）
                if (state.currentTrack && state.currentTrack.trackId &&
                    (state.currentTrack.kind === 'youtube' || state.currentTrack.previewUrl?.includes('youtube.com'))) {
                    try {
                        const youTubeLyricsRes = await fetch(`https://api.yuangs.cc/youtubeapi/lyrics/${state.currentTrack.trackId}`);
                        if (youTubeLyricsRes.ok) {
                            const youTubeLyricsData = await youTubeLyricsRes.json();

                            if (youTubeLyricsData.success && youTubeLyricsData.data && youTubeLyricsData.data.lyrics) {
                                $('lyrics-text').textContent = youTubeLyricsData.data.lyrics;
                                // 缓存歌词（有效期24小时）
                                CacheManager.set(cacheKey, youTubeLyricsData.data.lyrics, 24);
                                return;
                            }
                        } else {
                            console.error('YouTube lyrics API 请求失败，状态码:', youTubeLyricsRes.status);
                        }
                    } catch (e) {
                        console.error('YouTube lyrics API failed:', e);
                        // 如果 YouTube API 失败，继续尝试其他 API
                    }
                }

                // 尝试使用原版 API
                const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.lyrics) {
                        $('lyrics-text').textContent = data.lyrics;
                        // 缓存歌词（有效期24小时）
                        CacheManager.set(cacheKey, data.lyrics, 24);
                        return;
                    }
                }
                showCatFallback();
            } catch {
                showCatFallback();
            }
        }

        async function showCatFallback() {
            try {
                const res = await fetch('https://api.thecatapi.com/v1/images/search');
                const data = await res.json();
                if (data?.[0]?.url) {
                    $('lyrics-text').innerHTML = `
                        <div style="margin-bottom: 20px; color: var(--text-secondary);">暂无歌词，送你一只猫 🐱</div>
                        <img src="${data[0].url}" style="max-width: 280px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                    `;
                    return;
                }
            } catch { }
            $('lyrics-text').textContent = '暂无歌词';
        }

        // 设置维基百科链接
        function setupWikipediaLink(artistName) {
            const cleanName = artistName.split(/&|,|feat\.|ft\./i)[0].trim();
            const encodedName = encodeURIComponent(cleanName);

            // 存储链接到艺术家元素的数据属性 as fallback
            $('lyrics-artist').dataset.wikiUrl = `https://zh.wikipedia.org/wiki/${encodedName}`;

            // 验证链接是否存在（异步检查）
            verifyWikipediaPageExists(cleanName);
        }

        // 验证维基百科页面是否存在
        async function verifyWikipediaPageExists(artistName) {
            const cleanName = artistName.split(/&|,|feat\.|ft\./i)[0].trim();
            const encodedName = encodeURIComponent(cleanName);

            // 首先尝试中文维基百科
            try {
                const res = await fetch(`https://zh.wikipedia.org/api/rest_v1/page/summary/${encodedName}`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.title) {
                        // 中文维基百科存在，使用中文链接
                        $('lyrics-artist').dataset.wikiUrl = `https://zh.wikipedia.org/wiki/${encodedName}`;
                        return;
                    }
                }
            } catch { }

            // 如果中文不存在，尝试英文维基百科
            try {
                const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodedName}`);

                if (res.ok) {
                    const data = await res.json();
                    if (data.title) {
                        // 英文维基百科存在，使用英文链接
                        $('lyrics-artist').dataset.wikiUrl = `https://en.wikipedia.org/wiki/${encodedName}`;
                        return;
                    }
                }
            } catch { }

            // 如果都不存在，设置为搜索页面
            $('lyrics-artist').dataset.wikiUrl = `https://zh.wikipedia.org/wiki/Special:Search?search=${encodedName}`;
        }

        // 歌手百科
        async function fetchArtistWiki(artistName) {
            const cleanName = artistName.split(/&|,|feat\.|ft\./i)[0].trim();
            const cacheKey = `wiki_${encodeURIComponent(cleanName)}`;
            const cachedWiki = CacheManager.get(cacheKey);

            if (cachedWiki) {
                console.log('Using cached wiki for:', cleanName);
                $('wiki-title').textContent = `关于 ${cachedWiki.title}`;
                $('wiki-text').textContent = cachedWiki.extract;
                $('lyrics-wiki').classList.add('show');
                return;
            }

            try {
                let res = await fetch(`https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`);
                if (!res.ok) {
                    res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`);
                }

                if (res.ok) {
                    const data = await res.json();
                    if (data.extract) {
                        $('wiki-title').textContent = `关于 ${data.title}`;
                        $('wiki-text').textContent = data.extract;
                        $('lyrics-wiki').classList.add('show');
                        // 缓存维基百科数据（有效期12小时）
                        CacheManager.set(cacheKey, {
                            title: data.title,
                            extract: data.extract
                        }, 12);
                    } else {
                        // If no wiki summary found, hide the wiki section
                        $('lyrics-wiki').classList.remove('show');
                    }
                }
            } catch { }
        }

        // 歌词页面
        function openLyrics() {
            if (!state.currentTrack) return;
            $('lyrics-modal').classList.add('show');
        }

        function closeLyrics() {
            $('lyrics-modal').classList.remove('show');
        }

        // 天气搜索 - 随机关键词增强版
        async function searchByWeather() {
            try {
                // 1. 获取地理位置
                const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
                const geo = await geoRes.json();

                // 2. 获取天气数据
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current_weather=true`);
                const weatherData = await weatherRes.json();
                const code = weatherData.current_weather.weathercode;

                // 3. 定义变量
                let keywordOptions = []; // 候选关键词列表
                let weatherLabel = '未知'; // 天气中文名

                // 4. 根据天气代码分配关键词库，并与标签系统关联
                if (code <= 3) {
                    // 晴朗 (0-3)
                    weatherLabel = '晴朗';
                    // 从情绪标签中的积极情绪中选择
                    keywordOptions = [...musicTags.attributes.moods.positive, ...musicTags.scenarios.activity_based.exercise, ...musicTags.scenarios.activity_based.social];
                }
                else if (code >= 45 && code <= 48) {
                    // 雾天 (45, 48)
                    weatherLabel = '雾天';
                    // 从氛围标签中选择神秘、梦幻的标签
                    keywordOptions = [...musicTags.attributes.moods.intense, ...musicTags.attributes.moods.melancholy, ...musicTags.attributes.styles.aesthetic];
                }
                else if (code >= 51 && code <= 67) {
                    // 下雨 (51-67)
                    weatherLabel = '下雨';
                    // 选择安静、舒适的音乐类型
                    keywordOptions = [...musicTags.attributes.moods.melancholy, ...musicTags.scenarios.activity_based.relaxation, ...musicTags.genres.main.traditional];
                }
                else if (code >= 71 && code <= 86) {
                    // 下雪 (71-86)
                    weatherLabel = '下雪';
                    // 选择温暖、节日的音乐类型
                    keywordOptions = [...musicTags.scenarios.special_occasions, ...musicTags.genres.main.traditional, ...musicTags.nature_abstract.nature.weather];
                }
                else if (code >= 95) {
                    // 雷暴 (95+)
                    weatherLabel = '雷暴';
                    // 选择强烈、有冲击力的音乐类型
                    keywordOptions = [...musicTags.attributes.moods.intense, ...musicTags.genres.main.rock, ...musicTags.genres.main.electronic];
                }
                else {
                    // 多云/阴天 (其他情况)
                    weatherLabel = '多云';
                    // 选择温和、日常的音乐类型
                    keywordOptions = [...musicTags.attributes.moods.mellow, ...musicTags.scenarios.time_based.daily_routine, ...musicTags.genres.main.pop];
                }

                // 5. 核心：从数组中随机选择一个关键词
                const randomKeyword = keywordOptions[Math.floor(Math.random() * keywordOptions.length)];
                if (!randomKeyword) {
                    // 如果标签库中没有对应类别，使用默认天气相关的关键词
                    const defaultKeywords = [
                        'Sunny Day', 'Rainy Day', 'Snow Winter', 'Cloudy Sky',
                        'Foggy Mood', 'Thunder Storm', 'Summer Vibes', 'Winter Mood'
                    ];
                    const randomKeyword = defaultKeywords[Math.floor(Math.random() * defaultKeywords.length)];
                    $('search-input').value = randomKeyword;
                } else {
                    $('search-input').value = randomKeyword;
                }

                // 6. 执行搜索与提示
                searchMusic();
                alert(`📍 ${geo.city || '未知'}\n🌤️ ${weatherLabel}\n🎲 智能推荐: ${$('search-input').value}`);

            } catch (e) {
                console.error(e);
                alert('获取天气失败，请检查网络');
            }
        }

        // 弹幕系统
        function startDanmaku() {
            $('danmaku').classList.add('show');
            $('danmaku').innerHTML = '';
            // Clear the displayed danmaku set when starting
            state.displayedDanmaku.clear();
            // Clear recent danmaku indices to allow more variety
            if (state.recentDanmakuIndices) {
                state.recentDanmakuIndices = [];
            }
            // Reset tracks
            state.tracks = [false, false, false, false, false];

            if (state.danmakuInterval) clearInterval(state.danmakuInterval);

            // 初始化弹幕数据
            DanmakuManager.fetchAndFill().then(() => {
                // 立即生成几条弹幕以增加多样性
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        spawnDanmaku();
                    }, i * 800); // 错开时间显示，避免同时出现
                }

                // 设置定时器持续生成弹幕
                state.danmakuInterval = setInterval(spawnDanmaku, 2000); // 减少间隔以增加频率
                // 开始定期刷新弹幕数据
                DanmakuManager.startRefresh();
            });
        }

        async function spawnDanmaku() {
            // 从全局弹幕存储中获取随机弹幕
            const danmaku = DanmakuManager.getRandom();

            if (danmaku) {
                renderDanmaku(danmaku);
            } else {
                // 如果没有可用弹幕，获取新数据
                await DanmakuManager.fillNewRecords(5);
                const newDanmaku = DanmakuManager.getRandom();
                if (newDanmaku) {
                    renderDanmaku(newDanmaku);
                }
            }
        }

        function renderDanmaku(data) {
            // Create a unique content identifier to prevent duplicates
            const content = `${data.name}:${data.text}`;
            const fullContent = `${data.name}:${data.text}:${Date.now()}`; // Add timestamp to make it always unique for display

            // Check if this content is already displayed in the current view
            // Only check for recent duplicates (last 20 items) to avoid the issue of no fresh content
            if (state.displayedDanmaku.size > 20) {
                // Clear the set if it gets too large to avoid memory issues and allow refresh
                const recent = Array.from(state.displayedDanmaku).slice(-10); // Keep last 10 items as recent
                state.displayedDanmaku.clear();
                recent.forEach(item => state.displayedDanmaku.add(item));
            }

            if (state.displayedDanmaku.has(content)) {
                // If this exact content is already displayed recently, try to get another one
                setTimeout(async () => {
                    const alternativeDanmaku = DanmakuManager.getRandom();
                    if (alternativeDanmaku) {
                        renderDanmaku(alternativeDanmaku);
                    } else {
                        // If no alternative, try to fill with new records
                        await DanmakuManager.fillNewRecords(3);
                        const newDanmaku = DanmakuManager.getRandom();
                        if (newDanmaku) {
                            renderDanmaku(newDanmaku);
                        }
                    }
                }, 100); // Small delay to avoid blocking
                return;
            }

            let track = state.tracks.findIndex(t => !t);
            if (track === -1) {
                // If all tracks are busy, try to find the one that will finish earliest or just pick randomly
                track = Math.floor(Math.random() * 5);
            }

            state.tracks[track] = true;

            const item = document.createElement('div');
            item.className = 'danmaku-item';
            item.style.top = (track * 40 + 10) + 'px';
            item.style.animationDuration = (12 + Math.random() * 5) + 's';

            item.innerHTML = `
                <img class="danmaku-avatar" src="${data.avatar}" alt="">
                <span class="danmaku-name">${escapeHtml(data.name)}:</span>
                <span class="danmaku-text">${escapeHtml(data.text)}</span>
            `;

            // Add content to the displayed set
            state.displayedDanmaku.add(content);

            item.onanimationend = () => {
                // Remove content from the displayed set when animation ends
                state.displayedDanmaku.delete(content);
                item.remove();
                state.tracks[track] = false;
            };

            // Also handle manual removal if element is removed for other reasons
            const originalRemove = item.remove;
            item.remove = function () {
                state.displayedDanmaku.delete(content);
                state.tracks[track] = false;
                originalRemove.call(this);
            };

            $('danmaku').appendChild(item);
        }

        // 弹幕管理器
        const DanmakuManager = {
            STORAGE_KEY: 'danmaku_records',
            MAX_RECORDS: 100,
            EXPIRY_TIME: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
            REFRESH_INTERVAL: null, // 定时刷新定时器

            // 获取所有弹幕记录
            getAll: () => {
                try {
                    const data = localStorage.getItem(DanmakuManager.STORAGE_KEY);
                    if (!data) return [];

                    const records = JSON.parse(data);
                    const now = Date.now();

                    // 过滤掉过期的记录
                    const validRecords = records.filter(record => now - record.timestamp < DanmakuManager.EXPIRY_TIME);

                    // 如果有过期记录，更新存储
                    if (records.length !== validRecords.length) {
                        localStorage.setItem(DanmakuManager.STORAGE_KEY, JSON.stringify(validRecords));
                    }

                    return validRecords;
                } catch (e) {
                    console.error('Failed to get danmaku records:', e);
                    return [];
                }
            },

            // 保存弹幕记录（最多100条，超出则移除最旧的）
            save: (records) => {
                try {
                    // 确保不超过最大数量
                    if (records.length > DanmakuManager.MAX_RECORDS) {
                        records = records.slice(-DanmakuManager.MAX_RECORDS);
                    }

                    localStorage.setItem(DanmakuManager.STORAGE_KEY, JSON.stringify(records));
                } catch (e) {
                    console.error('Failed to save danmaku records:', e);
                }
            },

            // 添加新弹幕记录
            add: (danmaku) => {
                let records = DanmakuManager.getAll();
                records.push({
                    ...danmaku,
                    timestamp: Date.now()
                });

                // 保存时自动清理过期记录并限制数量
                DanmakuManager.save(records);
            },

            // 随机获取一条弹幕记录，避免短时间内重复
            getRandom: () => {
                const records = DanmakuManager.getAll();
                if (records.length === 0) return null;

                // 如果记录数量大于5，尝试避免返回最近返回过的弹幕
                if (records.length > 5) {
                    // 保存最近返回的弹幕索引，避免重复
                    if (!state.recentDanmakuIndices) {
                        state.recentDanmakuIndices = [];
                    }

                    // 清除过期的索引记录（超过10个就保留最新的5个）
                    if (state.recentDanmakuIndices.length > 10) {
                        state.recentDanmakuIndices = state.recentDanmakuIndices.slice(-5);
                    }

                    // 尝试找到一个不在最近列表中的弹幕
                    let validIndices = [];
                    for (let i = 0; i < records.length; i++) {
                        if (!state.recentDanmakuIndices.includes(i)) {
                            validIndices.push(i);
                        }
                    }

                    // 如果所有弹幕都在最近列表中，或者有效选项太少，则使用所有记录
                    if (validIndices.length < 3) {
                        validIndices = Array.from({ length: records.length }, (_, i) => i);
                    }

                    const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
                    state.recentDanmakuIndices.push(randomIndex);

                    return records[randomIndex];
                }

                // 如果记录数量少于等于5，直接随机返回
                return records[Math.floor(Math.random() * records.length)];
            },

            // 获取并填充新弹幕数据（如果记录为空或过期）
            fetchAndFill: async () => {
                const records = DanmakuManager.getAll();
                const now = Date.now();

                // 如果记录少于15条，请求新数据（增加数量以确保有足够的弹幕）
                if (records.length < 15) {
                    await DanmakuManager.fillNewRecords(30); // 增加填充数量
                } else {
                    // 检查是否需要更新
                    const oldestRecord = records.reduce((oldest, record) => {
                        return record.timestamp < oldest.timestamp ? record : oldest;
                    }, records[0]);

                    if (now - oldestRecord.timestamp > DanmakuManager.EXPIRY_TIME * 0.5) { // 降低更新阈值到50%有效期
                        await DanmakuManager.fillNewRecords(15); // 增加每次填充的数量
                    }
                }
            },

            // 开始定期刷新弹幕数据
            startRefresh: () => {
                // 停止之前的刷新定时器
                if (DanmakuManager.REFRESH_INTERVAL) {
                    clearInterval(DanmakuManager.REFRESH_INTERVAL);
                }

                // 每10分钟检查一次是否需要更新弹幕数据
                DanmakuManager.REFRESH_INTERVAL = setInterval(async () => {
                    await DanmakuManager.fetchAndFill();
                }, 10 * 60 * 1000); // 10分钟
            },

            // 停止定期刷新弹幕数据
            stopRefresh: () => {
                if (DanmakuManager.REFRESH_INTERVAL) {
                    clearInterval(DanmakuManager.REFRESH_INTERVAL);
                    DanmakuManager.REFRESH_INTERVAL = null;
                }
            },

            // 填充新的弹幕记录
            fillNewRecords: async (count) => {
                try {
                    for (let i = 0; i < count; i++) {
                        // 随机生成弹幕数据（如果API调用失败，使用默认值）
                        const useKanye = Math.random() > 0.5;

                        const [userRes, textRes] = await Promise.all([
                            fetch('https://randomuser.me/api/?inc=name,picture'),
                            useKanye
                                ? fetch('https://api.kanye.rest/')
                                : fetch('https://v1.hitokoto.cn/?c=a&c=b')
                        ]);

                        const user = await userRes.json();
                        const text = await textRes.json();

                        const danmaku = {
                            name: user.results[0].name.first,
                            avatar: user.results[0].picture.thumbnail,
                            text: text.quote || text.hitokoto
                        };

                        DanmakuManager.add(danmaku);
                    }
                } catch (err) {
                    console.error('Failed to fetch new danmaku records:', err);
                    // 如果API调用失败，生成一些默认弹幕
                    for (let i = 0; i < count; i++) {
                        const danmaku = {
                            name: '用户' + (Math.floor(Math.random() * 10000)),
                            avatar: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23ccc"/%3E%3C/svg%3E',
                            text: '这是一条随机弹幕'
                        };
                        DanmakuManager.add(danmaku);
                    }
                }
            }
        };

        // PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW registered:', reg.scope))
                .catch(err => console.log('SW failed:', err));
        }

        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            deferredPrompt = e;
            showInstallPrompt();
        });

        function showInstallPrompt() {
            if (document.querySelector('.install-prompt')) return;

            const div = document.createElement('div');
            div.className = 'install-prompt';
            div.innerHTML = `
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <div class="install-title">添加到主屏幕</div>
                    <div class="install-desc">获得更好的全屏体验</div>
                </div>
                <button class="install-btn" onclick="installApp()">安装</button>
                <button class="install-close" onclick="this.parentElement.remove()">×</button>
            `;
            document.body.appendChild(div);

            setTimeout(() => div.remove(), 10000);
        }

        // ========== 收藏和历史功能 ==========

        // 切换收藏状态
        function toggleFavorite() {
            if (!state.currentTrack) return;

            const trackId = state.currentTrack.trackId;
            const btn = $('favorite-btn');

            if (FavoritesManager.isFavorited(trackId)) {
                FavoritesManager.remove(trackId);
                btn.textContent = '🤍';
                btn.classList.remove('favorited');
                showToast('已取消收藏');
            } else {
                FavoritesManager.add(state.currentTrack);
                btn.textContent = '❤️';
                btn.classList.add('favorited');
                showToast('已添加到收藏');
            }
        }

        // 更新收藏按钮状态
        function updateFavoriteButton() {
            if (!state.currentTrack) return;

            const btn = $('favorite-btn');
            const isFavorited = FavoritesManager.isFavorited(state.currentTrack.trackId);

            btn.textContent = isFavorited ? '❤️' : '🤍';
            if (isFavorited) {
                btn.classList.add('favorited');
            } else {
                btn.classList.remove('favorited');
            }
        }

        // 打开历史记录
        function openHistory() {
            $('history-modal').classList.add('show');
            renderHistory();
        }

        // 关闭历史记录
        function closeHistory() {
            $('history-modal').classList.remove('show');
        }

        // 渲染历史记录
        function renderHistory() {
            const history = HistoryManager.getAll();
            const container = $('history-content');

            if (history.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📖</div>
                        <div class="empty-title">暂无播放历史</div>
                        <div class="empty-desc">开始播放音乐后会自动记录</div>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="collection-grid">
                    ${history.map(song => `
                        <div class="collection-item" onclick="playHistoryItem('${song.trackId}')">
                            <img class="collection-item-cover" src="${(song.artworkUrl100 || song.artworkUrl || '').replace('100x100bb', '300x300bb')}" alt="">
                            <div class="collection-item-title">${escapeHtml(song.trackName)}</div>
                            <div class="collection-item-artist">${escapeHtml(song.artistName)}</div>
                            <div class="collection-item-time">${formatDate(song.playedAt)}</div>
                            <button class="collection-item-remove" onclick="event.stopPropagation(); removeHistory('${song.trackId}')" title="删除">×</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 播放历史中的歌曲
        function playHistoryItem(trackId) {
            const history = HistoryManager.getAll();
            const song = history.find(s => s.trackId == trackId);
            if (song) {
                // 将歌曲添加到播放列表并播放
                state.playlist = [song];
                state.currentIndex = 0;
                playSong(0);
                closeHistory();
            }
        }

        // 删除历史记录
        function removeHistory(trackId) {
            if (confirm('确定要删除这条历史记录吗？')) {
                HistoryManager.remove(trackId);
                renderHistory();
                showToast('已删除');
            }
        }

        // 清空历史
        function clearHistory() {
            if (confirm('确定要清空所有播放历史吗？此操作不可恢复！')) {
                HistoryManager.clear();
                renderHistory();
                showToast('历史记录已清空');
            }
        }

        // 导出历史
        function exportHistory() {
            const history = HistoryManager.getAll();
            if (history.length === 0) {
                alert('暂无历史记录可导出');
                return;
            }
            HistoryManager.export();
            showToast('历史记录已导出');
        }

        // 导入历史
        function importHistory() {
            const input = $('import-file-input');
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const count = await HistoryManager.import(file);
                        renderHistory();
                        showToast(`成功导入 ${count} 条历史记录`);
                    } catch (err) {
                        alert('导入失败：' + err.message);
                    }
                }
                input.value = '';
            };
            input.click();
        }

        // 打开收藏列表
        function openFavorites() {
            $('favorites-modal').classList.add('show');
            renderFavorites();
        }

        // 关闭收藏列表
        function closeFavorites() {
            $('favorites-modal').classList.remove('show');
        }

        // 渲染收藏列表
        function renderFavorites() {
            const favorites = FavoritesManager.getAll();
            const container = $('favorites-content');

            if (favorites.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">❤️</div>
                        <div class="empty-title">暂无收藏</div>
                        <div class="empty-desc">点击播放器中的爱心按钮收藏歌曲</div>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="collection-grid">
                    ${favorites.map(song => `
                        <div class="collection-item" onclick="playFavoriteItem('${song.trackId}')">
                            <img class="collection-item-cover" src="${(song.artworkUrl100 || song.artworkUrl || '').replace('100x100bb', '300x300bb')}" alt="">
                            <div class="collection-item-title">${escapeHtml(song.trackName)}</div>
                            <div class="collection-item-artist">${escapeHtml(song.artistName)}</div>
                            <div class="collection-item-time">${formatDate(song.favoritedAt)}</div>
                            <button class="collection-item-remove" onclick="event.stopPropagation(); removeFavorite('${song.trackId}')" title="取消收藏">×</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 播放收藏中的歌曲
        function playFavoriteItem(trackId) {
            const favorites = FavoritesManager.getAll();
            const song = favorites.find(s => s.trackId == trackId);
            if (song) {
                // 将歌曲添加到播放列表并播放
                state.playlist = [song];
                state.currentIndex = 0;
                playSong(0);
                closeFavorites();
            }
        }

        // 取消收藏
        function removeFavorite(trackId) {
            if (confirm('确定要取消收藏这首歌吗？')) {
                FavoritesManager.remove(trackId);
                renderFavorites();
                updateFavoriteButton();
                showToast('已取消收藏');
            }
        }

        // 清空收藏
        function clearFavorites() {
            if (confirm('确定要清空所有收藏吗？此操作不可恢复！')) {
                FavoritesManager.clear();
                renderFavorites();
                updateFavoriteButton();
                showToast('收藏已清空');
            }
        }

        // 导出收藏
        function exportFavorites() {
            const favorites = FavoritesManager.getAll();
            if (favorites.length === 0) {
                alert('暂无收藏可导出');
                return;
            }
            FavoritesManager.export();
            showToast('收藏已导出');
        }

        // 导入收藏
        function importFavorites() {
            const input = $('import-file-input');
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const count = await FavoritesManager.import(file);
                        renderFavorites();
                        updateFavoriteButton();
                        showToast(`成功导入 ${count} 首收藏`);
                    } catch (err) {
                        alert('导入失败：' + err.message);
                    }
                }
                input.value = '';
            };
            input.click();
        }

        // 格式化日期
        function formatDate(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;

            // 小于1分钟
            if (diff < 60000) {
                return '刚刚';
            }
            // 小于1小时
            if (diff < 3600000) {
                return Math.floor(diff / 60000) + '分钟前';
            }
            // 小于1天
            if (diff < 86400000) {
                return Math.floor(diff / 3600000) + '小时前';
            }
            // 小于7天
            if (diff < 604800000) {
                return Math.floor(diff / 86400000) + '天前';
            }
            // 显示具体日期
            return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
        }

        function installApp() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => {
                    deferredPrompt = null;
                    document.querySelector('.install-prompt')?.remove();
                });
            }
        }

        // 切换搜索输入框显示/隐藏 (重构后)
        function toggleSearchInput() {
            const searchContainer = document.getElementById('search-input-container');
            const searchInput = document.getElementById('search-input');
            const isVisible = searchContainer.style.display === 'flex';

            if (isVisible) {
                searchContainer.style.display = 'none';
            } else {
                searchContainer.style.display = 'flex';
                // 延迟聚焦以解决PWA环境下的渲染问题
        setTimeout(() => searchInput.focus(), 100); // 关键：延迟聚焦以解决PWA问题
            }
        }
    </script>
    



</body>
</html>
```

---

## manifest.json

```json
{
    "name": "广山音乐播放器",
    "short_name": "广山音乐",
    "description": "随机探索版音乐播放器",
    "start_url": "./index.html",
    "scope": "./",
    "display": "standalone",
    "background_color": "#121212",
    "theme_color": "#1db954",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "./icon/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "./icon/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "prefer_related_applications": false,
    "related_applications": [],
    "categories": ["music", "entertainment"],
    "dir": "ltr",
    "lang": "zh-CN"
}
```

---

## sw.js

```javascript
const CACHE_VERSION = 'geek-music-v4';
const STATIC_CACHE_NAME = CACHE_VERSION + '-static';
const IMAGES_CACHE_NAME = CACHE_VERSION + '-images';
const API_CACHE_NAME = CACHE_VERSION + '-api';
const DYNAMIC_CACHE_NAME = CACHE_VERSION + '-dynamic';

const urlsToCache = [
    './index.html',
    './manifest.json',
    './YouTubePlayerManager.js'
];

// 安装时缓存核心文件
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE_NAME &&
                        cacheName !== IMAGES_CACHE_NAME &&
                        cacheName !== API_CACHE_NAME &&
                        cacheName !== DYNAMIC_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 根据请求类型使用不同的缓存策略
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // 【新增修复代码】忽略非 http/https 协议的请求（如 chrome-extension://）
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 【新增修复代码】忽略 POST 请求（Cache API 只能缓存 GET）
    if (request.method !== 'GET') {
        return;
    }

    // 静态资源（HTML, CSS, JS, manifest）- 网络优先，失败时使用缓存
    if (isStaticResource(request)) {
        event.respondWith(networkFirstStrategy(request));
    }
    // 图片资源 - 缓存优先，网络更新
    else if (isImageRequest(request)) {
        event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE_NAME));
    }
    // API 请求 - 网络优先，带缓存更新，设置过期时间
    else if (isApiRequest(request)) {
        event.respondWith(networkFirstWithExpiryStrategy(request));
    }
    // 其他动态资源 - 动态缓存策略
    else {
        event.respondWith(networkFirstStrategy(request));
    }
});

// 判断是否为静态资源
function isStaticResource(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    return pathname.endsWith('.html') ||
           pathname.endsWith('.css') ||
           pathname.endsWith('.js') ||
           pathname.endsWith('manifest.json');
}

// 判断是否为图片请求
function isImageRequest(request) {
    return request.destination === 'image' ||
           request.url.includes('artworkUrl') ||
           request.url.includes('cover') ||
           /\.(png|jpe?g|gif|svg|webp)$/i.test(request.url);
}

// 判断是否为API请求
function isApiRequest(request) {
    return request.url.includes('itunes.apple.com') ||
           request.url.includes('api.lyrics.ovh') ||
           request.url.includes('wikipedia.org/api') ||
           request.url.includes('randomuser.me') ||
           request.url.includes('api.kanye.rest') ||
           request.url.includes('v1.hitokoto.cn') ||
           request.url.includes('open-meteo.com') ||
           request.url.includes('get.geojs.io');
}

// 网络优先策略
function networkFirstStrategy(request) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    return fetch(request)
        .then(response => {
            if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                    .then(cache => cache.put(request, responseClone));
            }
            return response;
        })
        .catch(() => caches.match(request));
}

// 缓存优先策略（用于图片）
function cacheFirstStrategy(request, cacheName) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    return caches.match(request)
        .then(response => {
            if (response) {
                // 如果缓存中有，则使用缓存，并在后台更新
                fetch(request)
                    .then(networkResponse => {
                        if (networkResponse.status === 200) {
                            const networkResponseClone = networkResponse.clone();
                            caches.open(cacheName)
                                .then(cache => cache.put(request, networkResponseClone));
                        }
                    })
                    .catch(() => {}); // 忽略更新失败
                return response;
            }

            // 缓存中没有，则从网络获取并存储 
            return fetch(request)
                .then(networkResponse => {
                    if (networkResponse.status === 200) {
                        const networkResponseClone = networkResponse.clone();
                        caches.open(cacheName)
                            .then(cache => cache.put(request, networkResponseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request)); // 如果网络也失败，返回缓存
        });
}

// 带过期时间的网络优先策略（用于API）
function networkFirstWithExpiryStrategy(request) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    const cacheKey = request.url;

    return caches.open(API_CACHE_NAME)
        .then(cache => cache.match(request))
        .then(cachedResponse => {
            if (!cachedResponse) {
                // 没有缓存，直接从网络获取
                return fetchAndCache(request);
            }

            // 检查缓存是否过期（1小时）
            const expirationTime = 60 * 60 * 1000; // 1小时
            const cachedTime = cachedResponse.headers.get('x-cache-time');

            if (!cachedTime || (Date.now() - parseInt(cachedTime)) > expirationTime) {
                // 缓存过期，从网络获取并更新缓存
                return fetchAndCache(request);
            }

            // 缓存未过期，返回缓存，并在后台更新
            fetch(request)
                .then(networkResponse => {
                    if (networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        const headers = new Headers(responseToCache.headers);
                        headers.set('x-cache-time', Date.now().toString());

                        const responseWithTime = new Response(responseToCache.body, {
                            status: responseToCache.status,
                            statusText: responseToCache.statusText,
                            headers: headers
                        });

                        caches.open(API_CACHE_NAME)
                            .then(cache => cache.put(request, responseWithTime));
                    }
                })
                .catch(() => {}); // 忽略更新失败

            return cachedResponse;
        });
}

// 从网络获取并缓存的辅助函数
function fetchAndCache(request) {
    // Skip caching requests from browser extensions
    if (request.url.startsWith('chrome-extension:') ||
        request.url.startsWith('moz-extension:') ||
        request.url.startsWith('safari-extension:')) {
        return fetch(request);
    }

    return fetch(request)
        .then(networkResponse => {
            if (networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                const headers = new Headers(responseToCache.headers);
                headers.set('x-cache-time', Date.now().toString());

                const responseWithTime = new Response(responseToCache.body, {
                    status: networkResponse.status,
                    statusText: responseToCache.statusText,
                    headers: headers
                });

                caches.open(API_CACHE_NAME)
                    .then(cache => cache.put(request, responseWithTime));
            }
            return networkResponse;
        })
        .catch(() => {
            // 网络失败时返回缓存
            return caches.open(API_CACHE_NAME)
                .then(cache => cache.match(request));
        });
}
```

---

## youtube/artist.py

```python
from ytmusicapi import YTMusic

yt = YTMusic()

# 你需要先通过 search 找到艺术家的 channelId
channel_id = "UCPC0L1d253x-KuMNwa05TpA" # 艺术家的 Channel ID
artist_info = yt.get_artist(channel_id)

print(f"艺术家: {artist_info['name']}")
print(f"描述: {artist_info['description']}")
print(f"订阅数: {artist_info['subscribers']}")

# 查看热门歌曲
for song in artist_info['songs']['results']:
    print(song['title'])
```

---

## youtube/data_api.py

```python
# data_api_all.py - 最终完整修复版 (纯JSON API)
# 解决了日志冲突、代码重复等所有已知问题，并保留全部代码和常量。

# --- 1. 基础模块导入 ---
import sqlite3
import codecs
import json
import logging
import os
import re
import threading
import time
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler
import inspect
from pathlib import Path
from functools import wraps

import akshare as ak
import numpy as np
import pandas as pd
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, make_response
import xmltodict
from WXBizMsgCrypt import WXBizMsgCrypt
from flask_cors import CORS
from werkzeug.routing import BaseConverter
from pywebpush import webpush, WebPushException
import sqlite3

# --- 从自定义模块导入功能 ---
try:
    from get_ths_data import (
        get_ths_basis,
        get_ths_company_holding,
        get_ths_main_force,
        get_ths_position_ranking,
        get_ths_profit,
        get_ths_stock,
        get_ths_trading,
    )
    from hq import get_exchange_data
except ImportError as e:
    print(
        f"启动错误：无法导入自定义模块。请确保 get_ths_data.py 和 hq.py 文件存在于同一目录。错误: {e}"
    )
    exit(1)

# --- 导入 YouTube Music 服务 ---
try:
    from youtube_service import (
        search_song,
        search_artist,
        get_artist_info,
        get_lyrics,
        get_song_details
    )
    YOUTUBE_SERVICE_AVAILABLE = True
    print("✅ YouTube Music 服务已加载")
except ImportError as e:
    YOUTUBE_SERVICE_AVAILABLE = False
    print(f"⚠️ YouTube Music 服务不可用: {e}")
    # 定义空函数以避免路由报错
    def search_song(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def search_artist(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def get_artist_info(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def get_lyrics(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}
    def get_song_details(*args, **kwargs):
        return {'success': False, 'error': 'YouTube Music 服务未安装'}

# --- 2. 初始化与配置 ---
load_dotenv()

# --- Flask 应用初始化 ---
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
CORS(app)


# --- 日期转换器 ---
class DateConverter(BaseConverter):
    regex = r"\d{4}-\d{2}-\d{2}"

    def to_python(self, value):
        return datetime.strptime(value, "%Y-%m-%d")

    def to_url(self, value):
        return value.strftime("%Y-%m-%d")


app.url_map.converters["date"] = DateConverter

# --- 日志配置 (已修复) ---
log_formatter = logging.Formatter(
    "%(asctime)s - %(levelname)s - %(module)s - %(message)s"
)
log_handler = RotatingFileHandler(
    "data_api.log", maxBytes=1000000, backupCount=3, encoding="utf-8"
)
log_handler.setFormatter(log_formatter)
log_handler.setLevel(logging.INFO)

# [FIXED] 移除Flask默认的handler，避免日志重复输出
from flask.logging import default_handler
app.logger.removeHandler(default_handler)

app.logger.addHandler(log_handler)
app.logger.setLevel(logging.INFO)
# [FIXED] 将werkzeug的日志也导向文件，而不是控制台
logging.getLogger('werkzeug').addHandler(log_handler)
# [FIXED] 移除了冲突的 logging.basicConfig()，这是导致Gunicorn worker崩溃的主要原因
# logging.basicConfig(
#     level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
# )

# --- 3. 核心配置与常量 (已去重) ---

# --- 数据库配置 ---
DB_PATHS = {
    "futures": "futures_data.db",
    "minute": "minute_data.db",
    "qhhq": "qhhq.db",
    "qhlhb": "qhlhb.db",
    "klines": "/home/ubuntu/minute_data.db",
}
LATEST_DATE_FIELDS = {
    "futures": ("hqdata", "日期", "期货代码"),
    "minute": ("minute_klines", "substr(timestamp,1,10)", "code"),
    "qhhq": ("hqdata", "日期", "期货公司"),
    "qhlhb": ("lhb", "日期", "期货公司"),
}

# --- 发布频率限制 ---
TOUTIAO_RATE_LIMIT = {
    "date": datetime.now().strftime("%Y-%m-%d"),
    "count": 0,
    "limit": 45,
}
rate_limit_lock = threading.Lock()

# --- 知乎API相关配置 ---
zhihu_proxy_url = os.getenv("FLASK_PROXY_API_URL")
if zhihu_proxy_url:
    ZHIHU_HOT_API_URL = f"{zhihu_proxy_url}/api/zhihu/hot"
    ZHIHU_INSPIRATION_API_URL = f"{zhihu_proxy_url}/api/zhihu/inspiration"
    logging.info(f"使用代理配置: 知乎热点API = {ZHIHU_HOT_API_URL}")
    logging.info(f"使用代理配置: 知乎灵感API = {ZHIHU_INSPIRATION_API_URL}")
else:
    ZHIHU_HOT_API_URL = "https://newsnow.want.biz/api/s?id=zhihu"
    ZHIHU_INSPIRATION_API_URL = "https://www.zhihu.com/api/v4/creators/recommend/list"
    logging.warning("⚠️ 未配置FLASK_PROXY_API_URL环境变量，将直接调用知乎官方API")

ZHIHU_CONFIG = {
    "hot_api_url": ZHIHU_HOT_API_URL,
    "inspiration_api_url": ZHIHU_INSPIRATION_API_URL,
    "cache_duration": 300,
    "user_agent": "ZhihuHybrid Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
    "headers": {
        "Host": "www.zhihu.com",
        "Cookie": (
            "BEC=1a391e0da683f9b1171c7ee6de8581cb; zst_82=2.0eZIThrz3yhoLAAAASwUAADIuMBvXfWgAAAAAXgGewK5BC1LDt8HYJm1oLPR-YrE=; q_c0=2|1:0|10:1753077525|4:q_c0|92:Mi4xemk4T0FBQUFBQUFBSUJkblVFN3RGZ3NBQUFCZ0FsVk5GV1NsYUFBRjJFSFNVNWRqaUJubi1XTFBYc055T2owY3hR|7f06e47ec86f9f6ded886152c646ebd77b38e781bf61d05e8642ab6a95dc6524; z_c0=2|1:0|10:1753077525|4:z_c0|92:Mi4xemk4T0FBQUFBQUFBSUJkblVFN3RGZ3NBQUFCZ0FsVk5GV1NsYUFBRjJFSFNVNWRqaUJubi1XTFBYc055T2owY3hR|eaf51cb59994605f7a46fda8605543bca6f69118237dd4721e00911fdd76b669; d_c0=ACAXZ1BO7RZLBcPRn4Wd-d-AV-Zh_0TjO7A=|1753077507; ff_supports_webp=1; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1748024974,1749773726,1750009971; _xsrf=OQF5dPbhWz7u3JgNYRUCH5ENI0WqRxxv; edu_user_uuid=edu-v1|55a9641d-29d3-46c2-aba6-5cd6e49f82d4; _zap=9c13540f-053d-4ade-95a0-46817bdd32d5"
        ),
        "Accept": "*/*",
        "x-requested-with": "fetch",
        "Sec-Fetch-Site": "same-origin",
        "x-ms-id": "D28wdOqhFkp+xKhHEicm44T+7X7jw71HgL2zO1NIkbShEX36",
        "x-zse-93": "101_5_3.0",
        "x-hd": "2f1575458c8a4be82627fba342568473",
        "x-zst-82": "2.0eZIThrz3yhoLAAAASwUAADIuMBvXfWgAAAAAXgGewK5BC1LDt8HYJm1oLPR-YrE=",
        "Sec-Fetch-Mode": "cors",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": (
            "ZhihuHybrid osee2unifiedRelease/24008 osee2unifiedReleaseVersion/10.60.0 Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        ),
        "Referer": "https://www.zhihu.com/appview/creator",
        "x-app-version": "10.60.0",
        "Connection": "keep-alive",
        "x-ac-udid": "ACAXZ1BO7RZLBcPRn4Wd-d-AV-Zh_0TjO7A=",
        "Sec-Fetch-Dest": "empty",
        "x-zse-96": "2.0_MB7Iyz2YCpM9aaWVkNnV2qpImCnZJjc1QtYokgTco0=faYPkJK=yLRzCSs=mlYYM",
    },
}

ZHIHU_CACHE = {
    "hot_topics": {"timestamp": 0, "data": None},
    "inspiration_questions": {"timestamp": 0, "data": None},
}

# --- 头条API相关常量 ---
FLASK_PROXY_API_URL = os.getenv("FLASK_PROXY_API_URL")
TOUTIAO_API_BASE_URL = (
    FLASK_PROXY_API_URL or "https://ib.snssdk.com/pgcapp/mp/agw/article/publish"
)
if not FLASK_PROXY_API_URL:
    logging.warning("⚠️ 未配置 FLASK_PROXY_API_URL 环境变量，将直接调用头条官方API")

TOUTIAO_QUERY_PARAMS = {
    "session_id": "4A3CCF1E-0A90-4FF5-9D7F-2C43038A2311",
    "version_code": "9.0.0",
    "tma_jssdk_version": "2.53.2.0",
    "app_name": "news_article_social",
    "app_version": "9.0.0",
    "carrier_region": "CN",
    "device_id": "3591453919949805",
    "channel": "App Store",
    "resolution": "1170*2532",
    "aid": "19",
    "ab_version": "1859936,668776,13356769,668779,13356755,662099,12636413,13293553,12305809,13126479,13215653,13373095,4113875,4522574,4890008,6571799,7204589,7354844,7551466,8160328,8553218,8639938,8885971,8985781,9671606,10146301,10251872,10386924,10433952,10645729,10703934,10743278,10772964,10797943,10849833,10879886,11144711,11232912,11239382,11308092,11394631,11513698,11563236,11565349,11645964,11649962,11661813,11709192,11763389,11786812,11796248,11823590,11823748,11823877,11839761,11906663,11920653,11924697,11970513,11970596,11970655,11981315,12126055,12172770,12327156,12363458,12368504,12378301,12384208,12389444,12403709,12496899,12523247,12589695,12690790,12720695,12733027,12785735,12836704,12860549,12888549,12937660,12952090,12984593,12984891,12985928,12988354,12990051,12990119,13027015,13042650,13063492,13072413,13098989,13107216,13115718,13135331,13143696,13148461,13154507,13164816,13201836,13222263,13227575,13264130,13265056,13269343,13272746,13277739,13286697,13293838,13294457,13295710,13299207,13300136,13302896,13308931,13316011,13319569,13329548,13343756,13344454,13345087,13349421,13350564,13353112,13353880,13357778,13359423,13363700,13364742,13365092,13367499,13367883,13369098,13369251,13371369,13372334,13372445,13375116,13375511,13375820,13379882,13381650,13381940,13382234,13223470,10282085,668775,9328991,9629719,11295211,12945760,13356744,668774,13149414,13356742,662176,13356741,660830,13356743,10549444,13162708,13377132,11254714,9470952,9855884,11622653,12110965,12593783,12779906,12901058,12940566,13174430,13235472,13257457,13283710,13293852,13297076,13331007,13331919,13366931,13374303,13375428,13166144,7142413,8504306,10511023,10756958,12467959,13183282,13214397,13037701,10357230,13095523,13190769,13303652,13333297,13346524",
    "ab_feature": "4783616,794528,1662481,3408339,4743952",
    "ab_group": "4783616,794528,1662481,3408339,4743952",
    "update_version_code": "90020",
    "cdid": "007B8099-C811-4864-A7E3-DBCD3D4BC79C",
    "ac": "WIFI",
    "os_version": "18.5",
    "ssmix": "a",
    "device_platform": "iphone",
    "iid": "3186833641732558",
    "device_type": "iPhone 14",
    "ab_client": "a1,f2,f7,e1",
}

TOUTIAO_HEADERS = {
    "Host": "ib.snssdk.com",
    "Connection": "keep-alive",
    "x-Tt-Token": "00beea9a49b13130a18ffaf8397042fab700c003fd996720690ed1322b340d464536b4ca2a2aa0868cb61df177c4081ae4dae80785b0ec888969220aeb60ba60d99df6369362fd70e8d89cfb7c46e2713d09a32d3b638da6c8133ad2885e112c65289--0a490a20523ccfab387acfed3f5d8e43be1d7642dcefff4445b6d88158b33d211636133812208f3963668516980676fc24d91bf26cb75d3b1078c6a2d195624a071c695bbe6c18f6b4d309-3.0.1",
    "Cookie": "store-region=cn-sh; store-region-src=uid; FRM=new; PIXIEL_RATIO=3; WIN_WH=390_844; d_ticket=03baf8528d2ed41d6e4f50bbab6d510e9c684; ttwid=1%7CCuG9RHWdsNGnIkwQzxaGQYNdFB7oKQXJlzowyBPnavQ%7C1699378517%7C8c0c38a62793b9bbe3a33a8930d5ac059278fc7e681b53a1f3e94d0d59bec043; odin_tt=e664859603dd14a3b61beb10a5b56949a14e9856d1da68788f5988c36a26b177919315c204f455c8a8371cd56af40a1cfb957d87605b52d03246eacfacb3912c; ariaDefaultTheme=undefined; passport_csrf_token=fc5cb2b50e13c6525d1895832aa2113c; passport_csrf_token_default=fc5cb2b50e13c6525d1895832aa2113c; is_staff_user=false; sessionid=beea9a49b13130a18ffaf8397042fab7; sessionid_ss=beea9a49b13130a18ffaf8397042fab7; sid_guard=beea9a49b13130a18ffaf8397042fab7%7C1751570868%7C5184000%7CMon%2C+01-Sep-2025+19%3A27%3A48+GMT; sid_tt=beea9a49b13130a18ffaf8397042fab7; sid_ucp_v1=1.0.0-KGI3Mjk2ZTBkMTMxMmE5MmJiODRiOTRmYWY1ODFmNTJiYTA5Njc5NTEKJgjx7u3MFRC0s5vDBhgTIAwol9nwvr3M2AQw2p2XswU4AkDxB0gBGgJsZiIgYmVlYTlhNDliMTMxMzBhMThmZmFmODM5NzA0MmZhYjc; ssid_ucp_v1=1.0.0-KGI3Mjk2ZTBkMTMxMmE5MmJiODRiOTRmYWY1ODFmNTJiYTA5Njc5NTEKJgjx7u3MFRC0s5vDBhgTIAwol9nwvr3M2AQw2p2XswU4AkDxB0gBGgJsZiIgYmVlYTlhNDliMTMxMzBhMThmZmFmODM5NzA0MmZhYjc; uid_tt=a6f1b830a6aad57983224b2b49766a3d; uid_tt_ss=a6f1b830a6aad57983224b2b49766a3d; passport_csrf_token=fc5cb2b50e13c6525d1895832aa2113c; passport_csrf_token_default=fc5cb2b50e13c6525d1895832aa2113c; ariaDefaultTheme=undefined; odin_tt=e664859603dd14a3b61beb10a5b56949a14e9856d1da68788f5988c36a26b177919315c204f455c8a8371cd56af40a1cfb957d87605b52d03246eacfacb3912c; ttwid=1%7CCuG9RHWdsNGnIkwQzxaGQYNdFB7oKQXJlzowyBPnavQ%7C1699378517%7C8c0c38a62793b9bbe3a33a8930d5ac059278fc7e681b53a1f3e94d0d59bec043; d_ticket=03baf8528d2ed41d6e4f50bbab6d510e9c684; FRM=new; PIXIEL_RATIO=3; WIN_WH=390_844; store-region=cn-sh; store-region-src=uid",
    "tt-request-time": "1752642339124",
    "User-Agent": "NewsSocial 9.0.0 rv:9.0.0.20 (iPhone; iOS 18.5; zh_CN) Cronet",
    "sdk-version": "2",
    "x-tt-dt": "AAAZGUYOABV34XKPYQAACEOO4MBQWN2OA7IRSYSOASZQA4DBZRY7CYANGO53CNAD5EETHYYWFCH6SN3LDPBSJOZCDU536OHV5HR2EG6QGTAGOQA5CMGBENT3B3B3U7AYTV3CDGGNQY7CFRRZBW65FM4XQ",
    "passport-sdk-version": "5.17.5-rc.8-toutiao",
    "X-SS-STUB": "E94C602985537DACD686BFB04ED20198",
    "x-tt-local-region": "unknown",
    "x-bd-kmsv": "1",
    "x-tt-trace-id": "00-119fc2d00dcc268872033edc3b620013-119fc2d00dcc2688-01",
    "Accept-Encoding": "gzip, deflate",
    "X-Argus": "FEBoYI7BSzvTZRbQ9ibi2xCGbmguVmyMLkpCrKA89hk+YgQqws/TvqucNvoAWBnCBdSTDV6jv+LjzxHbnF/D9xOH5mU4hnpm9uL1H/ucCvND6WIke5OL4Hpou3RcA33fd5p+mHMLiL3HEu283Q9vSsW1YCJxBYUqd02Aj5wvEngZgWzabNjguFbpNg+AZ1R79wfr5phkaHQusi3YlDCXt1gaskaaTOIV70DcEfl7HbGwRpZH5k9FE2h3GBYohM2QHjyyNeEpWcL3USw0nuv771XuDmfCP/ubVJKXl+GJ1XUQGuCFTl1c3TftWEatoicHYOA=",
    "X-Gorgon": "8404e0230000fbbd0c9203ec8975280bb5a16f348e48f929a7eb",
    "X-Khronos": "1752642339",
    "X-Ladon": "8T7vOGRNi4tIZIfnnUxbxGZeJysrb+Z2DzGVwqbyM3f+8XOM",
}

TOUTIAO_POST_DATA_TEMPLATE = {
    "article_ad_type": "3",
    "article_type": "0",
    "claim_origin": "0",
    "from_page": "main_publisher",
    "goods_card_cnt": "0",
    "is_original_image_clicked": "0",
    "paste_words_cnt": "0",
    "pgc_feed_covers": "[]",
    "pgc_id": "7527541462024585754",
    "praise": "0",
    "save": "1",
    "source": "3",
    "with_video": "0",
}

# --- 博客发布 API 相关配置 ---
BLOG_POST_CONFIG = {
    "url": "https://blog.want.biz/new",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
        "cache-control": "no-cache",
        "origin": "https://blog.want.biz",
        "pragma": "no-cache",
        "referer": "https://blog.want.biz/new",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
}

# --- Web Push 推送服务配置 ---
VAPID_PRIVATE_KEY = os.environ.get("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.environ.get("VAPID_PUBLIC_KEY")
VAPID_CLAIMS = {
    "sub": f"mailto:{os.environ.get('VAPID_CONTACT_EMAIL', 'yuanguangshan@gmail.com')}"
}
PUSH_API_KEY = os.environ.get("PUSH_API_KEY", "0503")

# --- 期货相关常量 ---
COMPANIES = [
    "国泰君安期货", "银河期货", "中信期货", "永安期货", "华泰期货", "东证期货", "中信建投期货",
    "中泰期货", "浙商期货", "光大期货", "南华期货", "中粮期货", "国投安信期货", "招商期货",
    "广发期货", "新湖期货", "方正中期期货", "申银万国期货", "宏源期货", "海通期货", "瑞达期货",
    "五矿期货", "平安期货", "东吴期货", "国信期货", "国元期货", "建信期货", "兴证期货",
    "弘业期货", "广州期货", "创元期货", "长江期货", "金瑞期货", "徽商期货", "兴业期货",
    "中金财富期货", "国贸期货", "东海期货", "国联期货", "宝城期货", "信达期货", "国海良时",
    "格林大华", "东方财富期货", "华安期货", "海证期货", "紫金天风", "一德期货", "中金期货",
    "华西期货", "物产中大期货", "华融融达期货", "中国国际期货", "华闻期货", "国富期货",
]
VARIETIES = [
    "PR", "M", "RB", "TA", "MA", "RM", "P", "V", "RU", "Y", "FG", "PP", "EB", "I", "FU",
    "AG", "C", "HC", "SP", "SA", "L", "SI", "NI", "EG", "CF", "IM", "OI", "CU", "SR",
    "AL", "IC", "SS", "IF", "PX", "AU", "B", "LC", "PF", "PG", "NR", "JD", "SF", "CS",
    "UR", "JM", "SN", "BU", "IH", "T", "A", "LU", "ZN", "AP", "PK", "SM", "TF", "LH",
    "AO", "PB", "TS", "TL", "J", "CJ", "EC", "SH", "CY", "BC",
]
CODE_MAP = {
    "PR": "瓶片", "M": "豆粕", "Y": "豆油", "C": "玉米", "RM": "菜粕", "I": "铁矿石",
    "MA": "甲醇", "HC": "热卷", "SA": "纯碱", "P": "棕榈油", "AG": "沪银", "RB": "螺纹钢",
    "LC": "碳酸锂", "SI": "工业硅", "IF": "沪深300", "IC": "中证500", "OI": "菜油",
    "L": "塑料", "IM": "中证1000", "T": "十年国债", "RU": "橡胶", "JM": "焦煤", "SF": "硅铁",
    "IH": "上证50", "ZN": "沪锌", "V": "PVC", "SM": "锰硅", "BU": "沥青", "NR": "20号胶",
    "AL": "沪铝", "LH": "生猪", "SP": "纸浆", "CS": "玉米淀粉", "NI": "沪镍", "SS": "不锈钢",
    "SN": "沪锡", "AP": "苹果", "TL": "三十年国债", "B": "豆二", "CJ": "红枣", "SH": "烧碱",
    "A": "豆一", "TS": "二年国债", "PF": "短纤", "AU": "沪金", "EC": "欧线集运",
    "AO": "氧化铝", "PG": "LPG", "PB": "沪铅", "FU": "燃油", "CU": "沪铜", "PK": "花生",
    "TF": "五年国债", "PP": "聚丙烯", "BC": "国际铜", "PX": "对二甲苯", "CY": "棉纱",
    "TA": "PTA", "CF": "棉花", "SR": "白糖", "FG": "玻璃", "JD": "鸡蛋", "RS": "菜籽",
    "LU": "低硫燃油", "UR": "尿素", "EG": "乙二醇", "J": "焦炭",
}


# --- 4. 辅助函数 (已去重和优化) ---

# --- Helper Function for JSBox DB Connection ---
def get_jsbox_db_conn():
    # 建议为JSBox启动器使用一个独立的数据库文件
    conn = sqlite3.connect('jsbox_launchers.db', timeout=10)
    conn.row_factory = sqlite3.Row  # 以字典形式返回行
    return conn

def log_execution_time(func):
    """一个装饰器，用于记录函数执行时间。"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        app.logger.info(f"开始执行: {func.__name__}")
        try:
            result = func(*args, **kwargs)
            end_time = time.time()
            duration = end_time - start_time
            app.logger.info(f"完成执行: {func.__name__}，耗时: {duration:.2f}秒")
            return result
        except Exception as e:
            end_time = time.time()
            duration = end_time - start_time
            app.logger.error(f"执行失败: {func.__name__}，耗时: {duration:.2f}秒，错误: {e}", exc_info=True)
            raise
    return wrapper

def safe_json_serializer(obj):
    """统一的JSON序列化器，处理日期、Numpy和Pandas特殊类型"""
    if pd.isna(obj) or obj == "undefined" or obj == "NaN":
        return None
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        return float(obj) if not np.isnan(obj) else None
    elif isinstance(obj, (pd.Timestamp, pd.Period, datetime)):
        return obj.isoformat()
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return str(obj)

def dataframe_to_json_response(df):
    """将DataFrame转换为统一的Flask JSON响应：{"data": [...]}"""
    if not isinstance(df, pd.DataFrame):
        app.logger.error(f"dataframe_to_json_response 收到非DataFrame类型: {type(df)}")
        return jsonify({"error": "内部服务器错误：预期数据类型为DataFrame"}), 500
    df = df.replace({np.nan: None})
    data = df.to_dict(orient='records')
    # 使用自定义序列化器以防万一，尽管jsonify已经很强大
    json_string = json.dumps({"data": data}, ensure_ascii=False, default=safe_json_serializer)
    return app.response_class(response=json_string, status=200, mimetype='application/json')

CURL_FILE = Path("/home/ubuntu/zhihu_cookie_for_data_api.txt")

def load_curl_command(path: Path):
    if not path.exists():
        import sys
        print(f"Error: 未找到 curl 文件 {path}", file=sys.stderr)
        sys.exit(1)
    content = path.read_text(encoding="utf-8")
    return content.replace("\n", " ").strip()

def parse_headers_from_curl(curl_cmd: str) -> dict:
    headers = {}
    pattern = re.compile(r"-H\s+['\"]([^:'\" ]+):\s*([^'\"]*)['\"]")
    for key, val in pattern.findall(curl_cmd):
        headers[key] = val
    return headers

def update_zhihu_headers():
    if CURL_FILE.exists():
        curl_cmd = load_curl_command(CURL_FILE)
        new_h = parse_headers_from_curl(curl_cmd)
        ZHIHU_CONFIG["headers"].update(new_h)
        app.logger.info("已更新知乎请求参数。")
    else:
        app.logger.warning(f"未找到知乎cookie文件: {CURL_FILE}")

def fetch_zhihu_hot_topics():
    now = time.time()
    if (
        ZHIHU_CACHE["hot_topics"]["data"]
        and now - ZHIHU_CACHE["hot_topics"]["timestamp"]
        < ZHIHU_CONFIG["cache_duration"]
    ):
        return ZHIHU_CACHE["hot_topics"]["data"]
    try:
        response = requests.get(
            ZHIHU_CONFIG["hot_api_url"],
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data or not data.get("items"):
            raise Exception("知乎热点API返回数据格式异常")
        topics = process_zhihu_data(data["items"])
        ZHIHU_CACHE["hot_topics"] = {"timestamp": now, "data": topics}
        return topics
    except Exception as e:
        logging.error(f"获取知乎热点失败: {str(e)}")
        return get_fallback_topics()

def fetch_zhihu_inspiration_questions(page_size=100, current=1):
    now = time.time()
    if (
        ZHIHU_CACHE["inspiration_questions"]["data"]
        and now - ZHIHU_CACHE["inspiration_questions"]["timestamp"]
        < ZHIHU_CONFIG["cache_duration"]
    ):
        return ZHIHU_CACHE["inspiration_questions"]["data"]
    try:
        response = requests.get(
            f"{ZHIHU_CONFIG['inspiration_api_url']}?pageSize={page_size}&current={current}",
            headers=ZHIHU_CONFIG["headers"],
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        if not data or not data.get("question_data"):
            raise Exception("知乎灵感问题API返回数据格式异常")
        questions = process_inspiration_data(data["question_data"])
        ZHIHU_CACHE["inspiration_questions"] = {"timestamp": now, "data": questions}
        return questions
    except Exception as e:
        logging.error(f"获取知乎灵感问题失败: {str(e)}")
        return get_fallback_inspiration_questions()

def process_zhihu_data(raw_data):
    if not isinstance(raw_data, list):
        return []
    processed_data = []
    for item in raw_data:
        processed_item = {
            "id": item.get("id") or str(time.time()),
            "title": item.get("title") or item.get("question") or "无标题",
            "url": item.get("url") or item.get("link") or "#",
            "hot": (item.get("extra", {}) and item.get("extra", {}).get("hot"))
            or item.get("hot")
            or item.get("hot_value")
            or item.get("score")
            or "0",
            "excerpt": item.get("excerpt") or item.get("desc") or "",
            "answers": item.get("answers") or item.get("answer_count") or 0,
            "category": "知乎热点",
            "timestamp": datetime.now().isoformat(),
            "type": "hot",
        }
        processed_data.append(processed_item)
    return processed_data

def process_inspiration_data(raw_data):
    if not isinstance(raw_data, list):
        return []
    processed_data = []
    for item in raw_data:
        tags = extract_tags_from_question(item)
        processed_item = {
            "id": item.get("id") or str(time.time()),
            "title": item.get("title") or "无标题",
            "url": f"https://www.zhihu.com/question/{item.get('token') or item.get('id')}"
            or "#",
            "hot": item.get("follower_count") or 0,
            "excerpt": item.get("excerpt") or "",
            "answer_count": item.get("answer_count") or 0,
            "category": "知乎灵感问题",
            "timestamp": datetime.now().isoformat(),
            "type": "inspiration",
            "tags": tags,
        }
        processed_data.append(processed_item)
    return processed_data

def extract_tags_from_question(question):
    tags = []
    if question.get("title"):
        title_words = re.split(r"[,，、\s]", question["title"])
        tags.extend([word for word in title_words if 2 <= len(word) <= 6][:3])
    if len(tags) < 3:
        tags.extend(
            [
                tag
                for tag in ["灵感", "问题", "知乎", "创作", "讨论"]
                if tag not in tags and len(tags) < 5
            ]
        )
    return tags

def get_fallback_topics():
    return [
        {
            "id": "fallback1",
            "title": "2025年AI将如何改变我们的工作方式？",
            "url": "https://www.zhihu.com/question/ai2025",
            "hot": "2000万",
            "excerpt": "随着ChatGPT、Claude等AI工具的普及...",
            "answers": 158,
            "category": "知乎热点",
            "timestamp": datetime.now().isoformat(),
            "type": "hot",
        }
    ]

def get_fallback_inspiration_questions():
    return [
        {
            "id": "ins_fallback1",
            "title": "作为一个普通人，如何在日常生活中培养创造力？",
            "url": "https://www.zhihu.com/question/creativity_daily",
            "hot": "1200万",
            "excerpt": "创造力不仅仅属于艺术家和科学家...",
            "answer_count": 156,
            "category": "知乎灵感问题",
            "timestamp": datetime.now().isoformat(),
            "type": "inspiration",
            "tags": ["创造力", "自我提升", "思维", "习惯养成"],
        }
    ]

def check_and_update_toutiao_limit():
    with rate_limit_lock:
        today_str = datetime.now().strftime("%Y-%m-%d")
        if TOUTIAO_RATE_LIMIT["date"] != today_str:
            TOUTIAO_RATE_LIMIT["date"] = today_str
            TOUTIAO_RATE_LIMIT["count"] = 0
            logging.info("新的一天，重置头条发布计数器。")
        if TOUTIAO_RATE_LIMIT["count"] >= TOUTIAO_RATE_LIMIT["limit"]:
            logging.warning(
                f"今日头条发布次数已达上限 ({TOUTIAO_RATE_LIMIT['limit']})，将跳过发布。"
            )
            return False
        TOUTIAO_RATE_LIMIT["count"] += 1
        logging.info(
            f"头条发布计数增加，今日已尝试发布 {TOUTIAO_RATE_LIMIT['count']} 次。"
        )
        return True

def _post_to_toutiao(title, content):
    try:
        post_data_payload = TOUTIAO_POST_DATA_TEMPLATE.copy()
        post_data_payload.update(
            {
                "title": title,
                "content": content,
                "extra": json.dumps({"content_word_cnt": len(content)}),
            }
        )
        if "pgc_id" in post_data_payload:
            del post_data_payload["pgc_id"]
        toutiao_response = requests.post(
            TOUTIAO_API_BASE_URL,
            params=TOUTIAO_QUERY_PARAMS,
            data=post_data_payload,
            headers=TOUTIAO_HEADERS,
            timeout=15,
            verify=False,
        )
        response_json = (
            toutiao_response.json()
            if "application/json" in toutiao_response.headers.get("Content-Type", "")
            else {
                "error": "Toutiao API returned non-JSON response",
                "raw_response": toutiao_response.text[:500],
            }
        )
        toutiao_response.raise_for_status()
        return {"status": "success", "response": response_json}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"头条API请求失败: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"头条发布时发生未知错误: {str(e)}"}

def _post_to_blog(title, content_md, tags):
    try:
        client_id = os.getenv("CF_CLIENT_ID")
        client_secret = os.getenv("CF_CLIENT_SECRET")
        if not all([client_id, client_secret]):
            raise ValueError("环境变量 CF_CLIENT_ID 或 CF_CLIENT_SECRET 未设置。")

        request_headers = BLOG_POST_CONFIG["headers"].copy()
        request_headers["CF-Access-Client-Id"] = client_id
        request_headers["CF-Access-Client-Secret"] = client_secret

        form_data = {
            "title": (None, title),
            "content": (None, content_md),
            "tags": (None, tags),
            "image": ("", b"", "application/octet-stream"),
        }
        blog_response = requests.post(
            BLOG_POST_CONFIG["url"],
            headers=request_headers,
            files=form_data,
            timeout=20,
            verify=False,
            allow_redirects=False,
        )
        if (
            blog_response.status_code == 302 or blog_response.status_code == 303
        ) and "Location" in blog_response.headers:
            redirect_url = blog_response.headers["Location"]
            if "cloudflareaccess.com" in redirect_url and (
                "login" in redirect_url or "access" in redirect_url
            ):
                logging.info(
                    f"博客发布成功，但被重定向到 Cloudflare Access URL: {redirect_url}"
                )
                return {
                    "status": "success",
                    "message": "博客发布成功！(通过 Cloudflare Access 重定向)",
                    "redirect_url": redirect_url,
                }
            return {
                "status": "success",
                "message": "博客发布成功！",
                "redirect_url": redirect_url,
            }
        else:
            return {
                "status": "error",
                "message": f"博客发布失败，状态码: {blog_response.status_code}",
                "details": blog_response.text[:500],
            }
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"请求博客系统时发生网络错误: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"博客发布时发生未知错误: {str(e)}"}

def _execute_publishing_flow(title, content_plain, content_md, tags, targets=None):
    if targets is None:
        targets = ["toutiao","blog"]

    results = {}

    if "toutiao" in targets:
        can_post_to_toutiao = check_and_update_toutiao_limit()
        if can_post_to_toutiao:
            logging.info(f"执行头条发布: '{title}'")
            results["toutiao"] = _post_to_toutiao(title, content_plain)
        else:
            results["toutiao"] = {
                "status": "skipped",
                "message": "今日发布次数已达上限。",
            }

    if "blog" in targets:
        logging.info(f"执行博客发布: '{title}'")
        results["blog"] = _post_to_blog(title, content_md, tags)

    return results

def get_cloudflare_data():
    try:
        response = requests.get("https://pytest.want.biz")
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, f"API请求失败，状态码：{response.status_code}"
    except Exception as e:
        return None, str(e)

def jsl_etf_data():
    url = "https://www.jisilu.cn/data/etf/etf_list/"
    app.logger.info("开始从集思录获取ETF数据...")
    start_time = time.time()
    response = requests.get(url, timeout=15)
    duration = time.time() - start_time
    app.logger.info(f"从集思录获取ETF数据完成，耗时: {duration:.2f}秒")
    
    response.raise_for_status()
    data = response.json()
    df = pd.DataFrame(data["rows"])
    df = df["cell"].apply(pd.Series)
    df = df.dropna(subset=["unit_total", "unit_incr"])
    df["unit_total"] = df["unit_total"].astype(float)
    df["unit_incr"] = df["unit_incr"].astype(float)
    df["规模变化率_raw"] = np.where(df['unit_total'] > 0, df['unit_incr'] / df['unit_total'], 0)
    df["规模变化率"] = df["规模变化率_raw"].apply(lambda x: f"{x * 100:.2f}%")
    df_filtered = df[df["unit_total"] > 100]
    df_sorted = df_filtered.sort_values(by="规模变化率_raw", ascending=False)
    df_final = df_sorted[
        ["index_nm", "fund_id", "increase_rt", "unit_total", "unit_incr", "规模变化率"]
    ].head(20)
    df_final.columns = ["名称", "代码", "涨幅", "总规模", "规模变化", "规模变化率"]
    return df_final.to_dict(orient="records")

def code_prefix(code: str) -> str:
    match = re.match(r"([a-zA-Z]+)", code)
    return match.group(1).upper() if match else ""

def build_latest_sql(db_type, table, date_col, code_col, prefix, limit=100):
    pattern = f"{prefix}%"
    sql = f"""SELECT * FROM {table} WHERE `{code_col}` LIKE ? AND {date_col} = (SELECT MAX({date_col}) FROM {table} WHERE `{code_col}` LIKE ?) LIMIT ?"""
    params = (pattern, pattern, limit)
    return sql, params

def gbk_row_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        value = row[idx]
        if isinstance(value, bytes):
            try:
                d[col[0]] = codecs.decode(value, "gbk")
            except UnicodeDecodeError:
                d[col[0]] = value
        else:
            d[col[0]] = value
    return d

# --- 推送服务辅助函数 ---
def verify_push_api_key(auth_header):
    """验证推送API密钥"""
    if not auth_header or not auth_header.startswith('Bearer '):
        return False
    return auth_header[7:] == PUSH_API_KEY

def send_web_push(subscription, payload, ttl=86400):
    """发送Web推送通知"""
    try:
        response = webpush(
            subscription_info=subscription,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS,
            ttl=ttl
        )
        return {"success": True, "status_code": response.status_code}
    except WebPushException as e:
        status_code = e.response.status_code if hasattr(e, 'response') and e.response else 500
        return {"success": False, "error": str(e), "status_code": status_code}
    except Exception as e:
        return {"success": False, "error": str(e), "status_code": 500}


# =====================================================================
# --- 5. API 路由定义 (已去重和修正) ---
# =====================================================================

# API 1: 获取所有启动器 (替代 LeanCloud 的 Items 表查询)
@app.route("/api/jsbox/launchers", methods=["GET"])
@log_execution_time
def get_all_launchers():
    conn = get_jsbox_db_conn()
    try:
        # order by updated_at desc 模仿了原脚本的排序逻辑
        launchers = conn.execute("SELECT * FROM launchers ORDER BY updated_at DESC").fetchall()
        # 将结果转换为字典列表
        result = [dict(row) for row in launchers]
        # 为了与 LeanCloud 的返回格式兼容，包裹在 'results' 键下
        return jsonify({"results": result})
    except Exception as e:
        app.logger.error(f"获取所有启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库查询失败"}), 500
    finally:
        conn.close()

# API 2: 获取"我的上传" (根据 device_token 查询)
@app.route("/api/jsbox/my_launchers", methods=["GET"])
@log_execution_time
def get_my_launchers():
    device_token = request.args.get('device_token')
    if not device_token:
        return jsonify({"error": "缺少 device_token 参数"}), 400
    
    conn = get_jsbox_db_conn()
    try:
        launchers = conn.execute(
            "SELECT * FROM launchers WHERE device_token = ? ORDER BY updated_at DESC",
            (device_token,)
        ).fetchall()
        result = [dict(row) for row in launchers]
        return jsonify({"results": result})
    except Exception as e:
        app.logger.error(f"获取我的启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库查询失败"}), 500
    finally:
        conn.close()

# API 3: 上传一个新的启动器
@app.route("/api/jsbox/launchers", methods=["POST"])
@log_execution_time
def create_launcher():
    data = request.get_json()
    app.logger.info(f"create_launcher 收到: {data}")  # 添加日志
    if not data or not all(k in data for k in ['title', 'url_scheme', 'icon_url', 'device_token']):
        app.logger.warning(f"缺少必要字段，收到的数据: {data}")
        return jsonify({"error": "缺少必要字段"}), 400

    conn = get_jsbox_db_conn()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO launchers (title, url_scheme, icon_url, description, device_token)
            VALUES (?, ?, ?, ?, ?)
            """,
            (data['title'], data['url_scheme'], data['icon_url'], data.get('description'), data['device_token'])
        )
        conn.commit()
        # 返回一个与 LeanCloud 相似的成功响应
        return jsonify({"objectId": cursor.lastrowid, "createdAt": datetime.now().isoformat()}), 201
    except sqlite3.IntegrityError as e:
        # 检查是否是URL Scheme冲突
        if "url_scheme" in str(e).lower() or "unique" in str(e).lower():
            return jsonify({"error": "该 URL Scheme 已存在"}), 409
        else:
            app.logger.error(f"创建启动器时违反完整性约束: {e}")
            return jsonify({"error": "数据违反完整性约束"}), 409
    except Exception as e:
        app.logger.error(f"创建启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库插入失败"}), 500
    finally:
        conn.close()

# API 4: 更新一个启动器 (根据 ID)
@app.route("/api/jsbox/launchers/<int:launcher_id>", methods=["PUT"])
@log_execution_time
def update_launcher(launcher_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "缺少必要字段"}), 400

    conn = get_jsbox_db_conn()
    try:
        cursor = conn.cursor()
        
        # 首先获取当前记录的信息
        current_record = cursor.execute(
            "SELECT title, url_scheme, icon_url, description FROM launchers WHERE id = ?", 
            (launcher_id,)
        ).fetchone()
        
        if not current_record:
            return jsonify({"error": "未找到指定的启动器"}), 404
        
        # 获取新值，如果未提供则使用当前值
        new_title = data.get('title', current_record['title'])
        new_url_scheme = data.get('url_scheme', current_record['url_scheme'])
        new_icon_url = data.get('icon_url', current_record['icon_url'])
        new_description = data.get('description', current_record['description'])
        
        # 检查是否要更新URL Scheme
        current_url_scheme = current_record['url_scheme']
        
        # 如果URL Scheme没有改变，直接更新其他字段
        if new_url_scheme == current_url_scheme:
            cursor.execute(
                """
                UPDATE launchers 
                SET title=?, url_scheme=?, icon_url=?, description=?
                WHERE id=?
                """,
                (new_title, new_url_scheme, new_icon_url, new_description, launcher_id)
            )
        else:
            # 如果URL Scheme改变了，先检查是否与其他记录冲突
            conflict_check = cursor.execute(
                "SELECT id FROM launchers WHERE url_scheme = ? AND id != ?",
                (new_url_scheme, launcher_id)
            ).fetchone()
            
            if conflict_check:
                return jsonify({"error": "该 URL Scheme 已存在"}), 409
                
            # 没有冲突，执行更新
            cursor.execute(
                """
                UPDATE launchers 
                SET title=?, url_scheme=?, icon_url=?, description=?
                WHERE id=?
                """,
                (new_title, new_url_scheme, new_icon_url, new_description, launcher_id)
            )
        
        conn.commit()
        return jsonify({"message": "更新成功"})
    except sqlite3.IntegrityError as e:
        # 捕获可能的其他完整性错误
        app.logger.error(f"更新启动器时违反完整性约束: {e}")
        return jsonify({"error": "数据违反完整性约束"}), 409
    except Exception as e:
        app.logger.error(f"更新启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库更新失败"}), 500
    finally:
        conn.close()

# API 5: 删除一个启动器 (根据 ID)
@app.route("/api/jsbox/launchers/<int:launcher_id>", methods=["DELETE"])
@log_execution_time
def delete_launcher(launcher_id):
    conn = get_jsbox_db_conn()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM launchers WHERE id = ?", (launcher_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "未找到指定的启动器"}), 404
            
        return jsonify({}), 200  # LeanCloud 删除成功返回空对象和200
    except Exception as e:
        app.logger.error(f"删除启动器失败: {e}", exc_info=True)
        return jsonify({"error": "数据库删除失败"}), 500
    finally:
        conn.close()

@app.route("/health")
def health():
    """健康检查接口"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route("/api/<db_type>", methods=["GET"])
def api_latest_one_day(db_type):
    if db_type not in DB_PATHS:
        return jsonify({"error": f"无效的数据类型: {db_type}"}), 400
    code = request.args.get("code", "").strip()
    if not code:
        return jsonify({"error": "code 参数必须提供"}), 400
    try:
        limit = int(request.args.get("limit", 100))
    except ValueError:
        return jsonify({"error": "limit 参数必须是整数"}), 400
    db_path = DB_PATHS[db_type]
    table, date_col, code_col = LATEST_DATE_FIELDS[db_type]
    prefix = code_prefix(code)
    sql, params = build_latest_sql(db_type, table, date_col, code_col, prefix, limit)
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = gbk_row_factory
        cur = conn.cursor()
        cur.execute(sql, params)
        rows = cur.fetchall()
        columns = [description[0] for description in cur.description]
        meta = {
            "query_type": "latest_day",
            "instrument_pattern": f"{prefix}%",
            "limit": limit,
            "count": len(rows),
            "sql": sql.strip(),
        }
        body = {"meta": meta, "columns": columns, "data": rows}
        return jsonify(body)
    except Exception as e:
        return jsonify({"error": f"数据库查询失败: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/aggregate", methods=["GET"])
def api_aggregate():
    code = request.args.get("code", "").strip().upper()
    if not code:
        return jsonify({"error": "code 参数必须提供"}), 400
    allowed_agg_funcs = ["MAX", "MIN", "AVG", "SUM"]
    agg_func = request.args.get("agg_func", "MAX").upper()
    if agg_func not in allowed_agg_funcs:
        return jsonify(
            {"error": f"不支持的聚合函数: {agg_func}. 可选: {allowed_agg_funcs}"}
        ), 400
    allowed_agg_cols = ["开盘", "最高", "最低", "收盘", "成交量", "成交额"]
    agg_col = request.args.get("agg_col")
    if not agg_col or agg_col not in allowed_agg_cols:
        return jsonify(
            {"error": f"必须提供且有效的聚合字段 (agg_col)，可选: {allowed_agg_cols}"}
        ), 400
    try:
        days = int(request.args.get("days", 10))
    except ValueError:
        return jsonify({"error": "days 参数必须是整数"}), 400
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    end_date_str = end_date.strftime("%Y-%m-%d")
    start_date_str = start_date.strftime("%Y-%m-%d")
    db_path = DB_PATHS["futures"]
    table_name, date_col, code_col = LATEST_DATE_FIELDS["futures"]
    prefix = code_prefix(code)
    pattern = f"{prefix}%"
    sql = f"SELECT {agg_func}(`{agg_col}`) as result FROM `{table_name}` WHERE `{code_col}` LIKE ? AND `{date_col}` BETWEEN ? AND ?"
    params = (pattern, start_date_str, end_date_str)
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cur = conn.execute(sql, params)
        result = cur.fetchone()
        value = result["result"] if result and result["result"] is not None else None
        meta = {
            "query_type": "aggregation",
            "instrument_pattern": pattern,
            "time_period_days": days,
            "start_date": start_date_str,
            "end_date": end_date_str,
            "aggregation_function": agg_func,
            "aggregation_column": agg_col,
            "sql": sql.strip(),
        }
        body = {"meta": meta, "data": {"result": value}}
        return jsonify(body)
    except Exception as e:
        return jsonify({"error": f"数据库查询失败: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/publish", methods=["POST"])
def publish_article():
    logging.info("收到 /api/publish (新) 发布请求。")
    data = request.get_json()
    if not data:
        return jsonify({"error": "请求体必须是JSON格式。"}), 400

    title = data.get("title")
    content_plain = data.get("content")
    content_md = data.get("content_md")
    tags = data.get("tags", datetime.now().strftime("%Y%m"))
    targets = data.get("targets")

    if not all([title, content_plain, content_md]):
        return jsonify(
            {
                "error": "请求必须包含 title, content (纯文本), 和 content_md (Markdown)。"
            }
        ), 400

    results = _execute_publishing_flow(title, content_plain, content_md, tags, targets)
    return jsonify(results), 200

@app.route("/api/toutiaopost", methods=["POST"])
def toutiao_post_proxy_compatible():
    logging.info("收到 /api/toutiaopost (兼容) 发布请求。")
    data = request.get_json()
    if not data:
        return jsonify({"error": "请求体必须是JSON格式。"}), 400

    title = data.get("title")
    content_plain = data.get("content")

    if not all([title, content_plain]):
        return jsonify({"error": "标题和内容是必填项。"}), 400

    content_md = data.get("content_md", content_plain)
    tags = data.get("tags", datetime.now().strftime("%Y%m"))
    results = _execute_publishing_flow(title, content_plain, content_md, tags)
    toutiao_result = results.get("toutiao", {})
    toutiao_status = toutiao_result.get("status")

    if toutiao_status == "success":
        logging.info("兼容接口：头条发布成功，返回头条响应。")
        return jsonify(toutiao_result.get("response", {})), 200
    elif toutiao_status == "skipped":
        logging.warning("兼容接口：头条发布被跳过。")
        return jsonify(
            {"error": "发布失败", "details": toutiao_result.get("message")}
        ), 429
    else:
        logging.error("兼容接口：头条发布失败。")
        return jsonify(
            {"error": "发布失败", "details": toutiao_result.get("message")}
        ), 502

@app.route("/api/zhihu/hot", methods=["GET"])
def api_zhihu_hot():
    try:
        limit = int(request.args.get("limit", 20))
        topics = fetch_zhihu_hot_topics()
        if not topics:
            return jsonify({"error": "未获取到知乎热点话题"}), 404
        sorted_topics = sorted(
            topics,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        return jsonify(
            {
                "status": "success",
                "data": sorted_topics[:limit],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logging.error(f"获取知乎热点话题失败: {str(e)}")
        return jsonify({"error": f"获取知乎热点话题失败: {str(e)}"}), 500

@app.route("/api/zhihu/inspiration", methods=["GET"])
def api_zhihu_inspiration():
    try:
        limit = int(request.args.get("limit", 20))
        questions = fetch_zhihu_inspiration_questions()
        if not questions:
            return jsonify({"error": "未获取到知乎灵感问题"}), 404
        sorted_questions = sorted(
            questions,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        return jsonify(
            {
                "status": "success",
                "data": sorted_questions[:limit],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logging.error(f"获取知乎灵感问题失败: {str(e)}")
        return jsonify({"error": f"获取知乎灵感问题失败: {str(e)}"}), 500

@app.route("/api/zhihu/combined", methods=["GET"])
def api_zhihu_combined():
    try:
        hot_limit = int(request.args.get("hot_limit", 15))
        inspiration_limit = int(request.args.get("inspiration_limit", 15))
        hot_topics = fetch_zhihu_hot_topics()
        inspiration_questions = fetch_zhihu_inspiration_questions()
        sorted_hot_topics = sorted(
            hot_topics,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        sorted_inspiration_questions = sorted(
            inspiration_questions,
            key=lambda x: int(x["hot"]) if str(x["hot"]).isdigit() else 0,
            reverse=True,
        )
        return jsonify(
            {
                "status": "success",
                "hotTopics": sorted_hot_topics[:hot_limit],
                "inspirationQuestions": sorted_inspiration_questions[:inspiration_limit],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logging.error(f"获取知乎综合内容失败: {str(e)}")
        return jsonify(
            {
                "error": f"获取知乎综合内容失败: {str(e)}",
                "hotTopics": get_fallback_topics(),
                "inspirationQuestions": get_fallback_inspiration_questions(),
                "timestamp": datetime.now().isoformat(),
            }
        ), 500

@app.route("/api/etf/summary")
@log_execution_time
def api_etf_summary():
    try:
        etf_data = jsl_etf_data()
        return dataframe_to_json_response(pd.DataFrame(etf_data))
    except Exception as e:
        app.logger.error(f"API /api/etf/summary 出错: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/qhlhb")
@app.route("/api/qhlhb/<date_param>")
def api_lhb_summary(date_param=None):
    conn = None
    try:
        if date_param is None:
            date_param = datetime.now().strftime("%Y%m%d")

        conn = sqlite3.connect(DB_PATHS["qhlhb"], timeout=10, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(tradeDate) FROM dailylhb")
        latest_date = cursor.fetchone()[0]

        query = """
            SELECT 
            tradeDate, futureCompanyName, COUNT(*) as onlist,
            SUM(CASE WHEN positionType = '多' THEN 1 ELSE 0 END) as long_count,
            SUM(CASE WHEN positionType = '空' THEN 1 ELSE 0 END) as short_count,
            CASE WHEN SUM(CASE WHEN positionType = '空' THEN 1 ELSE 0 END) = 0 THEN NULL ELSE ROUND(SUM(CASE WHEN positionType = '多' THEN 1 ELSE 0 END) * 1.0 / SUM(CASE WHEN positionType = '空' THEN 1 ELSE 0 END), 2) END as long_short_ratio,
            SUM(CASE WHEN positionType = '多' THEN num ELSE 0 END) as long_position_sum,
            SUM(CASE WHEN positionType = '空' THEN num ELSE 0 END) as short_position_sum,
            SUM(num) as total_position_sum,
            CASE WHEN SUM(CASE WHEN positionType = '空' THEN num ELSE 0 END) = 0 THEN NULL ELSE ROUND(SUM(CASE WHEN positionType = '多' THEN num ELSE 0 END) * 1.0 / SUM(CASE WHEN positionType = '空' THEN num ELSE 0 END), 2) END as long_short_position_ratio
            FROM dailylhb WHERE tradeDate = ? AND contract <> 'ALL'
            GROUP BY tradeDate, futureCompanyName ORDER BY onlist DESC
        """
        cursor.execute(query, (date_param,))
        data = cursor.fetchall()

        if not data and date_param != latest_date:
            date_param = latest_date
            cursor.execute(query, (date_param,))
            data = cursor.fetchall()

        columns = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(data, columns=columns)
        return dataframe_to_json_response(df)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@app.route("/api/ak/methods")
def api_list_ak_methods():
    try:
        all_attributes = dir(ak)
        methods = [attr for attr in all_attributes if callable(getattr(ak, attr)) and not attr.startswith("_")]
        method_docs = {method: (inspect.getdoc(getattr(ak, method)) or "No documentation available") for method in methods}
        return jsonify({"total_methods": len(methods), "methods": method_docs})
    except Exception as e:
        app.logger.error(f"Error in listing AKShare methods: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/ak/<string:api_name>")
def api_fetch_ak_data(api_name):
    try:
        if not hasattr(ak, api_name):
            return jsonify({"error": f"API '{api_name}' not found"}), 404

        f = getattr(ak, api_name)
        params = request.args.to_dict()
        start_time = time.time()
        app.logger.info(f"开始调用 akshare 方法: {api_name} with params: {params}")
        result = f(**params)
        duration = time.time() - start_time
        app.logger.info(f"完成调用 akshare 方法: {api_name}，耗时: {duration:.2f}秒")

        if isinstance(result, pd.DataFrame):
            return dataframe_to_json_response(result)
        else:
            # 对于非DataFrame的结果，也封装在 'data' 键下
            return jsonify({"data": result})
    except Exception as e:
        app.logger.error(f"Error in {api_name}: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/holding/<date:date>/<company>")
@log_execution_time
def api_get_company_holding(date, company):
    date_str = date.strftime("%Y-%m-%d")
    try:
        positionList, topTwentyPositionSum = get_ths_company_holding(date=date_str, company=company)
        sort_by = request.args.get("sort_by", "空单持仓")
        order = request.args.get("order", "desc")

        if sort_by in positionList.columns:
            positionList = positionList.sort_values(by=sort_by, ascending=(order == "asc"))
        if sort_by in topTwentyPositionSum.columns:
            topTwentyPositionSum = topTwentyPositionSum.sort_values(by=sort_by, ascending=(order == "asc"))

        return jsonify({
            "positionList": positionList.to_dict(orient="records"),
            "topTwentyPositionSum": topTwentyPositionSum.to_dict(orient="records"),
            "company": company,
            "date": date_str,
        })
    except Exception as e:
        return jsonify({"error": f"Failed to get data for {company} on {date_str}: {str(e)}"}), 500

@app.route("/api/hq/index")
@log_execution_time
def api_hq_data_f():
    try:
        data = get_exchange_data(index_type=1)
        return dataframe_to_json_response(data)
    except Exception as e:
        app.logger.error(f"Error in get_exchange_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/hq/main")
@log_execution_time
def api_hq_data_m():
    try:
        data = get_exchange_data(index_type=0)
        return dataframe_to_json_response(data)
    except Exception as e:
        app.logger.error(f"Error in get_exchange_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/basis")
@log_execution_time
def api_get_basis():
    try:
        df = get_ths_basis()
        query = request.args.get("query", "").strip()
        default_only = request.args.get("default_only", "off")

        if query:
            df = df[df["品种"].str.contains(query) | df["现货名"].str.contains(query)]
        if default_only == "on":
            df = df[df["默认"] == "Y"]

        return dataframe_to_json_response(df)
    except Exception as e:
        app.logger.error(f"Error in get_ths_basis: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/stock")
@log_execution_time
def api_get_stock():
    try:
        df = get_ths_stock()
        df = df.drop("market", axis=1)
        df.columns = ["合约名称", "代码", "仓单量", "变化", "变化率", "折期货手数", "更新时间"]
        df = df.sort_values(by="折期货手数", ascending=False)

        query = request.args.get("query", "")
        default_only = request.args.get("default_only", "off")

        if query:
            df = df[(df["合约名称"].str.contains(query)) | (df["代码"].str.contains(query))]
        if default_only == "on":
            df["更新时间"] = pd.to_datetime(df["更新时间"]).dt.date
            current_date = datetime.now().date()
            yesterday_date = (datetime.now() - timedelta(1)).date()
            df_today = df[df["更新时间"] == current_date]
            df = df_today if not df_today.empty else df[df["更新时间"] == yesterday_date]

        return dataframe_to_json_response(df)
    except Exception as e:
        app.logger.error(f"Error in get_ths_stock: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/trading/<variety>/<contract>/<company>")
@log_execution_time
def api_get_trading(variety, contract, company):
    try:
        (df_company_position_list, _, _, _, df_profit_detail_list) = get_ths_trading(variety=variety, contract=contract, company=company)
        df_company_position_list["品种"] = df_company_position_list["品种"].map(CODE_MAP)
        profit_data = df_profit_detail_list.drop("品种名称", axis=1).to_dict(orient="records") if not df_profit_detail_list.empty else {"error": "无盈亏数据"}

        return jsonify({
            "companyPositionList": df_company_position_list.to_dict(orient="records"),
            "profitDetailList": profit_data,
            "company": company,
            "variety": variety,
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_trading: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/main_force/<company>/<date:date>")
@log_execution_time
def api_get_main_force(company, date):
    try:
        variety_position_list, main_force_trend_list = get_ths_main_force(company=company, date=date.strftime("%Y-%m-%d"))
        sort_by = request.args.get("sort_by", "交易日")
        order = request.args.get("order", "desc")

        if sort_by in variety_position_list.columns:
            variety_position_list = variety_position_list.sort_values(by=sort_by, ascending=(order == "asc"))
        if sort_by in main_force_trend_list.columns:
            main_force_trend_list = main_force_trend_list.sort_values(by=sort_by, ascending=(order == "asc"))

        return jsonify({
            "varietyPositionList": variety_position_list.to_dict(orient="records"),
            "mainForceTrendList": main_force_trend_list.to_dict(orient="records"),
            "company": company,
            "date": date.strftime("%Y-%m-%d"),
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_main_force: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/ranking/<variety>/<contract>/<date:date>")
@log_execution_time
def api_get_position_ranking(variety, contract, date):
    date_str = date.strftime("%Y-%m-%d")
    try:
        positionList_df, topTwentyPositionSum_df = get_ths_position_ranking(variety, contract, date_str)
        if float(topTwentyPositionSum_df["多空比"].iloc[0]) > 1:
            default_column_name = "多单持仓"
        else:
            default_column_name = "空单持仓"
        sort_by = request.args.get("sort_by", default_column_name)
        order = request.args.get("order", "desc")

        if sort_by in positionList_df.columns:
            positionList_df = positionList_df.sort_values(by=sort_by, ascending=(order == "asc"))
        positionList_df["品种"] = positionList_df["品种"].map(CODE_MAP)

        return jsonify({
            "positionList": positionList_df.to_dict(orient="records"),
            "topTwentyPositionSum": topTwentyPositionSum_df.to_dict(orient="records"),
            "variety": variety.upper(),
            "date": date.strftime("%Y年%m月%d日"),
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_position_ranking: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/profit/<company>/<variety>/<type_>/<date:start_date>/<date:end_date>")
@log_execution_time
def api_get_profit(company, variety, type_, start_date, end_date):
    try:
        df = get_ths_profit(company=company, variety=variety, type_=type_, start_date=start_date.strftime("%Y-%m-%d"), end_date=end_date.strftime("%Y-%m-%d"))
        sort_by = request.args.get("sort_by", "日盈亏")
        order = request.args.get("order", "desc")

        if sort_by in df.columns:
            df = df.sort_values(by=sort_by, ascending=(order == "asc"))

        return jsonify({
            "profitData": df.to_dict(orient="records"),
            "company": company,
            "variety": variety,
            "type": type_,
            "startDate": start_date.strftime("%Y-%m-%d"),
            "endDate": end_date.strftime("%Y-%m-%d"),
        })
    except Exception as e:
        app.logger.error(f"Error in get_ths_profit: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/klines")
@app.route("/api/klines/<date_param>")
@app.route("/api/klines/<date_param>/<code>")
def api_get_kline_data(date_param=None, code=None):
    conn = None
    try:
        if date_param is None:
            date_param = datetime.now().strftime("%Y%m%d")

        conn = sqlite3.connect(DB_PATHS["klines"], timeout=10, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT date(timestamp) FROM minute_klines ORDER BY timestamp DESC LIMIT 1")
        latest_date_row = cursor.fetchone()
        latest_date = latest_date_row[0] if latest_date_row else date_param

        conditions = ["date(timestamp) = ?"]
        params = [date_param]
        if code:
            conditions.append("code = ?")
            params.append(code.lower())

        query = f"SELECT timestamp, code, open, close, high, low, volume, amount, average, update_time FROM minute_klines WHERE {' AND '.join(conditions)} ORDER BY timestamp ASC, code ASC"
        cursor.execute(query, params)
        data = cursor.fetchall()

        if not data and date_param != latest_date:
            params[0] = latest_date
            cursor.execute(query, params)
            data = cursor.fetchall()
            date_param = latest_date

        columns = [desc[0] for desc in cursor.description]
        df = pd.DataFrame(data, columns=columns)
        return dataframe_to_json_response(df)
    except Exception as e:
        app.logger.error(f"Error in get_kline_data: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# --- 推送服务 API 路由 ---
@app.route("/push/vapid-public-key", methods=["GET"])
def get_vapid_public_key():
    """获取VAPID公钥"""
    if not VAPID_PUBLIC_KEY:
        return jsonify({"error": "VAPID公钥未配置"}), 500
    return jsonify({"publicKey": VAPID_PUBLIC_KEY})

@app.route("/push/debug")
def debug_push_config():
    """调试推送配置"""
    return jsonify({
        "push_api_key": PUSH_API_KEY,
        "env_push_api_key": os.environ.get("PUSH_API_KEY", "未设置"),
        "vapid_private_key_configured": bool(VAPID_PRIVATE_KEY),
        "vapid_public_key_configured": bool(VAPID_PUBLIC_KEY)
    })

# 在你的 data_api.py 文件中

@app.route('/push/send', methods=['POST'])
def send_push_notification():
    # --- START TEMPORARY DEBUG LOGGING ---
    app.logger.info("--- 收到 /push/send 推送请求 ---")
    app.logger.info(f"请求头 (Request Headers): {request.headers}")
    auth_header = request.headers.get('Authorization')
    app.logger.info(f"收到的 Authorization Header: {auth_header}")
    app.logger.info(f"服务器期望的 PUSH_API_KEY: '{PUSH_API_KEY}'")
    # --- END TEMPORARY DEBUG LOGGING ---

    # 1. 验证 Authorization Header
    if not auth_header or not auth_header.startswith('Bearer '):
        app.logger.warning(f"推送请求缺少或格式错误的 Authorization Header，认证失败。")
        return jsonify({"error": "未授权"}), 401

    # 提取 token，注意去除 'Bearer ' 前缀
    token = auth_header.split(' ')[1]
    
    # 比较收到的 token 和期望的 key
    if token != PUSH_API_KEY:
        app.logger.warning(f"推送请求的 Token 无效. 收到: '{token}', 期望: '{PUSH_API_KEY}'。认证失败。")
        return jsonify({"error": "未授权"}), 401
    
    app.logger.info("✅ Authorization Token 验证通过。")

    # 2. 获取请求数据 (后续逻辑保持不变)
    data = request.get_json()
    if not data or 'subscription' not in data or 'payload' not in data:
        app.logger.error(f"推送请求缺少必要参数: {data}")
        return jsonify({"error": "请求参数不完整"}), 400

    subscription_info = data['subscription']
    payload = json.dumps(data['payload'])
    ttl = data.get('ttl', 86400)

    app.logger.info(f"准备向 endpoint 发送推送: {subscription_info.get('endpoint', 'N/A')}")

    if not VAPID_PRIVATE_KEY:
        app.logger.error("VAPID_PRIVATE_KEY 未在环境变量中配置！")
        return jsonify({"error": "服务器VAPID密钥未配置"}), 500

    # 3. 调用 pywebpush 发送
    try:
        webpush(
            subscription_info=subscription_info,
            data=payload,
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS.copy(),
            ttl=ttl
        )
        app.logger.info(f"✅ 成功向 endpoint 发送推送")
        return jsonify({"success": True, "message": "推送已发送"}), 200
    except WebPushException as ex:
        app.logger.error(f"❌ WebPush 发送失败: {ex}")
        if ex.response and ex.response.text:
             # 打印推送服务返回的原始错误信息，非常有用！
            app.logger.error(f"推送服务返回的原始错误: {ex.response.text}")
            try:
                error_details = ex.response.json()
                return jsonify({"error": "推送服务拒绝", "details": error_details}), 410
            except json.JSONDecodeError:
                return jsonify({"error": "推送服务拒绝", "details": ex.response.text}), 410
        return jsonify({"error": str(ex)}), 500
    except Exception as e:
        app.logger.error(f"❌ 发送推送时发生未知错误: {e}", exc_info=True)
        return jsonify({"error": "内部服务器错误"}), 500


@app.route("/api/users/<room_name>/push/subscribe", methods=["POST"])
def register_push_subscription(room_name):
    """注册推送订阅"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体必须是JSON格式"}), 400
        
        username = data.get('username')
        subscription = data.get('subscription')
        
        if not username or not subscription:
            return jsonify({"error": "username和subscription参数必须提供"}), 400
        
        # 保存订阅信息到数据库
        conn = sqlite3.connect('qhlhb.db', timeout=10)
        cursor = conn.cursor()
        
        # 创建推送订阅表（如果不存在）
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                room_name TEXT NOT NULL,
                subscription TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(username, room_name)
            )
        ''')
        
        # 插入或更新订阅
        cursor.execute('''
            INSERT OR REPLACE INTO push_subscriptions (username, room_name, subscription)
            VALUES (?, ?, ?)
        ''', (username, room_name, json.dumps(subscription)))
        
        conn.commit()
        conn.close()
        
        app.logger.info(f"用户 {username} 在房间 {room_name} 的推送订阅已注册")
        return jsonify({"success": True, "message": "推送订阅已注册"})
        
    except Exception as e:
        app.logger.error(f"注册推送订阅时发生错误: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/<room_name>/push/unregister", methods=["POST"])
def unregister_push_subscription(room_name):
    """注销推送订阅"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体必须是JSON格式"}), 400
        
        username = data.get('username')
        if not username:
            return jsonify({"error": "username参数必须提供"}), 400
        
        conn = sqlite3.connect('qhlhb.db', timeout=10)
        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM push_subscriptions WHERE username = ? AND room_name = ?
        ''', (username, room_name))
        conn.commit()
        conn.close()
        
        app.logger.info(f"用户 {username} 在房间 {room_name} 的推送订阅已注销")
        return jsonify({"success": True, "message": "推送订阅已注销"})
        
    except Exception as e:
        app.logger.error(f"注销推送订阅时发生错误: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/api/users/<room_name>/push/offline", methods=["GET"])
def get_offline_push_users(room_name):
    """获取离线用户列表（用于推送通知）"""
    try:
        conn = sqlite3.connect('qhlhb.db', timeout=10)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT username, subscription FROM push_subscriptions
            WHERE room_name = ?
        ''', (room_name,))
        
        users = []
        for row in cursor.fetchall():
            try:
                subscription = json.loads(row['subscription'])
                users.append({
                    "username": row['username'],
                    "subscription": subscription
                })
            except json.JSONDecodeError:
                app.logger.warning(f"用户 {row['username']} 的订阅数据格式错误")
                continue
        
        conn.close()
        
        return jsonify({"users": users})
        
    except Exception as e:
        app.logger.error(f"获取离线用户列表时发生错误: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


from flask import make_response
import xmltodict
from WXBizMsgCrypt import WXBizMsgCrypt

# 企业微信回调配置（务必与管理后台一致）
WECHAT_CALLBACK_TOKEN = os.getenv("WECHAT_CALLBACK_TOKEN", "WeChatTestToken123")
WECHAT_CALLBACK_AES_KEY = os.getenv("WECHAT_CALLBACK_AES_KEY", "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG")
WECHAT_CORP_ID = os.getenv("WECHAT_CORP_ID", None)  # 推荐从环境变量设置
WECHAT_CALLBACK_MODE = os.getenv("WECHAT_CALLBACK_MODE", "aes").lower()

from wechat import WeChat
wechat_client = WeChat()
if not WECHAT_CORP_ID:
    WECHAT_CORP_ID = getattr(wechat_client, "_corpid", None)

def _wxcpt():
    return WXBizMsgCrypt(WECHAT_CALLBACK_TOKEN, WECHAT_CALLBACK_AES_KEY, WECHAT_CORP_ID or "")

def _encrypt_if_needed(text: str, timestamp: str, nonce: str):
    if WECHAT_CALLBACK_MODE == "aes":
        ret, sEncryptMsg = _wxcpt().EncryptMsg(text, timestamp, nonce)
        if ret != 0:
            app.logger.error(f"EncryptMsg 失败 ret={ret}，返回明文 success")
            resp = make_response("success", 200)
            resp.headers["Content-Type"] = "text/plain; charset=utf-8"
            return resp
        resp = make_response(sEncryptMsg, 200)
        resp.headers["Content-Type"] = "application/xml; charset=utf-8"
        return resp
    else:
        resp = make_response(text, 200)
        resp.headers["Content-Type"] = "text/plain; charset=utf-8"
        return resp

def handle_template_card_event(event_dict: dict):
    try:
        from_user = event_dict.get("FromUserName")
        agent_id = event_dict.get("AgentID") or getattr(wechat_client, "_agentid", None)
        response_code = event_dict.get("ResponseCode")
        task_id = event_dict.get("TaskId")
        event_key = event_dict.get("EventKey")

        app.logger.info(f"模板卡片事件: from={from_user}, agent={agent_id}, task={task_id}, event_key={event_key}, response_code={response_code}")
        if not response_code:
            return

        replace_card_payload = {
            "agentid": agent_id,
            "response_code": response_code,
            "replace_card": {
                "card_type": "text_notice",
                "main_title": {"title": f"“{event_key or '操作'}”已响应", "desc": f"任务ID: {task_id}"},
                "horizontal_content_list": [
                    {"keyname": "响应时间", "value": datetime.now().strftime('%Y-%m-%d %H:%M:%S')},
                    {"keyname": "操作按钮", "value": event_key or "-"}
                ],
                "card_action": {"type": 0}
            }
        }
        wechat_client.updateTemplateCard(replace_card_payload)
    except Exception as e:
        app.logger.error(f"处理模板卡片事件异常: {e}", exc_info=True)

@app.route('/wechat/callback', methods=['GET', 'POST', 'HEAD'])
def wechat_callback():
    msg_signature = request.args.get("msg_signature", "")
    timestamp = request.args.get("timestamp", "")
    nonce = request.args.get("nonce", "")

    # 0) HEAD 探测：直接 200
    if request.method == "HEAD":
        return make_response("", 200)

    # 1) URL 验证（GET + 带签名参数）
    if request.method == 'GET':
        echostr = request.args.get('echostr', "")
        # 无参数 GET：作为连通性探测，返回 200/ok，避免后台保存时报 -30065
        if not (msg_signature and timestamp and nonce and echostr):
            return make_response("ok", 200)
        ret, sEchoStr = _wxcpt().VerifyURL(msg_signature, timestamp, nonce, echostr)
        app.logger.info(f"VerifyURL ret={ret}")
        if ret != 0:
            return make_response("validation failed", 401)
        resp = make_response(sEchoStr, 200)
        resp.headers["Content-Type"] = "text/plain; charset=utf-8"
        return resp

    # 2) 事件与消息（POST）
    try:
        raw = request.data  # bytes
        if WECHAT_CALLBACK_MODE == "aes":
            ret, sMsg = _wxcpt().DecryptMsg(raw, msg_signature, timestamp, nonce)
            app.logger.info(f"DecryptMsg ret={ret}")
            if ret != 0:
                # 返回加密或明文的 success，避免重试
                return _encrypt_if_needed("success", timestamp or str(int(time.time())), nonce or "nonce")
            xml_str = sMsg
        else:
            xml_str = raw.decode("utf-8", errors="ignore")

        data = xmltodict.parse(xml_str).get("xml", {}) or {}
        app.logger.info(f"回调解析: {json.dumps(data, ensure_ascii=False)}")

        msg_type = (data.get("MsgType") or "").lower()
        event = (data.get("Event") or "").lower()
        if msg_type == "event" and event == "template_card_event":
            handle_template_card_event(data)
        # 其他事件按需处理...

    except Exception as e:
        app.logger.error(f"POST 回调处理异常: {e}", exc_info=True)

    # 按规范返回 success（加密模式需加密XML）
    return _encrypt_if_needed("success", timestamp or str(int(time.time())), nonce or "nonce")


@app.route('/weixinpush', methods=['POST'])
def weixin_push():
    """
    微信推送接口，支持各类通知的发送
    请求体 JSON 格式：
    {
        "msgtype": "text",  // 支持: text, image, image_file, news, mpnews, task_card, template_card
        "content": "消息内容",  // text类型时必需
        "media_id": "MEDIA_ID",  // image类型时必需
        "file_name": "/path/to/image.jpg",  // image_file类型时必需
        "articles": [...],  // news和mpnews类型时必需
        "template_card": {...},  // template_card类型时必需
        "task_card": {...},  // task_card类型时必需
        "to_user": "@all"  // 可选，指定接收用户，默认为@all
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "请求体必须是JSON格式"}), 400

        msgtype = data.get("msgtype")
        if not msgtype:
            return jsonify({"error": "缺少msgtype参数"}), 400

        to_user = data.get("to_user", "@all")

        # 确保wechat_client已初始化
        if not hasattr(wechat_client, 'sendMsg'):
            return jsonify({"error": "微信客户端未正确初始化"}), 500

        # 根据消息类型发送不同类型的推送
        if msgtype == "text":
            content = data.get("content")
            if not content:
                return jsonify({"error": "发送文本消息时content参数不能为空"}), 400
            
            success = wechat_client.sendMsg(content, to_user)
            if success:
                return jsonify({"status": "success", "message": "文本消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "文本消息发送失败"}), 500

        elif msgtype == "image":
            media_id = data.get("media_id")
            if not media_id:
                return jsonify({"error": "发送图片消息时media_id参数不能为空"}), 400
            
            success = wechat_client.sendPicture(media_id, to_user)
            if success:
                return jsonify({"status": "success", "message": "图片消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "图片消息发送失败"}), 500

        elif msgtype == "image_file":
            file_name = data.get("file_name")
            if not file_name:
                return jsonify({"error": "发送图片文件时file_name参数不能为空"}), 400
            
            success = wechat_client.sendPictureFile(file_name, to_user)
            if success:
                return jsonify({"status": "success", "message": "图片文件发送成功"})
            else:
                return jsonify({"status": "error", "message": "图片文件发送失败"}), 500

        elif msgtype == "news":
            articles = data.get("articles")
            if not articles:
                return jsonify({"error": "发送图文消息时articles参数不能为空"}), 400
            
            success = wechat_client.sendNews(articles, to_user)
            if success:
                return jsonify({"status": "success", "message": "图文消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "图文消息发送失败"}), 500

        elif msgtype == "mpnews":
            articles = data.get("articles")
            if not articles:
                return jsonify({"error": "发送富图文消息时articles参数不能为空"}), 400
            
            success = wechat_client.sendMpNews(articles, to_user)
            if success:
                return jsonify({"status": "success", "message": "富图文消息发送成功"})
            else:
                return jsonify({"status": "error", "message": "富图文消息发送失败"}), 500

        elif msgtype == "task_card":
            task_card = data.get("task_card")
            if not task_card:
                return jsonify({"error": "发送任务卡片时task_card参数不能为空"}), 400
            
            # 提取任务卡片参数
            title = task_card.get("title", "任务标题")
            desc = task_card.get("desc", "任务描述")
            content_list = task_card.get("content_list")
            task_id = task_card.get("task_id")
            command_str = task_card.get("command_str", "")
            button_selection_dict = task_card.get("button_selection_dict")
            button_list = task_card.get("button_list")
            
            success = wechat_client.sendTaskCard(
                title=title,
                desc=desc,
                content_list=content_list,
                task_id=task_id,
                to_user=to_user,
                command_str=command_str,
                button_selection_dict=button_selection_dict,
                button_list=button_list
            )
            if success:
                return jsonify({"status": "success", "message": "任务卡片发送成功"})
            else:
                return jsonify({"status": "error", "message": "任务卡片发送失败"}), 500

        elif msgtype == "template_card":
            template_card = data.get("template_card")
            if not template_card:
                return jsonify({"error": "发送模板卡片时template_card参数不能为空"}), 400
            
            card_type = template_card.get("card_type", "text_notice")
            
            success = wechat_client.sendTemplateCard(
                card_type,
                to_user,
                **{k: v for k, v in template_card.items() if k != "card_type"}
            )
            if success:
                return jsonify({"status": "success", "message": "模板卡片发送成功"})
            else:
                return jsonify({"status": "error", "message": "模板卡片发送失败"}), 500

        else:
            return jsonify({"error": f"不支持的消息类型: {msgtype}"}), 400

    except Exception as e:
        app.logger.error(f"微信推送接口异常: {e}", exc_info=True)
        return jsonify({"error": f"服务器内部错误: {str(e)}"}), 500


# =====================================================================
# --- 6. YouTube Music API 路由 ---
# =====================================================================


@app.route('/youtubeapi/search/song', methods=['GET'])
@log_execution_time
def youtube_search_song():
    """搜索歌曲接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词 (参数: q)'}), 400
    
    if limit < 1 or limit > 50:
        return jsonify({'success': False, 'error': 'limit 参数必须在 1-50 之间'}), 400
    
    try:
        result = search_song(query, limit)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 搜索歌曲失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/search/artist', methods=['GET'])
@log_execution_time
def youtube_search_artist():
    """搜索艺术家接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词 (参数: q)'}), 400
    
    if limit < 1 or limit > 50:
        return jsonify({'success': False, 'error': 'limit 参数必须在 1-50 之间'}), 400
    
    try:
        result = search_artist(query, limit)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 搜索艺术家失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/artist/<channel_id>', methods=['GET'])
@log_execution_time
def youtube_get_artist(channel_id):
    """获取艺术家详细信息接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    try:
        result = get_artist_info(channel_id)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 获取艺术家信息失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/lyrics/<video_id>', methods=['GET'])
@log_execution_time
def youtube_get_lyrics(video_id):
    """获取歌词接口"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    try:
        result = get_lyrics(video_id)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 获取歌词失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/youtubeapi/song/<video_id>', methods=['GET'])
@log_execution_time
def youtube_get_song_details(video_id):
    """获取歌曲完整信息接口（包括歌词）"""
    if not YOUTUBE_SERVICE_AVAILABLE:
        return jsonify({'success': False, 'error': 'YouTube Music 服务不可用'}), 503
    
    try:
        result = get_song_details(video_id)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"YouTube 获取歌曲详情失败: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


# --- 7. 启动入口 ---
if __name__ == "__main__":
    try:
        update_zhihu_headers()
    except Exception as e:
        app.logger.warning(f"启动时更新知乎头信息失败: {e}")

    if not VAPID_PRIVATE_KEY or not VAPID_PUBLIC_KEY:
        app.logger.warning("⚠️ 缺少 VAPID 密钥配置. 推送服务可能无法正常工作")
    else:
        app.logger.info("✅ VAPID 密钥配置已加载")
    
    app.logger.info("数据API服务启动 (最终完整修复版，含Web推送服务和微信回调)")
    app.run(host="0.0.0.0", port=5000, debug=False)

```

---

## youtube/flask_example.py

```python
"""
Flask 接口使用示例
"""
from flask import Flask, jsonify, request
from youtube_service import search_song, search_artist, get_artist_info, get_lyrics, get_song_details

app = Flask(__name__)


@app.route('/api/music/search/song', methods=['GET'])
def api_search_song():
    """搜索歌曲接口"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词'}), 400
    
    result = search_song(query, limit)
    return jsonify(result)


@app.route('/api/music/search/artist', methods=['GET'])
def api_search_artist():
    """搜索艺术家接口"""
    query = request.args.get('q', '')
    limit = request.args.get('limit', 5, type=int)
    
    if not query:
        return jsonify({'success': False, 'error': '缺少搜索关键词'}), 400
    
    result = search_artist(query, limit)
    return jsonify(result)


@app.route('/api/music/artist/<channel_id>', methods=['GET'])
def api_get_artist(channel_id):
    """获取艺术家详细信息接口"""
    result = get_artist_info(channel_id)
    return jsonify(result)


@app.route('/api/music/lyrics/<video_id>', methods=['GET'])
def api_get_lyrics(video_id):
    """获取歌词接口"""
    result = get_lyrics(video_id)
    return jsonify(result)


@app.route('/api/music/song/<video_id>', methods=['GET'])
def api_get_song_details(video_id):
    """获取歌曲完整信息接口"""
    result = get_song_details(video_id)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)

```

---

## youtube/lyrics.py

```python
from ytmusicapi import YTMusic

yt = YTMusic()
video_id = "DYptgVvkVLQ" # 假设这是某首歌的 videoId

# 1. 获取播放相关信息 (watch playlist)
watch_playlist = yt.get_watch_playlist(videoId=video_id)

# 2. 检查是否有歌词
if watch_playlist['lyrics']:
    lyrics_id = watch_playlist['lyrics']
    
    # 3. 获取具体歌词内容
    lyrics_data = yt.get_lyrics(lyrics_id)
    print(lyrics_data['lyrics'])
else:
    print("该歌曲没有提供歌词。")
```

---

## youtube/README.md

```markdown
# YouTube Music API 服务

整合了 YouTube Music API 的 Python 服务模块，可直接用于 Flask 接口。

## 文件说明

- `youtube_service.py` - 核心服务模块
- `data_api.py` - Flask 主应用（已集成 YouTube Music API）
- `flask_example.py` - Flask 接口使用示例
- `youtubeapi.py`, `artist.py`, `lyrics.py` - 原始测试文件（可保留作为参考）

## 安装依赖

```bash
pip install ytmusicapi flask
```

---

## 使用方法

### 方式一：直接调用函数

```python
from youtube_service import search_song, get_lyrics, get_artist_info

# 搜索歌曲
result = search_song("周杰伦 晴天", limit=5)
print(result)

# 获取歌词
lyrics = get_lyrics("DYptgVvkVLQ")
print(lyrics)

# 获取艺术家信息
artist = get_artist_info("UCPC0L1d253x-KuMNwa05TpA")
print(artist)
```

### 方式二：在 Flask 中使用

```python
from flask import Flask, jsonify, request
from youtube_service import search_song, get_lyrics

app = Flask(__name__)

@app.route('/api/search')
def search():
    query = request.args.get('q')
    result = search_song(query)
    return jsonify(result)

@app.route('/api/lyrics/<video_id>')
def lyrics(video_id):
    result = get_lyrics(video_id)
    return jsonify(result)
```

---

## API 函数列表

### `search_song(query, limit=5)`

搜索歌曲

**参数：**

- `query` (str): 搜索关键词
- `limit` (int): 返回结果数量

**返回：**

```python
{
    'success': True,
    'data': [
        {
            'title': '晴天 - Sunny Day',
            'video_id': 'DYptgVvkVLQ',
            'artists': ['Jay Chou'],
            'album': 'Ye Hui Mei',
            'duration': '4:29',
            'thumbnails': [...]
        }
    ]
}
```

### `search_artist(query, limit=5)`

搜索艺术家

**返回：**

```python
{
    'success': True,
    'data': [
        {
            'name': 'Taylor Swift',
            'browse_id': 'UCPC0L1d253x-KuMNwa05TpA',
            'thumbnails': [...]
        }
    ]
}
```

### `get_artist_info(channel_id)`

获取艺术家详细信息

**返回：**

```python
{
    'success': True,
    'data': {
        'name': 'Taylor Swift',
        'description': '...',
        'subscribers': '62.7M',
        'top_songs': [...]
    }
}
```

### `get_lyrics(video_id)`

获取歌词

**返回：**

```python
{
    'success': True,
    'data': {
        'lyrics': '歌词内容...',
        'source': 'LyricFind'
    }
}
```

### `get_song_details(video_id)`

获取歌曲完整信息（包括歌词）

**返回：**

```python
{
    'success': True,
    'data': {
        'video_id': 'DYptgVvkVLQ',
        'title': '晴天',
        'artists': ['Jay Chou'],
        'album': 'Ye Hui Mei',
        'thumbnails': [...],
        'lyrics': {
            'text': '...',
            'source': 'LyricFind'
        }
    }
}
```

---

## 📋 Flask API 接口列表

所有接口都以 `/youtubeapi` 为前缀，与现有的 API 保持一致的命名风格。

### 1. 搜索歌曲

**接口**: `GET /youtubeapi/search/song`

**参数**:

- `q` (必需): 搜索关键词
- `limit` (可选): 返回结果数量，默认 5，范围 1-50

**示例**:

```bash
curl "http://your-server.com/youtubeapi/search/song?q=周杰伦%20晴天&limit=5"
```

**返回格式**:

```json
{
  "success": true,
  "data": [
    {
      "title": "晴天 - Sunny Day",
      "video_id": "DYptgVvkVLQ",
      "artists": ["Jay Chou"],
      "album": "Ye Hui Mei",
      "duration": "4:29",
      "thumbnails": [...]
    }
  ]
}
```

---

### 2. 搜索艺术家

**接口**: `GET /youtubeapi/search/artist`

**参数**:

- `q` (必需): 艺术家名称
- `limit` (可选): 返回结果数量，默认 5，范围 1-50

**示例**:

```bash
curl "http://your-server.com/youtubeapi/search/artist?q=Taylor%20Swift"
```

**返回格式**:

```json
{
  "success": true,
  "data": [
    {
      "name": "Taylor Swift",
      "browse_id": "UCPC0L1d253x-KuMNwa05TpA",
      "thumbnails": [...]
    }
  ]
}
```

---

### 3. 获取艺术家详细信息

**接口**: `GET /youtubeapi/artist/<channel_id>`

**路径参数**:

- `channel_id`: 艺术家的 Channel ID / Browse ID

**示例**:

```bash
curl "http://your-server.com/youtubeapi/artist/UCPC0L1d253x-KuMNwa05TpA"
```

**返回格式**:

```json
{
  "success": true,
  "data": {
    "name": "Taylor Swift",
    "description": "...",
    "subscribers": "62.7M",
    "thumbnails": [...],
    "top_songs": [
      {
        "title": "Blank Space",
        "video_id": "e-ORhEE9VVg",
        "thumbnails": [...]
      }
    ]
  }
}
```

---

### 4. 获取歌词

**接口**: `GET /youtubeapi/lyrics/<video_id>`

**路径参数**:

- `video_id`: 歌曲的 Video ID

**示例**:

```bash
curl "http://your-server.com/youtubeapi/lyrics/DYptgVvkVLQ"
```

**返回格式**:

```json
{
  "success": true,
  "data": {
    "lyrics": "歌词内容...",
    "source": "LyricFind"
  }
}
```

**注意**: 如果歌曲没有歌词，返回:

```json
{
  "success": false,
  "error": "该歌曲没有提供歌词"
}
```

---

### 5. 获取歌曲完整信息

**接口**: `GET /youtubeapi/song/<video_id>`

**路径参数**:

- `video_id`: 歌曲的 Video ID

**示例**:

```bash
curl "http://your-server.com/youtubeapi/song/DYptgVvkVLQ"
```

**返回格式**:

```json
{
  "success": true,
  "data": {
    "video_id": "DYptgVvkVLQ",
    "title": "晴天",
    "artists": ["Jay Chou"],
    "album": "Ye Hui Mei",
    "thumbnails": [...],
    "lyrics": {
      "text": "...",
      "source": "LyricFind"
    }
  }
}
```

---

## 🔧 部署说明

### 1. 确保依赖已安装

```bash
pip install ytmusicapi
```

### 2. 文件结构

确保以下文件在同一目录：

```
music/youtube/
├── data_api.py          # 主 Flask 应用（已集成 YouTube Music API）
├── youtube_service.py   # YouTube Music 服务模块
└── ...
```

### 3. 启动服务

```bash
python data_api.py
```

启动时会看到日志：

- ✅ `YouTube Music 服务已加载` - 表示集成成功
- ⚠️ `YouTube Music 服务不可用` - 表示 `youtube_service.py` 未找到

---

## 🛡️ 错误处理

所有接口都遵循统一的错误格式：

**成功响应**:

```json
{"success": true, "data": {...}}
```

**失败响应**:

```json
{ "success": false, "error": "错误描述" }
```

**HTTP 状态码**:

- `200` - 成功
- `400` - 请求参数错误
- `500` - 服务器内部错误
- `503` - YouTube Music 服务不可用

---

## 📊 日志记录

所有接口都使用了 `@log_execution_time` 装饰器，会自动记录：

- 接口调用时间
- 执行耗时
- 错误堆栈（如果发生）

日志会写入 `data_api.log` 文件。

---

## 🧪 测试示例

### Python 测试

```python
import requests

# 搜索歌曲
response = requests.get('http://localhost:5000/youtubeapi/search/song',
                       params={'q': '周杰伦 晴天', 'limit': 3})
print(response.json())

# 获取歌词
response = requests.get('http://localhost:5000/youtubeapi/lyrics/DYptgVvkVLQ')
print(response.json())
```

### JavaScript 测试

```javascript
// 搜索艺术家
fetch("http://localhost:5000/youtubeapi/search/artist?q=Taylor Swift")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 🔗 与现有 API 的集成

这些新接口与现有的 API 完美集成：

- 使用相同的 Flask app 实例
- 遵循相同的 JSON 响应格式
- 使用相同的日志系统
- 支持 CORS（已配置）

你可以在前端统一调用，无需额外配置。

---

## 📝 测试输出示例

### 搜索歌曲测试

```
歌名: 晴天 - Sunny Day
Video ID: DYptgVvkVLQ
艺术家: Jay Chou
```

### 搜索艺术家测试

```
艺术家: Taylor Swift
描述: And, baby, that's show business for you. New album The Life of a Showgirl. Out October 3  ❤️‍🔥
订阅数: 62.7M
 
热门歌曲:
- The Fate of Ophelia
- Opalite
- Blank Space
- Shake It Off
- Cruel Summer
```

---

## Flask 示例接口

运行 `flask_example.py` 后，可访问以下接口：

- `GET /api/music/search/song?q=周杰伦&limit=5` - 搜索歌曲
- `GET /api/music/search/artist?q=Taylor Swift` - 搜索艺术家
- `GET /api/music/artist/<channel_id>` - 获取艺术家信息
- `GET /api/music/lyrics/<video_id>` - 获取歌词
- `GET /api/music/song/<video_id>` - 获取歌曲完整信息

```

---

## youtube/test_halfscreen.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Half Screen Modal Test</title>
    <style>
        :root {
            --primary: #1db954;
            --primary-dark: #1aa34a;
            --accent: #ff6b6b;
            --bg: #0a0a0a;
            --card: #161616;
            --card-hover: #1f1f1f;
            --text: #ffffff;
            --text-secondary: #a0a0a0;
            --glass: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            padding: 20px;
        }

        .test-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }
    </style>
</head>
<body>
    <h1>Half Screen Modal Test</h1>
    <p>This tests the half-screen modal implementation for YouTube links</p>
    
    <button class="test-btn" onclick="openJumpLink('Test Song', 'Test Artist')">Test Half Screen Modal</button>
    <button class="test-btn" onclick="closeHalfScreenModal()">Close Modal (if open)</button>
    
    <script>
        // 打开跳转链接，使用标题和作者作为查询参数
        function openJumpLink(trackName, artistName) {
            // 组合标题和作者，用空格分隔
            const query = `${trackName} ${artistName}`;
            // 创建目标URL，使用提供的格式
            const jumpUrl = `https://wealth.want.biz/pages/youtubeMusic.html?query=${encodeURIComponent(query)}`;
            
            // 检查是否已存在半屏模态框，如果存在则移除
            const existingModal = document.querySelector('.half-screen-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // 创建半屏模态框
            const modal = document.createElement('div');
            modal.className = 'half-screen-modal';
            modal.innerHTML = `
                <div class="modal-overlay" onclick="closeHalfScreenModal()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="modal-drag-bar"></div>
                        <div class="modal-actions">
                            <button class="modal-close-btn" onclick="closeHalfScreenModal()">✕</button>
                        </div>
                    </div>
                    <div class="modal-iframe">Would show: ${jumpUrl}</div>
                </div>
            `;
            
            // 添加模态框样式（如果尚未添加）
            if (!document.querySelector('#half-screen-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'half-screen-modal-styles';
                styles.textContent = `
                    .half-screen-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 10000;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .modal-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.6);
                        z-index: 1;
                        opacity: 0;
                        animation: fadeIn 0.3s ease forwards;
                    }
                    
                    .modal-content {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 50vh;
                        background: var(--bg);
                        border-top-left-radius: 20px;
                        border-top-right-radius: 20px;
                        z-index: 2;
                        transform: translateY(100%);
                        animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                    }
                    
                    .modal-header {
                        padding: 12px 16px 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        position: relative;
                        z-index: 3;
                        background: var(--bg);
                        border-bottom: 1px solid var(--glass-border);
                    }
                    
                    .modal-drag-bar {
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40px;
                        height: 4px;
                        background: var(--text-secondary);
                        border-radius: 2px;
                    }
                    
                    .modal-actions {
                        display: flex;
                        gap: 8px;
                        z-index: 4;
                    }
                    
                    .modal-close-btn {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: var(--glass);
                        border: 1px solid var(--glass-border);
                        color: var(--text);
                        font-size: 18px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                    }
                    
                    .modal-close-btn:hover {
                        background: var(--glass-border);
                        transform: scale(1.1);
                    }
                    
                    .modal-iframe {
                        flex: 1;
                        border: none;
                        width: 100%;
                        height: calc(100% - 60px);
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        background: #1a1a1a;
                        color: white;
                    }
                    
                    @keyframes slideUp {
                        from {
                            transform: translateY(100%);
                        }
                        to {
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    
                    /* 响应式适配 */
                    @media (min-width: 768px) {
                        .modal-content {
                            height: 60vh;
                            max-height: 700px;
                        }
                    }
                `;
                document.head.appendChild(styles);
            }
            
            document.body.appendChild(modal);
        }
        
        // 关闭半屏模态框
        function closeHalfScreenModal() {
            const modal = document.querySelector('.half-screen-modal');
            if (modal) {
                // 添加关闭动画
                const content = modal.querySelector('.modal-content');
                const overlay = modal.querySelector('.modal-overlay');
                
                content.style.animation = 'slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                content.style.animationDirection = 'reverse';
                
                overlay.style.animation = 'fadeIn 0.3s ease forwards';
                overlay.style.animationDirection = 'reverse';
                
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        }
    </script>
</body>
</html>
```

---

## youtube/youtube_service.py

```python
# 此文件作为youtube服务已经到服务器供data_api使用

from ytmusicapi import YTMusic

class YouTubeMusicService:
    """YouTube Music API 服务类，用于 Flask 接口"""

    def __init__(self):
        self.yt = YTMusic()

    def _get_best_thumbnail(self, thumbnails):
        """
        从缩略图列表中选择最佳质量的缩略图

        Args:
            thumbnails (list): 缩略图列表，每个元素包含 url, width, height

        Returns:
            str: 最佳缩略图的 URL，如果列表为空则返回 None
        """
        if not thumbnails:
            return None

        # Sort by area (width * height) to choose the largest thumbnail
        # This should give us the highest resolution thumbnail available
        best_thumb = max(thumbnails, key=lambda x: x.get('width', 0) * x.get('height', 0))
        return best_thumb.get('url')
    
    def search_song(self, query, limit=5):
        """
        搜索歌曲

        Args:
            query (str): 搜索关键词
            limit (int): 返回结果数量限制

        Returns:
            list: 歌曲信息列表
        """
        try:
            results = self.yt.search(query, filter="songs", limit=limit)
            songs = []

            for item in results:
                video_id = item.get('videoId', '')
                # Select the highest quality thumbnail
                thumbnails = item.get('thumbnails', [])
                best_thumbnail = self._get_best_thumbnail(thumbnails)

                song_info = {
                    'title': item.get('title', ''),
                    'video_id': video_id,
                    'artists': [artist.get('name', '') for artist in item.get('artists', [])],
                    'album': item.get('album', {}).get('name', '') if item.get('album') else '',
                    'duration': item.get('duration', ''),
                    'thumbnails': thumbnails,
                    'thumbnail_url': best_thumbnail,  # Add URL for the best thumbnail
                    # 添加播放链接
                    'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
                    'youtube_music_url': f'https://music.youtube.com/watch?v={video_id}',
                    'embed_url': f'https://www.youtube.com/embed/{video_id}'
                }
                songs.append(song_info)

            return {
                'success': True,
                'data': songs
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def search_artist(self, query, limit=5):
        """
        搜索艺术家
        
        Args:
            query (str): 艺术家名称
            limit (int): 返回结果数量限制
            
        Returns:
            dict: 艺术家信息列表
        """
        try:
            results = self.yt.search(query, filter="artists", limit=limit)
            artists = []
            
            for item in results:
                # Select the highest quality thumbnail
                thumbnails = item.get('thumbnails', [])
                best_thumbnail = self._get_best_thumbnail(thumbnails)

                artist_info = {
                    'name': item.get('artist', ''),
                    'browse_id': item.get('browseId', ''),
                    'thumbnails': thumbnails,
                    'thumbnail_url': best_thumbnail  # Add URL for the best thumbnail
                }
                artists.append(artist_info)

            return {
                'success': True,
                'data': artists
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_artist_info(self, channel_id):
        """
        获取艺术家详细信息

        Args:
            channel_id (str): 艺术家的 Channel ID / Browse ID

        Returns:
            dict: 艺术家详细信息
        """
        try:
            artist_info = self.yt.get_artist(channel_id)

            # 提取热门歌曲
            top_songs = []
            if artist_info.get('songs') and artist_info['songs'].get('results'):
                for song in artist_info['songs']['results'][:10]:  # 限制前10首
                    video_id = song.get('videoId', '')
                    # Select the highest quality thumbnail for the song
                    song_thumbnails = song.get('thumbnails', [])
                    best_song_thumbnail = self._get_best_thumbnail(song_thumbnails)

                    top_songs.append({
                        'title': song.get('title', ''),
                        'video_id': video_id,
                        'thumbnails': song_thumbnails,
                        'thumbnail_url': best_song_thumbnail,  # Add URL for the best thumbnail
                        # 添加播放链接
                        'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
                        'youtube_music_url': f'https://music.youtube.com/watch?v={video_id}'
                    })

            # Select the highest quality thumbnail for the artist
            artist_thumbnails = artist_info.get('thumbnails', [])
            best_artist_thumbnail = self._get_best_thumbnail(artist_thumbnails)

            return {
                'success': True,
                'data': {
                    'name': artist_info.get('name', ''),
                    'description': artist_info.get('description', ''),
                    'subscribers': artist_info.get('subscribers', ''),
                    'thumbnails': artist_thumbnails,
                    'thumbnail_url': best_artist_thumbnail,  # Add URL for the best thumbnail
                    'top_songs': top_songs
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_lyrics(self, video_id):
        """
        获取歌词
        
        Args:
            video_id (str): 歌曲的 Video ID
            
        Returns:
            dict: 歌词信息
        """
        try:
            # 获取播放列表信息
            watch_playlist = self.yt.get_watch_playlist(videoId=video_id)
            
            # 检查是否有歌词
            if watch_playlist.get('lyrics'):
                lyrics_id = watch_playlist['lyrics']
                lyrics_data = self.yt.get_lyrics(lyrics_id)
                
                return {
                    'success': True,
                    'data': {
                        'lyrics': lyrics_data.get('lyrics', ''),
                        'source': lyrics_data.get('source', '')
                    }
                }
            else:
                return {
                    'success': False,
                    'error': '该歌曲没有提供歌词'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_song_details(self, video_id):
        """
        获取歌曲完整信息（包括歌词）
        
        Args:
            video_id (str): 歌曲的 Video ID
            
        Returns:
            dict: 歌曲完整信息
        """
        try:
            # 获取播放列表信息
            watch_playlist = self.yt.get_watch_playlist(videoId=video_id)

            track_info = watch_playlist.get('tracks', [{}])[0]
            # Get thumbnails and select the best one
            thumbnails = track_info.get('thumbnail', [])
            best_thumbnail = self._get_best_thumbnail(thumbnails)

            song_info = {
                'video_id': video_id,
                'title': track_info.get('title', ''),
                'artists': [artist.get('name', '') for artist in track_info.get('artists', [])],
                'album': track_info.get('album', {}).get('name', ''),
                'thumbnails': thumbnails,
                'thumbnail_url': best_thumbnail,  # Add URL for the best thumbnail
                # 添加播放链接
                'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
                'youtube_music_url': f'https://music.youtube.com/watch?v={video_id}',
                'embed_url': f'https://www.youtube.com/embed/{video_id}',
                'lyrics': None
            }
            
            # 尝试获取歌词
            if watch_playlist.get('lyrics'):
                lyrics_id = watch_playlist['lyrics']
                lyrics_data = self.yt.get_lyrics(lyrics_id)
                song_info['lyrics'] = {
                    'text': lyrics_data.get('lyrics', ''),
                    'source': lyrics_data.get('source', '')
                }
            
            return {
                'success': True,
                'data': song_info
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


# 便捷函数，用于直接在 Flask 路由中调用
_service = None

def get_youtube_service():
    """获取 YouTubeMusicService 单例"""
    global _service
    if _service is None:
        _service = YouTubeMusicService()
    return _service


# 导出的便捷函数
def search_song(query, limit=5):
    """搜索歌曲"""
    return get_youtube_service().search_song(query, limit)


def search_artist(query, limit=5):
    """搜索艺术家"""
    return get_youtube_service().search_artist(query, limit)


def get_artist_info(channel_id):
    """获取艺术家详细信息"""
    return get_youtube_service().get_artist_info(channel_id)


def get_lyrics(video_id):
    """获取歌词"""
    return get_youtube_service().get_lyrics(video_id)


def get_song_details(video_id):
    """获取歌曲完整信息"""
    return get_youtube_service().get_song_details(video_id)

```

---

## youtube/youtubeapi.py

```python
from ytmusicapi import YTMusic

yt = YTMusic()

# 搜索关键词
query = "周杰伦 晴天"
results = yt.search(query)

# 打印第一个结果的信息
if results:
    first_song = results[0]
    print(f"歌名: {first_song['title']}")
    print(f"Video ID: {first_song['videoId']}") # 这个 ID 很重要，后续操作都用它
    print(f"艺术家: {first_song['artists'][0]['name']}")
    # print(f"专辑: {first_song['album']['name']}")

# 专门搜索特定类型 (songs, videos, albums, artists, playlists)
artist_results = yt.search("Taylor Swift", filter="artists")
print(artist_results)
```

---

## YouTubePlayerManager.js

```javascript
class YouTubePlayerManager {
    constructor() {
        this.apiReadyPromise = null;
        this.player = null;
        this.state = {
            isYouTubePlaying: false,
            shouldAutoplayYouTube: false
        };
    }

    /**
     * Safely loads YouTube IFrame API and returns a Promise.
     * The Promise resolves when the API is ready.
     * @returns {Promise<void>}
     */
    loadAPI() {
        if (this.apiReadyPromise) {
            return this.apiReadyPromise;
        }

        this.apiReadyPromise = new Promise((resolve) => {
            // If YT object already exists, the API is already loaded
            if (window.YT && window.YT.Player) {
                resolve();
                return;
            }

            // Set up the global callback to be called by YouTube API
            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube Iframe API is ready.');
                resolve();
            };

            // Dynamically create and insert the script tag with async attribute
            const scriptTag = document.createElement('script');
            scriptTag.src = 'https://www.youtube.com/iframe_api';
            scriptTag.async = true; // This addresses the performance issue
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
        });

        return this.apiReadyPromise;
    }

    /**
     * Initializes the player
     * @param {string} elementId - The DOM element ID for the player container
     * @param {object} options - Options containing videoId and playerVars
     * @returns {Promise<YT.Player>}
     */
    async initPlayer(elementId, options) {
        try {
            // Ensure API is loaded before creating player
            await this.loadAPI();

            // If we already have a player instance, destroy it first
            if (this.player) {
                this.player.destroy();
            }

            return new Promise((resolve) => {
                const playerConfig = {
                    videoId: options.videoId,
                    playerVars: options.playerVars,
                    events: {
                        'onReady': (event) => this.onPlayerReady(event, resolve),
                        'onStateChange': (event) => this.onPlayerStateChange(event),
                        'onError': (event) => this.onPlayerError(event)
                    }
                };

                // Add host if provided, or default to https://www.youtube.com for better PWA support
                if (options.host) {
                    playerConfig.host = options.host;
                } else {
                    playerConfig.host = 'https://www.youtube.com';
                }

                this.player = new YT.Player(elementId, playerConfig);
            });

        } catch (error) {
            console.error('Failed to initialize YouTube player:', error);
            throw error;
        }
    }

    onPlayerReady(event, resolve) {
        console.log('Player is ready.');
        // Use CustomEvent to dispatch events
        document.dispatchEvent(new CustomEvent('youtubePlayerReady', {
            detail: {
                player: event.target,
                stateManager: this.state
            }
        }));
        resolve(event.target); // Resolve initPlayer's promise
    }

    onPlayerStateChange(event) {
        // Map player states to custom events
        const stateMap = {
            [YT.PlayerState.PLAYING]: 'youtubePlayerPlaying',
            [YT.PlayerState.PAUSED]: 'youtubePlayerPaused',
            [YT.PlayerState.ENDED]: 'youtubePlayerEnded',
            [YT.PlayerState.BUFFERING]: 'youtubePlayerBuffering',
            [YT.PlayerState.CUED]: 'youtubePlayerCued'
        };

        const eventName = stateMap[event.data];
        if (eventName) {
            document.dispatchEvent(new CustomEvent(eventName, {
                detail: {
                    player: event.target,
                    state: event.data,
                    stateManager: this.state
                }
            }));
        }
    }
    
    onPlayerError(event) {
        console.error('YouTube Player Error:', event.data);
        document.dispatchEvent(new CustomEvent('youtubePlayerError', { 
            detail: { 
                error: event.data,
                stateManager: this.state
            } 
        }));
    }

    // Public methods to get player state and instance
    isPlaying() {
        if (this.player && typeof this.player.getPlayerState === 'function') {
            const playerState = this.player.getPlayerState();
            return playerState === YT.PlayerState.PLAYING;
        }
        return this.state.isYouTubePlaying;
    }

    getPlayer() {
        return this.player;
    }

    setState(newState) {
        Object.assign(this.state, newState);
    }

    getState() {
        return this.state;
    }

    // Control methods
    playVideo() {
        if (this.player) {
            this.player.playVideo();
            this.state.isYouTubePlaying = true;
        }
    }

    pauseVideo() {
        if (this.player) {
            this.player.pauseVideo();
            this.state.isYouTubePlaying = false;
        }
    }

    loadVideoById(videoId) {
        if (this.player) {
            this.player.loadVideoById(videoId);
        }
    }

    // Additional control methods
    seekTo(seconds, allowSeekAhead) {
        if (this.player) {
            this.player.seekTo(seconds, allowSeekAhead);
        }
    }

    getCurrentTime() {
        if (this.player) {
            return this.player.getCurrentTime();
        }
        return 0;
    }

    getDuration() {
        if (this.player) {
            return this.player.getDuration();
        }
        return 0;
    }

    getPlayerState() {
        if (this.player) {
            return this.player.getPlayerState();
        }
        return -1; // Unstarted state
    }
}
```
