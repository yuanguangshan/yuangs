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
                                <select id="priorityInput">
                                    <option value="low">低</option>
                                    <option value="medium" selected>中</option>
                                    <option value="high">高</option>
                                </select>
                                <label for="priorityInput">优先级</label>
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
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const notesInput = document.getElementById('notesInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const syncCalendarBtn = document.getElementById('syncCalendarBtn');
    const taskList = document.getElementById('taskList');

    // Initialize Materialize components
    M.AutoInit();

    // Specifically initialize the select dropdowns if they exist
    if (priorityInput) {
        M.FormSelect.init(priorityInput, {});
    }

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'collection-item task-item';

            // Determine priority class
            let priorityClass = '';
            switch(task.priority) {
                case 'high':
                    priorityClass = 'priority-high';
                    break;
                case 'medium':
                    priorityClass = 'priority-medium';
                    break;
                case 'low':
                    priorityClass = 'priority-low';
                    break;
            }

            // Format date for display
            const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';

            li.innerHTML = \`
                <div class="\${priorityClass}">
                    <div class="task-info">
                        <strong>\${task.text}</strong>
                        \${task.dueDate ? '<br><small>截止: ' + formattedDate + '</small>' : ''}
                        \${task.notes ? '<br><small>备注: ' + task.notes + '</small>' : ''}
                    </div>
                    <div class="task-actions right-align">
                        <input type="checkbox" id="complete_\${index}" \${task.completed ? 'checked' : ''}>
                        <label for="complete_\${index}">完成</label>
                        <button class="btn-small waves-effect waves-light red delete-btn" data-index="\${index}">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            \`;

            if (task.completed) {
                li.querySelector('.task-info').classList.add('task-completed');
            }

            // Add event listener for completion
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function() {
                tasks[index].completed = this.checked;
                if (tasks[index].completed) {
                    li.querySelector('.task-info').classList.add('task-completed');
                } else {
                    li.querySelector('.task-info').classList.remove('task-completed');
                }
                saveTasks();
            });

            // Add event listener for delete
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add task
    addTaskBtn.addEventListener('click', function() {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = {
                text: text,
                dueDate: dueDateInput.value,
                priority: priorityInput.value,
                notes: notesInput.value.trim(),
                completed: false,
                createdAt: new Date()
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();

            // Clear inputs
            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'medium';
            notesInput.value = '';

            // Reinitialize Materialize components
            M.AutoInit();
            // Specifically reinitialize the select dropdown
            M.FormSelect.init(priorityInput, {});
        }
    });

    // Allow adding task with Enter key
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Helper function to format Date object to ICS string (YYYYMMDDThhmmssZ)
    // Ensures no milliseconds and includes Z
    function formatICSDate(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Helper function to escape text values for iCalendar format
    function escapeICalText(text) {
        if (!text) return '';
        return text
            .replace(/\\\\/g, '\\\\\\\\') 
            .replace(/,/g, '\\\\,')
            .replace(/;/g, '\\\\;')
            .replace(/\\n/g, '\\\\n')
            .replace(/\\r/g, '');
    }

    // Calendar sync functionality
    syncCalendarBtn.addEventListener('click', function() {
        const tasksToExport = tasks.filter(t => t.dueDate && !t.completed);
        
        if (tasksToExport.length === 0) {
            alert('没有带日期的未完成任务可以同步');
            return;
        }

        // Generate iCalendar file content
        let icalContent = 'BEGIN:VCALENDAR\\r\\n';
        icalContent += 'VERSION:2.0\\r\\n';
        icalContent += 'PRODID:-//Todo List App//CN\\r\\n';
        icalContent += 'CALSCALE:GREGORIAN\\r\\n';
        icalContent += 'METHOD:PUBLISH\\r\\n';

        tasksToExport.forEach((task, index) => {
            // 1. Generate Start and End Times
            // Assuming task.dueDate is YYYY-MM-DD
            // Set Start at 09:00 UTC
            const cleanDateStr = task.dueDate.replace(/-/g, '');
            const dtStart = cleanDateStr + 'T090000Z';
            // Set End at 10:00 UTC (1 hour duration) - Crucial for Mac
            const dtEnd = cleanDateStr + 'T100000Z';
            
            // 2. Generate DTSTAMP (Current time)
            const dtStamp = formatICSDate(new Date());

            // 3. Generate UID
            // Use timestamp + index to avoid "empty UID" errors for Chinese text
            const uid = 'todo-' + Date.now() + '-' + index + '@todo-list-app';

            icalContent += 'BEGIN:VEVENT\\r\\n';
            icalContent += 'UID:' + uid + '\\r\\n';
            icalContent += 'DTSTAMP:' + dtStamp + '\\r\\n';
            icalContent += 'DTSTART:' + dtStart + '\\r\\n';
            icalContent += 'DTEND:' + dtEnd + '\\r\\n'; // Added DTEND

            // Escape special characters
            const escapedSummary = escapeICalText(task.text);
            icalContent += 'SUMMARY:' + escapedSummary + '\\r\\n';

            if (task.notes) {
                const escapedDescription = escapeICalText(task.notes);
                icalContent += 'DESCRIPTION:' + escapedDescription + '\\r\\n';
            }

            // Priority
            icalContent += 'PRIORITY:' + (task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9') + '\\r\\n';
            icalContent += 'END:VEVENT\\r\\n';
        });

        icalContent += 'END:VCALENDAR';

        // Create and download the file
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todolist.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Initial render
    renderTasks();
});
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