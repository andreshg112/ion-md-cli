(function () {
    'use strict';

    angular
        .module('starter')
        .config(config);

    /** @ngInject */
    function config($stateProvider, $urlRouterProvider, RestangularProvider, ionicDatePickerProvider) {
        RestangularProvider.setBaseUrl('http://localhost/ion-md-server/public');
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
                        only: ['ADMIN', 'EMPLEADO'],
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
                }
            })
            .state('app.clientes', {
                url: '/clientes',
                views: {
                    'menuContent': {
                        templateUrl: 'app/clientes/clientes.html',
                        controller: 'ClientesController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.pedidos'
                    }
                }
            })
            .state('app.reporte-general', {
                url: '/reporte-general',
                views: {
                    'menuContent': {
                        templateUrl: 'app/reporte-general/reporte-general.html',
                        controller: 'ReporteGeneralController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['ADMIN'],
                        redirectTo: 'app.pedidos'
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

        //Configuración del Ionic Datepicker
        var datePickerObj = {
            inputDate: new Date(),
            setLabel: 'Fijar',
            closeLabel: 'Cerrar',
            mondayFirst: true,
            weeksList: ["D", "L", "M", "M", "J", "V", "S"],
            monthsList: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            closeOnSelect: false
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
    }
})();