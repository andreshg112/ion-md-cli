(function () {
    'use strict';

    angular.module('starter.vendedor', [])
        .config(['$stateProvider', '$urlRouterProvider', routes]);

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.pedidos', {
                url: '/pedidos',
                views: {
                    'menuContent': {
                        templateUrl: 'app/vendedor/pedidos/pedidos.html',
                        controller: 'PedidosController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['VENDEDOR'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.pedidos-anteriores', {
                url: '/pedidos-anteriores',
                views: {
                    'menuContent': {
                        templateUrl: 'app/vendedor/pedidos-anteriores/pedidos-anteriores.html',
                        controller: 'PedidosAnterioresController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['VENDEDOR'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.registrar-clientes', {
                url: '/registrar-clientes',
                views: {
                    'menuContent': {
                        templateUrl: 'app/vendedor/registrar-clientes/registrar-clientes.html',
                        controller: 'RegistrarClientesController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['VENDEDOR'],
                        redirectTo: 'login'
                    }
                }
            });
    }
})();