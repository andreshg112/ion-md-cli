$(document).on("focus mouseover", ".tooltip", function () {
    $('.tooltip').tooltipster();
});

if (!String.format) {
    /**
     * Formatea un String como en C# o VB.NET: String.format(Hola {0}, 'Andres') = 'Hola Andres' 
     * @param {array} format
     * @returns {string}
     */
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

/**
 * Capitaliza una cadena: Convierte en mayúscula la primera letra de cada palabra.
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
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
 * Retorna un array con los valores de un objeto y no sus claves/keys.
 * @param {Object} object El objeto a recorrer.
 * @returns {Array}
 */
function getObjectValues(object) {
    var values = [];
    for (var key in object) {
        values.push(object[key]);
    }
    return values;
}

/**
 * Retorna un array con los valores de una propiedad que los objetos del array tengan.
 * @param {Array} array El array para recorrer.
 * @param {String} property La propiedad que se necesita para extraer los valores del array.
 * @returns {Array}
 */
function getPropertyInArrayObject(array, property) {
    var values = [];
    array = (!array) ? [] : array;
    array.forEach(function (element) {
        if (element.hasOwnProperty(property)) {
            values.push(element[property]);
        }
    }, this);
    return values;
}

/**
 * Función para validar si una tecla presionada es numérica o no.
 * @param {event} evt
 * @returns {boolean}
 */
function isNumberKey(evt) {
    var event = (!event) ? {} : event;
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

/*function MyAlertify(maxLogItems) {
    maxLogItems = (!maxLogItems) ? 1 : maxLogItems;
    this.error = function (mensaje, segundos, parent) {
        init(segundos, parent, maxLogItems);
        alertify.error(mensaje);
    };
    this.log = function (mensaje, segundos, parent) {
        init(segundos, parent, maxLogItems);
        alertify.log(mensaje);
    };
    this.success = function (mensaje, segundos, parent) {
        init(segundos, parent, maxLogItems);
        alertify.success(mensaje);
    };
    function init(segundos, parent, cantidadMaxLogs) {
        alertify.reset();
        alertify.maxLogItems(cantidadMaxLogs);
        var parentDOM = document.getElementById(parent);
        alertify.parent(parentDOM);
        alertify.delay(segundos * 1000)
    }
}*/

/**
 * Retorna una cadena sin tildes ni eñes.
 * @param {String} cadena
 * @returns {String}
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

/**
 * Retorna un array de enteros que estaban formateados como string.
 * Ejemplo: ['1', '2'] => [1, 2]
 * Si un elemento es null, retorna 0.
 * @param {array} array
 * @param {number} base
 * @returns {number}
 */
function parseIntArray(array, base) {
    base = (!base) ? 10 : base;
    return array.map(function (x) { return parseInt(x || 0, base); });
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
 * Suma los elementos de un array de valores, no de objetos.
 * @param {array} array El array para sumar sus elementos.
 * @returns {number}
 */
function sumarElementosArray(array) {
    array = (!array) ? [] : array;
    return array.reduce(function (previousValue, currentValue) {
        return Number(currentValue) + Number(previousValue);
    }, 0);
}