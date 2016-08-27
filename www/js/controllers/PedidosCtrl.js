(function() {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosCtrl', PedidosCtrl);

    PedidosCtrl.$inject = ['$stateParams', 'ionicMaterialInk', '$ionicPopup', '$timeout'];

    function PedidosCtrl($stateParams, ionicMaterialInk, $ionicPopup, $timeout) {
        var vm = this;

        vm.confirmar = confirmar;

        activate();

        ////////////////

        //ionic.material.ink.displayEffect();
        ionicMaterialInk.displayEffect();

        // Toggle Code Wrapper
        var code = document.getElementsByClassName('code-wrapper');
        for (var i = 0; i < code.length; i++) {
            code[i].addEventListener('click', function() {
                this.classList.toggle('active');
            });
        }

        function activate() {}

        function confirmar() {
            var alertPopup = $ionicPopup.alert({
                title: 'Tu pedido ha sido generado.',
                template: 'Se está imprimiendo...'
            });

            $timeout(function() {
                //ionic.material.ink.displayEffect();
                ionicMaterialInk.displayEffect();
            }, 0);
        }
    }
})();