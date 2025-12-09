// A Cloudflare Worker that serves a Todo List application with D1 database integration

// HTML content
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YGS云端待办事项</title>
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
            <a href="#" class="brand-logo center">YGS待办事项</a>
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
                            <div class="input-field col s6">
                                <input type="date" id="dueDateInput">
                                <label for="dueDateInput">截止日期</label>
                            </div>
                            <div class="input-field col s6">
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
                        <div class="row valign-wrapper">
                            <div class="col s10">
                                <span class="card-title">📋 您的任务</span>
                            </div>
                            <div class="col s2 right-align">
                                <button id="syncCalendarBtnTop" class="btn-flat btn-small">
                                    <i class="material-icons">calendar_today</i>
                                    <span class="hide-on-med-and-down">同步</span>
                                </button>
                            </div>
                        </div>
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
    padding-top: 0px;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* Card Styles */
card {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Navigation Styles */
nav {
    border-radius: 0px;
    margin-bottom: 5px;
}

/* Task List Styles */
.collection {
    border: none;
    margin: 5px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.collection-item {
    border-bottom: 1px solid #e0e0e0;
    padding: 15px 20px !important;
    margin-bottom: 8px;
    border-radius: 8px;
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.collection-item:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-1px);
}

.collection-item:last-child {
    border-bottom: none;
}

.task-completed {
    text-decoration: line-through;
    color: #9e9e9e;
    opacity: 0.8;
}

.task-item {
    position: relative;
    padding-left: 60px !important;
}

.task-checkbox {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
}

.task-content {
    flex: 1;
    min-width: 0;
}

.task-title {
    font-weight: 500;
    margin-bottom: 5px;
    font-size: 16px;
    color: #333;
}

.task-details {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 5px 0;
    font-size: 14px;
    color: #666;
}

.task-due-date {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    background: #e3f2fd;
    border-radius: 15px;
    color: #1976d2;
    font-size: 12px;
}

.task-priority {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 15px;
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.priority-high {
    background-color: #f44336;
    border-left: none;
}

.priority-medium {
    background-color: #ff9800;
    border-left: none;
}

.priority-low {
    background-color: #4caf50;
    border-left: none;
}

.task-notes {
    margin-top: 8px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 6px;
    font-size: 14px;
    color: #555;
    border-left: 3px solid #ddd;
    font-style: italic;
}

.task-notes-preview {
    cursor: pointer;
}

.task-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    justify-content: flex-start;
}

.btn-flat {
    padding: 0 8px;
    min-width: auto;
    margin: 0;
    color: #666;
    border-radius: 4px;
}

.btn-flat:hover {
    color: #000;
    background-color: #f0f0f0;
}

.task-expand-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #e0e0e0;
    color: #666;
    border: none;
    font-size: 16px;
    transition: all 0.2s ease;
}

.task-expand-btn:hover {
    background: #bdbdbd;
    transform: scale(1.1);
}

/* Collapsible content */
.task-details-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-top: 10px;
}

.task-details-content.expanded {
    max-height: 500px;
}

/* Button Styles */
.btn {
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 4px;
}

/* Card Content */
.card-content {
    padding: 15px;
}

.card-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
}

/* Input fields */
.input-field {
    margin-top: 10px;
    margin-bottom: 10px;
}

/* Row spacing */
.row {
    margin-bottom: 10px;
}

/* Container */
.container {
    margin: 0 auto;
    padding: 5px;
}

/* Responsive Styles */
@media (max-width: 600px) {
    .container {
        margin: 0 5px;
        padding: 2px;
    }

    .input-field {
        margin-bottom: 10px;
    }

    .collection-item {
        padding: 8px 12px !important;
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

    // Top calendar sync button functionality
    const syncCalendarBtnTop = document.getElementById('syncCalendarBtnTop');
    if (syncCalendarBtnTop) {
        syncCalendarBtnTop.addEventListener('click', syncWithCalendar);
    }

    // Function to add a new task or update existing task
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

        // Check if we're editing an existing task
        const taskId = document.getElementById('addTaskBtn').dataset.taskId;
        const isEditing = taskId !== undefined && taskId !== '';

        const taskData = {
            title: title,
            dueDate: dueDateTime || null,
            priority: priorityInput.value,
            notes: notesInput.value.trim() || null
        };

        try {
            let response;
            if (isEditing) {
                // Update existing task
                response = await fetch(\`/data/tasks/\${taskId}\`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });

                if (response.ok) {
                    // Reset button to original state
                    const addTaskBtn = document.getElementById('addTaskBtn');
                    addTaskBtn.innerHTML = '<i class="material-icons left">add</i>添加任务';
                    delete addTaskBtn.dataset.taskId;

                    const hideTaskBtn = document.getElementById('hideTaskBtn');
                    if (hideTaskBtn) {
                        hideTaskBtn.innerHTML = '<i class="material-icons left">close</i>收起';
                    }
                }
            } else {
                // Add new task
                response = await fetch('/data/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({...taskData, completed: false})
                });
            }

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
                console.error(isEditing ? 'Failed to update task' : 'Failed to add task');
            }
        } catch (error) {
            console.error(isEditing ? 'Error updating task:' : 'Error adding task:', error);
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
                        \${task.due_date ? \`<span class="task-due-date"><i class="material-icons tiny">event</i> \${formatDate(task.due_date)}</span>\` : ''}
                        <span class="task-priority priority-\${task.priority}"><i class="material-icons tiny">flag</i> \${getPriorityText(task.priority)}</span>
                    </div>
                    \${task.notes ? \`
                        <div class="task-notes-container">
                            <div class="task-notes-preview">\${escapeHtml(task.notes.substring(0, 60))}\${task.notes.length > 60 ? '...' : ''}</div>
                            <div class="task-details-content">
                                <div class="task-notes">\${escapeHtml(task.notes)}</div>
                            </div>
                        </div>
                    \` : ''}
                    <div class="task-actions">
                        <button class="btn-flat task-expand-btn" data-task-id="\${task.id}">
                            <i class="material-icons">expand_more</i>
                        </button>
                        <button class="btn-flat task-edit-btn" data-id="\${task.id}">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn-flat task-delete-btn" data-id="\${task.id}">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            \`;

            taskList.appendChild(taskItem);

            // Add event listeners for the new elements
            const checkbox = taskItem.querySelector(\`#task-\${task.id}\`);
            const editBtn = taskItem.querySelector('.task-edit-btn');
            const deleteBtn = taskItem.querySelector('.task-delete-btn');
            const expandBtn = taskItem.querySelector('.task-expand-btn');
            const notesContainer = taskItem.querySelector('.task-notes-container');
            const notesPreview = taskItem.querySelector('.task-notes-preview');
            const notesContent = taskItem.querySelector('.task-details-content');

            checkbox.addEventListener('change', () => toggleTask(task.id));
            editBtn.addEventListener('click', () => editTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            if (notesContainer) {
                expandBtn.addEventListener('click', () => {
                    const isExpanded = notesContent.classList.contains('expanded');
                    if (isExpanded) {
                        // Collapse
                        notesContent.classList.remove('expanded');
                        expandBtn.innerHTML = '<i class="material-icons">expand_more</i>';
                    } else {
                        // Expand
                        notesContent.classList.add('expanded');
                        expandBtn.innerHTML = '<i class="material-icons">expand_less</i>';
                    }
                });

                // If task has notes, make the preview clickable too
                if (notesPreview) {
                    notesPreview.addEventListener('click', () => {
                        const isExpanded = notesContent.classList.contains('expanded');
                        if (isExpanded) {
                            // Collapse
                            notesContent.classList.remove('expanded');
                            expandBtn.innerHTML = '<i class="material-icons">expand_more</i>';
                        } else {
                            // Expand
                            notesContent.classList.add('expanded');
                            expandBtn.innerHTML = '<i class="material-icons">expand_less</i>';
                        }
                    });
                }
            }
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

    // Function to edit task - populate form with existing values
    async function editTask(id) {
        try {
            const response = await fetch(\`/data/tasks/\${id}\`);
            if (response.ok) {
                const task = await response.json();

                // Populate the form fields with task data
                document.getElementById('taskInput').value = task.title;
                document.getElementById('priorityInput').value = task.priority;

                // Handle due date and time
                if (task.due_date) {
                    const dueDate = new Date(task.due_date);
                    // Format date to YYYY-MM-DD for input
                    const dateStr = dueDate.toISOString().split('T')[0];
                    // Format time to HH:MM for input
                    const timeStr = dueDate.toTimeString().substring(0, 5);

                    document.getElementById('dueDateInput').value = dateStr;
                    document.getElementById('dueTimeInput').value = timeStr;
                } else {
                    document.getElementById('dueDateInput').value = '';
                    document.getElementById('dueTimeInput').value = '';
                }

                document.getElementById('notesInput').value = task.notes || '';

                // Show the form if it's hidden
                const addTaskCard = document.getElementById('addTaskCard');
                if (addTaskCard && (addTaskCard.style.display === 'none' || addTaskCard.style.display === '')) {
                    addTaskCard.style.display = 'block';
                }

                // Focus on title input
                document.getElementById('taskInput').focus();

                // Change button text to "更新任务" and set data-task-id
                const addTaskBtn = document.getElementById('addTaskBtn');
                addTaskBtn.innerHTML = '<i class="material-icons left">edit</i>更新任务';
                addTaskBtn.dataset.taskId = task.id;

                // Change cancel button text
                const hideTaskBtn = document.getElementById('hideTaskBtn');
                if (hideTaskBtn) {
                    hideTaskBtn.innerHTML = '<i class="material-icons left">close</i>取消';
                    hideTaskBtn.onclick = function() {
                        // Reset button to original state
                        const addTaskBtn = document.getElementById('addTaskBtn');
                        addTaskBtn.innerHTML = '<i class="material-icons left">add</i>添加任务';
                        delete addTaskBtn.dataset.taskId;

                        // Clear the form and reset to default values
                        document.getElementById('taskInput').value = '';
                        document.getElementById('dueDateInput').value = '';
                        document.getElementById('dueTimeInput').value = '';
                        document.getElementById('priorityInput').value = 'medium';
                        document.getElementById('notesInput').value = '';

                        // Reinitialize Materialize select
                        M.FormSelect.init(priorityInput, {});

                        // Change button text back to "收起"
                        hideTaskBtn.innerHTML = '<i class="material-icons left">close</i>收起';
                    };
                }

                // Update Materialize select to show correct priority
                M.FormSelect.init(priorityInput, {});
                document.getElementById('priorityInput').value = task.priority;
                M.FormSelect.init(priorityInput, {});
            } else {
                console.error('Failed to fetch task for editing');
            }
        } catch (error) {
            console.error('Error fetching task for editing:', error);
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
    "name": "YGS云端待办事项",
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
    'txt': 'text/plain; charset=utf-8',
    'ics': 'text/calendar; charset=utf-8'
};

// Function to convert tasks to iCalendar format
function tasksToICalendar(tasks) {
    let calendarContent = 'BEGIN:VCALENDAR\r\n';
    calendarContent += 'VERSION:2.0\r\n';
    calendarContent += 'PRODID:-//Cloudflare Todo List//Calendar Export//EN\r\n';
    calendarContent += 'METHOD:PUBLISH\r\n';      // 新增：声明发布方式
    calendarContent += 'CALSCALE:GREGORIAN\r\n';  // 新增：声明历法

    // 辅助函数：将 Date 对象格式化为 ICS 字符串 (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (date) => {
        const year = String(date.getUTCFullYear()).padStart(4, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hour = String(date.getUTCHours()).padStart(2, '0');
        const minute = String(date.getUTCMinutes()).padStart(2, '0');
        const second = String(date.getUTCSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hour}${minute}${second}Z`;
    };

    // 辅助函数：将 Date 对象格式化为 ICS 全天日期字符串 (YYYYMMDD)
    const formatICSDateAllDay = (date) => {
        const year = String(date.getUTCFullYear()).padStart(4, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    };

    tasks.forEach(task => {
        calendarContent += 'BEGIN:VEVENT\r\n';

        // Format the task title
        calendarContent += `SUMMARY:${task.title.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}\r\n`;

        // Set the due date if available
        if (task.due_date) {
            const startDate = new Date(task.due_date);
            // 修正：结束时间 = 开始时间 + 30分钟 (30 * 60 * 1000 毫秒)
            const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

            calendarContent += `DTSTART:${formatICSDate(startDate)}\r\n`;
            calendarContent += `DTEND:${formatICSDate(endDate)}\r\n`;
        } else {
            // If no due date is set, create an all-day event
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // +1 day for all-day event

            calendarContent += `DTSTART;VALUE=DATE:${formatICSDateAllDay(startDate)}\r\n`;
            calendarContent += `DTEND;VALUE=DATE:${formatICSDateAllDay(endDate)}\r\n`;
        }

        // Set unique ID for the event
        calendarContent += `UID:${task.id}@todo.want.biz\r\n`;

        // Set creation date
        const createdDate = task.created_at ? new Date(task.created_at) : new Date();
        calendarContent += `DTSTAMP:${formatICSDate(createdDate)}\r\n`;

        // Set last modification date
        const modifiedDate = task.created_at ? new Date(task.created_at) : new Date();
        calendarContent += `LAST-MODIFIED:${formatICSDate(modifiedDate)}\r\n`;

        // Add description if available
        if (task.notes) {
            calendarContent += `DESCRIPTION:${task.notes.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')}\r\n`;
        }

        // Add status - completed or not
        if (task.completed) {
            calendarContent += 'STATUS:COMPLETED\r\n';
        } else {
            calendarContent += 'STATUS:NEEDS-ACTION\r\n';
        }

        // Set priority (1-9, with 1 being highest)
        let priority = 5; // default
        if (task.priority === 'high') priority = 1;
        else if (task.priority === 'low') priority = 9;
        calendarContent += `PRIORITY:${priority}\r\n`;

        calendarContent += 'END:VEVENT\r\n';
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