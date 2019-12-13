$(document).ready(function () {
    showLoadingInner();

    const buyerStr = "Người mua: ";
    const sellerStr = "Người bán: ";
    const reviewMsg = "Phản hồi ngay";
    const reviewedMsg = "Xem phản hồi";
    const unknownStr = "...";
    const $loadingInnerTable = $('#loadingInnerTable');
    const modalBtnDisplay = 'inline-block';

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

    //Item History
    const $sellingTable = $('#sellingTable');
    const $soldTable = $('#soldTable');
    const $boughtTable = $('#boughtTable');

    //Review
    const $reviewModal = $('#reviewModal');
    const $reviewForm = $(document.reviewForm);
    const $reviewItemId = $("#review_itemId");
    const $reviewItemName = $("#review_itemName");
    const $reviewTargetName = $("#review_targetName");
    const $reviewRating = $(document.reviewForm.rating);
    const $reviewContent = $(document.reviewForm.content);
    const $reviewBtn = $('#reviewBtn');
    const $reviewMsg = $('#review_msg');
    const $loadingReview = $('#loadingReview');
    const $reviewTargetLabel = $('#reviewModal label[for="review_targetName"]');
    loadUserAvatar();
    loadUserInfo();
    loadUserHistory();

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

    //Send review
    //Selling
    async function openReviewModalSelling(e, itemId, itemName, buyer, isReviewd) {
        e.preventDefault();
        $reviewTargetLabel.text(buyerStr);
        $reviewModal.modal('show');
        $reviewItemId.text(itemId);
        $reviewItemName.text(itemName);
        $reviewTargetName.text(buyer || "???");

        if (isReviewd) {
            $loadingReview.show();
            const formDisplay = $reviewForm.css('display');
            $reviewForm.hide();

            const result = await getReview(itemId);
            const resultJs = JSON.parse(result);
            if (resultJs.Table && resultJs.Table.length > 0) {
                $reviewRating.val(parseInt(resultJs.Table[0].rating));
                $reviewContent.val(resultJs.Table[0].content);
                setReviewModalState(false);
            }
            $loadingReview.hide();
            $reviewForm.css('display', formDisplay);
        } else {
            setReviewModalState(true);
        }
        
    }
    //Bought
    async function openReviewModalBought(e, itemId, itemName, seller, isReviewd) {
        e.preventDefault();
        $reviewTargetLabel.text(sellerStr);
        $reviewModal.modal('show');
        $reviewItemId.text(itemId);
        $reviewItemName.text(itemName);
        $reviewTargetName.text(seller || "???");

        if (isReviewd) {
            $loadingReview.show();
            const formDisplay = $reviewForm.css('display');
            $reviewForm.hide();

            const result = await getReview(itemId);
            const resultJs = JSON.parse(result);
            if (resultJs.Table && resultJs.Table.length > 0) {
                $reviewRating.val(parseInt(resultJs.Table[0].rating));
                $reviewContent.val(resultJs.Table[0].content);
                setReviewModalState(false);
            }
            $loadingReview.hide();
            $reviewForm.css('display', formDisplay);
        } else {
            document.reviewForm.reset();
            setReviewModalState(true);
        }

    }

    $reviewBtn.on('click', async (e) => {
        e.preventDefault();
        if (!$reviewForm.valid())
            return;
        try {
            const itemId = parseInt($reviewItemId.text());
            const result = await addReviewDB(itemId);
            const resultJs = JSON.parse(result);
            if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].error) {
                showReviewMsg(false, resultJs.Table[0].error);
            } else {
                showReviewMsg(true, "Gửi phản hồi thành công");
                $reviewModal.modal("hide");
                $(`.isReviewd_msg[data-itemId=${itemId}]`).text(reviewedMsg);
                $(`.isReviewd[data-itemId=${itemId}]`).val(1);
                setReviewModalState(false);
            }
        } catch (err) {
            Alert.error("Gửi phản hồi thất bại !!!");
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

    $reviewForm.validate({
        rules: {
            content: {
                required: true,
                maxlength: 500
            }
        },
        messages: {
            content: {
                required: "Chưa nhập nhận xét",
                maxlength: "Nhận xét chỉ được tối đa 500 chữ"
            }
        }
    })
    //End Forms Validate

    //Edit Profile
    function loadUserInfo() {
        if (gUser) {
            $userInfoName.text((gUser.lastName && gUser.firstName) ? gUser.lastName + ' ' + gUser.firstName : unknownStr);
            $userInfoGender.text(gUser.gender || unknownStr);
            $userInfoBirthdate.text((gUser.birthDate) ? parseDate(gUser.birthDate, '/') : unknownStr);
            $userInfoPhone.text(gUser.phone || unknownStr);
            $userInfoEmail.text(gUser.email || unknownStr);
            $userInfoAddress.text(gUser.address || unknownStr);
            $userInfoCity.text((gUser.city) ? gCity[gUser.city - 1].fullName : unknownStr);
            $userInfoCreatedDate.text((gUser.createdDate) ? parseDateTime(gUser.createdDate, '/') : unknownStr);
            $userInfoTable.show();
            hideLoadingInner();
        }
    }

    function loadUserEdit() {
        if (gUser) {
            $editFirstName.val(gUser.firstName);
            $editLastName.val(gUser.lastName);
            editGender.value = gUser.gender;
            $editBirthDate.val((gUser.birthDate) ? parseDateInput(gUser.birthDate) : unknownStr);
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
    //History
    async function loadUserHistory() {
        try {
            const result = await getUserHistoryDB();
            const resultJs = JSON.parse(result);
            loadSellingTable(resultJs.Selling, resultJs.Sold);
            loadSoldTable(resultJs.Sold);
            loadBoughtTable(resultJs.Bought);
        } catch (err) {
            Alert.error("Tải lịch sử thất bại !!!");
        }
    }
    function loadSellingTable(data, soldData) {
        const $tbody = $sellingTable.find('tbody');
        if (data.length == 0) {
            const $tr = $('<tr></tr>');
            const msg = "Không tìm thấy sản phẩm nào !!!";
            $tr.append($(`<td colspan="100%" style="color: #ff6633;">${msg}</td>`));
            $tbody.append($tr);
            return;
        }
        data.forEach((item, index) => {
            const $tr = $('<tr></tr>');
            const $stt = $(`<td>${index + 1}</td>`);
            const $id = $(`<td><a class="chotot-link" href="/Item/${item.itemId}">${item.itemId}</a></td>`);
            const $name = $(`<td>${item.name}</td>`);
            const $price = $(`<td>${numberWithCommas(item.price)}</td>`);

            const categoryStr = item.category.split(', ').map((cate) => gCategory[parseInt(cate) - 1].fullName).join(', ');
            const $category = $(`<td>${categoryStr}</td>`);

            const dateSeperator = '/';
            const $date = $(`<td>${parseDateTime(item.createdDate, dateSeperator)}</td>`);

            //Buttons
            const $completeBtn = $(`<button class="sellingCompleteBtn btn btn-default btn-chotot" data-itemId="${item.itemId}" style="width:40px; height:22px;">Hoàn tất</button>`);
            const $editBtn = $(`<button class="sellingEditBtn btn btn-default btn-chotot" style="width:22px; height:22px;"><a href="/PostItem/${item.itemId}">Sửa</a></button>`);
            const $deleteBtn = $(`<button class="sellingDeleteBtn btn btn-default btn-chotot" data-itemId="${item.itemId}" style="width:22px; height:22px;">Xóa</button>`);

            const $buttons = $('<td style="padding-left:2px; padding-right: 1px"></td>');
            $buttons.append($completeBtn, $editBtn, $deleteBtn);

            $tr.append($stt, $id, $name, $price, $category, $date, $buttons);
            $tbody.append($tr);
        });
        //Events
        $('.sellingDeleteBtn').on('click', async (e) => {
            const $this = $(e.target);
            const itemId = parseInt($this.attr('data-itemId'));
            try {
                const flag = await Alert.warning("Bạn có chắc muốn xóa bài đăng sản phẩm này !!!")
                if (flag.value) {
                    const result = await deleteItemDB(itemId);
                    const resultJs = JSON.parse(result);
                    if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].error) {
                        Alert.error(resultJs.Table[0].error);
                    } else {
                        Alert.success("Xóa bài đăng sản phẩm thành công");

                        //
                        $loadingInnerTable.show();
                        $sellingTable.hide();
                        $tbody.empty();
                        data = data.filter((item) => item.itemId !== itemId);
                        loadSellingTable(data, soldData);

                        $sellingTable.show();
                        $loadingInnerTable.hide();
                    }
                }
            } catch (err) {
                Alert.error("Xóa bài đăng sản phẩm thất bại !!!");
            }
        });

        $('.sellingCompleteBtn').on('click', async (e) => {
            const $this = $(e.target);
            const itemId = parseInt($this.attr('data-itemId'));
            try {
                const flag = await Alert.warning("Bạn có chắc muốn hoàn tất đơn hàng này !!!")
                if (flag.value) {
                    const result = await completeItemDB(itemId);
                    const resultJs = JSON.parse(result);
                    if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].error) {
                        Alert.error(resultJs.Table[0].error);
                    } else {
                        Alert.success("Hoàn tất đơn hàng thành công");

                        //
                        $loadingInnerTable.show();
                        $sellingTable.hide();
                        $tbody.empty();
                        $soldTable.find('tbody').empty();
                        const item = data.find((item) => item.itemId == itemId);
                        soldData.push(Object.assign({}, item));
                        data = data.filter((item) => item.itemId !== itemId);

                        loadSellingTable(data, soldData);
                        loadSoldTable(soldData);

                        $sellingTable.show();
                        $loadingInnerTable.hide();
                    }
                }
            } catch (err) {
                Alert.error("Xóa bài đăng sản phẩm thất bại !!!");
            }

        });
    }
    function loadSoldTable(data) {
        const $tbody = $soldTable.find('tbody');
        if (data.length == 0) {
            const $tr = $('<tr></tr>');
            const msg = "Không tìm thấy sản phẩm nào !!!";
            $tr.append($(`<td colspan="100%" style="color: #ff6633;">${msg}</td>`));
            $tbody.append($tr);
            return;
        }
        data.forEach((item, index) => {
            const $tr = $('<tr></tr>');
            const $stt = $(`<td>${index + 1}</td>`);
            const $id = $(`<td><a class="chotot-link" href="/Item/${item.itemId}">${item.itemId}</a></td>`);

            const $buyer = (item.buyerId) ? $(`<td><a class="chotot-link" href="/User/${item.buyerId}">${item.buyerName || item.buyerId}</a></td>`) : $(`<td>???</td>`);
            const $name = $(`<td>${item.name}</td>`);
            const $price = $(`<td>${numberWithCommas(item.price)}</td>`);

            const categoryStr = item.category.split(', ').map((cate) => gCategory[parseInt(cate) - 1].fullName).join(', ');
            const $category = $(`<td>${categoryStr}</td>`);

            const dateSeperator = '/';
            const $date = $(`<td>${parseDateTime(item.purchaseDate, dateSeperator)}</td>`);

            const msg = (item.isReviewd) ? reviewedMsg : reviewMsg;
            const $review = $(`<td><a data-itemId=${item.itemId} class="chotot-link isReviewd_msg" href="">${msg}</a></td>`);
            const $isReview = $(`<input type="hidden" class="isReviewd" data-itemId="${item.itemId}" value=${item.isReviewd} />`);
            $review.on('click', (e) => {
                openReviewModalSelling(e, item.itemId, item.name, item.buyerName, parseInt($isReview.val()));
            })
            $tr.append($stt, $id, $buyer, $name, $price, $category, $date, $review, $isReview);
            $tbody.append($tr);
        });
        
    }
    function loadBoughtTable(data) {
        const $tbody = $boughtTable.find('tbody');
        if (data.length == 0) {
            const $tr = $('<tr></tr>');
            const msg = "Không tìm thấy sản phẩm nào !!!";
            $tr.append($(`<td colspan="100%" style="color: #ff6633;">${msg}</td>`));
            $tbody.append($tr);
            return;
        }
        data.forEach((item, index) => {
            const $tr = $('<tr></tr>');
            const $stt = $(`<td>${index + 1}</td>`);
            const $id = $(`<td><a class="chotot-link" href="/Item/${item.itemId}">${item.itemId}</a></td>`);

            const $seller = (item.sellerId) ? $(`<td><a class="chotot-link" href="/User/${item.sellerId}">${item.sellerName || item.sellerId}</a></td>`) : $(`<td>???</td>`);
            const $name = $(`<td>${item.name}</td>`);
            const $price = $(`<td>${numberWithCommas(item.price)}</td>`);

            const categoryStr = item.category.split(', ').map((cate) => gCategory[parseInt(cate) - 1].fullName).join(', ');
            const $category = $(`<td>${categoryStr}</td>`);

            const dateSeperator = '/';
            const $date = $(`<td>${parseDateTime(item.purchaseDate, dateSeperator)}</td>`);

            const msg = (item.isReviewd) ? reviewedMsg : reviewMsg;
            const $review = $(`<td><a data-itemId=${item.itemId} class="chotot-link isReviewd_msg" href="">${msg}</a></td>`);
            const $isReview = $(`<input type="hidden" class="isReviewd" data-itemId="${item.itemId}" value=${item.isReviewd} />`);
            $review.on('click', (e) => {
                openReviewModalBought(e, item.itemId, item.name, item.sellerName, parseInt($isReview.val()));
            })

            $tr.append($stt, $id, $seller, $name, $price, $category, $date, $review, $isReview);
            $tbody.append($tr);
        });
    }
    function getUserHistoryDB() {
        showLoading();
        return $.ajax({
            url: "/User/getUserHistory",
            type: "GET",
            dataType: "json",
            data: {
                userId: gUser.userId
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
    //End History

    //Item
    function deleteItemDB(itemId) {
        showLoading();
        return $.ajax({
            url: "/PostItem/deleteItem",
            type: "GET",
            dataType: "json",
            data: {
                itemId: itemId
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
    function completeItemDB(itemId) {
        showLoading();
        return $.ajax({
            url: "/PostItem/completeItem",
            type: "POST",
            dataType: "json",
            data: {
                itemId: itemId
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
    //End Item

    //Review
    function getReview(itemIdd) {
        showLoading();
        return $.ajax({
            url: "/Review/getReview",
            type: "GET",
            dataType: "json",
            data: {
                userId: gUser.userId,
                itemId: itemIdd,
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
    function addReviewDB(itemId) {
        showLoading();
        return $.ajax({
            url: "/Review/addReview",
            type: "POST",
            dataType: "json",
            data: {
                userId: gUser.userId,
                itemId: itemId,
                rating: $reviewRating.val(),
                content: $reviewContent.val()
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
    function setReviewModalState(canSend) {
        if (canSend) {
            $reviewContent.attr("disabled", false);
            $reviewRating.attr("disabled", false);
            $reviewBtn.css("display", modalBtnDisplay);
        } else {
            $reviewContent.attr("disabled", true);
            $reviewRating.attr("disabled", true);
            $reviewBtn.hide();
        }
    }
    function showReviewMsg(isSuccess, message) {
        if (isSuccess) {
            Alert.success(message);
        } else {
            $reviewMsg.show();
            $reviewMsg.css("display", "block");
            $reviewMsg.html(message);
        }

    }
    //End Review
})