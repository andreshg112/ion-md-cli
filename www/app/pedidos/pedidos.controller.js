﻿(function () {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosController', PedidosController);

    PedidosController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user', 'ionicDatePicker'];

    function PedidosController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user, ionicDatePicker) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var fechaNacimiento = {
            callback: function (val) { vm.pedido.cliente.fecha_nacimiento = fechaYYYYMMDD(new Date(val)) }
        };
        var pedidos = Restangular.all('pedidos');

        //
        vm.cambioNombre = cambioNombre
        vm.cancelarPedido = cancelarPedido;
        vm.cerrarModal = cerrarModal;
        vm.cerrarPedidosCliente = cerrarPedidosCliente;
        vm.confirmar = confirmar;
        vm.despachar = despachar;
        vm.formatearBusqueda = formatearBusqueda;
        vm.imprimirPedidoEnCola = imprimirPedidoEnCola;
        vm.pedidos = [];
        vm.pedidosCliente = [];
        vm.openModal = openModal;
        vm.seleccionarFechaNacimiento = seleccionarFechaNacimiento;
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
            cargarPedidosNoEnviados();
        }

        function cambioNombre(str) {
            if (str == '') {
                vm.pedido.cliente = {};
            } else {
                vm.pedido.cliente.nombre_completo = str;
            }
        }

        function cancelarPedido(pedido) {
            $ionicLoading.show(loading);
            pedido.remove()
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

        function cargarPedidosCliente(cliente) {
            $ionicLoading.show(loading);
            vm.pedidosCliente = [];
            Restangular.one('clientes', cliente.id).getList('pedidos', {
                establecimiento_id: user.get().establecimiento_id,
                enviado: 1
            })
                .then(function (data) {
                    vm.pedidosCliente = data;
                })
                .catch(function (error) {
                    var mensaje = String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function cargarPedidosNoEnviados() {
            $ionicLoading.show(loading);
            vm.pedidos = [];
            pedidos.getList({ enviado: 0, establecimiento_id: user.get().establecimiento.id })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.pedidos = data;
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

        function cerrarModal() {
            vm.modalNuevo.hide();
        }

        function cerrarPedidosCliente() {
            vm.modalPedidosCliente.hide();
        }

        function confirmar() {
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
            var confirmarPedido = $ionicPopup.confirm({
                title: 'Estás a punto de registrar el siguiente pedido.',
                cssClass: 'resumen-pedido',
                templateUrl: 'app/pedidos/modal-resumen-pedido.html',
                scope: $scope,
                cancelText: 'Cancelar'
            });
            confirmarPedido.then(function (res) {
                if (res) {
                    registrarPedido();
                    imprimirResumenPedido('popup-resumen-pedido');
                }
            });
        }

        function despachar(pedido) {
            $ionicLoading.show(loading);
            pedido.enviado = 1;
            pedido.establecimiento = user.get().establecimiento;
            pedido.put()
                .then(function (data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Se ha despachado el pedido.',
                            template: 'Notificación al cliente: ' + data.notificacion
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
                    var mensaje = String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function imprimirPedidoEnCola(pedido) {
            vm.pedido = pedido;
            var confirmarPedido = $ionicPopup.confirm({
                title: 'Imprimir pedido',
                cssClass: 'resumen-pedido',
                templateUrl: 'app/pedidos/modal-resumen-pedido.html',
                scope: $scope,
                cancelText: 'Cancelar'
            });
            confirmarPedido.then(function (res) {
                if (res) {
                    imprimirResumenPedido('popup-resumen-pedido');
                }
                vm.pedido = {
                    cliente: {}
                };
            });
        }

        function imprimirResumenPedido(muestra) {
            var divResumenPedido = document.getElementById(muestra).innerHTML;
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            var inicio = '<html><head><link rel="stylesheet" type="text/css" href="lib/ionic/css/ionic.css" /></head><body onload="window.print()">';
            var final = '</body></html>';
            popupWin.document.write(inicio + divResumenPedido + final);
            popupWin.document.close();
        }

        function formatearBusqueda(str) {
            return {
                establecimiento_id: user.get().establecimiento_id,
                nombre_completo: str,
                token: user.get().token
            };
        }

        function openModal() {
            vm.modalNuevo.show();
        }

        function registrarPedido() {
            $ionicLoading.show(loading);
            pedidos.post(vm.pedido)
                .then(function (data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Registro exitoso!',
                            template: 'Tu pedido se ha almacenado correctamente.'
                        });
                        alertPopup.then(function (option) {
                            activate();
                        });
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

        function setCliente($item) {
            if ($item) {
                vm.pedido.cliente = $item.originalObject;
            }
        }

        function seleccionarFechaNacimiento() {
            ionicDatePicker.openDatePicker(fechaNacimiento);
        };

        function verPedidosAnteriores(cliente) {
            cargarPedidosCliente(cliente);
            vm.modalPedidosCliente.show();
        }

        /*function verResumenPedido() {
            vm.modalResumenPedido.show();
        }*/

        //Actividades de los modales
        $ionicModal.fromTemplateUrl('app/pedidos/nuevo-pedido.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            vm.modalNuevo = modal;
        });

        $ionicModal.fromTemplateUrl('app/pedidos/pedidos-anteriores-cliente.html', {
            scope: $scope
        }).then(function (modal) {
            vm.modalPedidosCliente = modal;
        });

        /*$ionicModal.fromTemplateUrl('app/pedidos/modal-resumen-pedido.html', {
            scope: $scope
        }).then(function (modal) {
            vm.modalResumenPedido = modal;
        });*/

        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function () {
            vm.modalNuevo.remove();
            vm.modalPedidosCliente.remove();
        });

    }
})();