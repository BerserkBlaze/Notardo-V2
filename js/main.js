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

/*style alert tarea*/
function workAlert() {
    var nombre= 'Nombre Tarea';
    Swal.fire({
        html: '<h1 class="alertTitle">'+nombre+'</h1><br><h3 class="alertFontword">Descripción:</h3><p class="alertFontword">Descripción lorem impsun te quiero bb uwu<P><br><h3 class="alertFontword">Día</h3><p class="alertFontword">dd/mm/dd</p>',
        showConfirmButton:false,
      })
}