//Formatea un String como en C# o VB.NET: String.format(Hola {0}, 'Andres') = 'Hola Andres'
if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

/**
 * Retorna el día de la semana (en letras y en español) correspondiente a una fecha. (Beta)
 * 
 * @param fecha_recibida La fecha a evaluar.
 * @returns El día de la semana correspondiente a la fecha recibida. 
 */
function getDiaSemana(fecha_recibida) {
    var dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[fecha_recibida.getDay()];
}

/**
 * Función range(), similar a la de Python. Retorna un array, recibiendo su inicio, final (no incluyente) y paso.
 * 
 * @param start Inicio
 * @param stop Final (no incluyente)
 * @param step Paso
 * @returns array
 */
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

/**
 * Convierte una fecha en el formato YYYY-MM-DD.
 * 
 * @param {Date} fecha
 * @returns String
 */
function fechaYYYYMMDD(fecha) {
    var anio = fecha.getFullYear();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var ymd = anio.toString() + '-';
    ymd += mes < 10 ? '0' + mes : mes;
    ymd += '-';
    ymd += dia < 10 ? '0' + dia : dia;
    return ymd;
}