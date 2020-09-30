var secciones = [];

window.onload = function () {
    this.inicializarVistas();
}
function inicializarVistas() {
    secciones[0] = document.getElementById("signIn");
    secciones[1] = document.getElementById("signUp");
}
function cambiarSeccion(id_seccion) {
    for (var i in secciones) {
        secciones[i].classList.add("oculto");
    }
    secciones[id_seccion].classList.remove("oculto");
}

/*style alert tarea*/
function workAlert() {
    var nombre = 'Nombre Tarea';
    Swal.fire({
        html: '<h1 class="alertTitle">' + nombre + '</h1><br><h3 class="alertFontword">Descripción:</h3><p class="alertFontword">Descripción lorem impsun te quiero bb uwu<P><br><h3 class="alertFontword">Día</h3><p class="alertFontword">dd/mm/dd</p>',
        showConfirmButton: false,
    })
}

/* Creación de usuarios */
function signUp() {
    var email = document.getElementById("emailSignUp").value;
    var password = document.getElementById("passwordSignUp").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function () {
            console.log("Se creó la cuente correctamente"); ///////////// ALERT ACÁ //////////////
            Swal.fire({
                icon: 'success',
                title: 'Se creó la cuenta correctamente',
                showConfirmButton: false,
                timer: 1500
              })
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, " ", errorMessage); ///////////// ALERT ACÁ //////////////
            Swal.fire({
                icon: 'error',
                title: errorCode+' '+errorMessage,
                showConfirmButton: false,
                timer: 1500
              })
        });

}

/* Inicio de sesión de los usuarios */
function signIn() {
    var email = document.getElementById("emailSignIn").value;
    var password = document.getElementById("passwordSignIn").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function () {
            console.log("Se autenticó correctamente");
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, " ", errorMessage); ///////////// ALERT ACÁ //////////////
            Swal.fire({
                icon: 'error',
                title: errorCode+' '+errorMessage,
                showConfirmButton: false,
                timer: 1500
              })
        });
}

/* Cerrar sesión */
function signOut() {
    firebase.auth().signOut().then(function () {
        console.log("Cerró sesión correctamente"); ///////////// ALERT ACÁ //////////////
        Swal.fire({
            icon: 'success',
            title: 'Cerró sesión correctamente',
            showConfirmButton: false,
            timer: 1500
          })
    }).catch(function (error) {

    });
}

/* Permite observar si un usuario está activo */

function isLoged() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            console.log("Usuario Activo"); //////////// PENDIENTE ///////////

        } else {

            console.log("Usuario Inactivo");
        }
    });
}
isLoged();

/* Inicializa la base de datos */
var db = firebase.firestore();

/* Crea una meta */
function nuevaMeta() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var nombre = document.getElementById("Mname").value;
    var descripcion = document.getElementById("Mdescription").value;
    var fechaInicio = document.getElementById("MDate_start").value;
    var fechaFin = document.getElementById("MDate_end").value;

    var fechaInDate = new Date(fechaInicio);
    var fechaFiDate = new Date(fechaFin);

    let date = new Date();
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    var fechaAux;
    if (month < 10) {
        fechaAux = year +"-0"+ month +"-"+ day;
    } else {
        fechaAux = year +"-"+ month +"-"+ day;
    }
    console.log(fechaAux, " ", fechaInicio);
    var fechaHoy = new Date(fechaAux);
    console.log(fechaFiDate, " ", fechaInDate, " ", fechaHoy);

    if (nombre != "" && descripcion != "" && fechaInicio != "" && fechaFin != "" && fechaInDate <= fechaFiDate && fechaInDate >= fechaHoy) {
        db.collection("usuarios").doc(email).collection("metas").add({
            nombre: nombre,
            descripcion: descripcion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    } else {
        console.log("No se pudo crear la meta"); ///////////// ALERT ACÁ //////////////
        Swal.fire({
            icon: 'error',
            title: "No se pudo crear la meta",
            showConfirmButton: false,
            timer: 1500
          })
    }
}