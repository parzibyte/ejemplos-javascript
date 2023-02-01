document.addEventListener("DOMContentLoaded", () => {
    const $textarea = document.querySelector("#miTextarea");
    $textarea.addEventListener("keydown", (evento) => {
        if (evento.keyCode === 13) {
            evento.preventDefault();
        }
    });
});
