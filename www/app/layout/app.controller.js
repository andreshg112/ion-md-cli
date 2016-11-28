(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$ionicPopover', 'user', '$state', '$timeout', '$ionicHistory', 'Restangular', '$ionicSideMenuDelegate', 'ClientesService', 'API', 'toastr', '$sessionStorage'];

    function AppController($scope, $ionicPopover, user, $state, $timeout, $ionicHistory, Restangular, $ionicSideMenuDelegate, ClientesService, API, toastr, $sessionStorage) {
        Restangular.setDefaultRequestParams({ token: user.get().token });

        var vm = this;

        vm.API = API;
        vm.clientesCumpliendo = []; //Para el administrador 
        vm.cerrarSesion = cerrarSesion;
        vm.user = user.get();
        vm.$sStorage = $sessionStorage.$default({
            productos: []
        });


        activate();

        ////////////////

        function activate() {
            if (user.get().rol == 'ADMIN') {
                cargarClientesCumpliendo(user.get().administrador.id);
            } else if (user.get().rol == 'VENDEDOR') {
                cargarClientesCumpliendo(user.get().vendedor.sede.establecimiento.administrador_id);
                cargarProductos();
            }
        }

        function cargarClientesCumpliendo(administradorId) {
            Restangular.one('administradores', administradorId)
                .customGET('clientes', { cumpleanos: true })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.clientesCumpliendo = data;
                        toastr.success(String.format('Tienes {0} cliente(s) cumpliendo años hoy. ' +
                            'Haz clic aquí para felicitarlo(s).', data.length), {
                                timeOut: 10000,
                                onTap: function () {
                                    $ionicHistory.nextViewOptions({ disableBack: true });
                                    $state.go('app.cumpleanos');
                                }
                            });
                    }
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('{0} {1}', error.status, error.statusText);
                    toastr.error(mensaje, 'Error', {
                        timeOut: 0
                    });
                });
        }

        function cargarProductos() {
            var toast = toastr.info('Por favor espere.', 'Cargando productos...', { timeOut: 0 });
            Restangular.one('vendedores', user.get().vendedor.id).one('establecimientos', user.get().vendedor.sede.establecimiento.id).getList('productos')
                .then(function (data) {
                    toastr.success('Productos cargados correctamente.', {
                        onShown: function () { toastr.clear(toast); }
                    });
                    vm.$sStorage.productos = data;
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('{0} {1}', error.status, error.statusText);
                    toastr.error(mensaje, 'Error', {
                        timeOut: 0
                    });
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