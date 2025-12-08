// Todo List Application
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
            dueDateTime = `${date}T${time}`;
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
        let calendarContent = 'BEGIN:VCALENDAR\n';
        calendarContent += 'VERSION:2.0\n';
        calendarContent += 'PRODID:-//Cloudflare Todo List//Calendar Export//EN\n';

        incompleteTasks.forEach(task => {
            calendarContent += 'BEGIN:VEVENT\n';

            // Format the task title
            calendarContent += `SUMMARY:${task.title}\n`;

            // Set the due date if available
            if (task.dueDate) {
                // Format date as YYYYMMDDTHHMMSSZ
                const date = new Date(task.dueDate);
                const formattedDate = date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
                calendarContent += `DTSTART:${formattedDate}\n`;
                calendarContent += `DTEND:${formattedDate}\n`;
            }

            // Set unique ID for the event
            calendarContent += `UID:${task.id}@cloudflare-todo-list\n`;

            // Set creation date
            const createdDate = new Date(task.createdAt);
            const formattedCreated = createdDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
            calendarContent += `DTSTAMP:${formattedCreated}\n`;

            // Add description if available
            if (task.notes) {
                calendarContent += `DESCRIPTION:${task.notes}\n`;
            }

            // Set priority (1-9, with 1 being highest)
            let priority = 5; // default
            if (task.priority === 'high') priority = 1;
            else if (task.priority === 'low') priority = 9;
            calendarContent += `PRIORITY:${priority}\n`;

            calendarContent += 'END:VEVENT\n';
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