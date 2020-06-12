/*

    Programado por Luis Cabrera Benito 
  ____          _____               _ _           _       
 |  _ \        |  __ \             (_) |         | |      
 | |_) |_   _  | |__) |_ _ _ __ _____| |__  _   _| |_ ___ 
 |  _ <| | | | |  ___/ _` | '__|_  / | '_ \| | | | __/ _ \
 | |_) | |_| | | |  | (_| | |   / /| | |_) | |_| | ||  __/
 |____/ \__, | |_|   \__,_|_|  /___|_|_.__/ \__, |\__\___|
         __/ |                               __/ |        
        |___/                               |___/         
    
    
    Blog:       https://parzibyte.me/blog
    Ayuda:      https://parzibyte.me/blog/contrataciones-ayuda/
    Contacto:   https://parzibyte.me/blog/contacto/
*/


// Este script es incluido en la ventana que abre la principal
const $btnEnviar = document.querySelector("#btnEnviar"),
	$mensaje = document.querySelector("#mensaje"),
	$mensajeRecibido = document.querySelector("#mensajeRecibido");
$btnEnviar.addEventListener("click", () => {
	const mensaje = $mensaje.value;
	if (!mensaje) return alert("Escribe un mensaje");
	if (window.opener) {
		window.opener.establecerMensaje(mensaje);
	}
});


// Definición de función desde la que nos llama el padre
window.establecerMensaje = function (mensaje) {
	$mensajeRecibido.textContent = mensaje;
}