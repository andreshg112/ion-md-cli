(function () {
    'use strict';

    angular
        .module('app')
        .config(['RestangularProvider', 'API', RestangularConfig]);

    /** @ngInject */
    function RestangularConfig(RestangularProvider, API) {
        RestangularProvider.setBaseUrl(API);
    }
})();