(function () {
    'use strict';

    angular.module('app.super_admin', [])
        .config(['$stateProvider', '$urlRouterProvider', routes]);
    
    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app.users', {
                url: '/users',
                views: {
                    'menuContent': {
                        templateUrl: 'app/super_admin/users/users.html',
                        controller: 'UsersController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['SUPER_USER'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.establecimientos', {
                url: '/establecimientos',
                views: {
                    'menuContent': {
                        templateUrl: 'app/super_admin/establecimientos/establecimientos.html',
                        controller: 'EstablecimientosController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['SUPER_USER'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.sedes', {
                url: '/sedes',
                views: {
                    'menuContent': {
                        templateUrl: 'app/super_admin/sedes/sedes.html',
                        controller: 'SedesController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['SUPER_USER'],
                        redirectTo: 'login'
                    }
                }
            })
            .state('app.vendedores', {
                url: '/vendedores',
                views: {
                    'menuContent': {
                        templateUrl: 'app/super_admin/vendedores/vendedores.html',
                        controller: 'VendedoresController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['SUPER_USER'],
                        redirectTo: 'login'
                    }
                }
            });
    }
})();