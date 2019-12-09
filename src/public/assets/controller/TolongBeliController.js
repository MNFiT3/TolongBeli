const GROCERY_ENDPOINT = '/tolongbeli/grocery';
const CHECKOUT_ENDPOINT = '/tolongbeli/checkout';
const MYORDER_ENDPOINT = '/tolongbeli/order';
const ADMIN_GROCERY_ENDPOINT = '/admin/grocery';
const ADMIN_LIST_NEW_DELIVERER = '/admin/deliverer/view';
const ADMIN_APPROVE_NEW_DELIVERER = '/admin/deliverer/validate';

class TolongBeliController {
    
    groceryList = (htmlElement, callback) => {
        var data = {
            option: "byStatus_listed",
            itemID: ""
        };
        serv.httpPost(GROCERY_ENDPOINT + '/list', data, (err, result) => {
            if(err) return;
            result = JSON.parse(result.response)
            var tableData = "";
            result["lists"].forEach((e, i) => {
                const price = e.price + ''
                const priceStr = price.substr(0, price.length - 2) + '.' + price.substr(price.length - 2)
                tableData += `<tr>
                    <td class="w-25">
                        <img src="` + e.json.image + `" class="img-fluid img-thumbnail" alt="image">
                    </td>
                    <td id='item-`+e.id+`'>` + e.name + `
                    </td>
                    <td id='price-`+e.id+`'>`+ priceStr +`</td>
                    <td>
                        <input class="form-control input-lg" type="number" min="1" id="qty-` + e.id + `">
                    </td>
                    <td>
                        <div class="checkbox">
                            <label><input type="checkbox" value="` + e.id + `" onClick='add(this)'></label>
                        </div>
                    </td>
                </tr>`
            });

            document.getElementById(htmlElement).innerHTML = tableData;
        });
    }

    addGrocery = (formName, callback) => {
        var grocery = {};
        var formData = jsonForm($(formName).serializeArray());

        grocery.name = formData.name
        grocery.price = formData.price
        grocery.category = formData.category
        grocery.image = (formData.urlImage != "")? formData.urlImage : 'https://via.placeholder.com/300'
        grocery.desc = formData.desc

        serv.httpPost(ADMIN_GROCERY_ENDPOINT + '/add', grocery, (err, result) => {
            if(err) return;
            callback(result)
        });
    }

    cartCheckout = (cartObj, callback) => {
        serv.httpPost(CHECKOUT_ENDPOINT, cartObj, (err, result) => {
            if(err) return;
            result = result.response
            callback(result)
        });
    }

    myOrders = (htmlElement) => {
        var data = {
            option: "all",
            value: ""
        };
        serv.httpPost(MYORDER_ENDPOINT, data, (err, result) => {
            if(err) return;
            result = JSON.parse(result.response)
            var tableData = "";
            result.forEach((e, i) => {
                const price = e.totalPrice + ''
                const priceStr = price.substr(0, price.length - 2) + '.' + price.substr(price.length - 2)
                tableData += `<tr>
                    <th scope="row">`+ (i + 1) +`</th>
                    <td class="w-25">
                        `+ e.createdOn +`
                    </td>
                    <td>RM ` + priceStr + `
                    </td>
                    <td><button type='button' class='btn btn-primary' onClick="window.location.href='user_orderDetail.html?id=`+ e.id +`'">View</button></td>
                </tr>`
            });

            document.getElementById(htmlElement).innerHTML = tableData;
        });
    }

    //TODO: -
    myOrderDetails = (htmlElement, orderId) => {
        serv.httpPost(MYORDER_ENDPOINT, {
            "option": "byId",
            "value": orderId
        }, (err, result) => {
            if(err) return;
            result = result.response

            document.getElementById(htmlElement).innerHTML = result;
        });
    }

    newDeliverer = (htmlElement) => {
        serv.httpPost(ADMIN_LIST_NEW_DELIVERER, {
            "option":"byApproval_false",
            "delivererID": ""
        }, (err, result) => {
            if(err) return;
            result = JSON.parse(result.response)

            console.log(result)
            var tableData = "";
            result.lists.forEach((e, i) => {
                tableData += `<tr>
                    <td class="w-25"> `+ e.account.username +`</td>
                    <td>` + e.account.email + `</td>
                    <td>` + e.json.documents.ic + `</td>
                    <td>` + e.vehicle.plateNumber + `</td>
                    <td>` + e.json.status.message + `</td>
                    <td><button type='button' class='btn btn-primary' onClick="new TolongBeliController().newDelivererApprove('` + e.id + `')">View</button></td>
                </tr>`
            });

            document.getElementById(htmlElement).innerHTML = tableData;
        });
    }

    newDelivererApprove = (accountId) => {
        serv.httpPost(ADMIN_APPROVE_NEW_DELIVERER, {
            "status":"approve",
            "delivererID": accountId
        }, (err, result) => {
            if(err){
                alert(err)
                return
            }

            alert('Success')
            location.reload()
        });
    }
}