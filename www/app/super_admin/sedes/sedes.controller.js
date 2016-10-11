(function () {
    'use strict';

    angular
        .module('app')
        .controller('SedesController', SedesController);

    SedesController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user'];

    function SedesController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var establecimientos = Restangular.all('establecimientos');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var sedes = Restangular.all('sedes');

        //
        vm.cerrarNuevo = cerrarNuevo;
        vm.confirmar = confirmar;
        vm.desactivar = desactivar;
        vm.modificar = modificar;
        vm.nuevo = nuevo;
        vm.sedes = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarEstablecimientos();
            cargarSedes();
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

        function cerrarNuevo() {
            vm.modalNuevo.hide();
        }

        function confirmar() {
            var template = (!vm.sede.id) ?
                '¿Estás seguro que deseas registrar la sede?' :
                '¿Estás seguro que deseas modificar la información de la sede?';
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

        function desactivar(sede) {
            $ionicLoading.show(loading);
            sede.remove()
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

        function modificar(sede) {
            vm.sede = sede;
            vm.modalNuevo.show();
        }

        function nuevo() {
            vm.sede = {};
            vm.modalNuevo.show();
        }

        function registrar() {
            $ionicLoading.show(loading);
            var promesa;
            if (!vm.sede.id) {
                promesa = sedes.post(vm.sede);
            } else {
                promesa = vm.sede.put();
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

        $ionicModal.fromTemplateUrl('app/super_admin/sedes/nuevo-sede.html', {
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