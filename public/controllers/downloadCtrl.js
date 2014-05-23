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
					file.downloaded = 0;
					return file;
				});
			});
		});

		scope.download = function(file){
			peerSrvc.offer(file.owner, [], function(err, con){
				con.on('channel', function(channel){
					channel.send(file.name);
					var buffers = [];

					con.on('data', function(arraybuffer){
						buffers.push(arraybuffer);
						scope.$apply();
						file.downloaded += arraybuffer.byteLength;

						if(file.downloaded === file.size){
							var blob = new Blob(buffers, { type: 'application/octet-binary' });
							downloadBlob(blob, file.name);
						}
					});
				});
			});
		};

		function downloadBlob(blob, name){
			// download blob
			var url = URL.createObjectURL(blob);
			var a = document.createElement('a');
			a.download = name;
			a.href = url;
			document.body.appendChild(a);
			a.click();
			a.parentNode.removeChild(a);
		}

	}
]);