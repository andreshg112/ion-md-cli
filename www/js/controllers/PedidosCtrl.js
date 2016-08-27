(function() {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosCtrl', PedidosCtrl);

    PedidosCtrl.$inject = ['$stateParams', 'ionicMaterialInk', '$ionicPopup', '$timeout'];

    function PedidosCtrl($stateParams, ionicMaterialInk, $ionicPopup, $timeout) {
        var vm = this;
        //
        vm.confirmar = confirmar;
        var pedidos = [];

        activate();

        ////////////////

        //ionic.material.ink.displayEffect();
        ionicMaterialInk.displayEffect();

        function activate() {
            vm.pedido = {};
            var formPedido = document.getElementsByName('formPedido')[0];
        }

        function confirmar() {
            vm.requerido = true;
            pedidos.push(angular.copy(vm.pedido));
            var alertPopup = $ionicPopup.alert({
                title: 'Tu pedido ha sido generado.' + pedidos.length,
                template: 'Se está imprimiendo...'
            });
            $timeout(function() {
                //ionic.material.ink.displayEffect();
                ionicMaterialInk.displayEffect();
            }, 0);
            activate();
            console.log(pedidos);
        }
    }
})();