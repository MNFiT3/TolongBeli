const GROCERY_ENDPOINT = '/tolongbeli/grocery';
const CHECKOUT_ENDPOINT = '/tolongbeli/checkout';
const ADMIN_GROCERY_ENDPOINT = '/admin/grocery';

class TolongBeliController {
    
    groceryList = (htmlElement, callback) => {
        var data = {
            option: "byStatus_listed",
            itemID: ""
        };
        serv.httpPost(GROCERY_ENDPOINT + '/list', data, (err, result) => {
            if(err) return;
            
            var tableData = "";
            result["lists"].forEach((e, i) => {
                const price = e.price + ''
                const priceStr = price.substr(0, price.length - 2) + '.' + price.substr(price.length - 2)
                tableData += `<tr>
                    <th scope="row">`+ (i + 1) +`</th>
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
            callback(result)
        });
    }
}