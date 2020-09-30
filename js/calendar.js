let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'];

let currentDate = new Date();
let currentDay = currentDate.getDate();
let currentMonth= currentDate.getMonth();
let monthNumber = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let dates = document.getElementById('dates');
let month = document.getElementById('month');
let year = document.getElementById('year');

let prevMonthDOM = document.getElementById('prev-month');
let nextMonthDOM = document.getElementById('next-month');

month.textContent = monthNames[monthNumber];
year.textContent = currentYear.toString();

prevMonthDOM.addEventListener('click', ()=>lastMonth());
nextMonthDOM.addEventListener('click', ()=>nextMonth());


// función escribir los meses
const writeMonth = month => {

    for(let i = startDay(); i>0;i--){
        dates.innerHTML += ` <div class="calendar__date calendar__item calendar__last-days">
            ${getTotalDays(monthNumber-1)-(i-1)}
        </div>`;
    }

    for(let i=1; i<=getTotalDays(month); i++){
        if(i===currentDay && monthNumber === currentMonth) {
            dates.innerHTML += ` <div class="calendar__date calendar__item calendar__day calendar__today">${i}</div>`;
        }else{
            dates.innerHTML += ` <div class="calendar__date calendar__item calendar__day">${i}</div>`;
        }
    }
}

// función total de días que tiene que escribir del mes
const getTotalDays = month => {
    if(month === -1) month = 11;

    if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
        return  31;

    } else if (month == 3 || month == 5 || month == 8 || month == 10) {
        return 30;

    } else {

        return isLeap() ? 29:28; // si verdadero 29 sino 28
    }
}
// Saber si el año es viciesto o no
const isLeap = () => {
    return ((currentYear % 100 !==0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));
}
// Saber el dia en el que empieza la semana, puede empezar cualquier dia de la semana
const startDay = () => {
    let start = new Date(currentYear, monthNumber, 1);
    return ((start.getDay()-1) === -1) ? 6 : start.getDay()-1;
    // start.getDay() devuelve el num del día (dom=0, lunes=1,...)
}

// Dibujar el mes anterior
const lastMonth = () => {
    if(monthNumber !== 0){ //¿estamos en enero?
        monthNumber--;
    }else{ // si lo estamos cambiamos a diciembre y restamos un año
        monthNumber = 11;
        currentYear--;
    }

    setNewDate();
}
// Dibujar el mes siguiente
const nextMonth = () => {
    if(monthNumber !== 11){// ¿Estamos en diciembre?
        monthNumber++;
    }else{ //si lo estamos cambiamos a enero y sumamos un año
        monthNumber = 0;
        currentYear++;
    }

    setNewDate();
}
// cuando movamos el calendario
const setNewDate = () => {
    currentDate.setFullYear(currentYear,monthNumber,currentDay);
    month.textContent = monthNames[monthNumber];
    year.textContent = currentYear.toString();
    dates.textContent = '';
    writeMonth(monthNumber);
}

writeMonth(monthNumber);