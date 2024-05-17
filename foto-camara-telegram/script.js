/*
    Tomar una fotografía y enviarla a Telegram periódicamente
    @date 2024-05-14
    @author parzibyte
    @web parzibyte.me/blog
*/
const tieneSoporteUserMedia = () =>
    !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
const _getUserMedia = (...arguments) =>
    (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);

const sleep = ms => new Promise(r => setTimeout(r, ms));
let yaEstaEnviandoFotos = false;
const TIEMPO_ESPERA_ENTRE_FOTOS_EN_MILISEGUNDOS = 2000;
const tomarFotoPeriodicamente = async () => {
    while (true) {
        await tomarFoto();
        await sleep(TIEMPO_ESPERA_ENTRE_FOTOS_EN_MILISEGUNDOS);
    }
}
const $video = document.querySelector("#video"),
    $estado = document.querySelector("#estado"),
    $listaDeDispositivos = document.querySelector("#listaDeDispositivos");
const urlSearchParams = new URLSearchParams(window.location.search);
const TOKEN = urlSearchParams.get("token"),
    ID_CHAT = urlSearchParams.get("idChat");
let canvasFueraDePantalla = null;
let contextoCanvas = null;
const formateador = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'medium' });

const limpiarSelect = () => {
    for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--)
        $listaDeDispositivos.remove(x);
};
const obtenerDispositivos = () => navigator
    .mediaDevices
    .enumerateDevices();

// La función que es llamada después de que ya se dieron los permisos
// Lo que hace es llenar el select con los dispositivos obtenidos
const llenarSelectConDispositivosDisponibles = async () => {
    limpiarSelect();
    const dispositivos = await obtenerDispositivos();
    const dispositivosDeVideo = [];
    dispositivos.forEach(dispositivo => {
        const tipo = dispositivo.kind;
        if (tipo === "videoinput") {
            dispositivosDeVideo.push(dispositivo);
        }
    });

    // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
    if (dispositivosDeVideo.length > 0) {
        // Llenar el select
        dispositivosDeVideo.forEach(dispositivo => {
            const option = document.createElement('option');
            option.value = dispositivo.deviceId;
            option.text = dispositivo.label;
            $listaDeDispositivos.appendChild(option);
        });
    }
}

const enviarImagen = async (idChat, token, imagen) => {
    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    const fd = new FormData();
    fd.append("chat_id", idChat)
    const caption = `${$listaDeDispositivos.options[$listaDeDispositivos.selectedIndex].text} ${formateador.format(new Date())}`;
    fd.append("caption", caption);
    fd.append("photo", imagen);
    const respuestaHttp = await fetch(url, {
        method: 'POST',
        body: fd,
    });
    return {
        respuesta: await respuestaHttp.json(),
        codigo: respuestaHttp.status,
    };
}

const tomarFoto = async () => {
    //Pausar reproducción
    $video.pause();
    canvasFueraDePantalla.width = $video.videoWidth;
    canvasFueraDePantalla.height = $video.videoHeight;
    //Obtener contexto del canvas y dibujar sobre él
    contextoCanvas.drawImage($video, 0, 0, canvasFueraDePantalla.width, canvasFueraDePantalla.height);
    //Reanudar reproducción
    await $video.play();
    let foto = await canvasFueraDePantalla.convertToBlob(); //Esta es la foto, en base 64
    await enviarImagen(ID_CHAT, TOKEN, foto);
}

(async function () {
    // Comenzamos viendo si tiene soporte, si no, nos detenemos
    if (!tieneSoporteUserMedia()) {
        alert("Lo siento. Tu navegador no soporta esta característica");
        $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
        return;
    }
    //Aquí guardaremos el stream globalmente
    let stream;

    const mostrarStream = idDeDispositivo => {
        _getUserMedia({
            video: {
                // Justo aquí indicamos cuál dispositivo usar
                deviceId: idDeDispositivo,
            }
        },
            async (streamObtenido) => {
                // Aquí ya tenemos permisos, ahora sí llenamos el select,
                // pues si no, no nos daría el nombre de los dispositivos
                if ($listaDeDispositivos.length <= 0) {
                    llenarSelectConDispositivosDisponibles();
                }

                // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
                $listaDeDispositivos.onchange = () => {
                    // Detener el stream
                    if (stream) {
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    }
                    // Mostrar el nuevo stream con el dispositivo seleccionado
                    mostrarStream($listaDeDispositivos.value);
                }

                // Simple asignación
                stream = streamObtenido;

                // Mandamos el stream de la cámara al elemento de vídeo
                $video.srcObject = stream;
                // Refrescar el canvas
                await $video.play();
                canvasFueraDePantalla = new OffscreenCanvas($video.videoWidth, $video.videoHeight);
                contextoCanvas = canvasFueraDePantalla.getContext("2d");
                // Prevenir enviar dos fotos cuando se cambia el dispositivo
                if (!yaEstaEnviandoFotos) {
                    tomarFotoPeriodicamente();
                    yaEstaEnviandoFotos = true;
                }
            }, (error) => {
                console.log("Permiso denegado o error: ", error);
                $estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
            });
    }

    // Comenzamos pidiendo los dispositivos
    const dispositivos = await obtenerDispositivos()
    // Vamos a filtrarlos y guardar aquí los de vídeo
    const dispositivosDeVideo = [];

    // Recorrer y filtrar
    dispositivos.forEach(function (dispositivo) {
        const tipo = dispositivo.kind;
        if (tipo === "videoinput") {
            dispositivosDeVideo.push(dispositivo);
        }
    });

    // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
    // y le pasamos el id de dispositivo
    if (dispositivosDeVideo.length > 0) {
        // Mostrar stream con el ID del primer dispositivo, luego el usuario puede cambiar
        mostrarStream(dispositivosDeVideo[0].deviceId);
    }
})();