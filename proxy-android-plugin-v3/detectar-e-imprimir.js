document.addEventListener("DOMContentLoaded", async () => {
    const $direccionPluginDesktop = document.querySelector("#direccionServidor"),
        $hacerPeticion = document.querySelector("#hacerPeticion"),
        $resultado = document.querySelector("#resultado"),
        $impresora = document.querySelector("#impresora"),
        $informacionRemota = document.querySelector("#contenedorInformacionRemota");
    let estamosEnAndroid = false;
    try {
        // Puente y plugin devuelven la versión en la misma ruta
        // Recordar que para usar await hay que estar dentro de una función async
        const respuestaHttp = await fetch("http://localhost:8000/version");
        const version = await respuestaHttp.json()
        estamosEnAndroid = version.plataforma === "Puente";
    } catch (e) {
        $resultado.textContent = ("Error consultando versión. Asegúrese de que el plugin o el puente se están ejecutando: " + e.message);
        return;
    }
    // Si llegamos hasta aquí es porque se ha detectado la plataforma correctamente
    if (estamosEnAndroid) {
        $resultado.textContent = ("Estamos en Android con el puente");
    } else {
        $resultado.textContent = ("Estamos en Desktop con el plugin")
    }




    if (!estamosEnAndroid) {
        $informacionRemota.style.display = "none";
    }

    $hacerPeticion.addEventListener("click", async () => {
        /*
            Nombre de la impresora compartida en la computadora
            donde se ejecuta el plugin Desktop (NO ANDROID)
        */

        let nombreImpresora = $impresora.value;
        // La carga útil es la misma tanto para el puente como para el 
        // plugin
        const operaciones = [
            {
                "nombre": "EscribirTexto",
                "argumentos": [
                    "Hola\nimpresora\ndesde puente\ncon JavaScript\n"
                ]
            }
        ];
        const payload = {
            serial: "",
            nombreImpresora: nombreImpresora,
            operaciones: operaciones
        };


        // Y aquí comprobamos si se imprime con el puente o sin él

        if (estamosEnAndroid) {
            const direccionRemota = $direccionPluginDesktop.value;
            const respuestaHttp = await fetch("http://localhost:8000", {
                body: JSON.stringify(payload),
                method: "POST",
                headers: {
                    "x-reenviar-a": direccionRemota,
                }
            });
            const respuesta = await respuestaHttp.json();
            if (respuesta.ok) {
                $resultado.textContent = ("Impreso correctamente");
            } else {
                $resultado.textContent = ("Error: " + respuesta.message);
            }
        } else {
            const respuestaHttp = await fetch("http://localhost:8000/imprimir", {
                body: JSON.stringify(payload),
                method: "POST",
            });
            const respuesta = await respuestaHttp.json();
            if (respuesta.ok) {
                $resultado.textContent = ("Impreso correctamente");
            } else {
                $resultado.textContent = ("Error: " + respuesta.message);
            }
        }
    })

});