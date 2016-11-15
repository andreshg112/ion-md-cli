(function () {
    'use strict';

    angular
        .module('app')
        .service('ClientesService', ClientesService);

    ClientesService.$inject = ['Restangular'];
    function ClientesService(Restangular) {
        var basil = new window.Basil({ namespace: 'fd', storages: ['session'] }),
            clientes = Restangular.all('clientes');

        this.add = add;
        this.all = all;
        this.clear = clear;

        ////////////////

        function add(cliente) {
            var listaClientes = basil.get('clientes');
            if (listaClientes) {
                listaClientes.push(cliente);
                basil.set('clientes', listaClientes);
            }
        }

        function all(administradorId) {
            return new Promise(
                // La función de resolución se llama con la capacidad de  
                // resolver o rechzar la promesa
                function (resolve, reject) {
                    var listaClientes = basil.get('clientes');
                    if (!listaClientes) {
                        clientes.getList({
                            administrador_id: administradorId
                        }).then(function (data) {
                            basil.set('clientes', data);
                            resolve(data);
                        }).catch(function (error) {
                            reject(error);
                        });
                    } else {
                        resolve(listaClientes);
                    }
                });
        }

        function clear() {
            basil.remove('clientes');
        }
    }
})();