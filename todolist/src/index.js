// A Cloudflare Worker that serves a Todo List application with D1 database integration

// HTML content
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>YGS 记事本</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#ffffff">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <!-- Navbar -->
        <nav class="navbar z-depth-0">
            <div class="custom-nav-container">
                <a href="#" class="brand-logo-custom">
                    <i class="material-icons-round brand-icon">check_circle</i>
                    <span class="brand-text">YGS记事本</span>
                </a>
                
                <div class="nav-actions">
                    <a href="javascript:void(0)" id="themeToggle" class="waves-effect waves-circle nav-icon-btn">
                        <i class="material-icons-round">dark_mode</i>
                    </a>
                    <a href="javascript:void(0)" id="syncCalendarBtn" class="waves-effect waves-circle nav-icon-btn">
                        <i class="material-icons-round">calendar_month</i>
                    </a>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main>
            <div class="container main-content-container">
                <!-- Header Stats -->
                <div class="header-info">
                    <div class="greeting-container">
                        <h4 id="greeting">你好</h4>
                        <p class="text-secondary">让我们开启高效的一天</p>
                    </div>
                </div>

                <!-- Loading Spinner -->
                <div id="mainLoader" class="center-align" style="margin: 60px 0; display: none;">
                    <div class="preloader-wrapper big active">
                        <div class="spinner-layer spinner-blue-only">
                            <div class="circle-clipper left"><div class="circle"></div></div>
                            <div class="gap-patch"><div class="circle"></div></div>
                            <div class="circle-clipper right"><div class="circle"></div></div>
                        </div>
                    </div>
                </div>

                <!-- Task List -->
                <ul id="taskList" class="collection task-list">
                    <!-- Tasks injected via JS -->
                </ul>

                <!-- Empty State -->
                <div id="emptyState" class="empty-state" style="display: none;">
                    <div class="empty-icon-wrapper">
                        <i class="material-icons-round">assignment_turned_in</i>
                    </div>
                    <h5>暂无任务</h5>
                    <p>点击右下角按钮创建你的第一个任务</p>
                </div>
            </div>
        </main>
    
        <!-- Floating Action Button -->
        <div class="fixed-action-btn">
            <a class="btn-floating btn-large pulse modal-trigger" href="#addTaskModal" id="fabButton">
                <i class="large material-icons-round">add</i>
            </a>
        </div>
        
        <!-- Add/Edit Task Modal -->
        <div id="addTaskModal" class="modal modal-fixed-footer">
            <div class="modal-content">
                <h4 class="modal-header-title">
                    <i class="material-icons-round">edit_note</i>
                    <span>新任务</span>
                </h4>
                <div class="row" style="margin-bottom: 0;">
                    <div class="input-field col s12">
                        <i class="material-icons-round prefix">edit</i>
                        <input type="text" id="taskInput" required>
                        <label for="taskInput">要做什么?</label>
                    </div>
                    <div class="input-field col s12 m6">
                        <i class="material-icons-round prefix">event</i>
                        <input type="date" id="dueDateInput" class="datepicker">
                        <label for="dueDateInput">截止日期</label>
                    </div>
                    <div class="input-field col s12 m6">
                        <i class="material-icons-round prefix">schedule</i>
                        <input type="time" id="dueTimeInput">
                        <label for="dueTimeInput">时间</label>
                    </div>
                    <div class="input-field col s12">
                        <i class="material-icons-round prefix">flag</i>
                        <select id="priorityInput">
                            <option value="low">低优先级</option>
                            <option value="medium" selected>中优先级</option>
                            <option value="high">高优先级</option>
                        </select>
                        <label>优先级</label>
                    </div>
                    <div class="input-field col s12">
                        <i class="material-icons-round prefix">description</i>
                        <textarea id="notesInput" class="materialize-textarea" data-length="200"></textarea>
                        <label for="notesInput">备注详情</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-light btn-flat">取消</a>
                <button id="saveTaskBtn" class="waves-effect waves-light btn accent-gradient">
                    <i class="material-icons-round left">save</i>保存任务
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="app.js"></script>
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
        }
    </script>
</body>
</html>`;

// CSS content - 大幅优化样式
// CSS_CONTENT 优化版本
const CSS_CONTENT = `
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
    --text-tertiary: #a0aec0;
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --border-light: #e2e8f0;
    --shadow-soft: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
    --shadow-hover: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
    --radius-lg: 24px;
    --radius-md: 16px;
    --radius-sm: 8px;
    --nav-height: 80px;
}

[data-theme="dark"] {
    --primary-gradient: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-tertiary: #64748b;
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --border-light: #334155;
    --shadow-soft: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    --shadow-hover: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
}

/* 导航栏 - 全新设计 */
nav.navbar {
    background: transparent !important;
    box-shadow: none !important;
    height: auto !important;
    line-height: normal !important;
    padding-top: 10px;
    position: relative;
    z-index: 100;
}

.custom-nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.brand-logo-custom {
    display: flex;
    align-items: center;
    gap: 8px; /* Reduced gap for tighter look */
    text-decoration: none;
    height: 48px;
}

.brand-icon {
    font-size: 32px;
    width: 32px;
    height: 32px;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    animation: float 3s ease-in-out infinite;
}

.brand-text {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    line-height: 1;
    position: relative;
    top: -4px; /* More aggressive correction for visual center */
    text-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary) !important;
    color: var(--text-secondary) !important;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-light);
}

.nav-icon-btn:hover {
    transform: translateY(-2px);
    color: var(--text-primary) !important;
    background: var(--bg-secondary) !important;
    box-shadow: var(--shadow-hover);
}

.nav-icon-btn i {
    font-size: 22px !important;
    line-height: 1 !important;
    height: auto !important;
}

/* 页面主体 */
.main-content-container {
    padding: 0 24px 100px;
    max-width: 800px !important;
    width: 100% !important;
    margin: 0 auto;
}

.header-info {
    margin: 30px 0 40px;
}

.header-info h4 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 8px;
    line-height: 1.2;
}

.header-info p {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 列表去除默认边框 */
.collection.task-list {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    margin: 0 !important;
    overflow: visible !important;
}

/* 任务卡片 - 现代化设计 */
.task-item {
    background: var(--bg-secondary) !important;
    border: none !important;
    border-radius: var(--radius-lg) !important;
    margin-bottom: 20px !important;
    padding: 24px !important;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    box-shadow: var(--shadow-soft);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: var(--primary-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.task-item:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-hover);
}

.task-item:hover::before {
    opacity: 1;
}

.task-item::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    border-radius: var(--radius-lg);
}

.task-item:hover::after {
    opacity: 1;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 复选框 - 精美动画 */
.task-checkbox-wrapper {
    position: relative;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    margin-top: 3px;
}

.custom-checkbox {
    width: 28px;
    height: 28px;
    border: 3px solid var(--border-light);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    background: var(--bg-secondary);
    position: relative;
}

.custom-checkbox::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--primary-gradient);
    opacity: 0;
    transform: scale(0);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.custom-checkbox i {
    font-size: 18px;
    color: white;
    transform: scale(0) rotate(-180deg);
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    z-index: 1;
}

.task-checkbox-wrapper input {
    display: none;
}

.task-checkbox-wrapper input:checked + .custom-checkbox::before {
    opacity: 1;
    transform: scale(1);
}

.task-checkbox-wrapper input:checked + .custom-checkbox {
    border-color: transparent;
    box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.15);
}

.task-checkbox-wrapper input:checked + .custom-checkbox i {
    transform: scale(1) rotate(0deg);
}

.custom-checkbox:hover {
    border-color: #667eea;
    transform: scale(1.15);
    box-shadow: 0 0 0 8px rgba(102, 126, 234, 0.1);
}

/* 任务内容 */
.task-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.task-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 10px;
    line-height: 1.5;
    word-wrap: break-word;
    transition: all 0.3s ease;
}

.task-completed .task-title {
    text-decoration: line-through;
    color: var(--text-tertiary);
    opacity: 0.5;
}

.task-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 8px;
}

.task-notes-content {
    margin: 8px 0 12px 0;
    padding: 12px;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--primary-gradient);
    font-size: 0.9rem;
    color: var(--text-secondary);
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.task-notes-content i.note-icon {
    color: var(--text-tertiary);
    font-size: 1.2rem;
    margin-top: 2px;
}

.task-notes-content span {
    flex: 1;
    word-break: break-word;
}

/* 标签 - 统一设计 */
.chip-custom {
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent; /* Prepare for border */
    height: 24px;
    line-height: 1;
}

.chip-custom i {
    font-size: 14px;
}

/* 优先级特定样式 - 弱化背景，强调文字 */
.chip-priority.high {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
    border: 1px solid rgba(244, 67, 54, 0.2);
}

.chip-priority.medium {
    background: rgba(255, 152, 0, 0.1);
    color: #ff9800;
    border: 1px solid rgba(255, 152, 0, 0.2);
}

.chip-priority.low {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    border: 1px solid rgba(76, 175, 80, 0.2);
}

/* 日期样式 - 保持一致 */
.chip-date {
    background: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border-light);
}

.chip-custom:hover {
    transform: translateY(-1px);
}

/* 操作按钮 */
.task-actions {
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.3s ease;
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--border-light);
}

.task-item:hover .task-actions {
    opacity: 1;
}

.action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
    transform: scale(1.1);
}

.action-btn.delete:hover {
    color: #f5576c;
    background: rgba(245, 87, 108, 0.1);
    box-shadow: none;
}

/* 浮动按钮 - 炫酷设计 */
.fixed-action-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 999;
}

.btn-floating.btn-large {
    width: 70px;
    height: 70px;
    background: var(--primary-gradient) !important;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5) !important;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
    position: relative;
    overflow: hidden;
}

.btn-floating.btn-large::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.btn-floating.btn-large:hover::before {
    width: 300px;
    height: 300px;
}

.btn-floating.btn-large:hover {
    transform: scale(1.15) rotate(90deg);
    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.6) !important;
}

.btn-floating.btn-large i {
    line-height: 70px !important;
    font-size: 36px;
    position: relative;
    z-index: 1;
}

.pulse::before {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
    background: var(--primary-gradient) !important;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.5);
    }
}

/* 模态框优化 */
.modal {
    background: var(--bg-secondary) !important;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0 !important;
    max-height: 90% !important;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3) !important;
}

.modal-header-title {
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 1.8rem;
}

.modal-header-title i {
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 32px;
}

.input-field {
    margin-top: 25px !important;
    margin-bottom: 25px !important;
}

.input-field input:focus,
.input-field textarea:focus {
    border-bottom: 2px solid #667eea !important;
    box-shadow: 0 1px 0 0 #667eea !important;
}

.input-field .prefix.active {
    color: #667eea !important;
}

.input-field > label.active {
    color: #667eea !important;
}

.btn.accent-gradient {
    background: var(--primary-gradient) !important;
    border-radius: 12px;
    font-weight: 700;
    text-transform: none;
    letter-spacing: 0;
    padding: 0 30px;
    height: 48px;
    line-height: 48px !important;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.btn.accent-gradient:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5) !important;
}

.modal-footer {
    background: var(--bg-secondary) !important;
    border-top: 2px solid var(--border-light);
    padding: 20px 24px;
}

.modal-close {
    color: var(--text-secondary) !important;
    font-weight: 600;
    transition: all 0.2s ease;
}

.modal-close:hover {
    color: var(--text-primary) !important;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    animation: fadeIn 0.8s ease;
}

.empty-icon-wrapper {
    width: 140px;
    height: 140px;
    margin: 0 auto 30px;
    border-radius: 50%;
    background: var(--primary-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.3);
    animation: float 3s ease-in-out infinite;
}

.empty-icon-wrapper i {
    font-size: 72px;
    color: white;
}

.empty-state h5 {
    color: var(--text-primary);
    margin-bottom: 12px;
    font-weight: 700;
    font-size: 1.5rem;
}

.empty-state p {
    color: var(--text-secondary);
    font-size: 1.05rem;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 下拉选择 */
.dropdown-content {
    background: var(--bg-secondary) !important;
    border: 2px solid var(--border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-soft) !important;
}

.dropdown-content li {
    color: var(--text-primary) !important;
    transition: background 0.2s ease;
}

.dropdown-content li:hover {
    background: rgba(102, 126, 234, 0.1) !important;
}

.select-wrapper .caret {
    fill: var(--text-secondary) !important;
}

/* 加载动画 */
.spinner-blue-only {
    border-color: #667eea !important;
}

/* 响应式优化 */
@media (max-width: 600px) {
    .header-info h4 {
        font-size: 2rem;
    }

    .task-item {
        padding: 18px !important;
    }

    .task-actions {
        opacity: 1;
    }

    .fixed-action-btn {
        bottom: 24px;
        right: 24px;
    }

    .btn-floating.btn-large {
        width: 60px;
        height: 60px;
    }

    .btn-floating.btn-large i {
        line-height: 60px !important;
        font-size: 30px;
    }

    nav.navbar {
        height: 64px;
        line-height: 64px;
    }

    nav .brand-logo {
        font-size: 1.2rem !important;
    }
}

/* 滚动条美化 */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: var(--bg-primary);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background: var(--primary-gradient);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    opacity: 0.8;
}

/* Toast 优化 */
.toast {
    border-radius: 12px !important;
    font-weight: 600;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}

.toast.green {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
}

.toast.red {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.toast.orange {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%) !important;
    color: #8b4513 !important;
}
`;

// JavaScript - Modern UI functionality adapted for D1 database
const JS_CONTENT = `
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');

    // Theme Handling
    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        const icon = document.querySelector('#themeToggle i');
        icon.textContent = next === 'dark' ? 'light_mode' : 'dark_mode';
        updateGreeting();
    };

    // Init Theme
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Init Materialize Components
    const modalElems = document.querySelectorAll('.modal');
    const modals = M.Modal.init(modalElems, {
        onOpenEnd: (modal) => {
            // Focus first input when modal opens
            const firstInput = modal.querySelector('#taskInput');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        },
        onCloseEnd: () => {
            // Reset form
            resetForm();
        }
    });

    // Initialize select elements properly
    const priorityInput = document.getElementById('priorityInput');
    if (priorityInput) {
        M.FormSelect.init(priorityInput, {});
    }

    // Character Counter for textarea
    M.CharacterCounter.init(document.querySelectorAll('textarea[data-length]'));

    // DOM Elements
    const taskList = document.getElementById('taskList');
    const saveBtn = document.getElementById('saveTaskBtn');
    const mainLoader = document.getElementById('mainLoader');
    const emptyState = document.getElementById('emptyState');
    const greeting = document.getElementById('greeting');
    const fabButton = document.getElementById('fabButton');

    // Date Input Setup
    const today = new Date().toISOString().split('T')[0];
    const dueDateInput = document.getElementById('dueDateInput');
    dueDateInput.min = today;
    dueDateInput.value = today;

    // Initialize
    updateGreeting();
    loadTasks();

    // FAB Click Handler - 明确绑定
    if (fabButton) {
        fabButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('FAB clicked');
            const modalElem = document.getElementById('addTaskModal');
            const instance = M.Modal.getInstance(modalElem);
            if (instance) {
                resetForm(); // Reset before opening
                instance.open();
            }
        });
    }

    // Save Button Handler
    saveBtn.addEventListener('click', handleSaveTask);

    // Enter key in task input
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveTask();
        }
    });

    // Calendar Sync
    // Calendar Sync
    document.getElementById('syncCalendarBtn').addEventListener('click', () => {
        M.toast({html: '<i class="material-icons-round left">cloud_download</i>正在跳转日历订阅...', classes: 'rounded'});
        // iOS Safari handles direct location change better for ICS files (it opens Calendar app import)
        window.location.href = '/event'; 
        // Small delay to allow toast to show before navigation (if it navigates away)
        setTimeout(() => {
             M.toast({html: '<i class="material-icons-round left">check_circle</i>请求已发送', classes: 'rounded green'});
        }, 1000);
    });

    function resetForm() {
        document.getElementById('taskInput').value = '';
        document.getElementById('notesInput').value = '';
        document.getElementById('dueDateInput').value = today;
        document.getElementById('dueTimeInput').value = '';

        // Reset priority to medium and reinitialize
        const priorityInput = document.getElementById('priorityInput');
        priorityInput.value = 'medium';

        // Reset button state
        saveBtn.removeAttribute('data-edit-id');
        saveBtn.innerHTML = '<i class="material-icons-round left">save</i>保存任务';
        document.querySelector('.modal-header-title span').textContent = '新任务';

        // Update Materialize components - reinitialize the select properly
        M.updateTextFields();
        M.textareaAutoResize(document.getElementById('notesInput'));
        M.FormSelect.init(priorityInput, {});
    }

    function updateGreeting() {
        const hour = new Date().getHours();
        let text = '你好';
        if (hour < 12) text = '早上好';
        else if (hour < 18) text = '下午好';
        else text = '晚上好';
        greeting.textContent = text;
    }

    async function loadTasks() {
        mainLoader.style.display = 'block';
        taskList.innerHTML = '';
        emptyState.style.display = 'none';

        try {
            const res = await fetch('/data/tasks');
            if (res.ok) {
                const tasks = await res.json();
                renderTasks(tasks);
            } else {
                M.toast({html: '<i class="material-icons-round left">error</i>加载失败', classes: 'rounded red'});
            }
        } catch (e) {
            console.error('Load error:', e);
            M.toast({html: '<i class="material-icons-round left">error</i>网络错误', classes: 'rounded red'});
        } finally {
            mainLoader.style.display = 'none';
        }
    }

    async function handleSaveTask() {
        const title = document.getElementById('taskInput').value.trim();
        if (!title) {
            M.toast({html: '<i class="material-icons-round left">warning</i>请输入任务内容', classes: 'rounded orange'});
            return;
        }

        const dueDate = document.getElementById('dueDateInput').value;
        const dueTime = document.getElementById('dueTimeInput').value;
        // Get the actual selected value from the Materialize select
        const prioritySelect = document.getElementById('priorityInput');
        const priority = prioritySelect.value || prioritySelect.options[prioritySelect.selectedIndex].value;
        const notes = document.getElementById('notesInput').value.trim();
        const editId = saveBtn.getAttribute('data-edit-id');

        let dueDateTime = null;
        if (dueDate) {
            dueDateTime = dueTime ? \`\${dueDate}T\${dueTime}\` : dueDate;
        }

        const payload = {
            title,
            dueDate: dueDateTime,
            priority,
            notes,
            completed: false
        };

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="material-icons-round left">hourglass_empty</i>保存中...';

        try {
            let url = '/data/tasks';
            let method = 'POST';

            if (editId) {
                url = \`/data/tasks/\${editId}\`;
                method = 'PATCH';
                delete payload.completed;
            }

            const res = await fetch(url, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                M.toast({
                    html: \`<i class="material-icons-round left">check_circle</i>\${editId ? '任务已更新' : '任务已添加'}\`,
                    classes: 'rounded green'
                });
                const modal = M.Modal.getInstance(document.getElementById('addTaskModal'));
                modal.close();
                loadTasks();
            } else {
                throw new Error('Save failed');
            }
        } catch (e) {
            console.error('Save error:', e);
            M.toast({html: '<i class="material-icons-round left">error</i>保存失败', classes: 'rounded red'});
        } finally {
        }
    }

    // Color Palette based on #007AFF
    const CARD_COLORS = [
        '#007AFF', '#FF8500', '#00FAFF', '#0500FF', '#FF007A', '#7AFF00',
        '#FF00FA', '#00FF05', '#4592E6', '#268EFF', '#006EE6', '#0062CC',
        '#FF0500', '#FAFF00', '#807f00', '#0085bf', '#a15be3', '#db432c',
        '#008e5d', '#ea1d6c', '#008b84', '#004aa0', '#0061ce', '#6893ff',
        '#97aeff', '#ae6c00', '#368d00', '#ffffff', '#d5dcff', '#a8baff',
        '#7399ff'
    ];

    function getContrastColor(hex) {
        if (!hex) return '#1a202c';
        if (hex.indexOf('#') === 0) hex = hex.slice(1);
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) return '#1a202c';
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#1a202c' : '#ffffff';
    }



    function renderTasks(tasks) {
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        tasks.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            if (a.due_date && b.due_date) return new Date(a.due_date) - new Date(b.due_date);
            return 0;
        });

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = \`collection-item task-item \${task.completed ? 'task-completed' : ''}\`;
            
            // Random Color Logic
            const randomColor = CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
            const textColor = getContrastColor(randomColor);
            const secondaryColor = textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
            
            li.style.setProperty('background', randomColor, 'important');
            li.style.setProperty('--text-primary', textColor);
            li.style.setProperty('--text-secondary', secondaryColor);
            li.style.color = textColor;
            
            // Adjust checkbox border and gradient if needed based on background lightness
            if (textColor === '#ffffff') {
                li.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.3)');
                li.style.setProperty('--bg-secondary', 'transparent'); 
                li.style.setProperty('--bg-primary', 'rgba(0,0,0,0.1)'); 
            } else {
                 li.style.setProperty('--border-light', 'rgba(0, 0, 0, 0.1)');
                 li.style.setProperty('--bg-primary', 'rgba(0,0,0,0.05)');
            }


            // Adjust checkbox border and gradient if needed based on background lightness
            // Simple hack: if text is white (dark bg), make checkbox border white/transparent
            if (textColor === '#ffffff') {
                li.style.setProperty('--border-light', 'rgba(255, 255, 255, 0.3)');
                li.style.setProperty('--bg-secondary', 'transparent'); // For inner elements
                li.style.setProperty('--bg-primary', 'rgba(0,0,0,0.1)'); // For notes
            } else {
                 // For light backgrounds (like white), default vars might work, but let's ensure text contrast
                 li.style.setProperty('--border-light', 'rgba(0, 0, 0, 0.1)');
                 li.style.setProperty('--bg-primary', 'rgba(0,0,0,0.05)');
            }

            let dateDisplay = '';
            if (task.due_date) {
                const d = new Date(task.due_date);
                if(!isNaN(d.getTime())) {
                    const isToday = new Date().toDateString() === d.toDateString();
                    const dateStr = isToday ? '今天' : \`\${d.getMonth()+1}/\${d.getDate()}\`;
                    const timeStr = task.due_date.includes('T') ? d.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'}) : '';
                    dateDisplay = \`<span class="chip-custom"><i class="material-icons-round">event</i>\${dateStr} \${timeStr}</span>\`;
                }
            }

            const priorityLabels = { high: '高', medium: '中', low: '低' };
            const priorityHtml = \`<span class="chip-custom chip-priority \${task.priority}">\${priorityLabels[task.priority]}</span>\`;

            // Show notes content directly if available
            const notesDisplay = task.notes ? \`<div class="task-notes-content"><i class="material-icons-round note-icon">description</i><span>\${escapeHtml(task.notes)}</span></div>\` : '';

            li.innerHTML = \`
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" \${task.completed ? 'checked' : ''}>
                    <div class="custom-checkbox"><i class="material-icons-round">check</i></div>
                </label>
                <div class="task-content">
                    <div class="task-title">\${escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        \${priorityHtml}
                        \${dateDisplay}
                    </div>
                    \${notesDisplay}
                    <div class="task-actions">
                        <button class="action-btn edit-btn waves-effect waves-light"><i class="material-icons-round">edit</i></button>
                        <button class="action-btn delete delete-btn waves-effect waves-light"><i class="material-icons-round">delete_outline</i></button>
                    </div>
                </div>
            \`;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked, li));

            const delBtn = li.querySelector('.delete-btn');
            delBtn.addEventListener('click', () => deleteTask(task.id));

            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => openEditModal(task));

            taskList.appendChild(li);
        });
    }

    async function toggleTask(id, completed, liElement) {
        if (completed) {
            liElement.classList.add('task-completed');
        } else {
            liElement.classList.remove('task-completed');
        }

        try {
            await fetch(\`/data/tasks/\${id}\`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ completed })
            });
        } catch(e) {
            M.toast({html: '<i class="material-icons-round left">error</i>更新失败', classes: 'rounded red'});
            liElement.querySelector('input').checked = !completed;
            if (completed) liElement.classList.remove('task-completed');
            else liElement.classList.add('task-completed');
        }
    }

    async function deleteTask(id) {
        if (!confirm('确定要删除这个任务吗?')) return;

        try {
            const res = await fetch(\`/data/tasks/\${id}\`, { method: 'DELETE' });
            if (res.ok) {
                M.toast({html: '<i class="material-icons-round left">delete</i>任务已删除', classes: 'rounded'});
                loadTasks();
            }
        } catch(e) {
            M.toast({html: '<i class="material-icons-round left">error</i>删除失败', classes: 'rounded red'});
        }
    }

    function openEditModal(task) {
        const modal = M.Modal.getInstance(document.getElementById('addTaskModal'));

        document.getElementById('taskInput').value = task.title;
        document.getElementById('notesInput').value = task.notes || '';
        document.getElementById('priorityInput').value = task.priority;

        if (task.due_date) {
            const parts = task.due_date.split('T');
            document.getElementById('dueDateInput').value = parts[0];
            if (parts.length > 1) {
                document.getElementById('dueTimeInput').value = parts[1].substring(0, 5);
            }
        }

        saveBtn.setAttribute('data-edit-id', task.id);
        saveBtn.innerHTML = '<i class="material-icons-round left">save</i>更新任务';
        document.querySelector('.modal-header-title span').textContent = '编辑任务';

        M.updateTextFields();
        M.textareaAutoResize(document.getElementById('notesInput'));

        // Reinitialize the select element properly
        const prioritySelect = document.getElementById('priorityInput');
        M.FormSelect.init(prioritySelect, {});

        // Update the selected value after reinitializing
        prioritySelect.value = task.priority;
        M.updateTextFields(); // Re-trigger Materialize updates
        M.FormSelect.init(prioritySelect, {}); // Reinit after setting value

        modal.open();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
`;

const MANIFEST_CONTENT = `{
    "name": "YGS云端待办",
    "short_name": "待办",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "icons": [
        {
            "src": "icon-512x512.svg",
            "sizes": "512x512",
            "type": "image/svg+xml"
        }
    ]
}`;

const SW_CONTENT = `const CACHE_NAME = 'todo-list-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;

// MIME types
const MIME_TYPES = {
    'html': 'text/html; charset=utf-8',
    'htm': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'svg': 'image/svg+xml',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'txt': 'text/plain; charset=utf-8',
    'ics': 'text/calendar; charset=utf-8'
};

function tasksToICalendar(tasks) {
    let calendarContent = 'BEGIN:VCALENDAR\r\n';
    calendarContent += 'VERSION:2.0\r\n';
    calendarContent += 'PRODID:-//Cloudflare Todo List//Calendar Export//EN\r\n';
    calendarContent += 'METHOD:PUBLISH\r\n';
    calendarContent += 'CALSCALE:GREGORIAN\r\n';
    calendarContent += 'X-WR-TIMEZONE:Asia/Shanghai\r\n';

    // 格式化为本地时间（不带Z后缀，带时区标识）
    const formatICSDateLocal = (date) => {
        const year = String(date.getFullYear()).padStart(4, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hour}${minute}${second}`;
    };

    const formatICSDateAllDay = (date) => {
        const year = String(date.getFullYear()).padStart(4, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    // 获取当前时间戳（UTC格式，用于DTSTAMP）
    const formatICSDateUTC = (date) => {
        const year = String(date.getUTCFullYear()).padStart(4, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hour = String(date.getUTCHours()).padStart(2, '0');
        const minute = String(date.getUTCMinutes()).padStart(2, '0');
        const second = String(date.getUTCSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hour}${minute}${second}Z`;
    };

    tasks.forEach(task => {
        if (!task.completed) {
            calendarContent += 'BEGIN:VEVENT\r\n';
            calendarContent += `SUMMARY:${task.title.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}\r\n`;

            if (task.due_date) {
                // 解析存储的日期时间字符串
                // 格式可能是 "2025-12-11" 或 "2025-12-11T14:00"
                const hasTime = task.due_date.includes('T');
                
                if (hasTime) {
                    // 有具体时间，解析为本地时间
                    const startDate = new Date(task.due_date);
                    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1小时后
                    
                    // 使用带时区的本地时间格式
                    calendarContent += `DTSTART;TZID=Asia/Shanghai:${formatICSDateLocal(startDate)}\r\n`;
                    calendarContent += `DTEND;TZID=Asia/Shanghai:${formatICSDateLocal(endDate)}\r\n`;
                } else {
                    // 只有日期，全天事件
                    const dateParts = task.due_date.split('-');
                    const year = dateParts[0];
                    const month = dateParts[1];
                    const day = dateParts[2];
                    
                    // 计算第二天日期
                    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                    
                    calendarContent += `DTSTART;VALUE=DATE:${year}${month}${day}\r\n`;
                    calendarContent += `DTEND;VALUE=DATE:${formatICSDateAllDay(endDate)}\r\n`;
                }
            } else {
                // 没有设置日期，使用今天作为全天事件
                const today = new Date();
                const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
                
                calendarContent += `DTSTART;VALUE=DATE:${formatICSDateAllDay(today)}\r\n`;
                calendarContent += `DTEND;VALUE=DATE:${formatICSDateAllDay(tomorrow)}\r\n`;
            }

            calendarContent += `UID:${task.id}@todo.want.biz\r\n`;
            
            // DTSTAMP 使用 UTC 时间（这是ICS规范要求的）
            const now = new Date();
            calendarContent += `DTSTAMP:${formatICSDateUTC(now)}\r\n`;

            if (task.notes) {
                calendarContent += `DESCRIPTION:${task.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}\r\n`;
            }

            calendarContent += 'STATUS:CONFIRMED\r\n';
            
            let priority = 5;
            if (task.priority === 'high') priority = 1;
            else if (task.priority === 'low') priority = 9;
            calendarContent += `PRIORITY:${priority}\r\n`;
            
            calendarContent += 'END:VEVENT\r\n';
        }
    });

    calendarContent += 'END:VCALENDAR';
    return calendarContent;
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Handle data routes (API routes) - MUST BE FIRST
        if (pathname.startsWith('/data/')) {
            // Handle preflight CORS requests
            if (request.method === 'OPTIONS') {
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                    }
                });
            }

            if (pathname === '/data/tasks') {
                if (request.method === 'GET') {
                    // Get all tasks
                    try {
                        // Test with a simple query first
                        const result = await env.DB.prepare("SELECT COUNT(*) as count FROM tasks").all();
                        console.log('DB connection test result:', result);

                        const { results } = await env.DB.prepare("SELECT * FROM tasks ORDER BY completed ASC, created_at DESC").all();
                        return new Response(JSON.stringify(results), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    } catch (error) {
                        console.error('Database error:', error);
                        return new Response(JSON.stringify({ error: 'Database error: ' + error.message }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    }
                } else if (request.method === 'POST') {
                    // Add new task
                    try {
                        const body = await request.json();
                        const { title, dueDate, priority, notes, completed } = body;

                        const result = await env.DB.prepare(
                            "INSERT INTO tasks (title, due_date, priority, notes, completed, notified) VALUES (?, ?, ?, ?, ?, ?)"
                        )
                        .bind(title, dueDate, priority, notes, completed ? 1 : 0, 0) // notified defaults to 0 (false)
                        .run();

                        // Get the newly inserted task
                        const newTask = await env.DB.prepare(
                            "SELECT * FROM tasks WHERE id = ?"
                        )
                        .bind(result.meta.last_row_id)
                        .first();

                        return new Response(JSON.stringify(newTask), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    } catch (error) {
                        console.error('Error creating task:', error);
                        return new Response(JSON.stringify({ error: 'Error creating task' }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    }
                }
            } else if (pathname.match(/^\/data\/tasks\/\d+$/)) {
                // Handle tasks by ID
                const taskId = parseInt(pathname.split('/')[3]);

                if (request.method === 'GET') {
                    // Get specific task
                    try {
                        const task = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(taskId).first();
                        return new Response(JSON.stringify(task), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    } catch (error) {
                        console.error('Error getting task ' + taskId + ':', error);
                        return new Response(JSON.stringify({ error: 'Error getting task' }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    }
                } else if (request.method === 'DELETE') {
                    // Delete specific task
                    try {
                        await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(taskId).run();
                        return new Response(JSON.stringify({ success: true }), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    } catch (error) {
                        console.error('Error deleting task ' + taskId + ':', error);
                        return new Response(JSON.stringify({ error: 'Error deleting task' }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    }
                } else if (request.method === 'PATCH') {
                    // Update specific task
                    try {
                        const body = await request.json();
                        const { title, dueDate, priority, notes, completed } = body;

                        // Build dynamic update query based on provided fields
                        let query = "UPDATE tasks SET ";
                        const values = [];

                        if (title !== undefined) {
                            query += "title = ?, ";
                            values.push(title);
                        }
                        if (dueDate !== undefined) {
                            query += "due_date = ?, ";
                            values.push(dueDate);
                        }
                        if (priority !== undefined) {
                            query += "priority = ?, ";
                            values.push(priority);
                        }
                        if (notes !== undefined) {
                            query += "notes = ?, ";
                            values.push(notes);
                        }
                        if (completed !== undefined) {
                            query += "completed = ?, ";
                            values.push(completed ? 1 : 0);
                        }
                        if (body.notified !== undefined) {
                            query += "notified = ?, ";
                            values.push(body.notified ? 1 : 0);
                        }

                        // Remove trailing comma and space
                        query = query.slice(0, -2);
                        query += " WHERE id = ?";
                        values.push(taskId);

                        await env.DB.prepare(query).bind(...values).run();

                        // Get the updated task
                        const updatedTask = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(taskId).first();

                        return new Response(JSON.stringify(updatedTask), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    } catch (error) {
                        console.error('Error updating task ' + taskId + ':', error);
                        return new Response(JSON.stringify({ error: 'Error updating task' }), {
                            status: 500,
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Content-Type'
                            }
                        });
                    }
                }
            } else {
                return new Response('Not Found', { status: 404 });
            }
        }

        // Handle the new /event route for ICS export
        if (pathname === '/event' || pathname === '/events') {
            if (request.method === 'GET') {
                try {
                    // Retrieve all tasks from database
                    const { results } = await env.DB.prepare("SELECT * FROM tasks ORDER BY completed ASC, created_at DESC").all();

                    // Convert tasks to iCalendar format
                    const icsContent = tasksToICalendar(results);

                    // Return the ICS content with appropriate headers
                    return new Response(icsContent, {
                        headers: {
                            'Content-Type': 'text/calendar; charset=utf-8',
                            'Content-Disposition': 'attachment; filename="todo-list.ics"',
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    });
                } catch (error) {
                    console.error('Error generating ICS:', error);
                    return new Response('Error generating ICS file', {
                        status: 500,
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    });
                }
            }
        }

        // Handle static file requests
        if (MIME_TYPES[pathname.split('.').pop().toLowerCase()]) {
            switch (pathname) {
                case '/':
                case '/index.html':
                    return new Response(HTML_CONTENT, {
                        headers: { 
                            'Content-Type': MIME_TYPES['html'],
                            'Cache-Control': 'no-cache, no-store, must-revalidate'
                        }
                    });
                case '/styles.css':
                    return new Response(CSS_CONTENT, {
                        headers: { 
                            'Content-Type': MIME_TYPES['css'],
                            'Cache-Control': 'no-cache, no-store, must-revalidate'
                        }
                    });
                case '/app.js':
                    return new Response(JS_CONTENT, {
                        headers: { 
                            'Content-Type': MIME_TYPES['js'],
                            'Cache-Control': 'no-cache, no-store, must-revalidate'
                        }
                    });
                case '/manifest.json':
                    return new Response(MANIFEST_CONTENT, {
                        headers: { 'Content-Type': MIME_TYPES['json'] }
                    });
                case '/sw.js':
                    return new Response(SW_CONTENT, {
                        headers: { 'Content-Type': MIME_TYPES['js'] }
                    });
                default:
                    return new Response('File not found', { status: 404 });
            }
        }

        // For SPA routing, serve index.html for all other routes without extensions
        return new Response(HTML_CONTENT, {
            headers: { 
                'Content-Type': MIME_TYPES['html'],
                'Cache-Control': 'no-cache'
            }
        });
    }
};