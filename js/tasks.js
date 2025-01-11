export function getRandom_Task_Message() {
    const task_message = document.querySelector('.task-header');
    if (task_message) {
      const tasks_messages = ["I am currently", "My plan for today", "Today I will", "Today's goals"];
      task_message.innerHTML = tasks_messages[Math.floor(Math.random() * tasks_messages.length)] + ":";
    }
  }
  
  export function addNewTask(){
      if(document.getElementById("task-input").value){
        let newTask = document.getElementById("task-input").value;
        let taskItems = document.querySelectorAll(".tasks ul li");
    
        // Check if the first two list items are placeholders
        if (taskItems.length > 0 && (taskItems[0].innerText.includes("Get the day started!!!") || taskItems[0].innerText.includes("...")) && !(taskItems[0].classList.contains("line-through"))) {
          updateTaskItem(taskItems[0], newTask);
        } else if (taskItems.length > 1 && taskItems[1].innerText.includes("...") && !(taskItems[1].classList.contains("line-through"))) {
          updateTaskItem(taskItems[1], newTask);
        } else {
          // Add a new task if placeholders are already replaced
          let li = document.createElement('li');
          createTaskItem(li, newTask);
          document.querySelector(".tasks ul").appendChild(li);
        }
    
        document.getElementById("task-input").value = ''; // Clear input box
      }
  }
    
  export function updateTaskItem(taskItem, newTask) {
      taskItem.innerText = newTask;
      taskItem.style.color = "#ffffff";
      let inner_input = document.createElement('input');
      inner_input.type = "checkbox";
      
      let inner_span1 = document.createElement('span');
      inner_span1.classList.add("checkmark-box");
    
      let inner_span2 = document.createElement('span');
      inner_span2.classList.add("checkmark", "draw", "hidden");
      inner_span2.style.display = "none";
    
      taskItem.appendChild(inner_input);
      taskItem.appendChild(inner_span1);
      taskItem.appendChild(inner_span2);
  }
    
  export function createTaskItem(li, newTask) {
      li.innerText = newTask;
      let inner_input = document.createElement('input');
      inner_input.type = "checkbox";
      
      let inner_span1 = document.createElement('span');
      inner_span1.classList.add("checkmark-box");
    
      let inner_span2 = document.createElement('span');
      inner_span2.classList.add("checkmark", "draw", "hidden");
      inner_span2.style.display = "none";
    
      li.appendChild(inner_input);
      li.appendChild(inner_span1);
      li.appendChild(inner_span2);
  }
  
  export function CheckmarkDelete(event){
      // Check if the clicked element is an LI or contains an LI
      let task = event.target.closest("li");
      if(task){
          let checkmark = task.querySelector('.checkmark');
          let timeoutId = task.dataset.timeoutId;
  
          if (checkmark.classList.contains("hidden")) {
              checkmark.style.display = "flex";
              checkmark.classList.remove("hidden");
              task.classList.add("line-through");
  
              // Set a timeout to delete the task after 6 seconds
              timeoutId = setTimeout(() => {
                  task.remove();
              }, 6000); // 6 seconds
  
              // Store the timeout ID in the task's dataset
              task.dataset.timeoutId = timeoutId;
          } else {
              checkmark.style.display = "none";
              checkmark.classList.add("hidden");
              task.classList.remove("line-through");
  
              // Clear the timeout if the task is unmarked
              clearTimeout(timeoutId);
              delete task.dataset.timeoutId;
          }
      }
  }
  