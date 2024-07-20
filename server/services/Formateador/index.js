class Formateador {
    constructor() {}
    
    crearFechas() {
        
        const formatDate= (date)=> {
            const year = date.getFullYear(); // Traer Año Completo
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Traer Mes y agregarle el 0 si hace falta
            const day = date.getDate().toString().padStart(2, '0'); // Traer Dia y agregarle el 0 si hace falta

                return `${year}-${month}-${day}`;
        }

        const fechasArray = [];

        for(let i = 0; i < 15; i++){
            const fecha = new Date()  // fecha actual
            const nextDate = new Date(fecha.setDate(fecha.getDate()+i))
            fechasArray.push(nextDate);
        }
        const soloSemana = fechasArray.filter(function(element,index){
            const dt = new Date(element);
            return (dt.getDay() != 0 && dt.getDay() != 6);
        }).map(date => formatDate(date)); // Formatear fecha como  yyyy-mm-dd
    
        return soloSemana;
    }

    crearFechasDelMes(month, year) {
        const formatDate = (date) => {
            const year = date.getFullYear(); // Traer Año Completo
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Traer Mes y agregarle el 0 si hace falta
            const day = date.getDate().toString().padStart(2, '0'); // Traer Dia y agregarle el 0 si hace falta
    
            return `${year}-${month}-${day}`;
        }
    
        const fechasArray = [];
        const diasDelMes = new Date(year, month, 0).getDate(); // obtener los días del mes especificado
    
        for(let i = 0; i < diasDelMes; i++){
            const nextDate = new Date(year, month - 1, i + 1);
            fechasArray.push(nextDate);
        }
    
        const soloSemana = fechasArray.filter(function(element, index){
            const dt = new Date(element);
            return (dt.getDay() != 0 && dt.getDay() != 6);
        }).map(date => formatDate(date)); // Formatear fecha como  yyyy-mm-dd
    
        return soloSemana;
    }

    formatearFechas(fechas, reservas, reservasTotales) {

        const resultado = []; 
        // Iterar sobre las fechas 
        fechas.forEach(fecha => { 
            // Buscar reserva para la fecha actual 
            const reservaEnFecha = reservas.find(reserva => reserva.fecha === fecha); 
            // Buscar cantidad de reservas totales para la fecha actual 
            const reservaTotal = reservasTotales.find(reserva =>reserva.dataValues.fecha === fecha ); 
            // Crear objeto con los datos combinados 
            const objeto = { fecha: fecha, reserva: reservaEnFecha || null, cant_dias: reservaTotal ? reservaTotal.dataValues.cant : 0 }; 
            // Agregar objeto al resultado
             resultado.push(objeto); }); 
             
             return resultado; 
            } 

    }

export default Formateador