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
    const $loginForm = $(document.loginForm);
    const $registerForm = $(document.registerForm);
    const $loginErrMsg = $('#login_error');
    const $registerMsg = $('#register_msg');

    //Sessions work
    if (isLoggingIn)
        $loginModal.modal('show');
    if (userJs) {
        gUser = JSON.parse(userJs).Table[0];
        displayNav(true);
    }
    //Get Parameters in sessions
    getParams();
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
    $loginModal.on('hide.bs.modal', (e) => {
        hideLoginErrorMsg();
    })

    $registerModal.on('shown.bs.modal', (e) => {
        $registerModal.find('#register_username').focus();
    });
    $registerModal.on('hide.bs.modal', (e) => {
        hideRegisterMsg();
    })
    //End Modal

    $('#loginBtn').on('click', async (e) => {
        if (!$loginForm.valid())
            return;
        e.preventDefault();
        showLoading();
        try {
            const result = await checkLogin(document.loginForm.username.value, document.loginForm.password.value, document.loginForm.keepIn.checked);
            const user = JSON.parse(result);
            if (user.Table.length > 0) {
                //Login success
                gUser = Object.assign(user.Table[0]);
                displayNav(true);
                $loginModal.modal('hide');
                document.loginForm.reset();
                $loginErrMsg.hide();

                //Navigate to url
                let currentUrl = window.location.href;
                window.location.href = currentUrl.slice(0, currentUrl.indexOf('/')) + returnUrl;
            }
            else {
                //Login failed
                showLoginErrorMsg();
            }
        } catch (e) {
            console.log(e);
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
            window.location.href = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
        } catch (e) {
            console.log(e);
        }
    })
    $('#registerBtn').on('click', async (e) => {
        if (!$registerForm.valid())
            return;
        e.preventDefault();
        showLoading();
        try {
            const result = await register(document.registerForm.username.value, document.registerForm.password.value, document.registerForm.email.value, document.registerForm.phone.value);
            const resultJs = JSON.parse(result);
            if (resultJs.Table.length > 0 && resultJs.Table[0].isSuccess) {
                //Register success
                document.registerForm.reset();
                showRegisterMsg(true);
            }
            else {
                //Register failed
                showRegisterMsg(false);
            }
        } catch (e) {
            console.log(e);
        }
        hideLoading();
        return false;
    })
    //Forms Validate
    $loginForm.validate({
        rules: {
            username: {
                required: true,
            },
            password: {
                required: true
            }
        },
        messages: {
            username: {
                required: "Username không được để trống",
            },
            password: {
                required: "Mật khẩu không được để trống"
            }
        }
    })

    $registerForm.validate({
        rules: {
            username: {
                required: true,
                minlength: 3,
                maxlength: 30
            },
            password: {
                required: true,
                minlength: 6,
                maxlength: 40
            },
            "re-password": {
                required: true,
                equalTo: "#register_password",
                minlength: 6,
                maxlength: 40
            },
            email: {
                required: true,
                email: true,
                minlength: 6,
                maxlength: 40
            },
            phone: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 15
            }
        },
        messages: {
            username: {
                required: "Username không được để trống",
                minlength: "Username phải có tối thiểu 3 ký tự",
                maxlength: "Username chỉ được có tối đa 30 ký tự"
            },
            password: {
                required: "Mật khẩu không được để trống",
                minlength: "Mật khẩu phải có tối thiểu 6 ký tự",
                maxlength: "Mật khẩu chỉ được có tối đa 40 ký tự"
            },
            "re-password": {
                required: "Xác nhận mật khẩu không được để trống",
                equalTo: "Xác nhận mật khẩu không trùng khớp",
                minlength: "Mật khẩu phải có tối thiểu 6 ký tự",
                maxlength: "Mật khẩu chỉ được có tối đa 40 ký tự"
            },
            email: {
                required: "Email không được để trống",
                email: "Email phải có dạng example@abc.com",
                minlength: "Emai phải có tối thiểu 6 ký tự",
                maxlength: "Emai chỉ được có tối đa 40 ký tự"
            },
            phone: {
                required: "Số điện thoại phải có tối thiểu 10 số",
                number: "Số điện thoại phải là số",
                minlength: "Số điện thoại phải có tối thiểu 10 số",
                maxlength: "Số điện thoại chỉ được có tối đa 15 số"
            }
        }
    })
    //End Forms Validate

    //Support functions
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

            $profileDropdown.find('span').text(gUser.firstName || gUser.userName);

            //If User is Admin
            if (gUser.type == 1) {
                $approveLink.show();
            } else {
                $approveLink.hide();
            }
        } else {
            $loginLink.show();
            $registerLink.show();
            $profileDropdown.hide();
            $sellLink.hide();
        }
    }
    function showLoginErrorMsg() {
        $loginErrMsg.show();
        $loginErrMsg.css("display", "block");
        $loginErrMsg.text("Tên đăng nhập hoặc mật khẩu chưa đúng !!!");
    }
    function hideLoginErrorMsg() {
        $loginErrMsg.hide();
    }
    function register(username, pass, email, phone) {
        const input = {
            username: username,
            password: pass,
            email: email,
            phone: phone
        };
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/Account/Register",
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
    function showRegisterMsg(isSuccess) {
        if (isSuccess) {
            Alert.success("Tạo tài khoản <b>THÀNH CÔNG</b> !!!");
        } else {
            $registerMsg.show();
            $registerMsg.css("display", "block");
            $registerMsg.html("Tên đăng nhập đã tồn tại !!!");
        }   
    }
    function hideRegisterMsg() {
        $registerMsg.hide();
    }
    
    //Parameters
    function getParams() {
        return new Promise((resolve, reject) => {
            let allParams = sessionStorage.getItem("ChoTotAllParams")
            if (allParams) {
                const allParamsJs = JSON.parse(allParams);
                gCity = allParamsJs.City;
                gCategory = allParamsJs.Category;
                gParam = allParamsJs.Parameter;
            }
            else {
                $.ajax({
                    url: "/Home/GetParams",
                    type: "GET",
                    dataType: 'json',
                    async: false
                }).done((result) => {
                    const allParamsJs = JSON.parse(result);
                    gCity = allParamsJs.City;
                    gCategory = allParamsJs.Category;
                    gParam = allParamsJs.Parameter;

                    sessionStorage.setItem("ChoTotAllParams", result);
                }).fail((err) => {
                    reject(err);
                });
            }
            
        })
    }

});