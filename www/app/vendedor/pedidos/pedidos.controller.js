﻿(function () {
    'use strict';

    angular
        .module('app.vendedor')
        .controller('PedidosController', PedidosController);

    PedidosController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', '$ionicModal', '$scope', 'user', 'ionicDatePicker', 'ClientesService', 'toastr'];

    function PedidosController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, $ionicModal, $scope, user, ionicDatePicker, ClientesService, toastr) {
        Restangular.setDefaultRequestParams({ token: user.get().token });

        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var fechaNacimiento = {
            callback: function (val) {
                vm.pedido.cliente.fecha_nacimiento = fechaYYYYMMDD(new Date(val))
            }
        };
        var pedidos = Restangular.all('pedidos');

        //
        vm.cambioNombre = cambioNombre
        vm.cancelarPedido = cancelarPedido;
        vm.cerrarModal = cerrarModal;
        vm.clientes = [];
        vm.confirmar = confirmar;
        vm.despachar = despachar;
        vm.imprimirPedidoEnCola = imprimirPedidoEnCola;
        vm.localSearch = localSearch;
        vm.modificar = modificar;
        vm.pedidos = [];
        vm.pedidosCliente = [];
        vm.openModal = openModal;
        vm.seleccionarFechaNacimiento = seleccionarFechaNacimiento;
        vm.setCliente = setCliente;
        vm.setTotal = setTotal;
        vm.verPedidosAnteriores = verPedidosAnteriores;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            limpiar();
            cargarClientesEstablecimiento();
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
            var toast = toastr.info('Cancelando pedido...', { timeOut: 0 });
            pedido.remove()
                .then(function (data) {
                    if (data.result) {
                        vm.pedidos.splice(vm.pedidos.indexOf(pedido), 1);
                        toastr.success(data.mensaje);
                    } else {
                        toastr.error(data.mensaje, 'Error', { timeOut: 0 });
                    }
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('{0} {1}', error.status, error.statusText);
                    toastr.error(mensaje, 'Error', { timeOut: 0 });
                })
                .finally(function (params) {
                    toastr.clear(toast);
                });
        }

        function cargarClientesEstablecimiento() {
            ClientesService.all(user.get().vendedor.sede.establecimiento_id)
                .then(function (data) {
                    vm.clientes = data;
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('{0} {1}', error.status, error.statusText);
                    toastr.error(mensaje, 'Error', { timeOut: 0 });
                });
        }

        function cargarPedidosCliente(cliente) {
            $ionicLoading.show(loading);
            vm.pedidosCliente = [];
            Restangular.one('clientes', cliente.id).getList('pedidos', {
                establecimiento_id: user.get().vendedor.sede.establecimiento_id,
                enviado: 1
            }).then(function (data) {
                vm.pedidosCliente = data;
            }).catch(function (error) {
                var mensaje = (!error.status) ? error :
                    String.format('{0} {1}', error.status, error.statusText);
                toastr.error(mensaje, 'Error', { timeOut: 0 });
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function cargarPedidosNoEnviados() {
            $ionicLoading.show(loading);
            vm.pedidos = [];
            pedidos.getList({ enviado: 0, sede_id: user.get().vendedor.sede_id })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.pedidos = data;
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

        function cerrarModal() {
            vm.modalNuevo.hide();
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
            vm.pedido.vendedor_id = user.get().vendedor.id;
            vm.pedido.cliente.establecimiento_id = user.get().vendedor.sede.establecimiento_id;
            vm.pedido.cliente.nombre_completo = vm.pedido.cliente.nombre_completo.capitalize();
            var tituloPopup = (!vm.pedido.id) ?
                'Estás a punto de registrar el siguiente pedido.' :
                '¿Estás seguro de que deseas modificar la información del pedido?';
            var confirmarPedido = $ionicPopup.confirm({
                title: tituloPopup,
                cssClass: 'resumen-pedido',
                templateUrl: 'app/vendedor/pedidos/modal-resumen-pedido.html',
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
            var toast = toastr.info('Despachando...', { timeOut: 0 });
            pedido.enviado = 1;
            pedido.establecimiento = user.get().vendedor.sede.establecimiento;
            pedido.put()
                .then(function (data) {
                    if (data.result) {
                        vm.pedidos.splice(vm.pedidos.indexOf(pedido), 1);
                        var titulo = 'Se ha despachado el pedido.';
                        var cuerpo = !data.sms_restantes ?
                            '' : String.format('{0} mensajes de texto restantes.', data.sms_restantes);
                        toastr.success(cuerpo, titulo);
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
                    toastr.clear(toast);
                });
        }

        function setTotal() {
            var subtotal = vm.pedido.subtotal || 0;
            var valor_domicilio = vm.pedido.valor_domicilio || 0
            vm.pedido.total = subtotal + valor_domicilio;
        }

        function imprimirPedidoEnCola(pedido) {
            vm.pedido = pedido;
            var confirmarPedido = $ionicPopup.confirm({
                title: 'Imprimir pedido',
                cssClass: 'resumen-pedido',
                templateUrl: 'app/vendedor/pedidos/modal-resumen-pedido.html',
                scope: $scope,
                cancelText: 'Cancelar'
            });
            confirmarPedido.then(function (res) {
                if (res) {
                    imprimirResumenPedido('popup-resumen-pedido');
                }
                limpiar();
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

        function limpiar() {
            vm.pedido = {
                cliente: {}
            };
            $scope.$broadcast('angucomplete-alt:clearInput', 'nombre_completo');
            if (vm.formPedido) {
                vm.formPedido.$setPristine();
                vm.formPedido.$setUntouched();
            }
        }

        function localSearch(str) {
            var index = 0;
            var matches = [];
            while (matches.length < 5 && index < vm.clientes.length) {
                var cliente = vm.clientes[index];
                if ((cliente.nombre_completo.toLowerCase()
                    .indexOf(str.toString().toLowerCase()) >= 0)) {
                    matches.push(cliente);
                }
                index++;
            }
            return matches;
        }

        function modificar(item) {
            vm.pedido = item; //No funciona con angular.copy().
            $scope.$broadcast('angucomplete-alt:changeInput', 'nombre_completo', vm.pedido.cliente.nombre_completo);
            vm.modalNuevo.show();
        }

        function openModal() {
            vm.modalNuevo.show();
            document.getElementById("nombre_completo_value").required = true;
        }

        function registrarPedido() {
            var info = (!vm.pedido.id) ? 'Registrando...' : 'Modificando...';
            var toast = toastr.info(info, { timeOut: 0 });
            var promesa = (!vm.pedido.id) ?
                pedidos.post(vm.pedido) : vm.pedido.put();
            promesa.then(function (data) {
                if (data.result) {
                    if (!vm.pedido.cliente.id) {
                        //Si el cliente no había sido registrado, se registra en memoria
                        ClientesService.add(data.result.cliente);
                        vm.clientes.push(data.result.cliente);
                    }
                    activate();
                    toastr.success(data.mensaje, {
                        onShown: function () { toastr.clear(toast); }
                    });
                } else {
                    var mensaje = (data.validator) ?
                        data.validator.join('<br />') : '';
                    toastr.error(mensaje, data.mensaje, {
                        timeOut: 0,
                        onShown: function () { toastr.clear(toast); }
                    });
                }
            }).catch(function (error) {
                var mensaje = (!error.status) ? error :
                    String.format('{0} {1}', error.status, error.statusText);
                toastr.error(mensaje, 'Error', { timeOut: 0 });
            }).finally(function () {
                //toastr.clear(toast);
            });
        }

        /**
         * Función callback del angucomplete.
         * Almacena una copia del cliente seleccionado en el pedido. 
         * @param {any} $item Representa el cliente seleccionado del autucompletado.
         */
        function setCliente($item) {
            if ($item) {
                vm.pedido.cliente = angular.copy($item.originalObject);
            }
        }

        function seleccionarFechaNacimiento() {
            ionicDatePicker.openDatePicker(fechaNacimiento);
        }

        function verPedidosAnteriores(cliente) {
            cargarPedidosCliente(cliente);
            var pedidosAnteriores = $ionicPopup.alert({
                title: 'Pedidos anteriores del cliente',
                cssClass: 'resumen-pedido',
                templateUrl: 'app/vendedor/pedidos/pedidos-anteriores-cliente.html',
                scope: $scope
            });
        }

        //Actividades de los modales
        $ionicModal.fromTemplateUrl('app/vendedor/pedidos/nuevo-pedido.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            vm.modalNuevo = modal;
        });

        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function () {
            vm.modalNuevo.remove();
        });

        $scope.$on('modal.hidden', function () {
            limpiar();
        });

        document.onkeydown = function (evt) {
            evt = evt || window.event;
            var isEscape = false;
            if ("key" in evt) {
                isEscape = (evt.key == "Escape" || evt.key == "Esc");
            } else {
                isEscape = (evt.keyCode == 27);
            }
            if (isEscape) {
                cerrarModal();
            }
        };
    }
})();