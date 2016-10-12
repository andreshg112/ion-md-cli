(function () {
    'use strict';

    angular
        .module('app.vendedor')
        .controller('HistorialPedidosController', HistorialPedidosController);

    HistorialPedidosController.$inject = ['ionicMaterialInk', 'Restangular', '$ionicLoading', 'ionicToast', '$scope', 'user', 'ionicDatePicker'];

    function HistorialPedidosController(ionicMaterialInk, Restangular, $ionicLoading, ionicToast, $scope, user, ionicDatePicker) {
        Restangular.setDefaultRequestParams({ token: user.get().token });
        var vm = this;
        var fechaInicial = {
            callback: function (val) {
                vm.fecha_inicial = fechaYYYYMMDD(new Date(val));
                cargarPedidosEnviadosDia();
            }
        };
        var loading = {
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        };
        var pedidos = Restangular.all('pedidos');

        //
        vm.cargarDatos = cargarDatos;
        vm.getValorPedidos = getValorPedidos;
        vm.seleccionarFechaInicial = seleccionarFechaInicial;

        activate();

        ////////////////

        ionicMaterialInk.displayEffect();

        function activate() {
            vm.fecha_inicial = fechaYYYYMMDD(new Date());
            vm.pedidos = [];
            cargarEstablecimientos();
            cargarDatos();
        }

        function cargarDatos() {
            cargarPedidosEnviadosDia();
        }

        function cargarEstablecimientos() {
            vm.establecimientos = user.get().administrador.establecimientos;
            vm.establecimientoSeleccionado = (!!vm.establecimientos)
                ? vm.establecimientos[0] : {};
        }

        function cargarPedidosEnviadosDia() {
            $ionicLoading.show(loading);
            var establecimientoId = (!vm.establecimientoSeleccionado) ? null : vm.establecimientoSeleccionado.id;
            var sedeId = (!vm.sedeSeleccionada) ? null : vm.sedeSeleccionada.id;
            vm.pedidos = [];
            pedidos.getList(
                {
                    enviado: 1,
                    establecimiento_id: establecimientoId,
                    sede_id: sedeId,
                    fecha_inicial: vm.fecha_inicial
                }
            ).then(function (data) {
                if (data.length > 0) {
                    vm.pedidos = data;
                }
            })
                .catch(function (error) {
                    var mensaje = String.format('Error: {0} {1}', error.status, error.statusText);
                    ionicToast.show(mensaje, 'top', true, 3000);
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        }

        function getValorPedidos() {
            return sumarElementosArray(getPropertyInArrayObject(vm.pedidos, 'total'));
        }

        function seleccionarFechaInicial() {
            ionicDatePicker.openDatePicker(fechaInicial);
        }
    }
})();