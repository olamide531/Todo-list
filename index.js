const dayDisplay = document.getElementById('dayDisplay');
const dateDisplay = document.getElementById('dateDisplay');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const tabButtons = document.querySelectorAll('.tab-btn');

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const showTasksBtn = document.getElementById('showTasksBtn');



   

     let taskStore = {
      "2025-05-28": [
        { text: "Do laundry", done: false, period: "Day" },
        { text: "Weekly planning", done: false, period: "Week" }
      ],
      "2025-05-29": [
        { text: "Go shopping", done: false, period: "Day" },
        { text: "Monthly report", done: false, period: "Month" }
      ]
    };

    let currentDate = new Date('2025-06-03'); 
    let currentPeriod = 'Day';

    function getDateKey(date) {
      return date.toISOString().split('T')[0]; 
    }

    function updateCalendarDisplay() {
      const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const date = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
      dayDisplay.textContent = day;
      dateDisplay.textContent = date;

      renderTasks(); 
    }

    prevBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 1);
      updateCalendarDisplay();
    });

    nextBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 1);
      updateCalendarDisplay();
    });

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        currentPeriod = btn.dataset.period;
        tabButtons.forEach(b => b.classList.remove('text-black', 'border-b-2', 'border-black', 'pb-1'));
        btn.classList.add('text-black', 'border-b-2', 'border-black', 'pb-1');
        renderTasks();
      });
    });
    function renderTasks() {
      taskList.innerHTML = '';

      const dateKey = getDateKey(currentDate);
      const dayTasks = taskStore[dateKey] || [];

      dayTasks
        .filter(t => t.period === currentPeriod)
        .forEach(task => {
          const li = document.createElement('li');
          li.className = 'flex items-center justify-between bg-black p-2 rounded';

          const left = document.createElement('div');
          left.className = 'flex items-center space-x-2';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = task.done;
          checkbox.className = 'black';
          checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            renderTasks();
          });

          const taskText = document.createElement('span');
          taskText.textContent = task.text;
          taskText.className = `text-sm text-white  ${task.done ? 'line-through' : ''}`;
          if (task.done) {
          taskText.style.textDecorationColor = 'black ';
          taskText.style.textDecorationThickness = '3px';
          }

          left.appendChild(checkbox);
          left.appendChild(taskText);

          const actions = document.createElement('div');
          actions.className = 'flex space-x-2';

          const editBtn = document.createElement('button');
          editBtn.innerHTML = ` <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 transition">
           <path fill-rule="evenodd" clip-rule="evenodd"
            d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
          /> </svg>`;
          editBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.className = 'bg-gray-700 text-white p-1 rounded text-sm outline-none';
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                task.text = input.value.trim() || task.text;
                renderTasks();
              }
            });
            input.addEventListener('blur', () => {
              task.text = input.value.trim() || task.text;
              renderTasks();
            });
            left.replaceChild(input, taskText);
            input.focus();
          });

          const delBtn = document.createElement('button');
          delBtn.innerHTML = `<svg fill="white" viewBox="0 0 24 24" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"/>
          </svg>`;

          delBtn.className = 'text-white text-xs p-1 ';
          delBtn.addEventListener('click', () => {
            const index = dayTasks.indexOf(task);
            if (index > -1) {
              dayTasks.splice(index, 1);
              taskStore[dateKey] = dayTasks;
              renderTasks();
            }
          });

          actions.appendChild(editBtn);
          actions.appendChild(delBtn);

          li.appendChild(left);
          li.appendChild(actions);
          taskList.appendChild(li);
        });
    }
       showTasksBtn.textContent = 'Add'; 

   
        showTasksBtn.addEventListener('click', () => {
         const text = taskInput.value.trim();
        if (!text) return;

        const dateKey = getDateKey(currentDate);
       if (!taskStore[dateKey]) taskStore[dateKey] = [];

       taskStore[dateKey].push({
        text,
        done: false,
        period: currentPeriod,
        });

       taskInput.value = '';
       taskList.style.display = 'block';

  
       showTasksBtn.textContent = 'Add';

        renderTasks();
       });

   
    

    
    updateCalendarDisplay();
