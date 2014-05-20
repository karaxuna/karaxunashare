angular.module('app.directives', []);
angular.module('app.services', []);
angular.module('app.controllers', []);
angular.module('app.directives', []);

angular
	.module('app', ['app.directives', 'app.services', 'app.controllers', 'app.directives'])
	.config([function(){
		
	}])
	.run(['$rootScope', 'socket', function(rootScope, socket){
		rootScope.socketId = socket.socket.sessionid;
	}]);

// init
window.addEventListener('load', function(){
	var socket = io.connect();

	socket.on('connect', function(){
		angular.module('app').value('socket', socket);
		angular.bootstrap(document, ['app']);
	});
});