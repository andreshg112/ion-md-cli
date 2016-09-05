(function() {
    'use strict';

    angular.module('starter').config(config);

    function config($stateProvider, $urlRouterProvider, RestangularProvider) {
        RestangularProvider.setBaseUrl('http://localhost/ion-md-server/public');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl',
                controllerAs: 'app',
                data: {
                    permissions: {
                        only: ['ADMIN', 'EMPLEADO'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.pedidos', {
                url: '/pedidos',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pedidos.html',
                        controller: 'PedidosCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.lists', {
                url: '/lists',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/lists.html',
                        controller: 'ListsCtrl'
                    }
                }
            })
            .state('app.ink', {
                url: '/ink',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ink.html',
                        controller: 'InkCtrl'
                    }
                }
            })
            .state('app.motion', {
                url: '/motion',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/motion.html',
                        controller: 'MotionCtrl'
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN']
                    }
                }
            })
            .state('app.components', {
                url: '/components',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/components.html',
                        controller: 'ComponentsCtrl'
                    }
                }
            })
            .state('app.extensions', {
                url: '/extensions',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/extensions.html',
                        controller: 'ExtensionsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/login');
        //Solución al error 10 $digest
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get("$state");
            $state.go('login');
        });
    }
})();