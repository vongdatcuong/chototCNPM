$(document).ready(function () {
    const $avatar_file = $('#avatar_file');

    $avatar_file.on('change', function (e) {
        pickImage(this, document.querySelector("#avatarModal .avatar"));
    })
})