document.addEventListener("DOMContentLoaded", () => {
    const $codigo = document.querySelector("#codigo");
    $codigo.addEventListener("keydown", evento => {
        if (evento.keyCode === 13) {
            // El lector ya terminó de leer
            const codigoDeBarras = $codigo.value;
            // Aquí ya podemos hacer algo con el código. Yo solo lo imprimiré
            console.log("Tenemos un código de barras:");
            console.log(codigoDeBarras);
            // Limpiar el campo
            $codigo.value = "";
        }
    });
});