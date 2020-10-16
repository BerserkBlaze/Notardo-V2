
let month_Names = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'];

let current_Date = new Date();
let current_Day = current_Date.getDate();
let current_Month= current_Date.getMonth();
let month_Number = current_Date.getMonth();
let current_Year = current_Date.getFullYear();

// let dates = document.getElementById('dates');
let monthS = document.getElementById('month-statistics');
let yearS = document.getElementById('year-statistics');

let prev_MonthDOM = document.getElementById('prev-month-statistics');
let next_MonthDOM = document.getElementById('next-month-statistics');

monthS.textContent = month_Names[month_Number];
yearS.textContent = current_Year.toString();

prev_MonthDOM.addEventListener('click', ()=>last_Month());
next_MonthDOM.addEventListener('click', ()=>next_Month());

// El mes anterior
const last_Month = () => {
    if(month_Number !== 0){ //¿estamos en enero?
        month_Number--;
    }else{ // si lo estamos cambiamos a diciembre y restamos un año
        month_Number = 11;
        current_Year--;
    }

    set_NewDate();
}
// El mes siguiente
const next_Month = () => {
    if(month_Number !== 11){// ¿Estamos en diciembre?
        month_Number++;
    }else{ //si lo estamos cambiamos a enero y sumamos un año
        month_Number = 0;
        current_Year++;
    }

    set_NewDate();
}
// cuando movamos de mes
const set_NewDate = () => {
    current_Date.setFullYear(current_Year,month_Number,current_Day);
    monthS.textContent = month_Names[month_Number];
    yearS.textContent = current_Year.toString();
}


var barChartData = {
    labels: [1,2,3,5,6,8,9,10], // dias con tareas
    datasets: [{
        label: 'Total tareas',
        backgroundColor: "#5E005E",
        data: [
            5,3,6,7,2,3,2 // total de tareas ese dia ejemplo 5 tareas el dia 1, 3 tareas 3l dia 2, etc
        ]
    }, {
        label: 'Completadas',
        backgroundColor: "#0DCB8F",
        data: [
            1,3,5,4,7,2,2,2 // tareas completadas ese dia
        ]
    }]

};
var ctx = document.getElementById('graphics').getContext('2d');
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
                scaleLabel:{
                    display: true,
                    labelString: 'Numero de tareas'
                },
                position: 'left',
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes:[{
                scaleLabel:{
                    display: true,
                    labelString: 'Días del mes'
                }
            }]
        }
    }
});

