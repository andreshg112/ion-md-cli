(function () {
    'use strict';

    angular
        .module('app')
        .config(NgTableConfig);

    /** @ngInject */
    NgTableConfig.$inject = ["ngTableFilterConfigProvider"];
    function NgTableConfig(ngTableFilterConfigProvider) {
        var filterAliasUrls = {
            "checkbox": "lib/ng-table/filters/checkbox.html"
        };
        ngTableFilterConfigProvider.setConfig({
            aliasUrls: filterAliasUrls
        });
    }
})();