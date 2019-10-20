class AccountController {

    register(arrayData, callback) {
        
    }

    login(formData, callback) { 
        var json = jsonForm(formData);
        serv.httpPost('/test/post', json, callback);
    }
}