const $loadingSpinner = $('#loadingSpinner');
function showLoading() {
    $loadingSpinner.show();
}

function hideLoading() {
    $loadingSpinner.hide();
}

function showLoadingInner() {
    $('#loadingInner').show();
}

function hideLoadingInner() {
    $('#loadingInner').hide();
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
    return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(seperator);
}
function parseDateInput(dateString, seperator) {
    seperator = seperator || '-';
    const date = new Date(dateString);
    return [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join(seperator);
}
function parseDateTime(dateString, dateSeperator) {
    dateSeperator = dateSeperator || '-';
    const date = new Date(dateString);
    return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(dateSeperator) + ' ' + [("0" + date.getHours()).slice(-2), ("0" + date.getMinutes()).slice(-2)].join(':');
}

//Jquery Validation rules
jQuery.validator.addMethod("greaterThanNow",
    function (value, element, params) {

        if (!/Invalid|NaN/.test(new Date(value))) {
            if (params)
                return new Date(value) > Date.now()
            else
                return true;
        }

        return isNaN(value) && isNaN(params)
            || (Number(value) > Number(params));
    }, 'Must be greater than now.');

jQuery.validator.addMethod("lessThanNow",
    function (value, element, params) {

        if (!/Invalid|NaN/.test(new Date(value))) {
            if (params)
                return new Date(value) < Date.now()
            else
                return true;
        }

        return isNaN(value) && isNaN(params)
            || (Number(value) < Number(params));
    }, 'Must be less than now.');

jQuery.validator.addMethod("checkFileType",
    function (value, element, params) {
        let flag = true;
        for (const file of element.files) {
            if (!file.type.includes(params)) {
                flag = false;
                break;
            }
        }
        return flag;
    }, 'Files must be images.');

jQuery.validator.addMethod("checkFileSize",
    function (value, element, params) {
        let size = 0;
        for (const file of element.files) {
            if (!file.type.includes(params)) {
                size += file.size;
            }
        }
        return size <= parseInt(params);
    }, 'Files oversize');