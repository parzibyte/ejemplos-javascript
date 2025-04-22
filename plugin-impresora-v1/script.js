document.addEventListener("DOMContentLoaded", async () => {
    const $impresoras = document.querySelector("#impresoras"),
        $mensaje = document.querySelector("#mensaje"),
        $imprimir = document.querySelector("#imprimir");
    if (typeof Impresora === "undefined") {
        alert("No has importado el conector")
        return;
    }

    const refrescarListaDeImpresoras = async () => {
        try {
            const respuestaHttpImpresoras = await fetch("http://localhost:8000/impresoras");
            const impresoras = await respuestaHttpImpresoras.json();
            if (impresoras.length <= 0) {
                alert("No hay impresoras. Asegúrese de contar con una y compartirla");
            }
            for (const impresora of impresoras) {
                const $option = Object.assign(document.createElement("option"), {
                    value: impresora,
                    text: impresora,
                })
                $impresoras.append($option);
            }
        } catch (e) {
            alert("Error cargando impresoras. Asegúrese de que el plugin se está ejecutando " + e.message);
        }

    }

    await refrescarListaDeImpresoras();

    const imprimir = async () => {
        const impresora = new Impresora();
        impresora.write("Imprimiendo...\n");
        impresora.setEmphasize(1);
        impresora.write("Texto enfatizado\n");
        impresora.setEmphasize(0);
        impresora.write("Tu mensaje es: \n");
        impresora.write($mensaje.value);
        impresora.write("\nAvanzando papel 5 lineas\n");
        impresora.feed(5);
        impresora.setAlign(C.AlineacionCentro)
        impresora.write("Texto centrado\nTerminando trabajo...");
        const respuesta = await impresora.imprimirEnImpresora($impresoras.value);
        console.log({respuesta})
    }


    $imprimir.addEventListener("click", () => {
        imprimir();
    });


})