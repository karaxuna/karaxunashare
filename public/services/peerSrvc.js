angular.module('app.services').factory('peerSrvc', ['$rootScope', 'socket', function(rootScope, socket) {
    var peer = new RTCPeer({}, socket);

    return {
        peer: peer,

        on: function(eventName, callback) {
            peer.on(eventName, function() {
                var args = arguments;
                rootScope.$apply(function() {
                    callback.apply(peer, args);
                });
            });
        },

        offer: function(to, streams, callback){
            peer.offer.apply(peer, arguments);
        },

        accept: function(){
            peer.accept.apply(peer, arguments);
        }
    };
}]);