(function () {
    'use strict';

    angular
        .module('starter')
        .config(['$stateProvider', '$urlRouterProvider', routes]);

    /** @ngInject */
    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/layout/menu.html',
                controller: 'AppController',
                controllerAs: 'app',
                data: {
                    permissions: {
                        only: ['SUPER_USER', 'ADMIN', 'VENDEDOR'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.pedidos', {
                url: '/pedidos',
                views: {
                    'menuContent': {
                        templateUrl: 'app/pedidos/pedidos.html',
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
                        templateUrl: 'app/pedidos-anteriores/pedidos-anteriores.html',
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
                        templateUrl: 'app/registrar-clientes/registrar-clientes.html',
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

        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/login');
        //Solución al error 10 $digest
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go('login');
        });
    }
})();