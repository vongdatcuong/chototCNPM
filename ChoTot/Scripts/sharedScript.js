$(document).ready(function () {
    const $loginModal = $('#loginModal');
    const $registerModal = $('#registerModal');
    const $loginLink = $('#loginLink');
    const $registerLink = $('#registerLink');
    const $profileLink = $('#profileLink');
    const $sellLink = $('#sellLink');

    //Sessions work
    if (isLoggingIn)
        $loginModal.modal('show');
    if (userJs) {
        gUser = JSON.parse(userJs).Table[0];
        displayNav(true);
    }

    $('#loginBtn').on('click', async (e) => {
        //login(document.loginForm.username.value, document.loginForm.password.value, );
        e.preventDefault();
        showLoading();
        const result = await checkLogin(document.loginForm.username.value, document.loginForm.password.value, document.loginForm.keepIn.checked);
        const user = JSON.parse(result);
        if (user.Table.length > 0) {
            gUser = Object.assign(user.Table[0]);
            displayNav(true);
            $loginModal.modal('hide');
            document.loginForm.reset();
        }
        hideLoading();
        return false;
    })

    function checkLogin(username, pass, rememberMe) {
        const input = {
            username: username,
            password: pass,
            rememberMe: Boolean(rememberMe)
        };
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/Account/Login",
                type: "POST",
                dataType: 'json',
                data: input,
            }).done((result) => {
                resolve(result);
            }).fail((err) => {
                reject(err);
            });
        })
    }

    function displayNav(isLoggingIn) {
        if (isLoggingIn) {
            $loginLink.hide();
            $registerLink.hide();
            $profileLink.show();
            $sellLink.show();

            $profileLink.text("Chào " + gUser.firstName);
        } else {
            $loginLink.show();
            $registerLink.show();
            $profileLink.hide();
            $sellLink.hide();
        }
    }
});