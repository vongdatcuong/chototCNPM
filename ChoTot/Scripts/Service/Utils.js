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
