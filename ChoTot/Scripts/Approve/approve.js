$(document).ready(function () {
    if (userJs) {
        gUser = JSON.parse(userJs).Table[0];
        displayNav(true);
    }
}