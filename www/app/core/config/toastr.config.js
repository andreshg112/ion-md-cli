(function () {
    'use strict';

    angular
        .module('app')
        .config(ToastrConfig);

    /** @ngInject */
    ToastrConfig.$inject = ["toastrConfig"];
    function ToastrConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: true,
            closeButton: true,
            closeHtml: '<button>&times;</button>',
            newestOnTop: false,
            positionClass: 'toast-bottom-left',
            progressBar: true,
            tapToDismiss: true
        });
    }
})();