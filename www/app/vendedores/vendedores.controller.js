(function () {
    'use strict';

    angular
        .module('starter')
        .controller('VendedoresController', VendedoresController);

    VendedoresController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user'];

    function VendedoresController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var establecimientos = Restangular.all('establecimientos');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var sedes = Restangular.all('sedes');
        var users = Restangular.all('users');
        var vendedores = Restangular.all('vendedores');

        //
        vm.confirmar = confirmar;
        vm.desactivar = desactivar;
        vm.sedes = [];
        vm.users = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarSedes();
            cargarUsuarios();
            cargarVendedores();
        }

        function cargarSedes() {
            $ionicLoading.show(loading);
            vm.sedes = [];
            sedes.getList()
                .then(function (data) {
                    if (data.length > 0) {
                        vm.sedes = data;
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

        function cargarUsuarios() {
            $ionicLoading.show(loading);
            vm.users = [];
            users.getList({ rol: 'VENDEDOR', sin_sede: true })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.users = data;
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

        function cargarVendedores() {
            $ionicLoading.show(loading);
            vm.vendedores = [];
            vendedores.getList()
                .then(function (data) {
                    if (data.length > 0) {
                        vm.vendedores = data;
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

        function confirmar() {
            var template = '¿Estás seguro que deseas asignar el usuario a la sede seleccionada?';
            var confirmarPopup = $ionicPopup.confirm({
                title: 'Confirmación de registro',
                template: template,
                scope: $scope
            });
            confirmarPopup.then(function (res) {
                if (res) {
                    registrar();
                }
            });
        }

        function desactivar(vendedor) {
            $ionicLoading.show(loading);
            vendedor.remove()
                .then(function (data) {
                    ionicToast.show(data.mensaje, 'bottom', false, 2000);
                    if (data.result) {
                        activate();
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

        function registrar() {
            $ionicLoading.show(loading);
            var promesa = vendedores.post(vm.vendedor);
            promesa
                .then(function (data) {
                    if (data.result) {
                        var mensaje = data.mensaje;
                        ionicToast.show(mensaje, 'bottom', false, 2000);
                        activate();
                    } else {
                        var mensaje = data.mensaje + '<br />';
                        if (data.validator) {
                            mensaje += data.validator.join('.<br />');
                        }
                        ionicToast.show(mensaje, 'bottom', false, 3000);
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