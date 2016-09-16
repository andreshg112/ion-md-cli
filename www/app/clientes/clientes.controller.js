(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ClientesController', ClientesController);

    ClientesController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast'];

    function ClientesController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast) {
        Restangular.setDefaultHeaders({ token: user.get().token });
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var clientes = Restangular.all('clientes');
        //
        vm.clientes = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarClientes();
        }

        function cargarClientes() {
            $ionicLoading.show(loading);
            vm.clientes = [];
            Restangular.one('establecimientos', user.get().establecimiento.id).customGET('clientes')
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
    }
})();