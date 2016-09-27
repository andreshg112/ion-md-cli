(function () {
    'use strict';

    angular
        .module('starter')
        .controller('ReporteGeneralController', ReporteGeneralController);

    ReporteGeneralController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast'];

    function ReporteGeneralController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var establecimientos = Restangular.all('establecimientos');
        var loading = { template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' };

        vm.cargarDatos = cargarDatos;
        vm.getTotalClientesPorGenero = getTotalClientesPorGenero;
        vm.getTotalPedidosDiaSemana = getTotalPedidosDiaSemana;
        vm.getTotalPedidosDiaLapso = getTotalPedidosDiaLapso;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            cargarEstablecimientos();
            cargarDatos();
        }

        function cargarDatos() {
            cargarPedidosDiaSemana();
            cargarPedidosDiaLapso();
            cargarClientesPorGenero();
            cargarValorPorDia();
            inicializarCharts();
        }

        function cargarClientesPorGenero() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('clientes-por-genero', { establecimiento_id: establecimientoId, sede_id: sedeId })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.clientesPorGenero.labels = getPropertyInArrayObject(data, 'genero');
                        vm.clientesPorGenero.data = getPropertyInArrayObject(data, 'cantidad');
                    }
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function cargarEstablecimientos() {
            vm.establecimientos = user.get().administrador.establecimientos;
        }

        function cargarPedidosDiaLapso() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('pedidos-por-dia-en-lapso', { establecimiento_id: establecimientoId, sede_id: sedeId })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.pedidosDiaLapso.labels = getPropertyInArrayObject(data, 'fecha');
                        vm.pedidosDiaLapso.data = [getPropertyInArrayObject(data, 'pedidos_enviados')];
                    }
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function cargarPedidosDiaSemana() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('pedidos-dia-semana', { establecimiento_id: establecimientoId, sede_id: sedeId })
                .then(function (data) {
                    vm.pedidosDiaSemana.labels = Object.keys(data.result);
                    vm.pedidosDiaSemana.data = getObjectValues(data.result);
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('Error: {0} {1}', error.status, error.statusText);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function cargarValorPorDia() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('valor-pedidos-por-dia', { establecimiento_id: establecimientoId, sede_id: sedeId })
                .then(function (data) {
                    if (data.length > 0) {
                        vm.valorPorDia.labels = getPropertyInArrayObject(data, 'fecha');
                        vm.valorPorDia.data = [parseIntArray(getPropertyInArrayObject(data, 'valor'))];
                    }
                })
                .catch(function (error) {
                    var mensaje = (!error.status) ? error :
                        String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'middle', true, 2000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function getTotalPedidosDiaSemana() {
            return sumarElementosArray(vm.pedidosDiaSemana.data);
        }

        function getTotalPedidosDiaLapso() {
            return sumarElementosArray(vm.pedidosDiaLapso.data[0]);
        }

        function getTotalClientesPorGenero() {
            return sumarElementosArray(vm.clientesPorGenero.data);
        }

        function inicializarCharts() {
            vm.clientesPorGenero = {
                data: [],
                labels: []
            };
            vm.pedidosDiaLapso = {
                data: [],
                labels: [],
                series: ['Domicilios'],
                options: {
                    scales: {
                        yAxes: [{
                            ticks: { beginAtZero: true, stepSize: 1 }
                        }]
                    }
                }
            };
            vm.pedidosDiaSemana = {
                data: [],
                labels: [],
                series: ['Domicilios'],
                options: {
                    scales: {
                        yAxes: [{
                            ticks: { beginAtZero: true, stepSize: 1 }
                        }]
                    }
                }
            };
            vm.valorPorDia = {
                data: [],
                labels: [],
                series: ['Domicilios'],
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                /*stepSize: function () {
                                    return vm.valorPorDia.data / 10;
                                }*/
                            }
                        }]
                    }
                }
            };
        }
    }
})();