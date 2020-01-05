Dropzone.autoDiscover = false;
    const $imageUpload = $('#image-upload');
    const $imageUploadError = $('#image-upload-error');
    const $editItemForm = $(document.editItemForm);
    let isSent = false;
    $editItemForm.validate({
        rules: {
            name: {
                required: true,
                maxlength: 50
            },
            price: {
                required: true,
                number: true,
                min: 0
            },
            description: {
                required: true,
                maxlength: 3000
            },
            edit_item_category: {
                required: true,
            },
            canNegotiate: {
                required: true,
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
            name: {
                required: "Tên sản phẩm không được phép để trống",
                maxlength: "Tên sản phẩm chỉ được có tối đa 50 ký tự"
            },
            price: {
                required: "Giá sản phẩm không được phép để trống",
                number: "Giá phải là số",
                min: "Giá sản phẩm phải lớn hơn 0"
            },
            description: {
                required: "Mô tả sản phẩm không được phép để trống",
                maxlength: "Mô tả sản phẩm chỉ được có tối đa 3000 ký tự"
            },
            edit_item_category: {
                required: "Hãy chọn loại sản phẩm"
            },
            canNegotiate: {
                required: "Hãy chọn sản phẩm thương lượng được hay không",
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
    });

    $imageUpload.dropzone({
        url: "/PostItem/addItem",
        method: "POST",
        timeout: 5 * 60 * 1000,
        uploadMultiple: true,
        paramName: "images",
        dictDefaultMessage: "Kéo ảnh sản phẩm vào",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        dictRemoveFile: "Xóa",
        autoProcessQueue: false,
        success: function (file, response) {
            const resultJs = JSON.parse(response);
            if (resultJs.Table && resultJs.Table.length > 0 && resultJs.Table[0].itemId) {
                window.location.href = "/Item/" + resultJs.Table[0].itemId;
            } else {
                Alert.error("Đăng sản phẩm thất bại !!!");
            }
        },
        error: function (file, response) {
            Alert.error("Đăng sản phẩm thất bại !!!");
        },
        sending: (file, xhr, formData) => {
            if (!isSent) {
                formData.append("name", $(document.editItemForm.name).val() || "");
                formData.append("price", Number($(document.editItemForm.price).val()) || 0);
                formData.append("description", encodeURI($(document.editItemForm.description).val()) || "");
                formData.append("category", $(document.editItemForm.edit_item_category).val() || "");
                formData.append("canNegotiate", parseInt($editItemForm.find("input[name=canNegotiate]:checked").val()) === 1|| false);
                formData.append("address", $(document.editItemForm.address).val() || "");
                formData.append("city", parseInt($(document.editItemForm.edit_item_city).val()) || "");
                formData.append("sellerId", gUser.userId || 1);
                isSent = true;
            }
        }
    })
    $('#post-btn').on('click', (e) => {
        e.preventDefault();
        let flag1 = false;
        const dropzone = Dropzone.forElement('#image-upload');
        if (dropzone.files.length > 0) {
            flag1 = true;
            showUploadImageError(false);
        } else {
            flag1 = false;
            showUploadImageError(true);
        }
        if ($editItemForm.valid() && flag1) {
            dropzone.processQueue();
        };
        
    })
    function showUploadImageError(flag) {
        if (flag) {
            $imageUploadError.css('display', 'block');
        } else {
            $imageUploadError.hide();
        }
    }