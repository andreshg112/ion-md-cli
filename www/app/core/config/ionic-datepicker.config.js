(function () {
    'use strict';

    angular
        .module('app')
        .config(['ionicDatePickerProvider', IonicDatePickerConfig]);

    /** @ngInject */
    function IonicDatePickerConfig(ionicDatePickerProvider) {
        //Configuración del Ionic Datepicker
        var datePickerObj = {
            setLabel: 'Fijar',
            closeLabel: 'Cerrar',
            mondayFirst: true,
            weeksList: ["D", "L", "M", "M", "J", "V", "S"],
            monthsList: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
    }
})();