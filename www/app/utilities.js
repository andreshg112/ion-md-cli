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

/**
 * Retorna una cadena sin tildes ni eñes.
 * @param {String} cadena
 * @returns String
 */
var normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');
    }
})();

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}