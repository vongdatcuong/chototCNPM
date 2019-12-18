$(document).ready(function () {

    loadApproveTable();

    async function loadApproveTable() {
        try {
            const data = await getAllItemAndSellerDB();
            const dataJs = JSON.parse(data);
            if (dataJs.Table && dataJs.Table.length > 0) {
                const allPendingItems = dataJs.Table;
                //Code tiep o day nay
            }
            else {
                Alert.error("Tải các bài đăng đang chờ thất bại");
            }
        } catch (err) {
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