(function() {
    'use strict';

    angular
        .module('starter')
        .controller('ReporteGeneralController', ReporteGeneralController);

    ReporteGeneralController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast'];

    function ReporteGeneralController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast) {
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };

        vm.data = [];
        vm.labels = [];
        vm.series = ['Domicilios'];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarDatos();
        }

        function cargarDatos() {
            $ionicLoading.show(loading);
            Restangular.one('establecimientos', user.get().establecimiento.id).customGET('pedidos-dia-semana')
                .then(function(data) {
                    vm.labels = Object.keys(data.result);
                    vm.data = getObjectValues(data.result);
                })
                .catch(function(error) {
                    console.log(error);
                    ionicToast.show(error.statusText, 'middle', true);
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }

        function getObjectValues(object) {
            var values = [];
            for (var key in object) {
                values.push(object[key]);
            }
            return values;
        }

    }
})();