angular.module('app.controllers').controller('downloadCtrl', ['$scope', 'socketSrvc', 'peerSrvc', 
	function(scope, socketSrvc, peerSrvc){

		scope.from = '';
		scope.files = [];

		scope.list = function(){
			peerSrvc.peer.provider.send('info:request', scope.from, null, function(){
				console.log(arguments);
			});
		};

		peerSrvc.peer.provider.on('info:response', function(e){
			scope.$apply(function(){
				scope.files = e.data.files.map(function(file){
					file.owner = e.from;
					return file;
				});
			});
		});

		scope.download = function(file){
			peerSrvc.offer(file.owner, [], function(err, con){
				con.on('channel', function(channel){
					channel.send(file.name);

					con.on('data', function(arraybuffer){
						var blob = new Blob([arraybuffer], {type: 'application/octet-binary'});
						var url = URL.createObjectURL(blob);

						var a = document.createElement('a');
						a.download = file.name;
						a.href = url;
						a.click();
					});
				});
			});
		};

	}
]);