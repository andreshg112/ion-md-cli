(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ReporteGeneralController', ReporteGeneralController);

    ReporteGeneralController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast'];

    function ReporteGeneralController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var establecimientos = Restangular.all('establecimientos');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };

        vm.cargarDatos = cargarDatos;
        vm.data = [];
        vm.labels = [];
        vm.series = ['Domicilios'];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarDatos();
            cargarEstablecimientos();
        }

        function cargarDatos() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('pedidos-dia-semana', { establecimiento_id: establecimientoId, sede_id: sedeId })
                .then(function (data) {
                    vm.labels = Object.keys(data.result);
                    vm.data = getObjectValues(data.result);
                })
                .catch(function (error) {
                    var mensaje = String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function cargarEstablecimientos() {
            vm.establecimientos = user.get().administrador.establecimientos;
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