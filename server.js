var http = require("http");
var qs = require("querystring");
var fs = require("fs");
var p = [];

var server = http.createServer(function (req, res) {
    var request = req;
    var response = res;

    if (request.method == "GET") {

        if (request.url === "/") {
            fs.readFile("static/index.html", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/css/style.css") {
            fs.readFile("static/css/style.css", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'text/css' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/libs/jquery.js") {
            fs.readFile("static/libs/jquery.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/libs/three.js") {
            fs.readFile("static/libs/three.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/Game.js") {
            fs.readFile("static/js/Game.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/Net.js") {
            fs.readFile("static/js/Net.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/UI.js") {
            fs.readFile("static/js/UI.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/js/Main.js") {
            fs.readFile("static/js/Main.js", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'application/javascript' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/gfx/white.jpg") {
            fs.readFile("static/gfx/white.jpg", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/gfx/black.jpg") {
            fs.readFile("static/gfx/black.jpg", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/gfx/red.jpg") {
            fs.readFile("static/gfx/red.jpg", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                response.write(data);
                response.end();
            })
        }
        else if (request.url === "/gfx/green.jpg") {
            fs.readFile("static/gfx/green.jpg", function (error, data) {
                response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                response.write(data);
                response.end();
            })
        }
    }
    if (request.method == "POST") {

        var allData = "";
        req.on("data", function (data) {
            allData += data
        })
        req.on("end", function (data) {
            var finishObj = qs.parse(allData)
            switch (finishObj.action) {
                case "add":
                    add(finishObj.name, req, res)
                    break;
                case "reset":
                    reset();
                    break;
                case "check":
                    var info = "false";
                    if (p[1]) {
                        info = "true";
                    }
                    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
                    res.end(info);
                    break;
                case "aktualizacja_tablicy":
                    aktualizacja_tablicy(finishObj, req, res);
                    break;
                case "porownywanie_tablic":
                    porownywanie_tablic(finishObj, req, res);
                    break;
            }
        })
    }
})

server.listen(3000, function () {
    //console.log("serwer startuje na porcie 3000")
});

function add(name, req, res) {
    var stan;
    if (!p[0]) {
        p[0] = name;
        stan = "player1";
    }
    else if (!p[1]) {
        if (p[0] != name) {
            p[1] = name;
            stan = "player2";
        }
        else {
            //stan = "login zajęty" !!!
            stan = "player1";
        }
    }
    else {
        if(p[0] == name){
            stan = "player1";
        }
        else if(p[1] == name){
            stan = "player2";
        }
        else{
            stan = "brak miejsc";
        }
        
    }
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    res.end(stan);
}

var pionkiTab = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
]

function reset() {
    p = [];
    pionkiTab = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ]
}

function aktualizacja_tablicy(finishObj, req, res) {
    //console.log(finishObj)

    pionkiTab = JSON.parse(finishObj.data)
    //console.log(pionkiTab)

    var data = "ok"
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    res.end(data);
}

function porownywanie_tablic(finishObj, req, res) {
    var obj = {};
    if (finishObj.data === JSON.stringify(pionkiTab)) {
        obj.zmiany = "false";
    }
    else {
        obj.zmiany = "true";
        obj.pionkiTab = pionkiTab;
    }
    var string = JSON.stringify(obj)
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    res.end(string);
}