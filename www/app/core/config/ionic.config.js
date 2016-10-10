(function () {
    'use strict';

    angular
        .module('starter')
        .config(['$ionicConfigProvider', IonicConfig]);

    /** @ngInject */
    function IonicConfig($ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);
    }
})();