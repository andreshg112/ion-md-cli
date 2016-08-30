(function() {
    'use strict';

    angular
        .module('starter')
        .controller('ComponentsCtrl', ComponentsCtrl);

    ComponentsCtrl.$inject = ['$stateParams', 'ionicMaterialInk'];

    function ComponentsCtrl($stateParams, ionicMaterialInk) {
        var vm = this;


        activate();

        ////////////////

        function activate() {}

        ionicMaterialInk.displayEffect();

        // Toggle Code Wrapper
        var code = document.getElementsByClassName('code-wrapper');
        for (var i = 0; i < code.length; i++) {
            code[i].addEventListener('click', function() {
                this.classList.toggle('active');
            });
        }
    }
})();