(function () {
    'use strict';

    angular
        .module('starter.super_admin')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user', 'ionicDatePicker'];

    function UsersController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user, ionicDatePicker) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var fechaNacimiento = {
            callback: function (val) { vm.user.fecha_nacimiento = fechaYYYYMMDD(new Date(val)) }
        };
        var users = Restangular.all('users');

        //
        vm.desactivarUser = desactivarUser;
        vm.cerrarNuevoUser = cerrarNuevoUser;
        vm.confirmar = confirmar;
        vm.modificarUser = modificarUser;
        vm.nuevoUser = nuevoUser;
        vm.users = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.user = {};
            $scope.$broadcast('angucomplete-alt:clearInput', 'nombre_completo');
            cargarUsers();
        }

        function desactivarUser(user) {
            $ionicLoading.show(loading);
            user.remove()
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

        function cargarUsers() {
            $ionicLoading.show(loading);
            vm.users = [];
            users.getList()
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

        function cerrarNuevoUser() {
            vm.modalNuevoUser.hide();
        }

        function confirmar() {
            var template = (!vm.user.id) ? '¿Estás seguro que deseas registrar el usuario?' :
                '¿Estás seguro que deseas modificar la información del usuario?';
            var confirmarPedido = $ionicPopup.confirm({
                title: 'Confirmación de registro',
                template: template,
                scope: $scope
            });
            confirmarPedido.then(function (res) {
                if (res) {
                    registrarUser();
                }
            });
        }

        function modificarUser(user) {
            vm.user = user;
            vm.modalNuevoUser.show();
        }

        function nuevoUser() {
            vm.user = {};
            vm.modalNuevoUser.show();
        }

        function registrarUser() {
            $ionicLoading.show(loading);
            vm.user.registrado_por = user.get().id;
            var promesa;
            if (!vm.user.id) {
                promesa = users.post(vm.user);
            } else {
                promesa = vm.user.put();
            }
            promesa.then(function (data) {
                if (data.result) {
                    var mensaje = 'Guardado correctamente';
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

        function seleccionarFechaNacimiento() {
            ionicDatePicker.openDatePicker(fechaNacimiento);
        };

        /*document.onkeypress = function (e) {
            //Si presiona la tecla Esc, cerrar la modal.
            if (e.keyCode == 27) {
                if (vm.modalNuevoUser.isShown()) {
                    vm.modalNuevoUser.hide();
                }
            }
        }*/

        $ionicModal.fromTemplateUrl('app/super_admin/users/nuevo-user.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            vm.modalNuevoUser = modal;
        });

        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function () {
            vm.modalNuevoUser.remove();
        });

    }
})();