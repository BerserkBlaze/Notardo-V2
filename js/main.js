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
function workAlert(element) {
    var nombre = 'Nombre Tarea';
    Swal.fire({
        html: '<h1 class="alertTitle">' + nombre + '</h1><br><h3 class="alertFontword">Descripción:</h3><p class="alertFontword">Descripción lorem impsun te quiero bb uwu<P><br><h3 class="alertFontword">Día</h3><p class="alertFontword">dd/mm/dd</p>',
        showCloseButton: true,
        confirmButtonText:
        'Completada',
        confirmButtonColor:'#0DCB8F'
    }).then((isConfirm) => {
        if(isConfirm.value){
            element.classList.remove('incomplete');
            element.classList.add('complete');
        }
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
                html:'<h1 class="alertFontword" >Creaste tu cuenta correctamente</h1>',
                showConfirmButton: false,
                timer: 2000
            })
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, " ", errorMessage); ///////////// ALERT ACÁ //////////////
            Swal.fire({
                icon: 'error',
                html:'<h1 class="alertFontword" >'+errorMessage+'</h1>',
                showConfirmButton: false,
                timer: 2000
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
                html:'<h1 class="alertFontword" >'+errorMessage+'</h1>',
                showConfirmButton: false,
                timer: 2000
            })
        });
}

/* Cerrar sesión */
function signOut() {
    firebase.auth().signOut().then(function () {
        console.log("Cerraste sesión correctamente"); ///////////// ALERT ACÁ //////////////
        Swal.fire({
            icon: 'success',
            html:'<h1 class="alertFontword" >Cerraste sesión correctamente</h1>',
            showConfirmButton: false,
            timer: 2000
        })
    }).catch(function (error) {

    });
}

/* Permite observar si un usuario está activo */


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        leerMetas();
        console.log("Usuario Activo"); //////////// PENDIENTE ///////////

    } else {

        console.log("Usuario Inactivo");
    }
});

/* Inicializa la base de datos*/
var db = firebase.firestore();

/* Lee las metas desde la base de datos */
function leerMetas() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var lista = document.getElementById('metasList');
    db.collection("usuarios").doc(email).collection("metas").get().then(function (querySnapshot) {
        lista.innerHTML = '';
        querySnapshot.forEach(function (doc) {
            lista.innerHTML += '<div class="item incomplete"><h1>'+doc.data().nombre+'</h1><img src="img/deleted.png" alt="" class="btn_deleted" onclick= eliminarMeta("'+doc.id+'")><img src="img/edit.png" alt="" class="btn_edit"></div>';
        });
    });
}



/* Crea una meta */
function nuevaMeta() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var nombre = document.getElementById("Mname").value;
    var descripcion = document.getElementById("Mdescription").value;
    var fechaInicio = document.getElementById("Mdate_start").value;
    var fechaFin = document.getElementById("Mdate_end").value;

    var fechaInDate = new Date(fechaInicio+"T00:00:00");
    var fechaFiDate = new Date(fechaFin+"T00:00:00");

    //Se obtiene la fecha de hoy y se convierte para que sólo quede la fecha sin hora
    let date = new Date();
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    var fechaAux;
    if (month < 10) {
        fechaAux = year + "-0" + month + "-" + day;
    } else {
        fechaAux = year + "-" + month + "-" + day;
    }
    var fechaHoy = new Date(fechaAux);

    if (nombre != "" && descripcion != "" && fechaInicio != "" && fechaFin != "") {
        if (fechaInDate <= fechaFiDate && fechaInDate >= fechaHoy) {
            db.collection("usuarios").doc(email).collection("metas").add({
                nombre: nombre,
                descripcion: descripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            })
                .then(function (docRef) {
                    ///////////// ALERT ACÁ //////////////

                    Swal.fire({
                        icon: 'success',
                        html:'<h2 class="alertFontword" >Creaste tu meta correctamente</h2>',
                        showConfirmButton: false,
                        timer: 2000
                    })

                    document.getElementById("Mname").value = '';
                    document.getElementById("Mdescription").value = '';
                    document.getElementById("Mdate_start").value = '';
                    document.getElementById("Mdate_end").value = '';

                    leerMetas();
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
        } else {
            Swal.fire({
                icon: 'error',
                html:'<h2 class="alertFontword" >Asegúrate de que las fechas estén bien</h2>',
                showConfirmButton: false,
                timer: 2000
            })
        }
    } else {
        ///////////// ALERT ACÁ //////////////
        Swal.fire({
            icon: 'error',
            html:'<h2 class="alertFontword" >Debes llenar todos los campos para crear tu meta</h2>',
            showConfirmButton: false,
            timer: 2500
        })
    }
}

/*Eliminar metas */
function eliminarMeta(docId){
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("usuarios").doc(email).collection("metas").doc(docId).delete().then(function() {
        Swal.fire({
            icon: 'success',
            html:'<h2 class="alertFontword" >Eliminaste la meta correctamente</h2>',
            showConfirmButton: false,
            timer: 2000
        })
        leerMetas();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}



