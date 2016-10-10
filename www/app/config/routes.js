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