var secciones = [];

window.onload = function() {
    this.inicializarVistas();
}
function inicializarVistas(){
    secciones[0]=document.getElementById("signIn");
    secciones[1]=document.getElementById("signUp");
}
function cambiarSeccion(id_seccion) {
    for (var i in secciones) {
        secciones[i].classList.add("oculto");
    }
    secciones[id_seccion].classList.remove("oculto");
}