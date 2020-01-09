$(document).ready(function () {
    let count = 0;
    const $listItem = $('#listItem');
    const resultJs = (listItemStr) ? JSON.parse(listItemStr) : {};
    const $city = $('#city');
    const $category = $('#category');
    const $input1 = $('#input1');
    const $input2 = $('#input2');
    const $input3 = $('#input3');
    let _count = 9;

    loadAllItem();
    async function loadAllItem() {
        gCity.forEach((_city) => {
            let $r = $(`<a class="dropdown-item" >${_city.fullName}</a>`);
            $city.append($r); 
        })
        gCategory.forEach((_category) => {
            if (_count != 0) {
                let $r = $(`<li class="nav-item"><a class="nav-link border border-dark " style="border-radius: 0rem; padding:30px;" data-toggle="pill">${_category.fullName}</a></li>`);
                $category.append($r);
            }
            _count--;
        })



        if (resultJs.Table && resultJs.Table.length > 0) {
            resultJs.Table.forEach((item, index) => {
                let idRow = '#row' + parseInt(count / 4).toString();
                const $row = $(`<div id="row${parseInt(count / 4)}" class="row"><div>`);
                const $col = $(`<div class="col-sm-3 mb-3"><div>`);
                const $card = $(` <div class="card h-100"><div>`);
                const firstImageUrl = item.thumbnail.split(", ")[0];
                const $Image = $(`<img  class="mt-2" src="${firstImageUrl}" style="width:180px;height:180px; align-self:center;" />`);
                const $body1 = $(`<div class="card-body"><div>`);
                const $nameItem = $(`<h5 class="card-title text-center card-item-name" style="color:#ff9900"><a href="/Item/${item.itemId}" class="chotot-link" style="font-weight: 600;">${item.name}&nbsp;</a></h5>`);
                const $priceItem = $(` <h5  class="card-title text-center card-item-price">${numberWithCommas(item.price)} VND</h5>`);
                const createdDateStr = parseDateTime(item.createdDate, "/");
                const $createdDate = $(` <h6  class=" text-center font-italic ">${createdDateStr}</h6>`)

                const $body2 = $(`<div class="row mt-2 mylast-row-item"><div>`);
                const $seller = $(` <h6>Người bán :<a href="/User/${item.sellerId}" class="chotot-link" style="font-weight: 600;"> ${item.sellerFirstName}</a></h6>`);
                const cityStr = gCity[item.city - 1].fullName;
                const $city = $(`<h6 ><i class="fa fa-map-marker" aria-hidden="true"></i>${cityStr}</h6>`);
                if (count % 4 == 0) {
                    $body1.append($nameItem, $priceItem, $createdDate);
                    $body2.append($seller, $city);
                    $card.append($Image, $body1, $body2);
                    $col.append($card);
                    $row.append($col);
                    $listItem.append($row);

                }
                else {
                    let $rowid = $(idRow);
                    $body1.append($nameItem, $priceItem, $createdDate);
                    $body2.append($seller, $city);
                    $card.append($Image, $body1, $body2);
                    $col.append($card);
                    $rowid.append($col);
                }
                count++;
            })
        }
    }

    function showAllItems() {
        //showLoading();
        return $.ajax({
            url: "/Home/getAllItem_home",
            type: "GET",
            dataType: "json",

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
    $("#category li").click(function () {
        $(this).parents(".nav-item").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".nav-item").find('.btn').val($(this).data('value'));
        gCategory.forEach((_category)=>
        {
            if ($(this).text() == _category.fullName)
                $('#input1').val(_category.categoryId);
        }); 
        
    });
    $(".row2 a").click(function () {
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        $('#arrange').val($(this).text());
           if ($(this).text() == 'Bài mới nhất')
            $('#input2').val(null);  
        if ($(this).text() == 'Mức giá tăng dần')
            $('#input2').val("desc");  
        if ($(this).text() == 'Mức giá giảm dần')
            $('#input2').val("asc");  
                // sap xep
    });
    $(".row1 a").click(function () {
        $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
     
        // city
        gCity.forEach((_city) => {
            if ($(this).text() == _city.fullName)
                $('#input3').val(_city.cityId);
        });
    });
    //$("#submit").click(function () {

    //    let _par1 = $("#input1").val();
    //    let _par2 = $("#input2").val();
    //    let _par3 = $("#input3").val();
    //    window.location = 'http://localhost:49831/?category=' + _par1 + '&city=' + _par2 + '&priceOrder' + _par3;
    //});

    
});

var btnContainer = document.getElementById("myDIV");

// Get all buttons with class="btn" inside the container
var btns = btnContainer.getElementsByClassName("my_btn");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("my_active");

        // If there's no active class
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" my_active", "");
        }

        // Add the active class to the current/clicked button
        this.className += " my_active";
    });
}
