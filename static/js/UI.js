/*
    UI - obsługa interfejsu użytkownika
*/

function Ui() {
    game.setPoz("side");

    $("#select").on("change", function () {
        game.setPoz($("#select").val());
    });

    $("#root").on("click", function (event) {
        game.pick(event)
    })

}