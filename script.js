    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function addTask() {
        const input = document.getElementById('taskInput');
        const timeInput = document.getElementById('taskTime');

        if (!input.value.trim()) {
            alert("Please enter a task name.");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: input.value,
            time: timeInput.value || null,
            completed: false,
            notified: false
        };

        tasks.push(newTask);
        saveAndRender();

        input.value = "";
        timeInput.value = "";
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }

    function toggleTask(id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const list = document.getElementById('taskList');
        list.innerHTML = "";

        if (tasks.length === 0) {
            list.innerHTML = `<div class="text-center py-4 text-muted">No tasks yet. Start by adding one!</div>`;
            return;
        }

        tasks.forEach(task => {
            const hasAlarm = task.time !== null;
            const li = document.createElement('div');
            li.className = `list-group-item d-flex justify-content-between align-items-center mb-3 p-3 rounded shadow-sm task-item ${!hasAlarm ? 'no-alarm' : ''}`;
            
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <input type="checkbox" class="form-check-input me-3" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <div>
                        <div class="fw-bold ${task.completed ? 'completed' : ''}">${task.text}</div>
                        <small class="text-muted">
                            <i class="bi ${hasAlarm ? 'bi-alarm text-primary' : 'bi-calendar-event'}"></i> 
                            ${hasAlarm ? new Date(task.time).toLocaleString() : 'No reminder set'}
                        </small>
                    </div>
                </div>
                <button class="btn btn-light btn-sm text-danger border" onclick="deleteTask(${task.id})">
                    <i class="bi bi-trash3"></i>
                </button>
            `;
            list.appendChild(li);
        });
    }

    setInterval(() => {
        const now = new Date().getTime();
        tasks.forEach(task => {
          
            if (task.time && !task.completed && !task.notified) {
                const alarmTime = new Date(task.time).getTime();
                if (now >= alarmTime) {
                    const audio = document.getElementById('alarmSound');
                    audio.play().catch(e => console.log("Audio play deferred until user interaction"));
                    
                    alert(`⏰ ALARM: ${task.text}`);
                    task.notified = true;
                    saveAndRender();
                }
            }
        });
    }, 1000);

    saveAndRender();