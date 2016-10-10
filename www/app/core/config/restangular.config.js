(function () {
    'use strict';

    angular
        .module('starter')
        .config(['RestangularProvider', 'API', RestangularConfig]);

    /** @ngInject */
    function RestangularConfig(RestangularProvider, API) {
        RestangularProvider.setBaseUrl(API);
    }
})();