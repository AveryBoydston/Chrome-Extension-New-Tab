let current_background = document.querySelector('.current_background');
console.log("background here")

//transition animation
function changeBackground(newVideoSrc) { 
    current_background.classList.add('fade-out');

    setTimeout(() => {
        current_background.setAttribute('src', newVideoSrc);
        current_background.classList.remove('fade-out');
    }, 500); // matches with duration of CSS transition
}

// toggle background menu
//   let bg_menu_Button = document.querySelector('.bg-menu-button');
  let bg_menu = document.querySelector('.bg-menu')

//   bg_menu_Button.addEventListener('click', () =>{
//     bg_menu.classList.toggle('hidden');
//   });


  // replace current background with bg in menu // upload new backgrond
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
