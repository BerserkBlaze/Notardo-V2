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
            document.getElementById("emailSignIn").value = '';
            document.getElementById("passwordSignIn").value = '';
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
        set_Barchartdata(month_Number+1);
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
            let estado = doc.data().estado;
            let clase;
            if (estado == 0) {
                clase = "incomplete";
            } else {
                clase = "complete";
            }
            lista.innerHTML += '<div class="item ' + clase + '"><h1 onclick=obtenerMeta("' + doc.id + '")>' + nombreMeta + '</h1><img src="img/deleted.png" alt="" class="btn_deleted" onclick= eliminarMeta("' + doc.id + '")><img src="img/edit.png" alt="" class="btn_edit" onclick=editarMeta("' + doc.id + '")></div>';
        });
        completeMetas();
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
                fechaFin: fechaFin,
                estado: 0
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
var tareasXDia = new Map();

var metaActual;
var nombreMeta;
var descpMeta;
var fechaInMeta;
var fechaFinMeta;
function obtenerMeta(id) {
    metaActual = id;
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
            for (var i in elementFechaInicio) {
                elementFechaInicio[i].innerHTML = fechaInMeta;
            }
            elementFechaFin = document.getElementsByClassName("date_finish");
            for (var j in elementFechaFin) {
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
                estado: 0
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
                    obtenerTareasXDias(fechaInicio);
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
            let estado = doc.data().estado;
            let clase;
            if (estado == 0) {
                clase = "incomplete";
            } else {
                clase = "complete";
            }

            lista.innerHTML += '<div class="item ' + clase + '"><h1 onclick=workAlert("' + doc.id + '",this)>' + nombreTarea + '</h1><img src="img/deleted.png" alt="" class="btn_deleted" onclick=eliminarTarea("' + doc.id + '")><img src="img/edit.png" alt="" class="btn_edit" onclick=editarTarea("' + doc.id + '")></div>'
        });
        completeLength();
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

/*style alert tarea*/
function workAlert(docId, element) {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var docRef = db.collection("usuarios").doc(email).collection("metas").doc(metaActual).collection("tareas").doc(docId);

    var nombre;
    var descripcion;
    var dia;
    docRef.get().then(function (doc) {
        if (doc.exists) {
            nombre = doc.data().nombre;
            descripcion = doc.data().descripcion;
            dia = doc.data().fechaInicio;
            Swal.fire({
                html: '<h1 class="alertTitle">' + nombre + '</h1><br><h3 class="alertFontword">Descripción:</h3><p class="alertFontword">' + descripcion + '<P><br><h3 class="alertFontword">Día</h3><p class="alertFontword">' + dia + '</p>',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Completada',
                cancelButtonText: 'Todavía no',
                confirmButtonColor: '#0DCB8F'
            }).then((result) => {
                let parent = element.parentNode;
                if (result.value) {
                    parent.classList.remove('incomplete');
                    parent.classList.add('complete');
                    docRef.update({
                        estado: 1
                    });
                    completeLength();

                }
                else if (result.dismiss == 'cancel') {
                    parent.classList.remove('complete');
                    parent.classList.add('incomplete');
                    docRef.update({
                        estado: 0
                    });
                    completeLength();

                }
            })

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

/* Manejo de metas, tareas y consejos */

/* Contar metas completadas */

function completeMetas() {
    const workList = document.getElementById('metasList');
    let complete = workList.getElementsByClassName('complete').length;
    if (complete >= 4) {
        Swal.fire({
            title: '<h1 class="alertTitle colorConsejo">Consejos</h1>',
            html: '<h3 class="alertFontword container_textalign_left" >Elimina las metas que ya completaste.<br><br>De esta manera, tendras una mejor organización y te enfocaras en las que tienes actualmente.</h3>',
            timer: 10000,
            showCloseButton: true,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    }
}

/*Contar tareas completadas*/
function completeLength() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    var docRef = db.collection("usuarios").doc(email).collection("metas").doc(metaActual);
    const workList = document.getElementById('tareasList');
    let list = workList.getElementsByClassName('item').length;
    let complete = workList.getElementsByClassName('complete').length;
    if (list == complete) {
        docRef.update({
            estado: 1
        }).then(function () {
            leerMetas();
        });

    } else {
        docRef.update({
            estado: 0
        }).then(function () {
            leerMetas();
        });
    }
}
let month_Names = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

let current_Date = new Date();
let current_Day = current_Date.getDate();
let current_Month = current_Date.getMonth();
let month_Number = current_Date.getMonth();
let current_Year = current_Date.getFullYear();

// let dates = document.getElementById('dates');
let monthS = document.getElementById('month-statistics');
let yearS = document.getElementById('year-statistics');

let prev_MonthDOM = document.getElementById('prev-month-statistics');
let next_MonthDOM = document.getElementById('next-month-statistics');

monthS.textContent = month_Names[month_Number];
yearS.textContent = current_Year.toString();


prev_MonthDOM.addEventListener('click', () => last_Month());
next_MonthDOM.addEventListener('click', () => next_Month());

const get_TotalDays = monthS => {
    if (monthS === -1) monthS = 11;

    if (monthS == 0 || monthS == 2 || monthS == 4 || monthS == 6 || monthS == 7 || monthS == 9 || monthS == 11) {
        return 31;

    } else if (monthS == 3 || monthS == 5 || monthS == 8 || monthS == 10) {
        return 30;

    } else {

        return isLeap() ? 29 : 28; // si verdadero 29 sino 28
    }
}

// Saber si el año es bisiesto o no
const is_Leap = () => {
    return ((current_Year % 100 !== 0) && (current_Year % 4 === 0) || (current_Year % 400 === 0));
}

// El mes anterior
const last_Month = () => {
    if (month_Number !== 0) { //¿estamos en enero?
        month_Number--;
    } else { // si lo estamos cambiamos a diciembre y restamos un año
        month_Number = 11;
        current_Year--;
    }

    set_NewDate();
}
// El mes siguiente
const next_Month = () => {
    if (month_Number !== 11) {// ¿Estamos en diciembre?
        month_Number++;
    } else { //si lo estamos cambiamos a enero y sumamos un año
        month_Number = 0;
        current_Year++;
    }

    set_NewDate();
}
// cuando movamos de mes
const set_NewDate = () => {
    current_Date.setFullYear(current_Year, month_Number, current_Day);
    monthS.textContent = month_Names[month_Number];
    yearS.textContent = current_Year.toString();
    get_diaTarea(month_Number+1);
}
var tareaxdia;
var tareaxdia_complete;
const set_Barchartdata = (mes) => {
    tareaxdia= new Map();
    tareaxdia_complete = new Map();
    var user = firebase.auth().currentUser;
    var email = user.email;
    var cont = 0;
    db.collection("usuarios").doc(email).collection("metas").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (docMeta) {
            db.collection("usuarios").doc(email).collection("metas").doc(docMeta.id).collection("tareas").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    fecha = doc.data().fechaInicio;
                    estado = doc.data().estado;
                    if (tareaxdia.get(fecha) == undefined) {
                        tareaxdia.set(fecha, 1);
                    } else {
                        tareaxdia.set(fecha, tareaxdia.get(fecha) + 1);
                    }
                    if (tareaxdia_complete.get(fecha) == undefined) {
                        if(estado == 1){
                            tareaxdia_complete.set(fecha, 1);
                        }
                        else if(estado == 0){
                            tareaxdia_complete.set(fecha, 0);
                        }
                    } else if(estado ==1){
                        tareaxdia_complete.set(fecha, tareaxdia_complete.get(fecha) + 1);
                    }
                }); get_diaTarea(mes);
            });
        });
    });
}
var dias_mes;
var dias_valor;
var dias_tareasCompletas;

const get_diaTarea = (mes) => {
    dias_mes = [];
    dias_valor = [];
    dias_tareasCompletas = [];
    var i = 0;
    for (var [key, value] of tareaxdia) {
        console.log("-------");
        array_key = key.split("-");
        if (array_key[1] == mes) {
            dias_valor[i] = value;
            dias_mes[i] = array_key[2];
            i++;
        }
    }
     i = 0;
    for (var [key, value] of tareaxdia_complete) {
        array_key = key.split("-");
        if (array_key[1] == mes) {
            dias_tareasCompletas[i] = value;
            i++
        }
    }
    for(var i= 0; i<dias_mes.length-1; i++){
        for (let j = i+1; j < dias_mes.length; j++) {
            if(dias_mes[j]<dias_mes[i]){
                let aux = dias_mes[i];
                dias_mes[i] = dias_mes[j];
                dias_mes[j] = aux;
                aux = dias_valor[i];
                dias_valor[i] = dias_valor[j];
                dias_valor[j] = aux;
                aux=dias_tareasCompletas[i];
                dias_tareasCompletas[i] = dias_tareasCompletas[j];
                dias_tareasCompletas[j] = aux;
            }
        }
    }
    console.log(dias_valor);
    console.log(dias_mes);
    console.log(dias_tareasCompletas)
    get_Barchartdata();
}
var barChartData;
function get_Barchartdata() {
    barChartData = {
        labels: dias_mes, // dias con tareas
        datasets: [{
            label: 'Total tareas',
            backgroundColor: "#5E005E",
            data: dias_valor // total de tareas ese dia ejemplo 5 tareas el dia 1, 3 tareas 3l dia 2, etc
        }, {
            label: 'Completadas',
            backgroundColor: "#0DCB8F",
            data: dias_tareasCompletas // tareas completadas ese dia
        }]
    };
    graficar()
}

function graficar() {
    let ctx = document.getElementById('graphics').getContext('2d');
    if (window.myBar) {
        window.myBar.clear();
        window.myBar.destroy();
    }
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: true
            },
            scales: {
                yAxes: [{
                    type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Numero de tareas'
                    },
                    position: 'left',
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Días del mes'
                    }
                }]
            }
        }
    });
}


/* Contar tareas según la fecha */
function obtenerTareasXDias(fechaInicio) {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("usuarios").doc(email).collection("metas").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (docMeta) {
            db.collection("usuarios").doc(email).collection("metas").doc(docMeta.id).collection("tareas").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    fecha = doc.data().fechaInicio;
                    if (tareasXDia.get(fecha) == undefined) {
                        tareasXDia.set(fecha, 1);
                    } else {
                        tareasXDia.set(fecha, tareasXDia.get(fecha) + 1);
                    }
                    if (tareasXDia.get(fechaInicio) >= 4) {
                        Swal.fire({
                            title: '<h1 class="alertTitle colorConsejo">Consejo</h1>',
                            html: '<h3 class="alertFontword container_textalign_left" >No te apresures con demasiadas tareas, te sentirás presionado después, realizar 3 o 4 al día será lo mejor para ti</h3>',
                            timer: 10000,
                            showCloseButton: true,
                            showConfirmButton: false,
                            timerProgressBar: true,
                        });
                    }
                });
            });
        });
    });
}


