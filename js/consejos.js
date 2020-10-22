function consejoNuevaMeta(){
    Swal.fire({
        title: '<h1 class="alertTitle colorConsejo">Consejo</h1>',
        html: '<h3 class="alertFontword" >Establece Metas claras, cortas y especificas</h3>',
        timer: 5000,
        showCloseButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
      });
}

function consejoMuchasMetasCompletas(){
    Swal.fire({
        title: '<h1 class="alertTitle colorConsejo">Consejos</h1>',
        html: '<h3 class="alertFontword container_textalign_left" >Elimina las metas que ya completaste.<br><br>De esta manera, tendras una mejor organización y te enfocaras en las que tienes actualmente.</h3>',
        timer: 10000,
        showCloseButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
      });
}

function consejoTarea(){
    Swal.fire({
        title: '<h1 class="alertTitle colorConsejo">Consejos</h1>',
        html: '<h3 class="alertFontword container_textalign_left" >Las tareas son las acciones que deben realizar para alcanzar la meta<br><br>Establece las prioridades para cumplir la meta y crea tus tareas de acuerdo a ellas.<br><br>Las tareas más difíciles o que tengan mayor prioridad ponlas de primero y deja las más fáciles para el final.</h3>',
        timer: 10000,
        showCloseButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
      });
}

function consejoNuevaTarea(){
    var meta = "--insertar meta--";
    Swal.fire({
        title: '<h1 class="alertTitle colorConsejo">Consejo</h1>',
        html: '<h3 class="alertFontword container_textalign_left" >Ten claro el objetivo final: '+meta+'<br><br>Crea tareas pequeñas para cumplir tu meta<br><br>Si crees que la tarea es muy pesada divídela aún más</h3>',
        timer: 10000,
        showCloseButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
      });
}

function consejoMuchasTareas(){
    Swal.fire({
        title: '<h1 class="alertTitle colorConsejo">Consejo</h1>',
        html: '<h3 class="alertFontword container_textalign_left" >No te apresures con demasiadas tareas al día, te sentirás presionado después, realiza máximo 3 o 4 al día es lo aconsejable</h3>',
        timer: 10000,
        showCloseButton: true,
        showConfirmButton: false,
        timerProgressBar: true,
      });
}