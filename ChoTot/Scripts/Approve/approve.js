$(document).ready(function () {
    const $approveTable = $('#approve-table');
    loadApproveTable();

    async function loadApproveTable() {
        try {
            const $tbody = $approveTable.find('tbody');  
            const data = await getAllItemAndSellerDB();
            const dataJs = JSON.parse(data);
            if (dataJs.Table && dataJs.Table.length > 0) {
                const allPendingItems = dataJs.Table;
                allPendingItems.forEach((item, index) => {
                    const $type = $(`<select style="width: 100%;" class="form-control" name="appr_category"></select>`);
                    gCategory.forEach((category, index) => {
                        if (index !== 0) {
                            $type.append($(`<option value="${category.categoryId}">${category.fullName}</option>`));
                        }
                    });
                    $type.val(item.category.split(", ")[0]);
                    const $tr = $(`<tr></tr>`);

                    $tr.append(`<td><input type="checkbox" name="appr_selected" data-itemId="${item.itemId}"></td >`);

                    $tr.append(`<td>${item.itemId}</td>`);               
                    $tr.append(`<td><a href="/User/${item.sellerId}" class="chotot-link">${item.sellerLastName} ${item.sellerFirstName}</a></td>`);
                    $tr.append(`<td>${item.name}</td>`);
                    
                    imgscr = item.thumbnail.split(",");
                    const $tdimage = $(`<td></td>`);

                    imgscr.forEach((pic, i) => {
                        $tdimage.append(`<img src="${pic}" alt="Ảnh minh họa ${i}">`);
                    });

                    $tr.append($tdimage);

                    $tr.append(`<td>${numberWithCommas(item.price)}</td>`);

                    $tr.append($(`<td></td>`).append($type));

                    const formatCreatedDate = (item.createdDate) ? parseDateTime(item.createdDate, "/") : "";
                    $tr.append(`<td>${formatCreatedDate}</td>`);
                    $tr.append(`<td>${decodeURI(item.description)}</td>`);

                    if (item.canNegotiate)
                        $tr.append(`<td class="text-success" style="font-weight: 700">Có</td>`);
                    else
                        $tr.append(`<td class="text-danger" style="font-weight: 700">Không</td>`);

                    $tbody.append($tr);
                });
            }
            else {
                const $tr = $('<tr></tr>');
                const msg = "Không có sản phẩm đang chờ duyệt !!!";
                $tr.append($(`<td colspan="100%" style="color: #ff6633; font-weight: 600;">${msg}</td>`));
                $tbody.append($tr);
                return;
            }
        } catch (err) {
            console.log(err);
            Alert.error("Tải các bài đăng đang chờ thất bại");
        }
    }

    $('#approve_select_all').on('click', async (e) => {
        $('#approve-table input[name=appr_selected]').prop("checked", true);
    });

    $('#approve_unselect_all').on('click', async (e) => {
        $('#approve-table input[name=appr_selected]').prop("checked", false);
    });

    $('#approve_ok').on('click', async (e) => {
        const $this = $(e.target);
        const $items = $('#approve-table input[name=appr_selected]:checked');
        if ($items.length > 0) {
            let itemId = [];
            let categories = [];
            $items.each(function (key, value) {
                itemId.push(parseInt($(this).attr("data-itemId")));
                categories.push(parseInt($(this).parent().parent().find("select[name=appr_category]").val()));
            })
            try {
                const flag = await Alert.warning("Bạn có chắc muốn <b>ĐỒNG Ý</b> phê duyệt những sản phẩm này !!!")
                if (flag.value) {
                    const result = await approveItems(itemId, categories);
                    const resultJs = JSON.parse(result);
                    if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].error) {
                        Alert.error(resultJs.Table[0].error);
                    } else {
                        $approveTable.find('tbody').empty();
                        loadApproveTable();
                        Alert.success("Phê duyệt sản phẩm thành công");
                    }
                }
            } catch (err) {
                Alert.error("Duyệt bài đăng sản phẩm thất bại !!!");
            }
        }
    });

    $('#approve_reject').on('click', async (e) => {
        const $this = $(e.target);
        const $items = $('#approve-table input[name=appr_selected]:checked');
        if ($items.length > 0) {
            let itemId = [];
            $items.each(function (key, value) {
                itemId.push(parseInt($(this).attr("data-itemId")));
            })
            try {
                const flag = await Alert.warning("Bạn có chắc muốn <b>TỪ CHỐI</b> phê duyệt những sản phẩm này !!!");
                if (flag.value) {
                    const result = await setItemsStatus(itemId, "rejected");
                    const resultJs = JSON.parse(result);
                    if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].error) {
                        Alert.error(resultJs.Table[0].error);
                    } else {
                        $approveTable.find('tbody').empty();
                        loadApproveTable();
                        Alert.success("Từ chối duyệt sản phẩm thành công");
                    }
                }
            } catch (err) {
                Alert.error("Từ chối duyệt bài đăng sản phẩm thất bại !!!");
            }
        }
    });

    async function getAllItemAndSellerDB() {
        showLoading();
        const result = await fetch("/Item/getAllPendingItem");
        hideLoading();
        return result.json();
    }
    async function setItemsStatus(items, status) {
        showLoading();
        return $.ajax({
            url: "/Approve/setItemStatus",
            type: "POST",
            dataType: "json",
            data: {
                itemId: items,
                status: status
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
    async function approveItems(items, categories) {
        showLoading();
        return $.ajax({
            url: "/Approve/approveItem",
            type: "POST",
            dataType: "json",
            data: {
                itemId: items,
                category: categories
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
})