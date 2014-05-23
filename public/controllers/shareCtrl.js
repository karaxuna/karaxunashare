angular.module('app.controllers').controller('shareCtrl', ['$scope', 'socketSrvc', 'peerSrvc', 
	function(scope, socketSrvc, peerSrvc){

		scope.files = [];
		scope.bpi = 50000; // bytes per interval
		scope.interval = 1000; // 1 second

		peerSrvc.peer.provider.on('info:request', function(e){
			peerSrvc.peer.provider.send('info:response', e.from, { files: scope.files }, angular.noop);
		});

		peerSrvc.on('offer', function(data){
			peerSrvc.accept(data, [], function(err, con){

				con.on('channel', function(channel){

					con.on('data', function(name){
						var file = utils.findOne(scope.files, { name: name });
						var datas = file.data;
						var index = 0;

						setTimeout(function send(){
							var chunk;

							if(index + scope.bpi >= datas.byteLength)
								chunk = datas.slice(index, index + datas.byteLength - index);
							else
								chunk = datas.slice(index, index + scope.bpi);

							if(chunk.byteLength){
								channel.send(chunk);

								if(chunk.byteLength === scope.bpi){
									index += scope.bpi;
									setTimeout(send, scope.interval);
								}
							}
						}, scope.interval);
					});
					
				});
			});
		});

	}
]);