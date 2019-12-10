const ACCOUNT_ENDPOINT = '/account';

class AccountController {

    register(formName, scope, callback) {
        var data = {};
        var formData = jsonForm($(formName).serializeArray());

        //Temp until frontend impliment email form
        data.email = formData.email || Math.random().toString();

        data.scope = scope
        data.username = formData.uname
        data.password = formData.psw
        data.phone = formData.num || formData.phone
        data.address = formData.addr
        data.ic = formData.ic
        data.licenseID = formData.license
        data.plateNumber = formData.plate
        data.fullName = formData.fname

        //Check the basic requirement
        if (!(data.email && data.password && data.username && data.phone)) {
            callback("Missing improtant attributes")
            return
        }

        if (scope == "deliverer") {
            if (!(data.plateNumber && data.ic && data.fullName && data.licenseID)) {
                callback("Missing deliverer attributes")
                return
            }
        } else {
            if (!(data.address)) {
                callback("Missing user attributes")
                return
            }
        }


        serv.httpPost(ACCOUNT_ENDPOINT + '/register', data, (err, result) => {
            if (err) return;
            result = result.response
            alert(result);
        });
    }

    login(formName) {
        var data = {};
        var formData = jsonForm($(formName).serializeArray());

        data.email = formData.uname;
        data.password = formData.psw;

        if (!(data.email && data.password)) {
            alert("Missing improtant attributes");
            return;
        }

        serv.httpPost('/account/login', data, (err, result) => {
            if (err) return;
            result = JSON.parse(result.response)

            if (!result.userData) {
                alert(result.message)
            } else {
                switch (result.userData.scope) {
                    case 'user': window.location.href = 'user_catalog.html'; break;
                    case 'admin': window.location.href = 'admin_index.html'; break;
                    case 'deliverer': window.location.href = 'rider_index.html'; break;
                    default: window.location.href = 'error.html?c=404'; break;
                }
            }

            localStorage.setItem('user', JSON.stringify(result.userData))
        });
    }
}