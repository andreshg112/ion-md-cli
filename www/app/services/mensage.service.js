(function () {
    'use strict';

    angular
        .module('starter')
        .factory('MensageService', MensageService);

    MensageService.$inject = ['$http', 'user', 'Restangular'];
    function MensageService($http, user, Restangular) {

        var service = {
            enviarMensaje: enviarMensaje,
        };

        return service;

        ///////////////

        /*function enviarMensaje(dest, msg) {
            var req = {
                method: 'POST',
                url: 'http://panel.smasivos.com/api.envio.new.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    apikey: '8d8f85de70729f67238d14f4dff1188d687d2565',
                    numregion: 57,
                    numcelular: dest,
                    mensaje: msg,
                    sandbox: 1
                },
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            };
            return $http(req);
        }*/

        function codificarXWWW(obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }

        function enviarMensaje(dest, msg) {
            var data = {
                apikey: '8d8f85de70729f67238d14f4dff1188d687d2565',
                numregion: 57,
                numcelular: dest,
                mensaje: msg,
                sandbox: 1
            };
            var dataEncoded = codificarXWWW(data);
            return Restangular.oneUrl('apiSms', 'http://panel.smasivos.com/api.envio.new.php')
                .customPOST(
                dataEncoded,
                undefined, // put your path here
                undefined, // params here, e.g. {format: "json"}
                { 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8" }
                );
        }

    }
})();