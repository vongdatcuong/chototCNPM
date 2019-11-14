$(document).ready(function () {
    $('#loginBtn').on('click', (e) => {
        login(document.loginForm.username.value, document.loginForm.password.value, document.loginForm.keepIn.value);
        return false;
    })

    function login(username, password, keepIn) {
        const input = {
            username: username,
            password: password,
            keepIn: false
        };
        return $.ajax({
            url: "/Account/Login",
            type: "POST",
            dataType: 'json',
            data: input,
        }).done((result) => {
            const r = result;
        }).fail((err) => {
            const r = err;
        });
            
            
    }
});