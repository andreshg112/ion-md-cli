(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$timeout', 'user', '$ionicHistory', '$state', 'toastr'];

    function LoginController(ionicMaterialInk, Restangular, $ionicLoading, $timeout, user, $ionicHistory, $state, toastr) {
        var vm = this;
        var authenticate = Restangular.all('authenticate');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        //
        vm.iniciarSesion = iniciarSesion;

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
            toastr.clear();
            $ionicLoading.show(loading);
            authenticate.post(vm.user)
                .then(function (data) {
                    if (data.result) {
                        user.set(data.result);
                        var mensaje = String.format('¡Bienvenido(a) {0} {1}!', user.get().primer_nombre, user.get().primer_apellido);
                        toastr.success('Serás redirigido(a) al menú principal.', mensaje);
                        $timeout(function () {
                            toastr.clear();
                            if (user.get().rol == 'SUPER_USER') {
                                $state.go('app.users');
                            } else if (user.get().rol == 'VENDEDOR') {
                                $state.go('app.pedidos');
                            } else {
                                $state.go('app.historial-pedidos');
                            }
                        }, 2000);
                    } else {
                        var mensaje = (data.validator) ?
                            data.validator.join('<br />') : '';
                        toastr.error(mensaje, data.mensaje, { timeOut: 0 });
                    }
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('{0} {1}', error.status, error.statusText);
                    toastr.error(mensaje, 'Error', { timeOut: 0 });
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }
    }
})();