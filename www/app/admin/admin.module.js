(function () {
    'use strict';

    angular.module('starter.admin', [])
        .config(['$stateProvider', '$urlRouterProvider', routes]);

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.clientes', {
                url: '/clientes',
                views: {
                    'menuContent': {
                        templateUrl: 'app/admin/clientes/clientes.html',
                        controller: 'ClientesController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.cumpleanos', {
                url: '/cumpleanos',
                views: {
                    'menuContent': {
                        templateUrl: 'app/admin/cumpleanos/cumpleanos.html',
                        controller: 'CumpleanosController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.reporte-general', {
                url: '/reporte-general',
                views: {
                    'menuContent': {
                        templateUrl: 'app/admin/reporte-general/reporte-general.html',
                        controller: 'ReporteGeneralController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'login'
                    }
                }
            });
    }
})();