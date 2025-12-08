// A self-contained Worker that serves static files without requiring KV storage
// This approach embeds the files directly in the Worker code

// Read all files as embedded constants
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>云端待办事项</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2196f3">
    <!-- Include Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Include Materialize CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
</head>
<body>
    <nav>
        <div class="nav-wrapper blue">
            <a href="#" class="brand-logo center">待办事项</a>
        </div>
    </nav>

    <main class="container">
        <div class="row">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">添加新任务</span>
                        <div class="row">
                            <div class="input-field col s12">
                                <input type="text" id="taskInput" placeholder="输入新任务...">
                                <label for="taskInput">任务</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12 m6">
                                <input type="date" id="dueDateInput">
                                <label for="dueDateInput">截止日期</label>
                            </div>
                            <div class="input-field col s12 m6">
                                <input type="time" id="dueTimeInput">
                                <label for="dueTimeInput">截止时间</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12 m6">
                                <select id="priorityInput">
                                    <option value="low">低</option>
                                    <option value="medium" selected>中</option>
                                    <option value="high">高</option>
                                </select>
                                <label>优先级</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <textarea id="notesInput" class="materialize-textarea"></textarea>
                                <label for="notesInput">备注</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <button id="addTaskBtn" class="btn waves-effect waves-light blue">添加任务</button>
                                <button id="syncCalendarBtn" class="btn waves-effect waves-light orange">同步日历</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">您的任务</span>
                        <div class="row">
                            <div class="col s12">
                                <ul id="taskList" class="collection">
                                    <!-- Tasks will be added here dynamically -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="app.js"></script>
    <script>
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(function(err) {
                        console.log('ServiceWorker registration failed');
                    });
            });
        }
    </script>
</body>
</html>`;

const CSS_CONTENT = `/* General Styles */
body {
    background-color: #f5f5f5;
    padding-top: 20px;
}

/* Card Styles */
.card {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Navigation Styles */
nav {
    border-radius: 8px;
    margin-bottom: 20px;
}

/* Task List Styles */
.collection {
    border: none;
}

.collection-item {
    border-bottom: 1px solid #e0e0e0;
}

.collection-item:last-child {
    border-bottom: none;
}

.task-completed {
    text-decoration: line-through;
    color: #9e9e9e;
}

.priority-high {
    border-left: 4px solid #f44336;
}

.priority-medium {
    border-left: 4px solid #ff9800;
}

.priority-low {
    border-left: 4px solid #4caf50;
}

/* Button Styles */
.btn {
    margin-right: 10px;
    border-radius: 4px;
}

/* Responsive Styles */
@media (max-width: 600px) {
    .container {
        margin: 0 10px;
    }

    .input-field {
        margin-bottom: 15px;
    }
}

/* Service Worker notification */
.sw-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}`;

const JS_CONTENT = `// Todo List Application
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.initializeMaterializeComponents();
    }

    bindEvents() {
        // Add task button
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.addTask();
        });

        // Input field enter key
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Sync with calendar button
        document.getElementById('syncCalendarBtn').addEventListener('click', () => {
            this.syncWithCalendar();
        });

        // Due date input - set min date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dueDateInput').min = today;
    }

    initializeMaterializeComponents() {
        // Initialize Materialize selects
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    loadTasks() {
        const tasks = localStorage.getItem('todoTasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDateInput');
        const dueTimeInput = document.getElementById('dueTimeInput');
        const priorityInput = document.getElementById('priorityInput');
        const notesInput = document.getElementById('notesInput');

        const title = taskInput.value.trim();
        if (!title) return;

        let dueDateTime = null;
        if (dueDateInput.value) {
            // Combine date and time inputs
            const date = dueDateInput.value;
            const time = dueTimeInput.value || '00:00'; // Default to 00:00 if no time is selected
            dueDateTime = \`\${date}T\${time}\`;
        }

        const newTask = {
            id: Date.now(),
            title: title,
            completed: false,
            dueDate: dueDateTime || null,
            priority: priorityInput.value,
            notes: notesInput.value.trim() || null,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();

        // Reset form
        taskInput.value = '';
        dueDateInput.value = '';
        dueTimeInput.value = '';
        priorityInput.value = 'medium';
        notesInput.value = '';

        // Reinitialize Materialize components after DOM update
        this.initializeMaterializeComponents();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newTitle = prompt('编辑任务:', task.title);
            if (newTitle !== null && newTitle.trim() !== '') {
                task.title = newTitle.trim();
                this.saveTasks();
                this.renderTasks();
            }
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Check if the date string includes time information
        if (dateString.includes('T')) {
            // Include both date and time
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            // Only date
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        if (this.tasks.length === 0) {
            taskList.innerHTML = '<li class="collection-item center">暂无任务。添加您的第一个任务！</li>';
            return;
        }

        // Sort tasks: incomplete first, then by due date
        const sortedTasks = [...this.tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });

        sortedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = \`collection-item task-item \${task.completed ? 'task-completed completed-task' : ''}\`;
            taskItem.innerHTML = \`
                <div class="task-checkbox">
                    <input type="checkbox" id="task-\${task.id}" \${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <div class="task-title">\${this.escapeHtml(task.title)}</div>
                    <div class="task-details">
                        \${task.dueDate ? \`<span class="task-due-date">截止: \${this.formatDate(task.dueDate)}</span>\` : ''}
                        <span class="task-priority priority-\${task.priority}">\${this.getPriorityText(task.priority)}</span>
                    </div>
                    \${task.notes ? \`<div class="task-notes">\${this.escapeHtml(task.notes)}</div>\` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-flat task-edit-btn" data-id="\${task.id}">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="btn-flat task-delete-btn" data-id="\${task.id}">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            \`;

            taskList.appendChild(taskItem);

            // Add event listeners for the new elements
            const checkbox = taskItem.querySelector(\`#task-\${task.id}\`);
            const editBtn = taskItem.querySelector('.task-edit-btn');
            const deleteBtn = taskItem.querySelector('.task-delete-btn');

            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            editBtn.addEventListener('click', () => this.editTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getPriorityText(priority) {
        switch (priority) {
            case 'high':
                return '高';
            case 'medium':
                return '中';
            case 'low':
                return '低';
            default:
                return priority;
        }
    }

    // Calendar sync functionality - Export to iCalendar format
    syncWithCalendar() {
        // Get all incomplete tasks
        const incompleteTasks = this.tasks.filter(task => !task.completed);

        if (incompleteTasks.length === 0) {
            M.toast({html: '没有可导出的任务！'});
            return;
        }

        // Create iCalendar content for each task
        let calendarContent = 'BEGIN:VCALENDAR\\n';
        calendarContent += 'VERSION:2.0\\n';
        calendarContent += 'PRODID:-//Cloudflare Todo List//Calendar Export//EN\\n';

        incompleteTasks.forEach(task => {
            calendarContent += 'BEGIN:VEVENT\\n';

            // Format the task title
            calendarContent += \`SUMMARY:\${task.title}\\n\`;

            // Set the due date if available
            if (task.dueDate) {
                // Format date as YYYYMMDDTHHMMSSZ
                const date = new Date(task.dueDate);
                const formattedDate = date.toISOString().replace(/[-:]/g, '').replace(/\\.\d{3}/, '');
                calendarContent += \`DTSTART:\${formattedDate}\\n\`;
                calendarContent += \`DTEND:\${formattedDate}\\n\`;
            }

            // Set unique ID for the event
            calendarContent += \`UID:\${task.id}@cloudflare-todo-list\\n\`;

            // Set creation date
            const createdDate = new Date(task.createdAt);
            const formattedCreated = createdDate.toISOString().replace(/[-:]/g, '').replace(/\\.\d{3}/, '');
            calendarContent += \`DTSTAMP:\${formattedCreated}\\n\`;

            // Add description if available
            if (task.notes) {
                calendarContent += \`DESCRIPTION:\${task.notes}\\n\`;
            }

            // Set priority (1-9, with 1 being highest)
            let priority = 5; // default
            if (task.priority === 'high') priority = 1;
            else if (task.priority === 'low') priority = 9;
            calendarContent += \`PRIORITY:\${priority}\\n\`;

            calendarContent += 'END:VEVENT\\n';
        });

        calendarContent += 'END:VCALENDAR';

        // Create a Blob with the calendar data
        const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'todo-list.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        M.toast({html: '任务已导出到日历！'});
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Service worker registration (will be moved to a separate file)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        if ('/sw.js' in navigator.serviceWorker.controller?.scriptURL) {
            // Already registered
        } else {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        }
    });
}
`;

const MANIFEST_CONTENT = `{
    "name": "云端待办事项",
    "short_name": "待办事项",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#2196f3",
    "icons": [
        {
            "src": "icon-512x512.svg",
            "sizes": "512x512",
            "type": "image/svg+xml"
        }
    ]
}`;

const SW_CONTENT = `// Service Worker for Todo List PWA
const CACHE_NAME = 'todo-list-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available, otherwise fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
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

const ICON_CONTENT = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'+
  '<rect width="512" height="512" fill="#2196f3"/>'+
  '<path d="M128,160 L384,160 L384,192 L128,192 Z" fill="white"/>'+
  '<path d="M128,240 L320,240 L320,272 L128,272 Z" fill="white"/>'+
  '<path d="M128,320 L256,320 L256,352 L128,352 Z" fill="white"/>'+
  '<circle cx="400" cy="176" r="16" fill="white"/>'+
  '<circle cx="400" cy="256" r="16" fill="white"/>'+
  '<circle cx="400" cy="336" r="16" fill="white"/>'+
'</svg>';

// File mapping
const FILES = {
    '/': HTML_CONTENT,
    '/index.html': HTML_CONTENT,
    '/styles.css': CSS_CONTENT,
    '/app.js': JS_CONTENT,
    '/manifest.json': MANIFEST_CONTENT,
    '/sw.js': SW_CONTENT,
    '/icon-512x512.svg': ICON_CONTENT
};

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
    'txt': 'text/plain; charset=utf-8'
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Handle specific file paths
        if (FILES[pathname]) {
            let contentType = 'text/html; charset=utf-8';

            // Determine content type based on file extension
            const ext = pathname.split('.').pop().toLowerCase();
            if (MIME_TYPES[ext]) {
                contentType = MIME_TYPES[ext];
            }

            const response = new Response(FILES[pathname], {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
                }
            });

            // Allow service worker registration
            if (pathname === '/sw.js' || pathname === '/') {
                response.headers.set('Service-Worker-Allowed', '/');
            }

            return response;
        }

        // For SPA routing, serve index.html for all other routes without extensions
        if (!/\.(js|css|png|jpg|jpeg|gif|ico|svg|json|xml|pdf|txt|map)$/i.test(pathname)) {
            return new Response(HTML_CONTENT, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache'
                }
            });
        }

        // Return 404 for missing files
        return new Response('页面未找到', {
            status: 404,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
};