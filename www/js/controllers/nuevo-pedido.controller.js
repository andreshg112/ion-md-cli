﻿(function() {
    'use strict';

    angular
        .module('starter')
        .controller('PedidosController', PedidosController);

    PedidosController.$inject = ['ionicMaterialInk', '$ionicPopup', 'Restangular', '$ionicLoading', 'user'];

    function PedidosController(ionicMaterialInk, $ionicPopup, Restangular, $ionicLoading, user) {
        var vm = this;
        var pedidos = Restangular.all('pedidos');
        //
        vm.confirmar = confirmar;
        vm.buscarCliente = buscarCliente;

        /*ionicToast.show('This is a toast at the top.', 'top', true, 2500);
        ionicToast.hide();*/

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.pedido = {};
        }

        function confirmar() {
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
                .finally(function() {});
        }

        function buscarCliente(celular) {
            //Al buscar nuevamente, se deben borrar los datos del cliente, pero se mantiene el celular.
            vm.pedido.cliente = {};
            vm.pedido.cliente.celular = celular;
            if (celular) {
                $ionicLoading.show({
                    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
                });
                Restangular.one('clientes', celular).get()
                    .then(function(data) {
                        if (data) {
                            data.celular = parseInt(data.celular);
                            vm.pedido.cliente = data;
                        }
                    })
                    .catch(function(error) {
                        console.log(error.statusText);
                    })
                    .finally(function() {
                        $ionicLoading.hide();
                    });
            }
        }
    }
})();