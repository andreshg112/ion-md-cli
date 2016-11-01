(function () {
    'use strict';

    angular
        .module('app')
        .config(NgStorageConfig);

    NgStorageConfig.$inject = ['$sessionStorageProvider'];
    function NgStorageConfig($sessionStorageProvider) {
        $sessionStorageProvider.setKeyPrefix('fd.');
    }
})();