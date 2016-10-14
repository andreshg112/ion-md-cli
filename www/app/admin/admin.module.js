(function () {
    'use strict';

    angular.module('app.admin', [])
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
            .state('app.historial-pedidos', {
                url: '/historial-pedidos',
                views: {
                    'menuContent': {
                        templateUrl: 'app/admin/historial-pedidos/historial-pedidos.html',
                        controller: 'HistorialPedidosController',
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
            .state('app.reporte-graficas', {
                url: '/reporte-graficas',
                views: {
                    'menuContent': {
                        templateUrl: 'app/admin/reporte-graficas/reporte-graficas.html',
                        controller: 'ReporteGraficasController',
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
            .state('app.reporte-tablas', {
                url: '/reporte-tablas',
                views: {
                    'menuContent': {
                        templateUrl: 'app/admin/reporte-tablas/reporte-tablas.html',
                        controller: 'ReporteTablasController',
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