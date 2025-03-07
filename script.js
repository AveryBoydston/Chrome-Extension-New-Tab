import * as tasks from './js/tasks.js';
import * as clock from './js/clock.js';
import * as searchbar from './js/searchbar.js';
import * as settings from './js/settings.js';
import * as authmodal from './authentication/authmodal.js'

document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('.widget');
    const body = document.querySelector('body');
    const toggleButton = document.getElementById('toggleDrag');
    let dragEnabled = false;

    // Define default positions for widgets
    const defaultPositions = {
        "tasksid": {left: 90, top: 85},
        "toggleDrag": {left: 79, top: 97},
        "clockid": {left: 50, top: 40},
        "searchid": {left: 50, top: 55},
        "hyperlinksID":{left:50, top: 65},
        "toggleSettings": {left: 1.5, top: 2.25}
    };

    widgets.forEach(widget => {

        let isDragging = false;
        const widgetWidth = widget.offsetWidth; 
        const widgetHeight = widget.offsetHeight;
        // console.log("widget width: " + widgetWidth)
        // console.log("widget height: " + widgetHeight) 

        // Load widget's position, saved LocalStorage or default
        const savedPosition = JSON.parse(localStorage.getItem(widget.id + 'Position'));
        if (savedPosition) {
            widget.style.left = `${savedPosition.left}px`;
            widget.style.top = `${savedPosition.top}px`;
        }else if (defaultPositions[widget.id]) { // default position
        const left = defaultPositions[widget.id].left !== undefined ? defaultPositions[widget.id].left : 0;
        const top = defaultPositions[widget.id].top !== undefined ? defaultPositions[widget.id].top : 0;
        
        requestAnimationFrame(() => { // Ensure the widget is rendered to get accurate width and height
            const widgetWidth = widget.offsetWidth; 
            const widgetHeight = widget.offsetHeight; 
            // console.log("widget width: " + widgetWidth); 
            // console.log("widget height: " + widgetHeight);

            widget.style.left = `calc(${left}% - ${widgetWidth / 2}px)`; 
            widget.style.top = `calc(${top}% - ${widgetHeight / 2}px)`; 
            // console.log("widget.style.left: " + widget.style.left); 
            // console.log("widget.style.top: " + widget.style.top); 
        }); 
    }

        body.style.display = "block"; // display after loading widgets positions

        widget.addEventListener('mousedown', (e) => {
            if (!dragEnabled) return;

            isDragging = true;
            widget.classList.add('bouncing');
            widget.style.cursor = 'grabbing';

            const offsetX = e.clientX - widget.getBoundingClientRect().left;
            const offsetY = e.clientY - widget.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(event) {
                if (!isDragging) return;

                let left = event.clientX - offsetX;
                let top = event.clientY - offsetY;

                if (left < 0) left = 0;
                if (top < 0) top = 0;

                if (left + widget.offsetWidth > window.innerWidth)
                    left = window.innerWidth - widget.offsetWidth;
                if (top + widget.offsetHeight > window.innerHeight)
                    top = window.innerHeight - widget.offsetHeight;

                widget.style.left = `${left}px`;
                widget.style.top = `${top}px`;
            }

            function onMouseUp() {
                isDragging = false;
                widget.classList.remove('bouncing');
                widget.style.cursor = 'pointer';

                // Save the widget's position in localStorage
                const position = {
                    left: widget.getBoundingClientRect().left,
                    top: widget.getBoundingClientRect().top
                };
                localStorage.setItem(widget.id + 'Position', JSON.stringify(position));

                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        });

        widget.addEventListener('click', (e) => { // stops interaction with widgets while dragging
            if (dragEnabled) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    // Settings
    const settingDiv = document.querySelector(".settings");settingDiv
    document.getElementById("toggleSettings").addEventListener("click", () => {
        settingDiv.classList.toggle("hidden");
        settingDiv.classList.toggle("slide-in"); 
        // setTimeout(() => {
        //     settingDiv.classList.remove("slide-in"); 
        //   }, 500); 
        
    })

    // Toggle drag button
    toggleButton.addEventListener('click', () => {
        dragEnabled = !dragEnabled;
        toggleButton.textContent = dragEnabled ? "🔓" : "🔒";
        widgets.forEach(widget => {
            widget.style.cursor = dragEnabled ? 'grab' : 'default';
            widget.classList.remove('bouncing');
        }); 
    });

    // Disable other functionalities if dragging is enabled
    document.addEventListener('click', (e) => {
        if (dragEnabled && !e.target.classList.contains('drag')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    // Tasks
    tasks.getRandom_Task_Message();

    document.getElementById('task-input').onkeydown = function(e) {
        if (!dragEnabled && (e.key === 'Enter' || e.keyCode === 13)) {
            tasks.addNewTask();
        }
    };

    document.querySelector(".addBtn").addEventListener("click", () => {
        if (!dragEnabled) {
            tasks.addNewTask();
        }
    });

    document.querySelector(".tasks ul").addEventListener("click", (event) => {
        if (!dragEnabled) {
            tasks.CheckmarkDelete(event);
        }
    });

    // Clock
    const clockElement = document.querySelector('.clock');
    let hour12Bool;
    if(clockElement.classList.contains("12-hour")){
        hour12Bool = true
    }
    else if(clockElement.classList.contains("24-hour")){
        hour12Bool = false
    }
    setInterval(() => clock.updateClock(clockElement, hour12Bool), 1000);
    clock.updateClock(clockElement, hour12Bool);

    // Search bar
    document.getElementById("invisible-search-button").addEventListener("click", searchbar.search);
    document.getElementById("searchInput").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchbar.search();
        }req.body
    });

    document.querySelectorAll("#tab").forEach(tab => {
        tab.addEventListener("click", (event) => {
            settings.openTab(event, tab);
        })
    })
});


export function getWidgetPositions() {
    const widgets = document.querySelectorAll('.widget'); // Select draggable widgets

    const positions = {};
    widgets.forEach(widget => {
        positions[widget.id] = { // Use widget id as key
            top: widget.style.top,
            left: widget.style.left
        };
    });
    console.log(positions)
    return positions;
}

export function getTasks() {
    const taskItems = document.querySelectorAll('#tasksid ul li'); // Select task list items
    const tasks = [];
    taskItems.forEach(item => {
        const text = item.textContent.trim(); // Get task text
        const checked = item.querySelector('input[type="checkbox"]').checked; // Checkbox state
        tasks.push({ text: text, checked: checked });
    });
    console.log(tasks)
    return tasks;
}

 export function setWidgetPositions(widgetPositions) {
    if (!widgetPositions) return; // base case no saved positions

    Object.keys(widgetPositions).forEach(widgetId => {
        const widget = document.getElementById(widgetId);
        if (widget) {
            widget.style.top = widgetPositions[widgetId].top;
            widget.style.left = widgetPositions[widgetId].left;

            // Save the widget's position in localStorage
            const position = {
                top: widget.getBoundingClientRect().top,
                left: widget.getBoundingClientRect().left
            };
            localStorage.setItem(widget.id + 'Position', JSON.stringify(position));
            
        }
    });
    
}


// ???????????????????????????
export function setTasks(tasksData) {
    if (!tasksData) return; // Handle case of no saved tasks

    const taskListUl = document.querySelector('#tasksid ul');
    taskListUl.innerHTML = ''; // Clear existing tasks

    tasksData.forEach(task => {
        const li = document.createElement('li');
        li.style.color = '#ffffff'; // Set your task item color

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.checked;

        const checkmarkBoxSpan = document.createElement('span');
        checkmarkBoxSpan.className = 'checkmark-box';

        const checkmarkDrawSpan = document.createElement('span');
        checkmarkDrawSpan.className = 'checkmark draw hidden';

        li.textContent = task.text + ' '; // Add text content
        li.appendChild(checkbox);
        li.appendChild(checkmarkBoxSpan);
        li.appendChild(checkmarkDrawSpan);

        taskListUl.appendChild(li);
    });
     // Re-attach event listeners to newly created task list (if needed for your task functionality)
    attachTaskEventListeners(); // You may need to re-implement this function based on your task event handling logic

}

export  function attachTaskEventListeners() {
    // Implement your task event listener attachment logic here
    // Example: for checkbox changes, task deletion, etc.
    // This is a placeholder, you'll need to adapt it based on your task list interactions.
    console.log("Placeholder for attachTaskEventListeners() - Implement your task event logic here!");
}
// ???????????????????????????

export function saveTasksToLocalStorage() {
    const tasks = getTasks(); // Get current tasks from the UI using your getTasks() function
    localStorage.setItem('tasksData', JSON.stringify(tasks)); // Save tasks to localStorage as JSON string
    console.log("Tasks saved to localStorage."); // Optional: confirmation log
}