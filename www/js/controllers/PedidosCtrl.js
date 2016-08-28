(function() {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosCtrl', PedidosCtrl);

    PedidosCtrl.$inject = ['$stateParams', 'ionicMaterialInk', '$ionicPopup', '$timeout', 'Restangular'];

    function PedidosCtrl($stateParams, ionicMaterialInk, $ionicPopup, $timeout, Restangular) {
        var vm = this;
        var pedidos = Restangular.all('pedidos');
        var clientes = Restangular.all('clientes');
        //
        vm.confirmar = confirmar;
        vm.buscarCliente = buscarCliente;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.pedido = {};
        }

        function confirmar() {
            pedidos.post(vm.pedido);
            var alertPopup = $ionicPopup.alert({
                title: 'Tu pedido ha sido generado.',
                template: 'Se está imprimiendo...'
            });
            $timeout(function() {
                ionicMaterialInk.displayEffect();
            }, 0);
            activate();
        }

        function buscarCliente(celular) {
            console.log(celular);
            if (celular) {
                Restangular.one('clientes', celular).get()
                    .then(function(data) {
                        if (data) {
                            data.celular = parseInt(data.celular);
                            vm.pedido.cliente = data;
                        }
                    });
            }
        }
    }
})();