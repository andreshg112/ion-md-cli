(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ClientesController', ClientesController);

    ClientesController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast', '$ionicPopup', '$scope'];

    function ClientesController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast, $ionicPopup, $scope) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var clientes = Restangular.all('clientes');
        var seleccionados = [];
        //
        vm.cargarClientes = cargarClientes;
        vm.itemClicked = itemClicked;
        vm.clientes = [];
        vm.escribirOferta = escribirOferta;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarClientes();
            cargarEstablecimientos();
        }

        function cargarClientes() {
            $ionicLoading.show(loading);
            vm.clientes = [];
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('clientes', { establecimiento_id: establecimientoId })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.clientes = data;
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
            vm.establecimientos = user.get().administrador.establecimientos;
        }

        function enviarOferta(mensaje) {
            $ionicLoading.show(loading);
            var destinatarios = seleccionados.map(function (cliente) { return cliente.celular; });
            Restangular.one('administradores', user.get().administrador.id)
                .customPOST({ clientes: seleccionados, mensaje: normalize(mensaje) }, 'ofertas')
                .then(function (data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Oferta enviada',
                            template: 'Informe del mensaje: ' + data.notificacion
                        });
                        alertPopup.then(function () {
                            limpiarSeleccionados();
                        })
                    } else {
                        var mensaje = data.mensaje + '<br />';
                        if (data.validator) {
                            mensaje += data.validator.join('.<br />');
                        }
                        ionicToast.show(mensaje, 'middle', true, 2000);
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

        function escribirOferta() {
            if (seleccionados.length > 0) {
                vm.mensaje = 'Aprovecha nuestra oferta especial en el día de hoy.';
                var popupOferta = $ionicPopup.show({
                    template: '<textarea rows="4" maxlength="155" ng-model="vm.mensaje"></textarea>',
                    cssClass: 'felicitacion',
                    title: 'Sorprende a tus clientes',
                    subTitle: String.format('El mensaje se enviará a los {0} clientes seleccionados', seleccionados.length),
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
                var mensaje = 'No ha seleccionado ningún cliente.<br/>Seleccione haciendo clic en sobre alguno de ellos.';
                ionicToast.show(mensaje, 'middle', false, 3000);
            }
        }

        /**
         * Agrega o quita un elemento del listado de seleccionados.
         * 
         * @param {any} member
         */
        function itemClicked(member) {
            if (!member.celular) {
                var mensaje = 'No se puede enviar ofertas a un cliente que no tiene celular registrado.';
                ionicToast.show(mensaje, 'middle', false, 2000);
            } else {
                var index = seleccionados.indexOf(member);
                if (index > -1) {
                    seleccionados.splice(index, 1);
                    member.selected = false;
                } else {
                    seleccionados.push(member);
                    member.selected = true;
                }
            }
        }

        function limpiarSeleccionados() {
            seleccionados.forEach(function (element) {
                element.selected = false;
            }, this);
            seleccionados = [];
        }

        /*vm.data = {};
        vm.data.columns = [{ "id": "1453", "name": "Product" }, { "id": "1355", "name": "Weight" }, { "id": "0393", "name": "Height" }, { "id": "3932", "name": "Width" }, { "id": "2939", "name": "Depth" }, { "id": "1234", "name": "Color" }];
        vm.data.items = [{ "1234": "Green", "1355": "15 oz.", "1453": "Crayons", "2939": "1.5 in.", "3932": "3 in.", "0393": "5 in." }, { "1234": "Brown", "1355": "12 oz.", "1453": "Cookies", "2939": "2.5 in.", "3932": "8 in.", "0393": "7 in." }, { "1234": "Green", "1355": "15 oz.", "1453": "Crayons", "2939": "1.5 in.", "3932": "3 in.", "0393": "5 in." }, { "1234": "Green", "1355": "15 oz.", "2939": "1.5 in.", "3932": "3 in.", "14531": "Crayons", "0393": "5 in." }];*/

    }
})();