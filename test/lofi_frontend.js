document.addEventListener('DOMContentLoaded', () => {

  // digital clock
  let clock = document.querySelector('.clock');
  let emoji = document.querySelector('.emoji');
  let daytime_emojis = ['☀️', '🌥️', '🙌', '🏙️☀️', '🌴🏖️','💻☕','💯','🪴','🪟🪴','☀️🌱'];
  let nighttime_emojis = ['🛏️🌙', '🌙', '🌃','✨🪐✨', '🪐💫', getMoonPhaseEmoji()];
  let sunrise_emojis = ['🌅', '🌄', '🌇', '🌺'];

  function getTime() {
    let hours24 = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let hours12 = hours24 % 12 || 12;
    return [hours24, minutes, seconds, hours12];
  }
  function updateTime() {
    [hours24, minutes, seconds, hours12] = getTime();
    min = minutes < 10 ? "0" + minutes : minutes;
    sec = seconds < 10 ? "0" + seconds : seconds;

    clock.innerHTML = `${hours12}:${min}:${sec}`;
    setTimeout(updateTime, 1000);
  }
  function updateSeconds(sec) { //if i want to make seconds clickable and removable
  }

  function updateEmoji(){
    [hours24, minutes, seconds, hours12] = getTime();
    let nextEmoji = '';
    if ((hours24 >= 8 && hours24 < 19) )
      nextEmoji = getRandomEmoji(daytime_emojis);
    else if ( (hours24 >= 21 || hours24 < 6))
        nextEmoji = getRandomEmoji(nighttime_emojis);
    else if( ( (hours24 >= 6 && hours24 < 8) || (hours24 >= 19 && hours24 < 21) ))
        nextEmoji = getRandomEmoji(sunrise_emojis);

    if (nextEmoji)
      emoji.innerHTML = `${nextEmoji}`;
  }
  function getRandomEmoji(emojis) {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  updateEmoji();
  updateTime();

  // change emoji on click
  emoji.addEventListener('click', () => {
    updateEmoji();
  })

  //random Tasks Message
  let task_message = document.querySelector('.task-header')
  function getRandom_Task_Message() {
    let tasks_messages = ["I am currently", "My plan for today", "Today I will", "Today's goals"]
    task_message.innerHTML = tasks_messages[Math.floor(Math.random() * tasks_messages.length)] + ":";
  }
  getRandom_Task_Message();





  // toggle background menu
  let bg_menu_Button = document.querySelector('.bg-menu-button');
  let bg_menu = document.querySelector('.bg-menu')

  bg_menu_Button.addEventListener('click', () =>{
    bg_menu.classList.toggle('hidden');
  });


  // replace current background with bg in menu // upload new backgrond
  let current_background = document.querySelector('.current_background');
  document.getElementById("bg-videos").addEventListener("click", (event) => {
      let bg_video_li = event.target.closest("li");
      let contains_video = bg_video_li.querySelector('video');
      if (contains_video) {
          changeBackground(contains_video.src);
      }
  });
  
  document.getElementById('add-bg-button').addEventListener('click', function () {
      document.getElementById('video-upload').click();
  });
  
  function changeBackground(newVideoSrc) {
    // Add fade-out class to current video
    current_background.classList.add('fade-out');

    // Wait for the fade-out transition to complete
    setTimeout(() => {
        // Change the video source
        current_background.setAttribute('src', newVideoSrc);

        // Remove the fade-out class
        current_background.classList.remove('fade-out');
    }, 500); // Match this duration with the CSS transition duration
}

//upload new .mp4 background
document.getElementById('video-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newVideoSrc = e.target.result;
            const newListItem = document.createElement('li');
            newListItem.classList.add('pointer');
            const newVideo = document.createElement('video');
            newVideo.src = newVideoSrc;
            newVideo.loop = true;
            newVideo.muted = true;
            newListItem.appendChild(newVideo);
            const addButton = document.getElementById('add-bg-button');
            addButton.parentNode.insertBefore(newListItem, addButton);
        };
        reader.readAsDataURL(file);
    }
});
  // // add new URL background embeddeditem to bg-menu 
  // document.querySelector(".add-new-bg").addEventListener("click", () => {
  //   let url = document.getElementById("bg-URL-Input").value;
  //   let bg_videos = document.getElementById('bg-videos');
  //   let li_item = document.createElement('li');

  //   li_item.appendChild(bg_embedVideo(url));
  //   bg_videos.insertBefore(li_item, bg_videos.querySelector('.add-bg-button')); // Insert before the "Add" button
  //   })

  //   //background video from URL
  //   function bg_embedVideo(url) {
  //     const videoId = extractVideoId(url);
      
  //     if (videoId) {
  //       const iframe = document.createElement('iframe');
  //       iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  //       iframe.frameBorder = "0";
  //       iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  //       iframe.allowFullscreen = false;
  //       return iframe;
  //     } else {
  //       alert('Invalid URL');
  //       return null;
  //     }
  //   }




// background seek buttons
let bg_seek_button_left = document.querySelector('.bg-seek-buttons .seek-button.left');
let bg_seek_button_right = document.querySelector('.bg-seek-buttons .seek-button.right');
let bg_currentIndex = 0;

bg_seek_button_left.addEventListener(('click'), () => {
    let allVideos_li = document.getElementById('bg-videos').querySelectorAll('li');
    bg_currentIndex = (bg_currentIndex - 1 + (allVideos_li.length - 1)) % (allVideos_li.length - 1); // Move to the next item, loop back to start if at the end, skip add item
    changeBackground(allVideos_li[bg_currentIndex].querySelector('video').src);
});

bg_seek_button_right.addEventListener(('click'), () => {
    let allVideos_li = document.getElementById('bg-videos').querySelectorAll('li');
    bg_currentIndex = (bg_currentIndex + 1) % (allVideos_li.length - 1); // Move to the next item, loop back to start if at the end
    changeBackground(allVideos_li[bg_currentIndex].querySelector('video').src);
});







  // toggle media-dropdown menu
  let dropdownButton = document.querySelector('.dropdown');
  let media_menu = document.querySelector('.media-menu')

  dropdownButton.addEventListener('click', () =>{
    media_menu.classList.toggle('hidden');

    let addMediaPopup = media_menu.querySelector('.addMedia')
    if(!(addMediaPopup.classList.contains('hidden'))){ //closed by default when opening menu or closes it when menu closes
      addMediaPopup.style.display = "none";
      addMediaPopup.classList.add('hidden');
    }
  });

  // replace videoplayer with iframe in menu 
  let videoplayer_iframe = document.querySelector('.videoplayer');
  document.getElementById("media-videos").addEventListener("click", (event) => {
    let video_li = event.target.closest("li");
    let addMediaPopup = media_menu.querySelector('.addMedia')

    contains_iframe = video_li.querySelector('iframe'); 
    if(contains_iframe){
      videoplayer_iframe.src = video_li.querySelector("iframe").src;
    }
    else{
      if(addMediaPopup.classList.contains("hidden")){
        addMediaPopup.style.display = "flex";
        addMediaPopup.classList.remove('hidden');    
      }
      else{
        addMediaPopup.style.display = "none";
        addMediaPopup.classList.add('hidden');    
      }    
    }
  });

  // add new video embeddeditem to media-menu 
  document.querySelector(".submitInput").addEventListener("click", () => {
    newMediaVideo();
    })
  document.getElementById('URLInput').onkeydown = function(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      newMediaVideo();
    }
  };

  function newMediaVideo(){
    let url = document.getElementById("URLInput").value;
    let media_videos = document.getElementById('media-videos');
    let li_item = document.createElement('li');  
    li_item.appendChild(embedVideo(url));
    media_videos.insertBefore(li_item, media_videos.querySelector('.addMediaButton')); // Insert before the "Add" button
    document.getElementById("URLInput").value = ''; // clear input box
  }


  
  // Create and return an iframe element
  function embedVideo(url) {
    const videoId = extractVideoId(url);
    
    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      return iframe;
    } else {
      alert('Invalid URL');
      return null;
    }
  }

  // Extract video ID from URL
  function extractVideoId(url) {
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get('v');
  
      if (videoId) {
        return videoId;
      } else {
        // Handle URLs with paths such as "youtube.com/watch/xyz" or "youtu.be/xyz"
        const pathParts = urlObj.pathname.split('/');
        if (pathParts.length > 1) {
          videoId = pathParts[pathParts.length - 1];
          if (videoId.length === 11) { // YouTube video IDs are 11 characters long
            return videoId;
          }
        }
  
        // Check for shorter YouTube URLs
        const shortUrlPattern = /^https:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})$/;
        const match = url.match(shortUrlPattern);
        if (match) {
          return match[1];
        }
      }
    } catch (e) {
      console.error('Error extracting video ID:', e);
    }
    return null;
  }


  // seek buttons on videoplayer
  let seek_button_left = document.querySelector('.horizontal .seek-button.left'); // no space
  let seek_button_right = document.querySelector('.horizontal .seek-button.right');
  let currentIndex = 0;

  seek_button_left.addEventListener(('click'), () =>{

    let allVideos_li = document.getElementById('media-videos').querySelectorAll('li');
    currentIndex = (currentIndex - 1 + (allVideos_li.length-1)) % (allVideos_li.length-1); // Move to the next item, loop back to start if at the end, skip add item
    videoplayer_iframe.src = allVideos_li[currentIndex].querySelector('iframe').src; // Change the video source to the next item's source
  })

   seek_button_right.addEventListener(('click'), () =>{
    let allVideos_li = document.getElementById('media-videos').querySelectorAll('li');
    currentIndex = (currentIndex + 1) % (allVideos_li.length-1); // Move to the next item, loop back to start if at the end
    videoplayer_iframe.src = allVideos_li[currentIndex].querySelector('iframe').src; // Change the video source to the next item's source
  })  

 // add new task
 document.getElementById('task-input').onkeydown = function(e){
  if (e.key === 'Enter' || e.keyCode === 13) {
    addNewTask();
  }
};

document.querySelector(".addBtn").addEventListener("click", () => {
  addNewTask();
});

function addNewTask(){
  if(document.getElementById("task-input").value){
    let newTask = document.getElementById("task-input").value;
    let taskItems = document.querySelectorAll(".tasks-items li");

    // Check if the first two list items are placeholders
    if (taskItems.length > 0 && (taskItems[0].innerText.includes("Get the day started!!!") || taskItems[0].innerText.includes("...")) && !(taskItems[0].classList.contains("line-through"))) {
      updateTaskItem(taskItems[0], newTask);
    } else if (taskItems.length > 1 && taskItems[1].innerText.includes("...") && !(taskItems[1].classList.contains("line-through"))) {
      updateTaskItem(taskItems[1], newTask);
    } else {
      // Add a new task if placeholders are already replaced
      let li = document.createElement('li');
      createTaskItem(li, newTask);
      document.querySelector(".tasks-items").appendChild(li);
    }

    document.getElementById("task-input").value = ''; // Clear input box
  }
}

function updateTaskItem(taskItem, newTask) {
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

function createTaskItem(li, newTask) {
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

  // document.querySelector(".tasks").addEventListener("mouseover", () =>{     //outer EventListner for updating querySelectorAll to include appended tasks
  //   document.querySelector(".tasks-items").querySelectorAll('li').forEach(task => {
  //     task.addEventListener("click", () => {
  //       let checkmark = task.querySelector('.checkmark');
  
  //       if(checkmark.classList.contains("hidden")){
  //         checkmark.style.display = "flex";
  //         checkmark.classList.remove("hidden");
  //       }
  //       else{
  //         checkmark.style.display = "none";
  //         checkmark.classList.add("hidden");
  //       }
  //   });
  // });
  // });
  document.querySelector(".tasks-items").addEventListener("click", (event) => {
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
});



//-----------------------











 

  // change clock emoji moon phase
  function getMoonPhaseEmoji() {
    const moonPhases = [
      '🌑', // New Moon
      '🌒', // Waxing Crescent
      '🌓', // First Quarter
      '🌔', // Waxing Gibbous
      '🌕', // Full Moon
      '🌖', // Waning Gibbous
      '🌗', // Last Quarter
      '🌘', // Waning Crescent
    ];
  
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() is zero-based
    const day = now.getDate();
  
    // Convert the year, month, day into the Julian Date
    const c = Math.floor((year / 100));
    const e = 2 - c + Math.floor(c / 4);
    const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524.5;
  
    // Calculate the number of days since the last new moon
    const daysSinceNewMoon = jd - 2451550.1;
    const newMoons = daysSinceNewMoon / 29.53058867;
    const phase = newMoons - Math.floor(newMoons);
  
    let index = Math.floor(phase * 8);
    if (index >= 8) index = 0;
  
    return moonPhases[index];
  }
});