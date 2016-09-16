(function () {
    'use strict';

    angular
        .module('starter')
        .factory('TokenService', TokenService);

    TokenService.$inject = [];
    function TokenService() {
        var TokenService = {
            setToken: setToken,
            getToken: getToken
        };

        return TokenService;

        ////////////////

        var token;

        function setToken(value) {
            token = value;
        }

        function getToken() {
            return token;
        }
    }
})();