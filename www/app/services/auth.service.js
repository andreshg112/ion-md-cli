(function () {
    'use strict';

    angular
        .module('starter')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$q', 'PermRoleStore', 'user'];
    function AuthService($q, PermRoleStore, user) {

        var service = {
            hasPermission: hasPermission,
        };

        return service;

        ///////////////

        function hasPermission(roleDef) {
            var deferred = $q.defer();
            var hasPermission = false;
            // check if user has permission via its roles
            if (PermRoleStore.hasRoleDefinition(user.get().rol)) {
                // check if the permission we are validating is in this role's permissions
                if (user.get().rol == roleDef) {
                    hasPermission = true;
                }
            }
            // if we have permission resolve otherwise reject the promise
            if (hasPermission) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
            // return promise
            return deferred.promise;
        }
    }
})();