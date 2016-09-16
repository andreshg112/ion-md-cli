(function () {
    'use strict';

    angular
        .module('starter')
        .provider('token', tokenProvider);

    tokenProvider.$inject = [];
    function tokenProvider(user) {
        var token;
        return {
            setToken: function (value) {
                token = value;
            },
            $get: function () {
                return {
                    token: token,
                    setToken: this.setToken
                };
            }
        };
    }
})();