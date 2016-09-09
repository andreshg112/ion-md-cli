(function () {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosAnterioresCtrl', PedidosAnterioresCtrl);

    PedidosAnterioresCtrl.$inject = ['ionicMaterialInk', '$ionicPopup', '$timeout', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user', 'ionicDatePicker'];

    function PedidosAnterioresCtrl(ionicMaterialInk, $ionicPopup, $timeout, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user, ionicDatePicker) {
        var vm = this;
        var fechaPedido = {
            callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            }
        };

        vm.seleccionarFecha = function () {
            ionicDatePicker.openDatePicker(fechaPedido);
        };
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var pedidos = Restangular.all('pedidos');
        //
        vm.cambioNombre = cambioNombre
        vm.cerrarPedidosCliente = cerrarPedidosCliente;
        vm.confirmar = confirmar;
        vm.formatearBusqueda = formatearBusqueda;
        vm.pedidosCliente = [];
        vm.setCliente = setCliente;
        vm.verPedidosAnteriores = verPedidosAnteriores;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.pedido = {
                cliente: {}
            };
            $scope.$broadcast('angucomplete-alt:clearInput', 'nombre_completo');
        }

        function cambioNombre(str) {
            if (str == '') {
                vm.pedido.cliente = {};
            } else {
                vm.pedido.cliente.nombre_completo = str;
            }
        }

        function cargarPedidosCliente(cliente) {
            $ionicLoading.show(loading);
            vm.pedidosCliente = [];
            Restangular.one('clientes', cliente.id).getList('pedidos', {
                establecimiento_id: user.get().establecimiento_id,
                enviado: 1
            }).then(function (data) {
                vm.pedidosCliente = data;
            })
                .catch(function (error) {
                    ionicToast.show(error, 'middle', true);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function cerrarPedidosCliente() {
            vm.modalPedidosCliente.hide();
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
            vm.pedido.establecimiento_id = user.get().establecimiento_id;
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
                    console.log(error);
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
                establecimiento_id: user.get().establecimiento_id,
                nombre_completo: str
                //token: user.get().token
            };
        }

        function setCliente($item) {
            if ($item) {
                vm.pedido.cliente = $item.originalObject;
            }
        }

        function verPedidosAnteriores(cliente) {
            cargarPedidosCliente(cliente);
            vm.modalPedidosCliente.show();
        }

        //Actividades de los modales
        $ionicModal.fromTemplateUrl('templates/nuevo-pedido.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            vm.modal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/pedidos-anteriores-cliente.html', {
            scope: $scope
        }).then(function (modal) {
            vm.modalPedidosCliente = modal;
        });

        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function () {
            vm.modalPedidosCliente.remove();
        });
    }
})();