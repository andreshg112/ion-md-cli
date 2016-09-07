(function() {
    'use strict';

    angular
        .module('starter')
        .controller('ClientesCtrl', ClientesCtrl);

    ClientesCtrl.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast'];

    function ClientesCtrl(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast) {
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
                .then(function(data) {
                    if (data.length > 0) {
                        vm.clientes = data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    ionicToast.show(error.statusText, 'middle', true);
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }
    }
})();