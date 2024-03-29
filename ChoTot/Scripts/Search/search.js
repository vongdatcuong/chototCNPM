﻿$(document).ready(function () {
    let count = 0;
    const $searchItemResult = $('#searchItemResult');
    const searchResultJs = (searchResultStr) ? JSON.parse(searchResultStr) : {};
    loadAllItem();
    async  function loadAllItem() {
        if (searchResultJs.Table && searchResultJs.Table.length > 0) {
            searchResultJs.Table.forEach((item, index) => {
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
                    $searchItemResult.append($row);

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
        } else {
            $searchItemResult.append($(`<div class="not-found-msg">Không tìm thấy sản phẩm nào !!!</div>`))
        }
    }
});