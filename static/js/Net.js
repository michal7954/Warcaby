/*
    obsługa komunikację Ajax - serwer
*/

function Net() {

    var czekaj;
    var stan;
    var mojlogin;
    this.test = "test";

    $("#loginbutton").on("click", function () {
        var login = $("#loginname").val()
        $.ajax({
            url: "http://localhost:3000/",
            data: { action: "add", name: login },
            type: "POST",
            success: function (data) {
                switch (data) {

                    case "player1":
                        $("#info").html(data + ": " + login + "</br>Czekanie na gracza 2")
                        game.setPoz("front");

                        game.dajPionki()
                        czekaj = setInterval(function () { check() }, 500);
                        zniknij()
                        porownywanie = setInterval(function () { porownywanie_tablic_klient() }, 1000);

                        stan = data;
                        mojlogin = login;
                        break;

                    case "player2":
                        $("#info").text(data + ": " + login)
                        game.setPoz("back");

                        game.dajPionki()
                        zniknij()
                        porownywanie = setInterval(function () { porownywanie_tablic_klient() }, 1000);

                        stan = data;
                        mojlogin = login;
                        break;

                    case "login zajęty":
                        $("#info").text(data)
                        break;

                    case "brak miejsc":
                        $("#info").text(data)
                        break;
                }
            },
            error: function (xhr, status, error) {
                //console.log("error")
            },
        });
    });

    $("#resetbutton").on("click", function () {
        $.ajax({
            url: "http://localhost:3000/",
            data: { action: "reset" },
            type: "POST",
            success: function (data) {
                if (data == "ok") {
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                //console.log("error")
            },
        });
    });

    function zniknij() {
        $("#form").css("display", "none");
    }

    function check() {
        $.ajax({
            url: "http://localhost:3000/",
            data: { action: "check" },
            type: "POST",
            success: function (data) {
                if (data == "true") {
                    stop();
                    $("#info").html(stan + ": " + mojlogin + "</br>Gracz 2 dołączył")
                }
            },
            error: function (xhr, status, error) {
                //console.log("error")
            },
        });
    }

    this.get_stan = function () {
        return stan;
    }

    function stop() {
        clearInterval(czekaj);
    }

    this.aktualizacja_tablicy_klient = function (pionki) {

        clearInterval(porownywanie)

        //console.log("update")
        //console.log(pionki)

        $.ajax({
            url: "http://localhost:3000/",
            data: { action: "aktualizacja_tablicy", data: JSON.stringify(pionki) },
            type: "POST",
            success: function (data) {
                if (data = "ok") {
                    porownywanie = setInterval(function () { porownywanie_tablic_klient() }, 1000);
                    //console.log("okokokokokokokokokokokokokookooko")
                }
            },
            error: function (xhr, status, error) {
                //console.log("error")
                this.aktualizacja_tablicy_klient(game.get_pionki())
            },
        });

    }

    function porownywanie_tablic_klient() {
        //console.log("compare")
        //console.log(game.get_pionki())

        $.ajax({
            url: "http://localhost:3000/",
            data: { action: "porownywanie_tablic", data: JSON.stringify(game.get_pionki()) },
            type: "POST",
            success: function (data) {
                var obj = JSON.parse(data)
                //console.log(obj.zmiany)
                if (obj.zmiany == "true") {
                    //console.log(obj.pionkiTab)
                    //console.log("refresh")
                    game.set_pionki(obj.pionkiTab);
                    game.refresh();
                }
            },
            error: function (xhr, status, error) {
                //console.log("error")
            },
        });
    }
}