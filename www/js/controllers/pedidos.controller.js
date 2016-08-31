(function() {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosController', PedidosController);

    PedidosController.$inject = ['ionicMaterialInk', '$ionicPopup', '$timeout', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope', 'user'];

    function PedidosController(ionicMaterialInk, $ionicPopup, $timeout, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope, user) {
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var pedidos = Restangular.all('pedidos');
        //
        vm.confirmar = confirmar;
        vm.despachar = despachar;
        vm.pedidos = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.pedido = {};
            cargarPedidosNoEnviados();
        }

        function cargarPedidosNoEnviados() {
            $ionicLoading.show(loading);
            pedidos.getList({ enviado: 0 })
                .then(function(data) {
                    if (data.length > 0) {
                        vm.pedidos = data;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                    ionicToast.show(error.statusText, 'middle', true);
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
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
                .then(function(data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Registro exitoso!',
                            template: 'Tu pedido se ha almacenado correctamente.'
                        });
                        alertPopup.then(function(option) {
                            activate();
                        })
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Error!',
                            template: 'Inténtelo más tarde nuevamente.'
                        });
                    }

                })
                .catch(function(error) {
                    console.log(error);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error: ' + error.statusText,
                        template: 'Inténtelo más tarde nuevamente.'
                    });
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }

        function despachar(pedido) {
            $ionicLoading.show(loading);
            pedido.enviado = 1;
            pedido.put()
                .then(function(data) {
                    if (data.result) {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Envío exitoso!',
                            template: 'Se le ha notificado al cliente.'
                        });
                        alertPopup.then(function(option) {
                            activate();
                        })
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: '¡Error!',
                            template: 'Inténtelo más tarde nuevamente.'
                        });
                    }

                })
                .catch(function(error) {
                    console.log(error.statusText);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error: ' + error.statusText,
                        template: 'Inténtelo más tarde nuevamente.'
                    });
                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }

        //Actividades de la modal de nuevo pedido
        $ionicModal.fromTemplateUrl('templates/nuevo-pedido.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function(modal) {
            vm.modal = modal;
        });

        vm.openModal = function() {
            vm.modal.show();
            /*$timeout(function() {
                $scope.modal.hide();
            }, 2000);*/
        };
        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function() {
            vm.modal.remove();
        });
    }
})();