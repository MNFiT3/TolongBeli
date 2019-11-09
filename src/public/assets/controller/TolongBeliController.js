const GROCERY_ENDPOINT = '/tolongbeli/grocery';

class TolongBeliController {
    
    groceryList = (config, htmlElement, callback) => {
        var data = {
            option: "byStatus_listed",
            itemID: ""
        };
        serv.httpPost(GROCERY_ENDPOINT + '/list', data, (err, result) => {
            if(err) return;
            
            var tableData = "";
            result["lists"].forEach((e, i) => {
                tableData += `<tr>
                    <th scope="row">`+ (i + 1) +`</th>
                    <td class="w-25">
                        <img src="` + e.json.image + `" class="img-fluid img-thumbnail" alt="Sheep">
                    </td>
                    <td>` + e.name + `
                    </td>
                    <td>`+ e.price +`</td>
                    <td>
                        <input class="form-control input-lg" type="number" min="1" name="qty">
                    </td>
                    <td>
                        <div class="checkbox">
                            <label><input type="checkbox" value="` + e.id + `" name="order"></label>
                        </div>
                    </td>
                </tr>`
            });

            document.getElementById("gList").innerHTML = tableData;
        });
    }
}