Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
new Vue({
	el: "#app",
	data: () => ({
		busqueda: "",
		articulos: [],
		articuloSeleccionado: {},
	}),
	methods: {
		// Función que se invoca cuando el texto de búsqueda cambia
		async buscarArticulos() {
			// La búsqueda como string. La tomamos del campo de texto
			const busqueda = this.busqueda;
			// Hacemos la petición a nuestra API pasándole la búsqueda. En este caso consulto la wikipedia
			const respuesta = await fetch(`https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=${busqueda}`);
			/**
			 * Pequeña gran nota: En este caso primero decodifico como texto, luego quito el HTML
			 * y después hago un JSON.parse así:
			 			let datos = await respuesta.text();
						datos = this.quitarHTML(datos);
						datos = JSON.parse(datos);
			 * En tu caso, si tu API no devuelve HTML (como debería ser) simplemente haz un:
			      const datos = await respuesta.json();
			 */
			let articulosWikipedia = await respuesta.text();
			articulosWikipedia = this.quitarHTML(articulosWikipedia);
			articulosWikipedia = JSON.parse(articulosWikipedia);
			// Aquí todo depende de la respuesta de tu servidor. Si el mismo solo te da un arreglo, entonces asigna con:
			// this.articulos = datos;
			//Pero en este caso la API nos regresa un objeto que tiene la propiedad "query" y dentro de la misma tiene la propiedad search
			this.articulos = articulosWikipedia.query.search;
		},
		quitarHTML(html) {
			return html.replace(/<\/?[^>]+>/gi, '');
		},
		// Función que convierte el objeto a cadena. Es llamado para mostrarse en la lista
		serializarValor(articulo) {
			return articulo.title + " - " + articulo.snippet;
		},
		onArticuloSeleccionado(articulo) {
			this.articuloSeleccionado = articulo;
		}
	}
});