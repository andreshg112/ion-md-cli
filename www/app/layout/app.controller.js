(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$ionicPopover', 'user', '$state', '$timeout', '$ionicHistory', 'Restangular', 'ionicToast', '$ionicSideMenuDelegate'];

    function AppController($scope, $ionicPopover, user, $state, $timeout, $ionicHistory, Restangular, ionicToast, $ionicSideMenuDelegate) {
        Restangular.setDefaultRequestParams({ token: user.get().token });

        var vm = this;

        vm.clientesCumpliendo = []; //Para el administrador 
        vm.cerrarSesion = cerrarSesion;
        vm.user = user.get();

        activate();

        ////////////////

        function activate() {
            if (user.get().rol == 'ADMIN') {
                cargarClientesCumpliendo();
            }
        }

        function cargarClientesCumpliendo() {
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('clientes', { cumpleanos: true })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.clientesCumpliendo = data;
                    }
                })
                .catch(function (error) {
                    var mensaje = String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                });
        }

        function cerrarSesion() {
            user.set(null);
            ClientesService.clear();
            $timeout(function () {
                vm.closePopover();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
            }, 30);
            $state.go('login', null, { reload: true });
        }

        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        }

        $ionicPopover.fromTemplateUrl('app/layout/popover.html', {
            scope: $scope
        }).then(function (popover) {
            vm.popover = popover;
        });

        vm.openPopover = function ($event) {
            vm.popover.show($event);
        };

        vm.closePopover = function () {
            vm.popover.hide();
        };

        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
            vm.popover.remove();
        });

        $scope.$on('$ionicView.enter', function () {
            $ionicSideMenuDelegate.canDragContent(false);
        });
        /*$scope.$on('$ionicView.leave', function () {
            $ionicSideMenuDelegate.canDragContent(true);
        });*/
    }
})();