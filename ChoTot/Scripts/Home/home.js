$(document).ready(function () {
    let count = 0;
    const $listItem = $('#listItem');

    loadAllItem();
    async  function loadAllItem() {

        const result = await showAllItems();
        const resultJs = JSON.parse(result);
        if (resultJs.Table && resultJs.Table.length > 0) {
            
            resultJs.Table.forEach((item, index) => {
                let idRow = '#row' + parseInt(count / 4).toString();         
                const $row = $(`<div id="row${parseInt(count/4)}" class="row"><div>`);
                const $col = $(`<div class="col-sm-3 mb-3"><div>`);
                const $card = $(` <div class="card h-100"><div>`);
                const $Image = $(`<img  class="mt-2" src="~/Images/transparent_logo.png" style="width:180px;height:180px; align-self:center;" />`);
                const $body1 = $(`<div class="card-body"><div>`);
                const $nameItem = $(`<h4 class="card-title text-center" style="color:#ff9900">${item.name}</h4>`);
                const $priceItem = $(` <h5  class="card-title text-center" style="color:#333333">${item.price}</h5>`);
                const $createdDate = $(` <h6  class=" text-center  ">Ngày đăng :${item.createdDate}</h6>`)

                const $body2 = $(`<div class="row mt-2 mylast-row-item"><div>`);
                const $seller = $(` <h6>Người bán :<a href=""> A</a></h6>`);
                const $city = $(`<h6 ><i class="fa fa-map-marker" aria-hidden="true"></i>TP.HCM</h6>`);
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

    //<div class="col-sm-3 mb-3">
    //    <div class="card h-100">
    //        <img id="Image" class="mt-2" src="~/Images/transparent_logo.png" style="width:180px;height:180px; align-self:center;" />
    //        <div class="card-body">
    //            <h4 id="nameItem" class="card-title text-center" style="color:#ff9900">Xiaomi Note 8</h4>
    //            <h5 id="priceItem" class="card-title text-center" style="color:#333333">800000</h5>

    //            <h6 id="createdDate" class=" text-center  ">Ngày đăng :11/10/2018</h6>
    //        </div>
    //        <div class="row mt-2 mylast-row-item">
    //            <h6>Người bán :<a href=""> A</a></h6>
    //            <h6 id="cityItem"><i class="fa fa-map-marker" aria-hidden="true"></i>TP.HCM</h6>
    //        </div>

    //    </div>
    //</div>
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