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
const $btnAbrir = document.querySelector("#btnAbrir"),
	$mensaje = document.querySelector("#mensaje"),
	$btnEnviarMensaje = document.querySelector("#btnEnviarMensaje"),
	$mensajeRecibido = document.querySelector("#mensajeRecibido");

let ventana;
$btnAbrir.addEventListener("click", () => {
	ventana = window.open("otra_ventana.html");
});

$btnEnviarMensaje.addEventListener("click", () => {
	let mensaje = $mensaje.value;
	if (!mensaje) {
		return;
	}
	if (ventana) {
		ventana.establecerMensaje(mensaje);
	}
});

// Llamada desde la hija
function establecerMensaje(mensaje) {
	$mensajeRecibido.textContent = mensaje;
}