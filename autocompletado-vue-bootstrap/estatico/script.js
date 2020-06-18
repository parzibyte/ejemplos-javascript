Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)
new Vue({
	el: "#app",
	data: () => ({
		busqueda: "",
		nombres: ["Luis Cabrera", "Leon Scott Kennedy", "Claire Redfield", "Noble 6", "Chris Redfield", "Madeline", "Cuphead", "Mugman", "Ori"],
		nombreSeleccionado: null,
	}),
	methods: {
		onNombreSeleccionado(nombre) {
			this.nombreSeleccionado = nombre;
		}
	}
});