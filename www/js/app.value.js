(function() {
    'use strict';

    angular.module('starter')
        .value('user', {
            get: function() {
                var basil = new window.Basil({ namespace: 'fd', storages: ['session'] });
                var user = basil.get('user');
                //Si no ha iniciado sesión el usuario, o si borraron caché, se le asigna rol ANONIMO.
                if (!user) { user = { rol: 'ANONIMO' } }
                return user;
            },
            set: function(user) {
                var basil = new window.Basil({ namespace: 'fd', storages: ['session'] });
                if (!user) { user = { rol: 'ANONIMO' } }
                basil.set('user', user);
            }
        });
})();
//