(function() {
    'use strict';

    angular
        .module('starter')
        .controller('InkCtrl', InkCtrl);

    InkCtrl.$inject = ['$stateParams', 'ionicMaterialInk'];

    function InkCtrl($stateParams, ionicMaterialInk) {
        var vm = this;


        activate();

        ////////////////

        function activate() {}
        ionicMaterialInk.displayEffect();

    }
})();