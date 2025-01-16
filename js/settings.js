export function openTab(event, tabName) {
    var i;

    //hide all tabs and contents
    const tabs = document.querySelectorAll("#tab");
    for (i = 0; i < tabs.length; i++) {
        if(tabs[i].classList.contains("active"))
            tabs[i].classList.remove("active");
    }
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Show current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName.textContent).style.display = "block"; //id same as innertext of tab
    event.currentTarget.className += " active";
}