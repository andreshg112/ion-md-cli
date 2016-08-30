(function() {
    'use strict';

    angular
        .module('starter')
        .controller('SetupController', SetupController);

    SetupController.$inject = ['$stateParams'];

    function SetupController($stateParams) {
        var vm = this;


        activate();

        ////////////////

        function activate() {}
    }
})();