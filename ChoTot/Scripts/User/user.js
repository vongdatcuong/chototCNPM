$(document).ready(function () {
    showLoadingInner();
    $('#userInfoUsername').text(gUser.userName);
    $('#userInfoId').text(gUser.userId);
    $('#userType').text(((gUser.type == 1) ? "Quản trị viên" : "Thành viên"));
    const $userInfoTable = $('#userInfoTable');
    const $userInfoName = $('#userInfoName');
    const $userInfoGender = $('#userInfoGender');
    const $userInfoBirthdate = $('#userInfoBirthdate');
    const $userInfoPhone = $('#userInfoPhone');
    const $userInfoEmail = $('#userInfoEmail');
    const $userInfoAddress = $('#userInfoAddress');
    const $userInfoCity = $('#userInfoCity');
    const $userInfoCreatedDate = $('#userInfoCreatedDate');

    const $editProfileModal = $('#editProfileModal');
    const $editProfileForm = $(document.editProfileForm);
    const $editFirstName = $(document.editProfileForm.firstName);
    const $editLastName = $(document.editProfileForm.lastName);
    const editGender = document.editProfileForm.gender;
    const $editBirthDate = $(document.editProfileForm.birthDate);
    const $editPhone = $(document.editProfileForm.phone);
    const $editEmail = $(document.editProfileForm.email);
    const $editAddress = $(document.editProfileForm.address);
    const $editCity = $(document.editProfileForm.edit_city);

    const $changePasswordModal = $('#changePasswordModal');
    const $changePasswordForm = $(document.changePasswordForm);
    const $changeOldPassword = $('#change_old_password');
    const $changePasswordMsg = $('#changePassword_msg');

    //Change avatar
    const $avatarModal = $('#avatarModal');
    const $changeAvatarForm = $(document.changeAvatarForm);
    const avatarFile = document.changeAvatarForm.avatar_file;
    const $changeAvatarMsg = $('#changeAvatar_msg');
    const $userInfoAvatar = $('#userInfoAvatar');
    const $userInfoAvatarModal = $('#userInfoAvatarModal');
    const $avatar_file = $('#avatar_file');

    loadUserAvatar();
    loadUserInfo();

    $avatar_file.on('change', function (e) {
        pickImage(this, document.querySelector("#avatarModal .avatar"));
    });

    //Edit Profile
    $('#editProfileBtn').on('click', async (e) => {
        e.preventDefault();
        try {
            const result = await setUserInfoToDB();
            const resultJs = JSON.parse(result);
            if (resultJs.Table.length > 0) {
                Alert.success("Thay đổi thông tin thành công !!!");
                $editProfileModal.modal("hide");
                gUser = Object.assign(resultJs.Table[0]);
                loadUserInfo();
            } else {
                Alert.error("Thay đổi thông tin thất bại !!!");
            }
            
        } catch (err) {
            Alert.error("Thay đổi thông tin thất bại !!!");
        }
        return false;
    })

    //Change password
    $('#changePasswordBtn').on('click', async (e) => {
        e.preventDefault();
        try {
            const result = await changeUserPassworDB();
            const resultJs = JSON.parse(result);
            if (resultJs.Table && resultJs.Table.length > 0) {
                showChangePasswordMsg(false, resultJs.Table[0].error);
            } else {
                showChangePasswordMsg(true, "Thay đổi mật khẩu thành công");
                $changePasswordModal.modal("hide");
            }
        } catch (err) {
            Alert.error("Thay đổi mật khẩu thất bại !!!");
        }
        return false;
    })

    //Change avatar
    $('#avatarBtn').on('click', async (e) => {
        e.preventDefault();
        if (!$changeAvatarForm.valid())
            return;
        try {
            const result = await changeUserAvatarDB();
            const resultJs = JSON.parse(result);
            if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].error) {
                showChangeAvatarMsg(false, resultJs.Table[0].error);
            } else {
                showChangeAvatarMsg(true, "Thay đổi ảnh đại diện thành công");
                gUser = resultJs.Table[0];
                pickImage($avatar_file[0], document.querySelector(".avatar"));
                $avatarModal.modal("hide");
            }
        } catch (err) {
            Alert.error("Thay đổi ảnh đại diện thất bại !!!");
        }
        return false;
    })

    //Modals
    $editProfileModal.on('shown.bs.modal', (e) => {
        loadUserEdit();
        $editLastName.focus();
    })
    $changePasswordModal.on('shown.bs.modal', (e) => {
        $changeOldPassword.focus();
    })
    $changePasswordModal.on('hide.bs.modal', (e) => {
        document.changePasswordForm.reset();
        $changePasswordMsg.hide();
    })
    $avatarModal.on('hide.bs.modal', (e) => {
        document.changeAvatarForm.reset();
        $changeAvatarMsg.hide();
    })
    //End Modals

    //Forms Validate
    $editProfileForm.validate({
        rules: {
            lastName: {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            firstName: {
                required: true,
                minlength: 3,
                maxlength: 20
            },
            gender: {
                required: true
            },
            birthDate: {
                required: true,
                lessThanNow: true
            },
            phone: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 15
            },
            email: {
                required: true,
                email: true,
                minlength: 6,
                maxlength: 40
            },
            address: {
                required: true,
                minlength: 10,
                maxlength: 100
            },
            edit_city: {
                required: true
            }
        },
        messages: {
            lastName: {
                required: "Họ không được phép để trống",
                minlength: "Họ phải có tối thiểu 3 ký tự",
                maxlength: "Họ chỉ được có tối đa 20 ký tự"
            },
            firstName: {
                required: "Tên không được phép để trống",
                minlength: "Tên phải có tối thiểu 3 ký tự",
                maxlength: "Tên chỉ được có tối đa 20 ký tự"
            },
            gender: {
                required: "Hãy chọn giới tính"
            },
            birthDate: {
                required: "Ngày sinh không được để trống",
                lessThanNow: "Ngày sinh phải nhỏ hơn hiện tại"
            },
            phone: {
                required: "Số điện thoại phải có tối thiểu 10 số",
                number: "Số điện thoại phải là số",
                minlength: "Số điện thoại phải có tối thiểu 10 số",
                maxlength: "Số điện thoại chỉ được có tối đa 15 số"
            },
            email: {
                required: "Email không được để trống",
                email: "Email phải có dạng example@abc.com",
                minlength: "Emai phải có tối thiểu 6 ký tự",
                maxlength: "Emai chỉ được có tối đa 40 ký tự"
            },
            address: {
                required: "Địa chỉ không được để trống",
                minlength: "Địa chỉ phải có tối thiểu 10 ký tự",
                maxlength: "Địa chỉ chỉ được có tối đa 100 ký tự"
            },
            edit_city: {
                required: "Hãy chọn tỉnh thành"
            }
        }
    })

    $changePasswordForm.validate({
        rules: {
            old_password: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            new_password: {
                required: true,
                minlength: 6,
                maxlength: 20
            },
            new_repassword: {
                required: true,
                minlength: 6,
                maxlength: 20,
                equalTo: "#change_new_password"
            },
        },
        messages: {
            old_password: {
                required: "Mật khẩu cũ không được phép để trống",
                minlength: "Mật khẩu cũ phải có tối thiểu 6 ký tự",
                maxlength: "Mật khẩu cũ chỉ được có tối đa 40 ký tự"
            },
            new_password: {
                required: "Mật khẩu mới không được phép để trống",
                minlength: "Mật khẩu mới phải có tối thiểu 6 ký tự",
                maxlength: "Mật khẩu mới chỉ được có tối đa 40 ký tự"
            },
            new_repassword: {
                required: "Xác nhận mật khẩu mới không được phép để trống",
                minlength: "Xác nhận mật khẩu mới phải có tối thiểu 6 ký tự",
                maxlength: "Xác nhận mật khẩu mới chỉ được có tối đa 40 ký tự",
                equalTo: "Xác nhận mật khẩu không trùng khớp"
            },
        }
    })

    $changeAvatarForm.validate({
        rules: {
            avatar_file: {
                required: true,
                checkFileType: "image",
                checkFileSize: 5 * 1024 * 1024
            }
        },
        messages: {
            avatar_file: {
                required: "Chưa chọn file",
                checkFileType: "Các file phải có dạng ảnh",
                checkFileSize: "File không được quá 5MB"
            }
        }
    })
    //End Forms Validate

    //Edit Profile
    function loadUserInfo() {
        if (gUser) {
            $userInfoName.text(gUser.lastName + ' ' + gUser.firstName);
            $userInfoGender.text(gUser.gender);
            $userInfoBirthdate.text(parseDate(gUser.birthDate, '/'));
            $userInfoPhone.text(gUser.phone);
            $userInfoEmail.text(gUser.email);
            $userInfoAddress.text(gUser.address);
            $userInfoCity.text(gCity[gUser.city].fullName);
            $userInfoCreatedDate.text(parseDateTime(gUser.createdDate, '/'));
            $userInfoTable.show();
            hideLoadingInner();
        }
    }

    function loadUserEdit() {
        if (gUser) {
            $editFirstName.val(gUser.firstName);
            $editLastName.val(gUser.lastName);
            editGender.value = gUser.gender;
            $editBirthDate.val(parseDateInput(gUser.birthDate));
            $editPhone.val(gUser.phone);
            $editEmail.val(gUser.email);
            $editAddress.val(gUser.address);
            $editCity.val(gUser.city);
        }
    }

    function setUserInfoToDB() {
        showLoading();
        return $.ajax({
            url: "/User/setUserInfo",
            type: "POST",
            dataType: "json",
            data: getEditData()
        })
            .done((result) => {
                return result;
            })
            .fail((err) => {
                return err;
            })
            .always(() => {
                hideLoading();
            })
    }
    function getEditData() {
        return {
            userId: gUser.userId,
            userName: gUser.userName,
            firstName: $editFirstName.val(),
            lastName: $editLastName.val(),
            gender: editGender.value,
            birthDate: parseDateInput($editBirthDate.val(), '/'),
            phone: $editPhone.val(),
            email: $editEmail.val(),
            address: $editAddress.val(),
            city: $editCity.val()
        }
    }
    //End Edit Profile

    //Change password
    function changeUserPassworDB() {
        showLoading();
        return $.ajax({
            url: "/Account/changeUserPassword",
            type: "POST",
            dataType: "json",
            data: {
                userId: gUser.userId,
                oldPassword: $('#change_old_password').val(),
                newPassword: $('#change_new_password').val()
            }
        })
            .done((result) => {
                return result;
            })
            .fail((err) => {
                return err;
            })
            .always(() => {
                hideLoading();
            })
    }
    function showChangePasswordMsg(isSuccess, message) {
        if (isSuccess) {
            Alert.success(message);
        } else {
            $changePasswordMsg.show();
            $changePasswordMsg.css("display", "block");
            $changePasswordMsg.html(message);
        }

    }
    //End Change password

    //Change avatar
    function changeUserAvatarDB() {
        showLoading();
        var data = new FormData();
        data.append("userId", gUser.userId);
        data.append("userName", gUser.userName);
        data.append("image", avatarFile.files[0]);
        return $.ajax({
            url: "/User/changeUserAvatar",
            type: "POST",
            dataType: "json",
            data: data,
            contentType: false,
            processData: false,

        })
            .done((result) => {
                return result;
            })
            .fail((err) => {
                return err;
            })
            .always(() => {
                hideLoading();
            })
    }
    function showChangeAvatarMsg(isSuccess, message) {
        if (isSuccess) {
            Alert.success(message);
        } else {
            $changeAvatarMsg.show();
            $changeAvatarMsg.css("display", "block");
            $changeAvatarMsg.html(message);
        }

    }
    function loadUserAvatar() {
        let url = (gUser.avatar) ? gUser.avatar : (gUser.gender === "Nam") ? "/Images/default_avatar_male.jpg" : "/Images/default_avatar_female.jpg";
        $userInfoAvatar.attr('src', url);
        $userInfoAvatarModal.attr('src', url);
    }
    //End Change avatar
})