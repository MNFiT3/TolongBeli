class AccountController {

    register(arrayData, callback) {
        
    }

    login(formName, callback) { 
        var json = jsonForm($(formName).serializeArray());
        serv.httpPost('/test/post', json, callback);
    }
}