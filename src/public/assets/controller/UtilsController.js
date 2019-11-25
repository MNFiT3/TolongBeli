const _endpoint = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/api";

class ServerController {

    httpGet = (url, callback) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                try{
                    callback(null, JSON.parse(this.response));
                }catch{
                    callback(null, this.response);
                }
            }
        };
        xmlhttp.open("GET", _endpoint + url, true);
        xmlhttp.send();
    }

    httpPost = (url, json, callback) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                try{
                    callback(null, JSON.parse(this.response));
                }catch{
                    callback(null, this.response);
                }
            }
        };
        xmlhttp.open("POST", _endpoint + url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(json));
    }
}

const jsonForm = (formData) => {
    let json = {};
    formData.forEach((item) => {
        json[item.name] = item.value;
    });
    return json;
}

const serv = new ServerController();