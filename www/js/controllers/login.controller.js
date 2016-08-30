(function() {
    'use strict';

    angular
        .module('starter')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$timeout', 'user'];

    function LoginController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $timeout, user) {
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
            vm.user = {};
        }

        function iniciarSesion() {
            $ionicLoading.show(loading);
            authenticate.post(vm.user)
                .then(function(data) {
                    if (data.result) {
                        user.set(data.result);
                        ionicToast.show('Inicio de sesión exitoso. Será redirigido al menú principal.', 'middle', false, 2000);
                        $timeout(function() {
                            location.href = '#/app/pedido';
                        }, 2000);
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Error!',
                            template: data.mensaje
                        });
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error: ' + error.statusText,
                        template: 'Inténtelo más tarde nuevamente.'
                    });
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }
    }
})();