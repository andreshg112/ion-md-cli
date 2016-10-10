(function () {
    'use strict';

    angular
        .module('starter.vendedor')
        .controller('RegistrarClientesController', RegistrarClientesController);

    RegistrarClientesController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$scope', 'user', 'ionicDatePicker'];

    function RegistrarClientesController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $scope, user, ionicDatePicker) {
        Restangular.setDefaultHeaders({ token: user.get().token });
        var vm = this;
        var fechaNacimiento = {
            callback: function (val) { vm.cliente.fecha_nacimiento = fechaYYYYMMDD(new Date(val)) }
        };
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var clientes = Restangular.all('clientes');
        //
        vm.cambioNombre = cambioNombre
        vm.confirmar = confirmar;
        vm.formatearBusqueda = formatearBusqueda;
        vm.seleccionarFechaNacimiento = seleccionarFechaNacimiento;
        vm.setCliente = setCliente;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.cliente = {};
            $scope.$broadcast('angucomplete-alt:clearInput', 'nombre_completo');
            //document.getElementById('nombre_completo_value').focus();
        }

        function cambioNombre(str) {
            if (str == '') {
                vm.cliente = {};
            } else {
                vm.cliente.nombre_completo = str;
            }
        }

        function confirmar() {
            $ionicLoading.show(loading);
            vm.cliente.establecimiento_id = user.get().vendedor.sede.establecimiento_id;
            clientes.post(vm.cliente)
                .then(function (data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Registro exitoso!',
                            template: 'El cliente se ha almacenado correctamente.'
                        });
                        alertPopup.then(function (option) {
                            activate();
                        })
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Error!',
                            template: 'Inténtelo más tarde nuevamente.'
                        });
                    }

                })
                .catch(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error: ' + error.statusText,
                        template: 'Inténtelo más tarde nuevamente.'
                    });
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function formatearBusqueda(str) {
            return {
                establecimiento_id: user.get().vendedor.sede.establecimiento_id,
                nombre_completo: str,
                token: user.get().token
            };
        }

        function seleccionarFechaNacimiento() {
            ionicDatePicker.openDatePicker(fechaNacimiento);
        }

        function setCliente($item) {
            if ($item) {
                vm.cliente = $item.originalObject;
            }
        }
    }
})();