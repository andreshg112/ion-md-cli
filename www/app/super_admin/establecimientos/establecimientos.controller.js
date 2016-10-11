(function () {
    'use strict';

    angular
        .module('app.super_admin')
        .controller('EstablecimientosController', EstablecimientosController);

    EstablecimientosController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user'];

    function EstablecimientosController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var establecimientos = Restangular.all('establecimientos');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var planes = Restangular.all('planes');
        var users = Restangular.all('users');

        //
        vm.desactivar = desactivar;
        vm.cerrarNuevo = cerrarNuevo;
        vm.confirmar = confirmar;
        vm.modificar = modificar;
        vm.nuevo = nuevo;
        vm.establecimientos = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.establecimiento = { mensaje: 'Su pedido va en camino.' };
            cargarEstablecimientos();
            cargarAdministradores();
            cargarPlanes();
        }

        function cargarAdministradores() {
            $ionicLoading.show(loading);
            vm.administradores = [];
            users.getList({ rol: 'ADMIN' })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.administradores = data;
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

        function cargarPlanes() {
            $ionicLoading.show(loading);
            vm.planes = [];
            planes.getList()
                .then(function (data) {
                    if (data.length > 0) {
                        vm.planes = data;
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

        function cargarEstablecimientos() {
            $ionicLoading.show(loading);
            vm.establecimientos = [];
            establecimientos.getList()
                .then(function (data) {
                    if (data.length > 0) {
                        vm.establecimientos = data;
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

        function cerrarNuevo() {
            vm.modalNuevo.hide();
        }

        function confirmar() {
            var template = (!vm.establecimiento.id) ?
                '¿Estás seguro que deseas registrar el establecimiento?' :
                '¿Estás seguro que deseas modificar la información del establecimiento?';
            var confirmarPedido = $ionicPopup.confirm({
                title: 'Confirmación de registro',
                template: template,
                scope: $scope
            });
            confirmarPedido.then(function (res) {
                if (res) {
                    registrar();
                }
            });
        }

        function desactivar(establecimiento) {
            $ionicLoading.show(loading);
            establecimiento.remove()
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

        function modificar(establecimiento) {
            vm.establecimiento = establecimiento;
            vm.modalNuevo.show();
        }

        function nuevo() {
            vm.establecimiento = { mensaje: 'Su pedido va en camino.' };
            vm.modalNuevo.show();
        }

        function registrar() {
            $ionicLoading.show(loading);
            var promesa;
            if (!vm.establecimiento.id) {
                promesa = establecimientos.post(vm.establecimiento);
            } else {
                promesa = vm.establecimiento.put();
            }
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

        $ionicModal.fromTemplateUrl('app/super_admin/establecimientos/nuevo-establecimiento.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            vm.modalNuevo = modal;
        });

        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function () {
            vm.modalNuevo.remove();
        });

    }
})();