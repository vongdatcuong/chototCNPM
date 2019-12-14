$(document).ready(function () {
    
});

var btnContainer = document.getElementById("myDIV");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("my_btn");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("my_active");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" my_active", "");
        }

        // Add the active class to the current/clicked button
        this.className += " my_active";
    });
}