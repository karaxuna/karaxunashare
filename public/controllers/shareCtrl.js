angular.module('app.controllers').controller('shareCtrl', ['$scope', 'socketSrvc', 'peerSrvc', 
	function(scope, socketSrvc, peerSrvc){

		scope.files = [];

		peerSrvc.peer.provider.on('info:request', function(e){
			peerSrvc.peer.provider.send('info:response', e.from, { files: scope.files }, angular.noop);
		});

		peerSrvc.on('offer', function(data){
			peerSrvc.accept(data, [], function(err, con){

				con.on('channel', function(channel){

					con.on('data', function(name){
						var file = utils.findOne(scope.files, { name: name });
						channel.send(file.data);
					});
					
				});

				//con.on('channel', function(channel){
				//	var file = scope.file,
				//		i = 0,
				//		chunkSize = 50000,
				//		interval = 1000;
//
				//	// send info
				//	channel.send(JSON.stringify({
				//		size: file.size,
				//		name: file.name
				//	}));
//
				//	// send chunks
				//	setTimeout(function send(){
//
				//		setTimeout(send, interval);
				//		i++;
//
				//	}, interval);
				//	
				//});
			});
		});

	}
]);