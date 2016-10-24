(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReporteGraficasController', ReporteGraficasController);

    ReporteGraficasController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast', 'ionicDatePicker'];

    function ReporteGraficasController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast, ionicDatePicker) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var establecimientos = Restangular.all('establecimientos');
        var fechaInicial = {
            callback: function (val) {
                vm.fechaInicial = fechaYYYYMMDD(new Date(val));
                cargarDatos();
            }
        };
        var fechaFinal = {
            callback: function (val) {
                vm.fechaFinal = fechaYYYYMMDD(new Date(val));
                cargarDatos();
            }
        };
        var loading = { template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>' };

        vm.cargarDatos = cargarDatos;
        vm.getTotalClientesPorGenero = getTotalClientesPorGenero;
        vm.getTotalPedidosDiaSemana = getTotalPedidosDiaSemana;
        vm.getTotalPedidosDiaLapso = getTotalPedidosDiaLapso;
        vm.seleccionarFechaInicial = seleccionarFechaInicial;
        vm.seleccionarFechaFinal = seleccionarFechaFinal;
        vm.getTotalValorPorDia = getTotalValorPorDia;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            var hoy = new Date();
            vm.fechaInicial = fechaYYYYMMDD(new Date(
                hoy.getFullYear(),
                hoy.getMonth() - 1,
                hoy.getDate()
            ));
            vm.fechaFinal = fechaYYYYMMDD(hoy);
            cargarEstablecimientos();
            cargarDatos();
        }

        function cargarDatos() {
            cargarPedidosDiaSemana();
            cargarPedidosDiaLapso();
            cargarClientesPorGenero();
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
            vm.establecimientoSeleccionado = (!!vm.establecimientos)
                ? vm.establecimientos[0] : {};
        }

        function cargarPedidosDiaLapso() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('pedidos-por-dia-en-lapso',
                {
                    establecimiento_id: establecimientoId,
                    sede_id: sedeId,
                    fecha_inicial: vm.fechaInicial,
                    fecha_final: vm.fechaFinal
                }).then(function (data) {
                    if (data.length > 0) {
                        vm.pedidosDiaLapso.labels = getPropertyInArrayObject(data, 'fecha');
                        vm.pedidosDiaLapso.data = [getPropertyInArrayObject(data, 'pedidos_enviados')];
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

        function getTotalClientesPorGenero() {
            return sumarElementosArray(vm.clientesPorGenero.data);
        }

        function getTotalPedidosDiaLapso() {
            return sumarElementosArray(vm.pedidosDiaLapso.data[0]);
        }

        function getTotalPedidosDiaSemana() {
            return sumarElementosArray(vm.pedidosDiaSemana.data);
        }

        function getTotalValorPorDia() {
            return sumarElementosArray(vm.valorPorDia.data[0]);
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
                options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
            };
            vm.pedidosDiaSemana = {
                data: [],
                labels: [],
                series: ['Domicilios'],
                options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
            };
            vm.valorPorDia = {
                data: [],
                labels: [],
                series: ['Domicilios'],
                options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
            };
        }

        function seleccionarFechaInicial() {
            ionicDatePicker.openDatePicker(fechaInicial);
        }

        function seleccionarFechaFinal() {
            ionicDatePicker.openDatePicker(fechaFinal);
        }
    }
})();