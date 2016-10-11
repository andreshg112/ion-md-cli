(function () {
    'use strict';

    angular
        .module('app')
        .controller('CumpleanosController', CumpleanosController);

    CumpleanosController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'ionicToast', '$scope', 'user'];

    function CumpleanosController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, ionicToast, $scope, user) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };

        //
        vm.escribirMensaje = escribirMensaje;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() { }

        function escribirMensaje(cliente) {
            var primerNombre = cliente.nombre_completo.split(' ')[0];
            vm.mensaje = String.format('{0}, {1} quiere felicitarte en tu cumpleaños y desearte muchos éxitos. Ven y disfruta de nuestra promoción especial para ti.', primerNombre, cliente.establecimiento.nombre);
            var popupMensaje = $ionicPopup.show({
                template: '<textarea rows="4" maxlength="155" ng-model="vm.mensaje"></textarea>',
                cssClass: 'felicitacion',
                title: 'Haga que su cliente se sienta especial',
                subTitle: 'Escríbale un mensaje de felicitación',
                scope: $scope,
                buttons: [
                    { text: 'Cancelar' },
                    {
                        text: '<b>Felicitar</b>',
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
            popupMensaje.then(function (mensaje) {
                if (mensaje) {
                    felicitar(cliente, mensaje);
                }
            });
        }

        function felicitar(cliente, mensaje) {
            $ionicLoading.show(loading);
            Restangular.one('administradores', user.get().administrador.id)
                .customPOST({ cliente: cliente, mensaje: normalize(mensaje) }, 'felicitaciones')
                .then(function (data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Felicitación enviada',
                            template: 'Informe al cliente: ' + data.notificacion
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
    }
})();