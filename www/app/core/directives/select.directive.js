(function () {
    'use strict';

    angular
        .module('app')
        .directive('select', select);

    select.$inject = [];
    function select() {
        return {
            restrict: 'E',
            scope: false,
            link: function (scope, ele) {
                ele.on('touchmove touchstart', function (e) {
                    e.stopPropagation();
                })
            }
        }
    }
})();