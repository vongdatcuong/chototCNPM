$(document).ready(function () {
    showLoadingInner();
    let user;

    const unknownStr = "...";

    const $userInfoTable = $('#userInfoTable');
    const $userInfoName = $('#userInfoName');
    const $userInfoGender = $('#userInfoGender');
    const $userInfoBirthdate = $('#userInfoBirthdate');
    const $userInfoPhone = $('#userInfoPhone');
    const $userInfoEmail = $('#userInfoEmail');
    const $userInfoAddress = $('#userInfoAddress');
    const $userInfoCity = $('#userInfoCity');
    const $userInfoCreatedDate = $('#userInfoCreatedDate');

    //Change avatar
    const $userInfoAvatar = $('#userInfoAvatar');
    const $userInfoAvatarModal = $('#userInfoAvatarModal');

    //Item History
    const $sellingTable = $('#sellingTable');
    const $soldTable = $('#soldTable');
    const $boughtTable = $('#boughtTable');

    if (userStr) {
        user = JSON.parse(userStr).Table[0];
        loadUserAvatar();
        loadUserInfo();
        loadUserHistory();

        $('#userInfoUsername').text(user.userName);
        $('#userInfoId').text(user.userId);
        $('#userType').text(((user.type == 1) ? "Quản trị viên" : "Thành viên"));
    }

    //Edit Profile
    function loadUserInfo() {
        if (user) {
            $userInfoName.text((user.lastName && user.firstName) ? user.lastName + ' ' + user.firstName : unknownStr);
            $userInfoGender.text(user.gender || unknownStr);
            $userInfoBirthdate.text((user.birthDate) ? parseDate(user.birthDate, '/') : unknownStr);
            $userInfoPhone.text(user.phone || unknownStr);
            $userInfoEmail.text(user.email || unknownStr);
            $userInfoAddress.text(user.address || unknownStr);
            $userInfoCity.text((user.city) ? gCity[user.city - 1].fullName : unknownStr);
            $userInfoCreatedDate.text((user.createdDate) ? parseDateTime(user.createdDate, '/') : unknownStr);
            $userInfoTable.show();
            hideLoadingInner();
        }
    }

    function loadUserAvatar() {
        let url = (user.avatar) ? user.avatar : (user.gender === "Nam") ? "/Images/default_avatar_male.jpg" : "/Images/default_avatar_female.jpg";
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


            $tr.append($stt, $id, $name, $price, $category, $date);
            $tbody.append($tr);
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
  
            $tr.append($stt, $id, $buyer, $name, $price, $category, $date);
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

            $tr.append($stt, $id, $seller, $name, $price, $category, $date);
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
                userId: user.userId
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
})