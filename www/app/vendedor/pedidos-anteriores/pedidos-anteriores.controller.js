(function () {
    'use strict';

    angular
        .module('app.vendedor')
        .controller('PedidosAnterioresController', PedidosAnterioresController);

    PedidosAnterioresController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$scope', 'user', 'ionicDatePicker'];

    function PedidosAnterioresController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $scope, user, ionicDatePicker) {
        Restangular.setDefaultHeaders({ token: user.get().token });
        var vm = this;
        var fechaPedido = {
            callback: function (val) { vm.pedido.created_at = fechaYYYYMMDD(new Date(val)) }
        };
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var pedidos = Restangular.all('pedidos');
        //
        vm.cambioNombre = cambioNombre
        vm.confirmar = confirmar;
        vm.formatearBusqueda = formatearBusqueda;
        vm.seleccionarFechaPedido = seleccionarFechaPedido;
        vm.setCliente = setCliente;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.pedido = {
                created_at: fechaYYYYMMDD(new Date()),
                cliente: {}
            };
            $scope.$broadcast('angucomplete-alt:clearInput', 'nombre_completo');
            document.getElementById("pedido").focus();
        }

        function cambioNombre(str) {
            if (str == '') {
                vm.pedido.cliente = {};
            } else {
                vm.pedido.cliente.nombre_completo = str;
            }
        }

        function confirmar() {
            $ionicLoading.show(loading);
            vm.pedido.numero = (vm.tipo_numero == 'Celular') ?
                vm.pedido.cliente.celular : vm.pedido.cliente.telefono;
            if (vm.tipo_direccion == 'Casa') {
                vm.pedido.direccion = vm.pedido.cliente.direccion_casa;
            } else if (vm.tipo_direccion == 'Oficina') {
                vm.pedido.direccion = vm.pedido.cliente.direccion_oficina;
            } else {
                vm.pedido.direccion = vm.pedido.cliente.direccion_otra;
            }
            vm.pedido.vendedor_id = user.get().vendedor.id;
            vm.pedido.cliente.establecimiento_id = user.get().vendedor.sede.establecimiento_id;
            vm.pedido.enviado = 1;
            pedidos.post(vm.pedido)
                .then(function (data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Registro exitoso!',
                            template: 'Tu pedido se ha almacenado correctamente.'
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

        function seleccionarFechaPedido() {
            ionicDatePicker.openDatePicker(fechaPedido);
        }

        function setCliente($item) {
            if ($item) {
                vm.pedido.cliente = $item.originalObject;
            }
        }
    }
})();