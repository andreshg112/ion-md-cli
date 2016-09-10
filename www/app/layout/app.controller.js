(function() {
    'use strict';

    angular
        .module('starter')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$ionicPopover', 'user', '$state', '$timeout', '$ionicHistory'];

    function AppController($scope, $ionicPopover, user, $state, $timeout, $ionicHistory) {
        var vm = this;
        vm.cerrarSesion = cerrarSesion;
        vm.user = user.get();

        activate();

        ////////////////

        function activate() {}

        // Form data for the login modal
        //$scope.loginData = {};

        function cerrarSesion() {
            user.set(null);
            $timeout(function() {
                vm.closePopover();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            }, 30);
            $state.go('login', null, { reload: true });
        }

        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        }

        $ionicPopover.fromTemplateUrl('app/layout/popover.html', {
            scope: $scope
        }).then(function(popover) {
            vm.popover = popover;
        });

        vm.openPopover = function($event) {
            vm.popover.show($event);
        };
        vm.closePopover = function() {
            vm.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            vm.popover.remove();
        });
    }
})();