(function() {
    'use strict';
    //
    angular.module('starter', [
            'ionic',
            'ionic-material',
            'restangular',
            'ionic-toast'
        ])
        .run(function($ionicPlatform) {
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)

                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })
        .config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
            RestangularProvider.setBaseUrl('http://localhost/ion-md-server/public');
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html'
                })
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/menu.html',
                    controller: 'AppCtrl'
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
                .state('app.pedido', {
                    url: '/pedido',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/pedido.html',
                            controller: 'PedidosController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.pedidos-en-cola', {
                    url: '/pedidos-en-cola',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/pedidos-en-cola.html',
                            controller: 'PedidosEnColaController',
                            controllerAs: 'vm'
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
            $urlRouterProvider.otherwise('/login');
        });;
})();