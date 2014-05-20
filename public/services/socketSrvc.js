angular.module('app.services').factory('socketSrvc', ['$rootScope', 'socket', function(rootScope, socket) {
    return {
        socket: socket,

        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },

        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                rootScope.$apply(function() {
                    if (callback) callback.apply(socket, args);
                });
            })
        }
    };
}]);