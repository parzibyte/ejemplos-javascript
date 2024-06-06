let canvasFueraDePantalla = null;
let contextoCanvas = null;
const CODIGO_CARACTER_TERMINACION = 4;
const $imagen = document.querySelector("#imagen");
const $ocultar = document.querySelector("#ocultar");
const $leer = document.querySelector("#leer");
const $mensaje = document.querySelector("#mensaje");
const $resultado = document.querySelector("#resultado");
let nombreImagenSinExtension = "";
let extensionImagen = "";

const extraerNombreSinExtension = (nombre) => {
    const indice = nombre.lastIndexOf(".");
    if (indice === -1) {
        return "";
    }
    return nombre.substring(0, indice);
}
const extraerExtensionDeArchivo = (nombre) => {
    const indice = nombre.lastIndexOf(".");
    if (indice === -1) {
        return "";
    }
    return nombre.substring(indice + 1);
}
const mimeTypeAPartirDeExtension = (extension) => {
    if (extension === "png") {
        return "image/png";
    } else if (extension === "jpg") {
        return "image/jpeg";
    } else if (extension === "webp") {
        return "image/png";
    }
}
/*
Si especificas el indiceBit en 0 te estarás refiriendo al LSB 
y si especificas el indiceBit en 7 te refieres al MSB.
Dicho de otra manera, los índices comienzan a contarse de derecha a izquierda
*/
const establecerBitEnNumero = (numero, indiceBit, bit) => {
    if (bit === 1) {
        numero |= (1 << indiceBit);
    } else {
        numero &= ~(1 << indiceBit);
    }
    return numero;
}

// Establece el LSB de un número según el bit y devuelve el número
const colocarLsbDeNumero = (numero, bit) => {
    // Solo lo he probado con números entre 0 y 255
    if (bit === 1) {
        return numero | 1;
    } else {
        return numero & 254;
    }
}

// Devuelve el LSB de un número
const obtenerLsb = (numero) => {
    return numero & 1;
}

const obtenerBitsDeMensaje = (mensaje) => {
    const bits = [];
    for (let indiceByte = 0; indiceByte < mensaje.length; indiceByte++) {
        // Obtener entero ASCII de la letra (byte) actual...
        const charCode = mensaje.charCodeAt(indiceByte);
        // Recorrer cada bit
        for (let indiceBit = 7; indiceBit >= 0; indiceBit--) {
            const bit = (charCode >> indiceBit) & 1;
            //console.log(`Charcode ${charCode} con índice bit ${indiceBit} y bit valor ${bit}`);
            bits.push(bit);
        }
    }
    return bits;
}


const dibujarImagenEnCanvasGlobal = async (imagen) => {
    nombreImagenSinExtension = extraerNombreSinExtension(imagen.name);
    extensionImagen = extraerExtensionDeArchivo(imagen.name);
    const imagenComoBitmap = await createImageBitmap(imagen);
    canvasFueraDePantalla = new OffscreenCanvas(imagenComoBitmap.width, imagenComoBitmap.height);
    contextoCanvas = canvasFueraDePantalla.getContext("2d");
    contextoCanvas.drawImage(imagenComoBitmap, 0, 0, imagenComoBitmap.width, imagenComoBitmap.height);
}

const obtenerImageData = () => {
    return contextoCanvas.getImageData(0, 0, canvasFueraDePantalla.width, canvasFueraDePantalla.height);
}

const colocarImageData = (datosDeImagen) => {
    contextoCanvas.putImageData(datosDeImagen, 0, 0);
}

const descargarCanvas = async () => {
    let fotoComoBlob = await canvasFueraDePantalla.convertToBlob();
    const a = document.createElement("a");
    const archivo = new Blob([fotoComoBlob], { type: mimeTypeAPartirDeExtension(extensionImagen) });
    const url = URL.createObjectURL(archivo);
    a.href = url;
    a.download = `${nombreImagenSinExtension}_con_mensaje.${extensionImagen}`;
    a.click();
    URL.revokeObjectURL(url);
}

const leer = async () => {
    const imagenes = $imagen.files;
    if (imagenes.length <= 0) {
        return;
    }
    const primerArchivoDeImagen = imagenes[0];
    await dibujarImagenEnCanvasGlobal(primerArchivoDeImagen);
    const datosDeImagen = obtenerImageData();
    const pixeles = datosDeImagen.data;
    let mensaje = "";
    let codigoDelCaracterActual = 0;
    let indiceBitEnCaracterActual = 7;
    for (let indice = 0; indice < pixeles.length; indice++) {
        // Omitir canal alfa por ahora
        // Por ejemplo 3, 7, 11 son el alfa. Si le sumamos 1 son
        // 4,8,12 que ya se puede comparar para saber si es múltiplo
        // de 4
        //console.log({ indice });
        if ((indice + 1) % 4 === 0) {
            continue;
        }
        const lsbDelNivelDelColor = obtenerLsb(pixeles[indice]);
        codigoDelCaracterActual = establecerBitEnNumero(codigoDelCaracterActual, indiceBitEnCaracterActual, lsbDelNivelDelColor);
        //console.log(`Agregando LSB ${lsbDelNivelDelColor} del nivel ${pixeles[indice]} al número que hasta ahora es ${codigoDelCaracterActual} en el índice ${indiceBitEnCaracterActual}`);
        if (indiceBitEnCaracterActual === 0) {
            if (codigoDelCaracterActual === CODIGO_CARACTER_TERMINACION) {
                break;
            }
            const letra = String.fromCodePoint(codigoDelCaracterActual);
            //console.log(`Agregando número ${codigoDelCaracterActual} que es ${letra}`);
            mensaje += letra;
            codigoDelCaracterActual = 0;
            indiceBitEnCaracterActual = 8;
        }
        indiceBitEnCaracterActual--;
    }
    $resultado.textContent = mensaje;
}

const bitsMensajeTerminacion = obtenerBitsDeMensaje(String.fromCharCode(CODIGO_CARACTER_TERMINACION));
const ocultar = async () => {
    const imagenes = $imagen.files;
    if (imagenes.length <= 0) {
        return;
    }
    const mensaje = $mensaje.value;
    if (!mensaje) {
        return alert("Escribe un mensaje");
    }
    const primerArchivoDeImagen = imagenes[0];
    await dibujarImagenEnCanvasGlobal(primerArchivoDeImagen);

    const datosDeImagen = obtenerImageData();
    const pixeles = datosDeImagen.data;
    const bitsMensaje = obtenerBitsDeMensaje(mensaje).concat(bitsMensajeTerminacion);
    let indicePixel = 0;
    for (let indiceBit = 0; indiceBit < bitsMensaje.length; indiceBit++) {
        const bitDelMensaje = bitsMensaje[indiceBit];
        //console.log(`Ocultando ${bitDelMensaje} en el nivel con valor ${pixeles[indicePixel]} (posición ${indicePixel}) que será convertido a ${colocarLsbDeNumero(pixeles[indicePixel], bitDelMensaje)}`)
        pixeles[indicePixel] = colocarLsbDeNumero(pixeles[indicePixel], bitDelMensaje);
        indicePixel++;
        // Omitir canal alfa por ahora
        // Por ejemplo 3, 7, 11 son el alfa. Si le sumamos 1 son
        // 4,8,12 que ya se puede comparar para saber si es múltiplo
        // de 4
        if ((indicePixel + 1) % 4 === 0) {
            indicePixel++;
        }
    }
    colocarImageData(datosDeImagen);
    await descargarCanvas();
}

document.addEventListener("DOMContentLoaded", () => {
    $ocultar.addEventListener("click", ocultar);
    $leer.addEventListener("click", leer);
});