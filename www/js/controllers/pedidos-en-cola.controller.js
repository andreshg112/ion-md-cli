(function() {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosEnColaController', PedidosEnColaController);

    PedidosEnColaController.$inject = ['ionicMaterialInk', '$ionicPopup', '$timeout', 'Restangular', '$ionicLoading', 'ionicToast', '$ionicModal', '$scope'];

    function PedidosEnColaController(ionicMaterialInk, $ionicPopup, $timeout, Restangular, $ionicLoading, ionicToast, $ionicModal, $scope) {
        var vm = this;
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var pedidos = Restangular.all('pedidos');
        //
        vm.despachar = despachar;
        vm.pedidos = [];

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
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

        $ionicModal.fromTemplateUrl('templates/pedido.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $scope.modal.show();
            /*$timeout(function() {
                $scope.modal.hide();
            }, 2000);*/
        };
        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function() {
            console.log('destroy');
            $scope.modal.remove();
        });
    }
})();