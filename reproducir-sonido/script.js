
// Carga un sonido a través de su fuente y lo inyecta de manera oculta
const cargarSonido = function (fuente) {
    const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
};
const $botonReproducir = document.querySelector("#btnReproducir"),
    $botonPausar = document.querySelector("#btnPausar"),
    $botonReiniciar = document.querySelector("#btnReiniciar");
// El sonido que podemos reproducir o pausar
const sonido = cargarSonido("sonido.flac");
$botonReproducir.onclick = () => {
    sonido.play();
};
$botonPausar.onclick = () => {
    sonido.pause();
};
$botonReiniciar.onclick = () => {
    sonido.currentTime = 0;
};