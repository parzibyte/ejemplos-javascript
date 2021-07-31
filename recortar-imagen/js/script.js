document.addEventListener("DOMContentLoaded", () => {
	const MIME_TYPE_IMAGEN_DESCARGADA = "image/jpeg",
		EXTENSION_IMAGEN_DESCARGADA = "jpg",
		CALIDAD_JPG = 1;

	const $btnDescargar = document.querySelector("#descargar");
	const $imagen = document.querySelector("#imagen");

	let cropper = new Cropper($imagen, {
		responsive: false, // <-- Si no se pone en false, la imagen se mueve cuando cambia el tamaño de la ventana
	});

	$btnDescargar.onclick = () => {
		if (!cropper) {
			return;
		}
		// Obtener el canvas recortado
		const canvas = cropper.getCroppedCanvas();
		// Aquí ya podemos hacer cualquier cosa con el canvas
		let enlace = document.createElement('a');
		// Nombre de la imagen que se descarga
		enlace.download = "imagen_recortada." + EXTENSION_IMAGEN_DESCARGADA;
		enlace.href = canvas.toDataURL(MIME_TYPE_IMAGEN_DESCARGADA, CALIDAD_JPG);
		enlace.click();
	};

});