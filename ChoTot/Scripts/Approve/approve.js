$(document).ready(function () {

    loadApproveTable();

    async function loadApproveTable() {
        try {
            const data = await getAllItemAndSellerDB();
            const dataJs = JSON.parse(data);
            if (dataJs.Table && dataJs.Table.length > 0) {
                const allPendingItems = dataJs.Table;
                //Code tiep o day nay

                const $tbody = $('#approve-table').find('tbody');        

                allPendingItems.forEach((item, index) => {
                    const $type = $(`<select></select>`);
                    gCategory.forEach((item, index) => {
                        $type.append($("<option></option>").attr('value', item.shortName).text(item.fullName))
                    });

                    const $tr = $(`<tr></tr>`);

                    $tr.append('<td><input type="checkbox" name="appr_selected" value=""></td >');

                    $tr.append(`<td>${item.itemId}</td>`);               
                    $tr.append(`<td>${item.sellerLastName} ${item.sellerFirstName}</td>`);
                    $tr.append(`<td>${item.name}</td>`);
                    
                    imgscr = item.thumbnail.split(",");
                    const $tdimage = $(`<td></td>`);

                    imgscr.forEach((pic, i) => {
                        $tdimage.append(`<img src="${pic}" alt="Ảnh minh họa ${i}">`);
                    });

                    $tr.append($tdimage);

                    $tr.append(`<td>${item.price}</td>`);

                    $tr.append($(`<td></td>`).append($type));

                    $tr.append(`<td>${item.createdDate}</td>`);
                    $tr.append(`<td>${decodeURI(item.description)}</td>`);

                    if (item.canNegotiate)
                        $tr.append(`<td>Có</td>`);
                    else
                        $tr.append(`<td>Không</td>`);

                    $tbody.append($tr);
                });
            }
            else {
                Alert.error("Tải các bài đăng đang chờ thất bại");
            }
        } catch (err) {
            console.log(err);
            Alert.error("Tải các bài đăng đang chờ thất bại");
        }
    }
    async function getAllItemAndSellerDB() {
        showLoading();
        const result = await fetch("/Item/getAllPendingItem");
        hideLoading();
        return result.json();
    }
})