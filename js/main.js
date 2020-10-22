var secciones = [];
var tiempo_splash = 2500;

window.onload = function () {
    this.inicializarVistas();
    //setTimeout(cambiarSplash, tiempo_splash);
}
function inicializarVistas() {
    secciones[0] = document.getElementById("signIn");
    secciones[1] = document.getElementById("signUp");
    secciones[3] = document.getElementById("splash");
}
function cambiarSplash() {
    secciones[3].classList.add("oculto");
    secciones[3].classList.remove("splash");
    secciones[0].className = "signIn";
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
        showCancelButton: true,
        confirmButtonText: 'Completada',
        cancelButtonText: 'Todavia no',
        confirmButtonColor: '#0DCB8F'
    }).then((result) => {
        if (result.value) {
            element.classList.remove('incomplete');
            element.classList.add('complete');
        }
        else if (result.dismiss == 'cancel') {
            element.classList.remove('complete');
            element.classList.add('incomplete');
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
                html: '<h1 class="alertFontword" >Creaste tu cuenta correctamente</h1>',
                showConfirmButton: false,
                timer: 2000
            })
            document.getElementById('emailSignUp').value = '';
            document.getElementById('passwordSignUp').value = '';
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, " ", errorMessage); ///////////// ALERT ACÁ //////////////
            Swal.fire({
                icon: 'error',
                html: '<h1 class="alertFontword" >' + errorMessage + '</h1>',
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
                html: '<h1 class="alertFontword" >' + errorMessage + '</h1>',
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
            html: '<h1 class="alertFontword" >Cerraste sesión correctamente</h1>',
            showConfirmButton: false,
            timer: 2000
        })
        document.getElementById('emailSignIn').value = '';
        document.getElementById('passwordSignIn').value = '';
        document.getElementById('metasList').innerHTML = '';
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

////////// Código de METAS //////////
/* Lee las metas desde la base de datos */
function leerMetas() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var lista = document.getElementById('metasList');
    db.collection("usuarios").doc(email).collection("metas").get().then(function (querySnapshot) {
        lista.innerHTML = '';
        querySnapshot.forEach(function (doc) {
            var nombreMeta = doc.data().nombre;
            lista.innerHTML += '<div class="item incomplete" onclick=obtenerMeta("' + doc.id + '")><h1>' + nombreMeta + '</h1><img src="img/deleted.png" alt="" class="btn_deleted" onclick= eliminarMeta("' + doc.id + '")><img src="img/edit.png" alt="" class="btn_edit" onclick=editarMeta("' + doc.id + '")></div>';
        });
    });
}


/* Obtiene la fecha del día actual */
function obtenerDia() {
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
    return fechaHoy;
}
/* Crea una meta */
function nuevaMeta() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var nombre = document.getElementById("Mname").value;
    var descripcion = document.getElementById("Mdescription").value;
    var fechaInicio = document.getElementById("Mdate_start").value;
    var fechaFin = document.getElementById("Mdate_end").value;

    var fechaInDate = new Date(fechaInicio + "T00:00:00");
    var fechaFiDate = new Date(fechaFin + "T00:00:00");
    var fechaHoy = obtenerDia();

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
                        html: '<h2 class="alertFontword" >Creaste tu meta correctamente</h2>',
                        showConfirmButton: false,
                        timer: 2000
                    })

                    document.getElementById("Mname").value = '';
                    document.getElementById("Mdescription").value = '';
                    document.getElementById("Mdate_start").value = '';
                    document.getElementById("Mdate_end").value = '';

                    leerMetas();
                })

        } else {
            Swal.fire({
                icon: 'error',
                html: '<h2 class="alertFontword" >Asegúrate de que las fechas estén bien</h2>',
                showConfirmButton: false,
                timer: 2000
            })
        }
    } else {
        ///////////// ALERT ACÁ //////////////
        Swal.fire({
            icon: 'error',
            html: '<h2 class="alertFontword" >Debes llenar todos los campos para crear tu meta</h2>',
            showConfirmButton: false,
            timer: 2500
        })
    }
}

/*Eliminar metas */
function eliminarMeta(docId) {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("usuarios").doc(email).collection("metas").doc(docId).delete().then(function () {
        Swal.fire({
            icon: 'success',
            html: '<h2 class="alertFontword" >Eliminaste la meta correctamente</h2>',
            showConfirmButton: false,
            timer: 2000
        })
        leerMetas();
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}


/* Editar metas */
function editarMeta(docId) {
    var user = firebase.auth().currentUser;
    var email = user.email;

    var docRef = db.collection("usuarios").doc(email).collection("metas").doc(docId);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            document.getElementById('MEname').value = doc.data().nombre;
            document.getElementById('MEdescription').value = doc.data().descripcion;
            document.getElementById('MEdate_start').value = doc.data().fechaInicio;
            document.getElementById('MEdate_end').value = doc.data().fechaFin;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });

    var button = document.getElementById('editMeta');
    button.onclick = function () {
        var metaRef = db.collection("usuarios").doc(email).collection("metas").doc(docId);

        var nombre = document.getElementById("MEname").value;
        var descripcion = document.getElementById("MEdescription").value;
        var fechaInicio = document.getElementById("MEdate_start").value;
        var fechaFin = document.getElementById("MEdate_end").value;

        console.log(nombre, descripcion, fechaInicio, fechaFin);
        var fechaInDate = new Date(fechaInicio + "T00:00:00");
        var fechaFiDate = new Date(fechaFin + "T00:00:00");
        var fechaHoy = obtenerDia();

        if (nombre != "" && descripcion != "" && fechaInicio != "" && fechaFin != "") {
            if (fechaInDate <= fechaFiDate && fechaInDate >= fechaHoy) {
                return metaRef.update({
                    nombre: nombre,
                    descripcion: descripcion,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                })
                    .then(function () {
                        console.log("Document successfully updated!");
                        Swal.fire({
                            icon: 'success',
                            html: '<h2 class="alertFontword" >Editaste tu meta correctamente</h2>',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        document.getElementById("MEname").value = '';
                        document.getElementById("MEdescription").value = '';
                        document.getElementById("MEdate_start").value = '';
                        document.getElementById("MEdate_end").value = '';
                        leerMetas();
                    })
            } else {
                Swal.fire({
                    icon: 'error',
                    html: '<h2 class="alertFontword" >Asegúrate de que las fechas estén bien</h2>',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                html: '<h2 class="alertFontword" >Debes llenar todos los campos para editar tu meta</h2>',
                showConfirmButton: false,
                timer: 2500
            })
        }
    }
}

////////// Código de TAREAS //////////
/* Permite saber cuál es la meta actual */
var metaActual;
var nombreMeta;
var descpMeta;
var fechaInMeta;
var fechaFinMeta;
function obtenerMeta(id) {
    metaActual = id;
    console.log(metaActual);
    var user = firebase.auth().currentUser;
    var email = user.email;
    var docRef = db.collection("usuarios").doc(email).collection("metas").doc(metaActual);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            nombreMeta = doc.data().nombre;
            descpMeta = doc.data().descripcion;
            fechaInMeta = doc.data().fechaInicio;
            fechaFinMeta = doc.data().fechaFin;

            document.getElementById("workNMeta").innerHTML = nombreMeta;
            document.getElementById("workDMeta").innerHTML = descpMeta;
            elementFechaInicio = document.getElementsByClassName("date_start");
            for (var i in elementFechaInicio){
                elementFechaInicio[i].innerHTML = fechaInMeta;
            }
            elementFechaFin = document.getElementsByClassName("date_finish");
            for (var j in elementFechaFin){
                elementFechaFin[j].innerHTML = fechaFinMeta;
            }
            leerTareas();

        }
    });
}


/* Crear tarea */
function nuevaTarea() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var nombre = document.getElementById("Wname").value;
    var descripcion = document.getElementById("Wdescription").value;
    var fechaInicio = document.getElementById("Wdate").value;

    var fechaInDate = new Date(fechaInicio + "T00:00:00");
    var fechaFiDate = new Date(fechaFinMeta + "T00:00:00");
    var fechaHoy = obtenerDia();

    if (nombre != "" && descripcion != "" && fechaInicio != "") {
        if (fechaInDate >= fechaHoy && fechaInDate <= fechaFiDate) {
            db.collection("usuarios").doc(email).collection("metas").doc(metaActual).collection("tareas").add({
                nombre: nombre,
                descripcion: descripcion,
                fechaInicio: fechaInicio,
            })
                .then(function (docRef) {
                    ///////////// ALERT ACÁ //////////////

                    Swal.fire({
                        icon: 'success',
                        html: '<h2 class="alertFontword" >Creaste tu tarea correctamente</h2>',
                        showConfirmButton: false,
                        timer: 2000
                    })

                    document.getElementById("Wname").value = '';
                    document.getElementById("Wdescription").value = '';
                    document.getElementById("Wdate").value = '';
                    leerTareas();

                })

        } else {
            Swal.fire({
                icon: 'error',
                html: '<h2 class="alertFontword" >Asegúrate de que las fechas estén bien</h2>',
                showConfirmButton: false,
                timer: 2000
            })
        }
    } else {
        ///////////// ALERT ACÁ //////////////
        Swal.fire({
            icon: 'error',
            html: '<h2 class="alertFontword" >Debes llenar todos los campos para crear tu tarea</h2>',
            showConfirmButton: false,
            timer: 2500
        })
    }
}

/* Leer tareas */
function leerTareas() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var lista = document.getElementById('tareasList');
    db.collection("usuarios").doc(email).collection("metas").doc(metaActual).collection("tareas").get().then(function (querySnapshot) {
        lista.innerHTML = '';
        querySnapshot.forEach(function (doc) {
            var nombreTarea = doc.data().nombre;
            lista.innerHTML += '<div class="item incomplete" onclick="workAlert(this)"><h1>' + nombreTarea + '</h1><img src="img/deleted.png" alt="" class="btn_deleted" onclick=eliminarTarea("' + doc.id + '")><img src="img/edit.png" alt="" class="btn_edit" onclick=editarTarea("' + doc.id + '")></div>'
        });
    });
}

/*Eliminar tareas */
function eliminarTarea(docId) {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("usuarios").doc(email).collection("metas").doc(metaActual).collection("tareas").doc(docId).delete().then(function () {
        Swal.fire({
            icon: 'success',
            html: '<h2 class="alertFontword" >Eliminaste la tarea correctamente</h2>',
            showConfirmButton: false,
            timer: 2000
        })
        leerTareas();
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

/* Editar tarea */
function editarTarea(docId) {
    var user = firebase.auth().currentUser;
    var email = user.email;

    var docRef = db.collection("usuarios").doc(email).collection("metas").doc(metaActual).collection("tareas").doc(docId);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            document.getElementById('WEname').value = doc.data().nombre;
            document.getElementById('WEdescription').value = doc.data().descripcion;
            document.getElementById('WEdate').value = doc.data().fechaInicio;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });

    var button = document.getElementById('editTarea');
    button.onclick = function () {
        var metaRef = db.collection("usuarios").doc(email).collection("metas").doc(metaActual).collection("tareas").doc(docId);

        var nombre = document.getElementById("WEname").value;
        var descripcion = document.getElementById("WEdescription").value;
        var fechaInicio = document.getElementById("WEdate").value;

        var fechaInDate = new Date(fechaInicio + "T00:00:00");
        var fechaFiDate = new Date(fechaFinMeta + "T00:00:00");
        var fechaHoy = obtenerDia();

        if (nombre != "" && descripcion != "" && fechaInicio != "") {
            if (fechaInDate <= fechaFiDate && fechaInDate >= fechaHoy) {
                return metaRef.update({
                    nombre: nombre,
                    descripcion: descripcion,
                    fechaInicio: fechaInicio,
                })
                    .then(function () {
                        console.log("Document successfully updated!");
                        Swal.fire({
                            icon: 'success',
                            html: '<h2 class="alertFontword" >Editaste tu tarea correctamente</h2>',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        document.getElementById("WEname").value = '';
                        document.getElementById("WEdescription").value = '';
                        document.getElementById("WEdate").value = '';
                        leerTareas();
                    })
            } else {
                Swal.fire({
                    icon: 'error',
                    html: '<h2 class="alertFontword" >Asegúrate de que las fechas estén bien</h2>',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                html: '<h2 class="alertFontword" >Debes llenar todos los campos para editar tu tarea</h2>',
                showConfirmButton: false,
                timer: 2500
            })
        }
    }
}