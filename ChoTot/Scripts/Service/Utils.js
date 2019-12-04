const $loadingSpinner = $('#loadingSpinner');

function showLoading() {
    $loadingSpinner.show();
}

function hideLoading() {
    $loadingSpinner.hide();
}

//Pick Image
function pickImage(fileInput, targetImg) {
    if (fileInput.files && fileInput.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            $(targetImg).attr('src', e.target.result);
        }

        reader.readAsDataURL(fileInput.files[0]);
    }
}

function SweetAlert() {
    const timer = 5 * 60 * 1000;
    this.warning = (message, options) => {
        return Swal.fire({
            title: "<span style='color: #ff6600;'>Thông báo</span>",
            icon: "warning",
            text: message + "!",
            timer: timer,
            showCloseButton: true,
            confirmButtonText: "Đồng ý",
            confirmButtonColor: "#00c300",
            showCancelButton: true,
            cancelButtonColor: "#ea4335",
            cancelButtonText: "Hủy bỏ",
            focusCancel: true,
        });
    }
    this.success = (message, options) => {
        return Swal.fire({
            title: "<span style='color: #00c300;'>Thông báo</span>",
            icon: "success",
            text: message + "!",
            timer: timer,
            showCloseButton: true,
            confirmButtonText: "Đồng ý",
            confirmButtonColor: "#00c300",
            focusConfirm: true,
        });
    }
    this.error = (message, options) => {
        return Swal.fire({
            title: "<span style='color: #ea4335;'>Thông báo</span>",
            icon: "error",
            text: message + "!",
            timer: timer,
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonColor: "#ea4335",
            cancelButtonText: "Đồng ý",
            focusCancel: true,
        });
    }
}

function parseDate(dateString, seperator) {
    seperator = seperator || '-';
    const date = new Date(dateString);
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(seperator);
}
function parseDateTime(dateString, dateSeperator) {
    dateSeperator = dateSeperator || '-';
    const date = new Date(dateString);
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(dateSperator) + ' ' + [date.getHours(), date.getMinutes()].join(':');
}