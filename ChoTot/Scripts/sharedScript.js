$(document).ready(function () {
    const $loginModal = $('#loginModal');
    const $registerModal = $('#registerModal');
    const $registerInLogin = $('#registerInLogin');
    const $loginInRegister = $('#loginInRegister');
    const $loginLink = $('#loginLink');
    const $registerLink = $('#registerLink');
    const $profileDropdown = $('#profileDropdown');
    const $sellLink = $('#sellLink');
    const $profileLink = $('#profileLink');
    const $approveLink = $('#approveLink');
    const $logoutLink = $('#logoutLink');

    //Sessions work
    if (isLoggingIn)
        $loginModal.modal('show');
    if (userJs) {
        gUser = JSON.parse(userJs).Table[0];
        displayNav(true);
    }
    //End Sessions

    //Modal
    $registerInLogin.on('click', (e) => {
        $loginModal.modal('hide');
        $registerModal.modal('show');
    })

    $loginInRegister.on('click', (e) => {
        $loginModal.modal('show');
        $registerModal.modal('hide');
    })

    $loginModal.on('shown.bs.modal', (e) => {
        $loginModal.find('#login_username').focus();
    });

    $registerModal.on('shown.bs.modal', (e) => {
        $registerModal.find('#register_username').focus();
    });

    //End Modal

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
    $logoutLink.on('click', async (e) => {
        try {
            showLoading();
            const result = await logout();
            displayNav(false);
            hideLoading();
        } catch (e) {
            console.log(e);
        }
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
    function logout() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/Account/Logout",
                type: "GET",
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
            $profileDropdown.show();
            $sellLink.show();

            $profileDropdown.find('span').text(gUser.firstName);
        } else {
            $loginLink.show();
            $registerLink.show();
            $profileDropdown.hide();
            $sellLink.hide();
        }
    }
});