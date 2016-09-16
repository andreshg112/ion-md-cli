(function () {
    'use strict';

    angular
        .module('starter')
        .run(['$ionicPlatform', 'PermRoleStore', 'AuthService', run]);
    /** @ngInject */
    function run($ionicPlatform, PermRoleStore, AuthService) {
        var roles = ['ADMIN', 'EMPLEADO'];
        angular.forEach(roles, function (rol) {
            PermRoleStore.defineRole(rol, function (roleName, stateParams) {
                return AuthService.hasPermission(roleName);
            });
        });
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }
})();