document.addEventListener("DOMContentLoaded", () => {
    const $direccionPluginDesktop = document.querySelector("#direccionServidor"),
        $hacerPeticion = document.querySelector("#hacerPeticion"),
        $resultado = document.querySelector("#resultado"),
        $impresora = document.querySelector("#impresora");
    $hacerPeticion.addEventListener("click", async () => {
        $resultado.textContent = "cargando...";
        try {
            /*
               La lista de operaciones se crea como siempre
               según la API: https://parzibyte.me/http-esc-pos-desktop-docs/es/

               Aquí es un simple "Hola mundo" pero
               puede ser cualquier otro
            */
            const operaciones = [
                {
                    "nombre": "EscribirTexto",
                    "argumentos": [
                        "Hola\nimpresora\ndesde puente\ncon JavaScript\nUna ñ: soy ñ\n"
                    ]
                }
            ];

            /*
            Nombre de la impresora compartida en la computadora
            donde se ejecuta el plugin Desktop (NO ANDROID)
            */

            let nombreImpresora = $impresora.value;


            const payload = {
                serial: "",
                nombreImpresora: nombreImpresora,
                operaciones: operaciones
            };

            /*
                Dirección para comunicarnos con "Puente para plugin".

                Recuerda: este código se ejecutará en un navegador web,
                y ese navegador web se debe ejecutar en el mismo dispositivo
                Android donde está el Puente para el plugin minimizado
            */
            const direccionPuenteLocal = "http://localhost:8000";


            /*

                Dirección del plugin Desktop versión 1 (NO ANDROID). Es la
                IP de la computadora que se encuentra en la misma LAN
                que el dispositivo Android, incluyendo el puerto

                Si la IP de la computadora que ejecuta el plugin es
                192.168.0.6 y el plugin Desktop versión 1 (NO ANDROID) se
                ejecuta en el puerto 8000 entonces podemos decir que la 
                dirección remota del plugin desktop es http://192.168.0.6:8000

                Recuerda que esa es la raíz, pero para imprimir debemos invocar
                a la ruta /imprimir_en así que queda en
                http://192.168.0.6:8000/imprimir_en

                En este caso 192.168.0.6 es una IP de ejemplo. En tu caso debes
                averiguar la IP de la computadora que ejecuta el plugin Desktop
                y de ser posible hacerla estática
            */
            const direccionRemota = $direccionPluginDesktop.value;

            const respuestaHttp = await fetch(direccionPuenteLocal, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "x-reenviar-a": direccionRemota,
                }
            })
            const respuestaComoTexto = await respuestaHttp.text();
            $resultado.textContent = respuestaComoTexto;
        } catch (e) {
            $resultado.textContent = "Error: " + e.message;
        }

    })
})
