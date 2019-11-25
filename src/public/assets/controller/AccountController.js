const ACCOUNT_ENDPOINT = '/account';

class AccountController {

    register(formName, scope, callback) {
        var data = {};
        var formData = jsonForm($(formName).serializeArray());

        data.username = formData.uname;
        data.password = formData.psw;
        data.phone = formData.num || formData.phone;
        data.address = formData.address;
        data.address = formData.address;
        data.ic = formData.ic;
        data.address = formData.address;
        data.plateNumber = formData.plate;

        //Check the basic requirement
        if(!(data.email && data.password && data.username && data.phone)){
            res.send("Missing improtant attributes")
        }
        //Check requirement for user 
        if(!(scope == "user" && data.address)){
            res.send("Missing user attributes")
        }
        //Check requirement for deliverer
        if(!(scope == "deliverer" && data.plateNumber && data.ic)){
            res.send("Missing user attributes")
        }

        serv.httpPost(ACCOUNT_ENDPOINT + '/register', data, (err, result) => {
            if(err) return;
            alert(result);
        });
    }

    login(formName, callback) { 
        var data = {};
        var formData = jsonForm($(formName).serializeArray());

        data.username = formData.uname;
        data.password = formData.psw;

        if(!(data.username && data.password)){
            alert("Missing improtant attributes");
            return;
        }

        serv.httpPost('/test/post', data, (err, result) => {
            if(err) return;
            alert(JSON.stringify(result));
        });
    }
}