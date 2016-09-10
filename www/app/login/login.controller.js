(function() {
    'use strict';

    angular
        .module('starter')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', 'ionicToast', '$timeout', 'user', '$ionicHistory', '$state'];

    function LoginController(ionicMaterialInk, Restangular, $ionicLoading, ionicToast, $timeout, user, $ionicHistory, $state) {
        var vm = this;
        var authenticate = Restangular.all('authenticate');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        //
        vm.iniciarSesion = iniciarSesion;
        //ionicToast.hide();

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            vm.user = {};
        }

        function iniciarSesion() {
            $ionicLoading.show(loading);
            authenticate.post(vm.user)
                .then(function(data) {
                    var mensaje = '';
                    if (data.result) {
                        user.set(data.result);
                        mensaje = String.format('¡Bienvenido {0} {1}! Serás redirigido(a) al menú principal.', user.get().primer_nombre, user.get().primer_apellido);
                        ionicToast.show(mensaje, 'bottom', false, 2000);                        
                        $timeout(function() {
                            $state.go('app.pedidos');
                        }, 2000);
                    } else {
                        mensaje = 'Error: ' + data.mensaje;
                        ionicToast.show(mensaje, 'bottom', false, 2000);                        
                    }
                })
                .catch(function(error) {
                    ionicToast.show(String.format('Error: {0}. Inténtelo más tarde nuevamente.', error.statusText), 'bottom', false, 3000);
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }
    }
})();