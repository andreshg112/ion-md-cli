(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientesController', ClientesController);

    ClientesController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', '$ionicPopup', '$scope', 'NgTableParams', 'toastr', '$sessionStorage'];

    function ClientesController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, $ionicPopup, $scope, NgTableParams, toastr, $sessionStorage) {
        Restangular.setDefaultRequestParams({ token: user.get().token });

        //Variables privadas
        var vm = this;
        var clientes = Restangular.all('clientes');
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };

        //Variables y funciones públicas
        vm.alternarSeleccionarTodo = alternarSeleccionarTodo;
        vm.cargarClientes = cargarClientes;
        vm.clientes = [];
        vm.escribirOferta = escribirOferta;
        vm.generos = [{ id: 'masculino', title: 'Masculino' }, { id: 'femenino', title: 'Femenino' }]
        vm.seleccionados = [];

        vm.itemClicked = itemClicked;
        vm.contactoFilterDef = {
            celular: { id: "text", placeholder: "Celular" },
            telefono: { id: "text", placeholder: "Teléfono" }
        };
        vm.direccionesFilterDef = {
            direccion_casa: { id: "text", placeholder: "Casa" },
            direccion_oficina: { id: "text", placeholder: "Oficina" },
            direccion_otra: { id: "text", placeholder: "Otra" }
        };
        // vm.anterior = anterior;
        // vm.esUltimaPagina = esUltimaPagina;
        // vm.getInicioTabla = getInicioTabla;
        // vm.pagina = 1;
        // vm.siguiente = siguiente;
        // vm.limit = 5;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarClientes();
            cargarEstablecimientos();
        }

        function alternarSeleccionarTodo() {
            if (vm.seleccionarTodoChecked) {
                for (var index = 0; index < vm.clientes.length; index++) {
                    if (vm.seleccionados.length >= vm.establecimientoSeleccionado.sms_restantes) {
                        toastr.error(String.format('Solamente puedes seleccionar {0} clientes porque esos son tus mensajes restantes.', vm.establecimientoSeleccionado.sms_restantes));
                        index = vm.clientes.length;
                    } else {
                        var element = vm.clientes[index];
                        if (!element.selected && element.celular) {
                            element.selected = true; //Selecciona si tiene celular.
                            vm.seleccionados.push(element);
                        }
                    }
                }
            } else {
                limpiarSeleccionados();
            }
        }

        //function anterior() { if (vm.pagina > 1) { vm.pagina--; } }

        function cargarClientes() {
            vm.seleccionarTodoChecked = false;
            $ionicLoading.show(loading);
            vm.clientes = [];
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('clientes', { establecimiento_id: establecimientoId })
                .then(function (data) {
                    vm.clientes = data;
                    vm.tableParams = new NgTableParams({}, { dataset: vm.clientes });
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

        function cargarEstablecimientos() {
            vm.establecimientos = user.get().administrador.establecimientos;
            vm.establecimientoSeleccionado = (!!vm.establecimientos)
                ? vm.establecimientos[0] : {};
        }

        function enviarOferta(mensaje) {
            $ionicLoading.show(loading);
            var destinatarios = vm.seleccionados.map(function (cliente) { return cliente.celular; });
            Restangular.one('administradores', user.get().administrador.id)
                .customPOST({
                    clientes: vm.seleccionados,
                    mensaje: normalize(mensaje),
                    establecimiento_id: vm.establecimientoSeleccionado.id
                }, 'ofertas')
                .then(function (data) {
                    if (data.result) {
                        var establecimientoIndex = $sessionStorage.user.administrador.establecimientos
                            .findIndex(function (element) {
                                return element.id == vm.establecimientoSeleccionado.id;
                            });
                        $sessionStorage.user.administrador.establecimientos[establecimientoIndex].sms_restantes = data.sms_restantes;
                        vm.establecimientoSeleccionado.sms_restantes = data.sms_restantes;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Oferta enviada',
                            template: 'Informe del mensaje: ' + data.notificacion
                        });
                        alertPopup.then(function () {
                            limpiarSeleccionados();
                        })
                    } else {
                        var cuerpo = (data.validator) ? data.validator.join('.<br />') : '';
                        toastr.error(cuerpo, mensaje, { timeOut: 0 });
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

        function escribirOferta() {
            if (vm.seleccionados.length > 0) {
                vm.mensaje = 'Aprovecha nuestra oferta especial en el día de hoy.';
                var popupOferta = $ionicPopup.show({
                    template: '<textarea rows="4" maxlength="155" ng-model="vm.mensaje"></textarea>',
                    cssClass: 'felicitacion',
                    title: 'Sorprende a tus clientes',
                    subTitle: String.format('El mensaje se enviará a los {0} clientes seleccionados', vm.seleccionados.length),
                    scope: $scope,
                    buttons: [
                        { text: 'Cancelar' },
                        {
                            text: '<b>Enviar</b>',
                            type: 'button-balanced',
                            onTap: function (e) {
                                if (!vm.mensaje) {
                                    //No permitir al usuario enviar el mensaje si no ha escrito nada.
                                    e.preventDefault();
                                } else {
                                    return vm.mensaje;
                                }
                            }
                        }
                    ]
                });
                popupOferta.then(function (mensaje) {
                    if (mensaje) {
                        enviarOferta(mensaje);
                    }
                });
            } else {
                var mensaje = 'No ha seleccionado ningún cliente.' +
                    '<br/>Seleccione haciendo clic sobre alguno de ellos.';
                toastr.info(mensaje);
            }
        }

        /*function esUltimaPagina(filtrados) {
            var totalPaginas = Math.ceil(vm.clientes.length / vm.limit);
            return vm.pagina >= totalPaginas || filtrados.length < vm.limit;
        }

        function getInicioTabla() { return 5 * (vm.pagina - 1); }*/

        /**
         * Agrega o quita un elemento del listado de seleccionados.
         * 
         * @param {any} member
         */
        function itemClicked(member) {
            if (vm.establecimientoSeleccionado.sms_restantes > 0) {
                if (!member.celular) {
                    var mensaje = 'No se puede enviar ofertas a un cliente que no tiene celular registrado.';
                    toastr.info(mensaje);
                } else {
                    var index = vm.seleccionados.indexOf(member);
                    if (index > -1) {
                        vm.seleccionados.splice(index, 1);
                        member.selected = false;
                    } else {
                        if (vm.seleccionados.length >= vm.establecimientoSeleccionado.sms_restantes) {
                            toastr.error(String.format('Solamente puedes seleccionar {0} clientes porque esos son tus mensajes restantes.', vm.establecimientoSeleccionado.sms_restantes));
                        } else {
                            vm.seleccionados.push(member);
                            member.selected = true;
                        }
                    }
                }
            } else {
                toastr.error('No tienes mensajes disponibles.');
            }
        }

        function limpiarSeleccionados() {
            vm.seleccionados.forEach(function (element) {
                element.selected = false;
            }, this);
            vm.seleccionados = [];
        }

        /*function siguiente(filtrados) {
            var totalPaginas = Math.ceil(vm.clientes.length / vm.limit);
            if (vm.pagina < totalPaginas && filtrados.length >= vm.limit) {
                vm.pagina++;
            }
        }*/
    }
})();