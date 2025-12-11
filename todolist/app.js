// Todo List Application
class TodoApp {
    constructor() {
        this.tasks = [];
        this.init();
    }

    async init() {
        this.tasks = await this.loadTasks();
        this.bindEvents();
        this.renderTasks();
        this.initializeMaterializeComponents();
        this.requestNotificationPermission();
        this.checkForDueTasks();
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

        // Notification permission button
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.requestNotificationPermission();
        });
    }

    initializeMaterializeComponents() {
        // Initialize Materialize selects
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }

    // Request notification permission from user
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support desktop notification');
            return;
        }

        if (Notification.permission === 'granted') {
            console.log('Notification permission already granted');
            return;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        }
    }

    // Show notification for a task
    showNotification(task) {
        if (Notification.permission === 'granted') {
            const options = {
                body: `任务: ${task.title}`,
                icon: '/icon-512x512.svg',
                badge: '/icon-512x512.svg',
                tag: `task-${task.id}`
            };

            // Check if a notification for this task is already displayed
            if ('getNotifications' in ServiceWorkerRegistration.prototype) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) {
                        registration.getNotifications({tag: options.tag}).then(notifications => {
                            if (notifications.length === 0) {
                                // Only show notification if not already shown
                                new Notification(`任务提醒`, options);
                            }
                        });
                    }
                });
            } else {
                new Notification(`任务提醒`, options);
            }
        }
    }

    // Check for tasks that are due soon and notify user
    checkForDueTasks() {
        const now = new Date();
        const soon = new Date(now.getTime() + 5 * 60000); // 5 minutes from now

        this.tasks.forEach(task => {
            if (task.dueDate && !task.completed && !task.notified) {
                const dueDate = new Date(task.dueDate);

                // Check if task is due in the next 5 minutes
                if (dueDate > now && dueDate <= soon) {
                    this.showNotification(task);

                    // Update task to mark as notified
                    this.markAsNotified(task.id);

                    // Show a toast message as well
                    M.toast({html: `任务即将到期：${task.title}`, classes: 'red'});
                }
            }
        });

        // Schedule next check in 1 minute
        setTimeout(() => this.checkForDueTasks(), 60000);
    }

    // Schedule notifications for tasks when they are added
    scheduleTaskNotification(task) {
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const now = new Date();

            if (dueDate > now) {
                const timeUntilDue = dueDate - now;

                // Set a timeout to notify the user when the task is due
                setTimeout(() => {
                    this.showNotification(task);

                    // Mark as notified in the task
                    this.markAsNotified(task.id);

                    // Show a toast message as well
                    M.toast({html: `任务已到期：${task.title}`, classes: 'red'});
                }, timeUntilDue);
            }
        }
    }

    async loadTasks() {
        try {
            const response = await fetch('/data/tasks');
            if (response.ok) {
                let tasks = await response.json();
                // Ensure all tasks have a 'notified' field
                tasks = tasks.map(task => ({
                    ...task,
                    notified: task.notified || false
                }));
                this.tasks = tasks;
                return this.tasks;
            } else {
                console.error('Failed to load tasks from database');
                return [];
            }
        } catch (error) {
            console.error('Error loading tasks from database:', error);
            return [];
        }
    }

    async saveTasks() {
        // This method is no longer needed since each operation updates the database individually
    }

    async addTask() {
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
            dueDateTime = `${date}T${time}`;
        }

        const payload = {
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
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const newTask = await response.json();
                // Ensure the new task has the notified field
                if (!('notified' in newTask)) {
                    newTask.notified = false;
                }
                this.tasks.unshift(newTask);
                this.renderTasks();

                // Schedule notification if due date is set
                if (dueDateTime) {
                    this.scheduleTaskNotification(newTask);
                }

                // Reset form
                taskInput.value = '';
                dueDateInput.value = '';
                dueTimeInput.value = '';
                priorityInput.value = 'medium';
                notesInput.value = '';

                // Reinitialize Materialize components after DOM update
                this.initializeMaterializeComponents();

                return newTask;
            } else {
                console.error('Failed to add task to database');
            }
        } catch (error) {
            console.error('Error adding task to database:', error);
        }
    }

    async toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const completed = !task.completed;
            try {
                const response = await fetch(`/data/tasks/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed })
                });

                if (response.ok) {
                    const updatedTask = await response.json();
                    // Update the task in the local array with the updated object from the server
                    Object.assign(task, updatedTask);
                    this.renderTasks();
                } else {
                    console.error('Failed to toggle task in database');
                }
            } catch (error) {
                console.error('Error toggling task in database:', error);
            }
        }
    }

    async deleteTask(id) {
        try {
            const response = await fetch(`/data/tasks/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.renderTasks();
            } else {
                console.error('Failed to delete task from database');
            }
        } catch (error) {
            console.error('Error deleting task from database:', error);
        }
    }

    async editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newTitle = prompt('编辑任务:', task.title);
            if (newTitle !== null && newTitle.trim() !== '') {
                try {
                    const response = await fetch(`/data/tasks/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: newTitle.trim() })
                    });

                    if (response.ok) {
                        const updatedTask = await response.json();
                        // Update the task in the local array with the updated object from the server
                        Object.assign(task, updatedTask);
                        this.renderTasks();
                    } else {
                        console.error('Failed to edit task in database');
                    }
                } catch (error) {
                    console.error('Error editing task in database:', error);
                }
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
            taskItem.className = `collection-item task-item ${task.completed ? 'task-completed completed-task' : ''}`;
            taskItem.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-details">
                        ${task.dueDate ? `<span class="task-due-date">截止: ${this.formatDate(task.dueDate)}</span>` : ''}
                        <span class="task-priority priority-${task.priority}">${this.getPriorityText(task.priority)}</span>
                    </div>
                    ${task.notes ? `<div class="task-notes">${this.escapeHtml(task.notes)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-flat task-edit-btn" data-id="${task.id}">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="btn-flat task-delete-btn" data-id="${task.id}">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            `;
            
            taskList.appendChild(taskItem);

            // Add event listeners for the new elements
            const checkbox = taskItem.querySelector(`#task-${task.id}`);
            const editBtn = taskItem.querySelector('.task-edit-btn');
            const deleteBtn = taskItem.querySelector('.task-delete-btn');

            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            editBtn.addEventListener('click', () => this.editTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        });
    }

    async markAsNotified(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.notified) {
            try {
                const response = await fetch(`/data/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ notified: true })
                });

                if (response.ok) {
                    const updatedTask = await response.json();
                    // Update the task in the local array with the updated object from the server
                    Object.assign(task, updatedTask);
                } else {
                    console.error('Failed to mark task as notified in database');
                }
            } catch (error) {
                console.error('Error marking task as notified in database:', error);
            }
        }
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
        // Redirect to the iCal export endpoint instead of generating locally
        window.location.href = '/event';
        M.toast({html: '正在导出任务到日历...'});
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