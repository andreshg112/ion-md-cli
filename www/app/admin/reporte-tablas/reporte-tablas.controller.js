(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReporteTablasController', ReporteTablasController);

    ReporteTablasController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', '$ionicModal', 'user', 'ionicToast', 'ionicDatePicker'];

    function ReporteTablasController(ionicMaterialInk, Restangular, $ionicLoading, $ionicModal, user, ionicToast, ionicDatePicker) {
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
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };

        vm.cargarDatos = cargarDatos;
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
            cargarPedidosDiaLapso();
            cargarValorPorDia();
        }

        function cargarEstablecimientos() {
            vm.establecimientos = user.get().administrador.establecimientos;
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
                    vm.pedidosDiaLapso = data;
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

        function cargarValorPorDia() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            Restangular.one('administradores', user.get().administrador.id)
                .customGET('valor-pedidos-por-dia',
                {
                    establecimiento_id: establecimientoId,
                    sede_id: sedeId,
                    fecha_inicial: vm.fechaInicial,
                    fecha_final: vm.fechaFinal
                }).then(function (data) {
                    vm.valorPorDia = data;
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

        function getTotalPedidosDiaLapso() {
            return sumarElementosArray(getPropertyInArrayObject(vm.pedidosDiaLapso, 'pedidos_enviados'));
        }

        function getTotalValorPorDia(params) {
            return sumarElementosArray(getPropertyInArrayObject(vm.valorPorDia, 'valor'));
        }

        function seleccionarFechaInicial() {
            ionicDatePicker.openDatePicker(fechaInicial);
        }

        function seleccionarFechaFinal() {
            ionicDatePicker.openDatePicker(fechaFinal);
        }
    }
})();