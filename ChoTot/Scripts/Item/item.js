$(document).ready(function () {
    if (!itemStr) {
        return;
    }
    const itemJs = JSON.parse(itemStr);
    const item = itemJs.Table[0];
    const thumbnailSeperator = ', ';
    const categorySeperator = ', ';
    const unknownStr = '...';

    loadItemInfo();

    function loadItemInfo() {
        const $imageGallery = $('#imageGallery');
        item.thumbnail.split(thumbnailSeperator).forEach((imageUrl) => {
            $imageGallery.append(`
                <li data-thumb="${imageUrl}" data-src="${imageUrl}">
                <img src="${imageUrl}" />
                </li>
            `);
        })

        document.title = item.name;
        $('#item-name').text(item.name);

        const $badgesBar = $('.badges-bar');
        if (item.city) {
            $badgesBar.append($(`<span id="item-city" class="badge badge-primary badge-chotot">${gCity[parseInt(item.city) - 1].fullName}</span>`));
        }
        if (item.category) {
            item.category.split(categorySeperator).forEach((categoryId) => {
                $badgesBar.append($(`<span class="item-category badge badge-primary badge-chotot">${gCategory[parseInt(categoryId) - 1].fullName}</span>`));
            })
        }
        if (item.canNegotiate) {
            $badgesBar.append($(`<span id="item-canNegotiate" class="badge badge-primary badge-chotot"><i class="far fa-thumbs-up"></i> Thương lượng</span>`));
        }
        if (item.createdDate) {
            $badgesBar.append($(`<span id="item-createdDate" class="badge-chotot">${parseDateTime(item.createdDate, "/")}</span>`));
        }
        $('#price').text(numberWithCommas(parseInt(item.price)));

        const sellerAvatar = (item.sellerAvatar) ? item.sellerAvatar : (item.sellerGender === 'Nữ') ? "~/Images/default_avatar_female.jpg" : "~/Images/default_avatar_male.jpg";
        $('#seller-avatar').attr('src', sellerAvatar);
        $('#seller-name').html(`<a href="/User/${item.sellerId}" class="chotot-link">${(item.sellerFirstName && item.sellerLastName) ? item.sellerLastName + " " + item.sellerFirstName : unknownStr}</a>`);

        $('#seller-createdDate').text(parseDate(item.sellerCreatedDate, '/'));
        $('#seller-product-sold').text(parseInt(item.sellerProductSold));
        $('#seller-rating').rating('update', item.sellerRating);

        $('#item-description div').text(decodeURI(item.description));
    }

    $('#contact-btn').on('click', (e) => {
        $(e.target).find('span').text(item.sellerPhone);
    });
    $('#imageGallery').lightSlider({
        gallery: true,
        item: 1,
        loop: true,
        thumbItem: item.thumbnail.split(thumbnailSeperator).length,
        slideMargin: 0,
        enableDrag: false,
        currentPagerPosition: 'right',
        onSliderLoad: function (el) {
            el.lightGallery({
                selector: '#imageGallery .lslide'
            });
        }
    });
})