﻿(function () {
    'use strict';

    angular
        .module('app')
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
            document.getElementById("username").focus();
        }

        function iniciarSesion() {
            $ionicLoading.show(loading);
            authenticate.post(vm.user)
                .then(function (data) {
                    var mensaje = '';
                    if (data.result) {
                        user.set(data.result);
                        mensaje = String.format('¡Bienvenido(a) {0} {1}! Serás redirigido(a) al menú principal.', user.get().primer_nombre, user.get().primer_apellido);
                        ionicToast.show(mensaje, 'bottom', false, 2000);
                        $timeout(function () {
                            if (user.get().rol == 'SUPER_USER') {
                                $state.go('app.users');
                            } else if (user.get().rol == 'VENDEDOR') {
                                $state.go('app.pedidos');
                            } else {
                                $state.go('app.historial-pedidos');
                            }
                        }, 2000);
                    } else {
                        mensaje = 'Error: ' + data.mensaje;
                        ionicToast.show(mensaje, 'bottom', false, 2000);
                    }
                })
                .catch(function (error) {
                    ionicToast.show(String.format('Error: {0}. Inténtelo más tarde nuevamente.', error), 'bottom', false, 3000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }
    }
})();