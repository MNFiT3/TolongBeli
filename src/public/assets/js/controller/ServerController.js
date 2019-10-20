
class ServerController {
    httpGet = (url, callback) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                callback(null, JSON.parse(this.response));
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    httpPost = (url, json, callback) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                callback(null, JSON.parse(this.response));
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(json));
    }
}