(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ClientesController', ClientesController);

    ClientesController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast'];

    function ClientesController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var clientes = Restangular.all('clientes');
        //
        vm.cargarClientes = cargarClientes;
        vm.clientes = [];
        /*vm.data = {};
        vm.data.columns = [{ "id": "1453", "name": "Product" }, { "id": "1355", "name": "Weight" }, { "id": "0393", "name": "Height" }, { "id": "3932", "name": "Width" }, { "id": "2939", "name": "Depth" }, { "id": "1234", "name": "Color" }];
        vm.data.items = [{ "1234": "Green", "1355": "15 oz.", "1453": "Crayons", "2939": "1.5 in.", "3932": "3 in.", "0393": "5 in." }, { "1234": "Brown", "1355": "12 oz.", "1453": "Cookies", "2939": "2.5 in.", "3932": "8 in.", "0393": "7 in." }, { "1234": "Green", "1355": "15 oz.", "1453": "Crayons", "2939": "1.5 in.", "3932": "3 in.", "0393": "5 in." }, { "1234": "Green", "1355": "15 oz.", "2939": "1.5 in.", "3932": "3 in.", "14531": "Crayons", "0393": "5 in." }];*/

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarClientes();
            cargarEstablecimientos();
        }

        function cargarClientes() {
            $ionicLoading.show(loading);
            vm.clientes = [];
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('clientes', { establecimiento_id: establecimientoId })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.clientes = data;
                    }
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
    }
})();