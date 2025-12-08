// A Cloudflare Worker that serves a Todo List application with D1 database integration

// HTML content
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

// CSS content
const CSS_CONTENT = `/* General Styles */
body {
    background-color: #f5f5f5;
    padding-top: 20px;
}

/* Card Styles */
card {
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

// JavaScript content for client-side
const JS_CONTENT = `// Todo List Application - Client Side
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const dueTimeInput = document.getElementById('dueTimeInput');
    const priorityInput = document.getElementById('priorityInput');
    const notesInput = document.getElementById('notesInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const syncCalendarBtn = document.getElementById('syncCalendarBtn');
    const taskList = document.getElementById('taskList');

    // Initialize Materialize components
    M.AutoInit();
    if (priorityInput) {
        M.FormSelect.init(priorityInput, {});
    }

    // Due date input - set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDateInput').min = today;

    // Load tasks on page load
    loadTasks();

    // Add task
    addTaskBtn.addEventListener('click', addTask);
    
    // Allow adding task with Enter key
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Calendar sync functionality
    syncCalendarBtn.addEventListener('click', syncWithCalendar);

    // Function to add a new task
    async function addTask() {
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
            title: title,
            dueDate: dueDateTime || null,
            priority: priorityInput.value,
            notes: notesInput.value.trim() || null,
            completed: false
        };

        try {
            const response = await fetch('/data/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });

            if (response.ok) {
                // Clear inputs
                taskInput.value = '';
                dueDateInput.value = '';
                dueTimeInput.value = '';
                priorityInput.value = 'medium';
                notesInput.value = '';

                // Reinitialize Materialize components
                M.FormSelect.init(priorityInput, {});

                // Reload tasks
                loadTasks();
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    // Function to load tasks
    async function loadTasks() {
        try {
            const response = await fetch('/data/tasks');
            if (response.ok) {
                const tasks = await response.json();
                renderTasks(tasks);
            } else {
                console.error('Failed to load tasks');
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    // Function to render tasks
    function renderTasks(tasks) {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="collection-item center">暂无任务。添加您的第一个任务！</li>';
            return;
        }

        // Sort tasks: incomplete first, then by due date
        const sortedTasks = [...tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (a.due_date && b.due_date) {
                return new Date(a.due_date) - new Date(b.due_date);
            }
            if (a.due_date) return -1;
            if (b.due_date) return 1;
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
                    <div class="task-title">\${escapeHtml(task.title)}</div>
                    <div class="task-details">
                        \${task.due_date ? \`<span class="task-due-date">截止: \${formatDate(task.due_date)}</span>\` : ''}
                        <span class="task-priority priority-\${task.priority}">\${getPriorityText(task.priority)}</span>
                    </div>
                    \${task.notes ? \`<div class="task-notes">\${escapeHtml(task.notes)}</div>\` : ''}
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

            checkbox.addEventListener('change', () => toggleTask(task.id));
            editBtn.addEventListener('click', () => editTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        });
    }

    // Function to toggle task completion
    async function toggleTask(id) {
        const task = Array.from(taskList.children).find(
            el => el.querySelector('input[type="checkbox"]')?.id === \`task-\${id}\`
        );
        
        if (!task) return;

        const checkbox = task.querySelector('input[type="checkbox"]');
        const completed = checkbox.checked;

        try {
            const response = await fetch(\`/data/tasks/\${id}\`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed })
            });

            if (!response.ok) {
                // Revert the checkbox if the update failed
                checkbox.checked = !completed;
                console.error('Failed to update task');
            }
        } catch (error) {
            // Revert the checkbox if there was an error
            checkbox.checked = !completed;
            console.error('Error updating task:', error);
        }
    }

    // Function to delete task
    async function deleteTask(id) {
        if (!confirm('确定要删除这个任务吗？')) return;

        try {
            const response = await fetch(\`/data/tasks/\${id}\`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadTasks(); // Reload tasks after deletion
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    // Function to edit task
    async function editTask(id) {
        const taskElement = Array.from(taskList.children).find(
            el => el.querySelector('.task-edit-btn')?.dataset.id === String(id)
        );
        
        if (!taskElement) return;

        const currentTitle = taskElement.querySelector('.task-title').textContent;
        const newTitle = prompt('编辑任务:', currentTitle);
        
        if (newTitle !== null && newTitle.trim() !== '') {
            try {
                const response = await fetch(\`/data/tasks/\${id}\`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newTitle.trim() })
                });

                if (response.ok) {
                    loadTasks(); // Reload tasks after update
                } else {
                    console.error('Failed to update task');
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        }
    }

    // Function to format date with time support
    function formatDate(dateString) {
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

    // Function to get priority text
    function getPriorityText(priority) {
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

    // Function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Calendar sync functionality - Export to iCalendar format
    async function syncWithCalendar() {
        try {
            const response = await fetch('/data/tasks');
            if (response.ok) {
                const tasks = await response.json();
                // Get all incomplete tasks
                const incompleteTasks = tasks.filter(task => !task.completed);

                if (incompleteTasks.length === 0) {
                    M.toast({html: '没有可导出的任务！'});
                    return;
                }

                // Create iCalendar content for each task
                let calendarContent = 'BEGIN:VCALENDAR\\r\\n';
                calendarContent += 'VERSION:2.0\\r\\n';
                calendarContent += 'PRODID:-//Cloudflare Todo List//Calendar Export//EN\\r\\n';

                incompleteTasks.forEach(task => {
                    calendarContent += 'BEGIN:VEVENT\\r\\n';

                    // Format the task title
                    calendarContent += \`SUMMARY:\${task.title.replace(/,/g, '\\\\,').replace(/;/g, '\\\\;')}\\r\\n\`;

                    // Set the due date if available
                    if (task.due_date) {
                        // Format date as YYYYMMDDTHHMMSSZ (strict RFC 5545 format without milliseconds)
                        const date = new Date(task.due_date);
                        const isoString = date.toISOString();
                        // Extract YYYY, MM, DD, HH, MM, SS parts and combine without milliseconds
                        const year = isoString.substr(0, 4);
                        const month = isoString.substr(5, 2);
                        const day = isoString.substr(8, 2);
                        const hour = isoString.substr(11, 2);
                        const minute = isoString.substr(14, 2);
                        const second = isoString.substr(17, 2);
                        const formattedDate = \`\${year}\${month}\${day}T\${hour}\${minute}\${second}Z\`;
                        calendarContent += \`DTSTART:\${formattedDate}\\r\\n\`;
                        calendarContent += \`DTEND:\${formattedDate}\\r\\n\`;
                    }

                    // Set unique ID for the event
                    calendarContent += \`UID:\${task.id}@cloudflare-todo-list\\r\\n\`;

                    // Set creation date
                    const createdDate = new Date(task.created_at);
                    const createdIsoString = createdDate.toISOString();
                    // Extract YYYY, MM, DD, HH, MM, SS parts and combine without milliseconds
                    const createdYear = createdIsoString.substr(0, 4);
                    const createdMonth = createdIsoString.substr(5, 2);
                    const createdDay = createdIsoString.substr(8, 2);
                    const createdHour = createdIsoString.substr(11, 2);
                    const createdMinute = createdIsoString.substr(14, 2);
                    const createdSecond = createdIsoString.substr(17, 2);
                    const formattedCreated = \`\${createdYear}\${createdMonth}\${createdDay}T\${createdHour}\${createdMinute}\${createdSecond}Z\`;
                    calendarContent += \`DTSTAMP:\${formattedCreated}\\r\\n\`;

                    // Add description if available
                    if (task.notes) {
                        calendarContent += \`DESCRIPTION:\${task.notes.replace(/,/g, '\\\\,').replace(/;/g, '\\\\;')}\\r\\n\`;
                    }

                    // Set priority (1-9, with 1 being highest)
                    let priority = 5; // default
                    if (task.priority === 'high') priority = 1;
                    else if (task.priority === 'low') priority = 9;
                    calendarContent += \`PRIORITY:\${priority}\\r\\n\`;

                    calendarContent += 'END:VEVENT\\r\\n';
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
            } else {
                console.error('Failed to sync calendar');
            }
        } catch (error) {
            console.error('Error syncing calendar:', error);
        }
    }
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
                            "INSERT INTO tasks (title, due_date, priority, notes, completed) VALUES (?, ?, ?, ?, ?)"
                        )
                        .bind(title, dueDate, priority, notes, completed ? 1 : 0)
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