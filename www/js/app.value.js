(function() {
    'use strict';

    angular.module('starter')
        .value('user', {
            get: function() {
                var basil = new window.Basil({ namespace: 'fd', storages: ['session'] });
                return basil.get('user');
            },
            set: function(user) {
                var basil = new window.Basil({ namespace: 'fd', storages: ['session'] });
                basil.set('user', user);
            }
        });
})();