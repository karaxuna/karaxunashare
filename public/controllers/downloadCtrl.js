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
					file.data = null;
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
						scope.$apply(function(){
							file.downloaded += arraybuffer.byteLength;
							
							if(file.downloaded === file.size)
								file.data = new Blob(buffers, { type: 'application/octet-binary' });
						});
					});
				});
			});
		};

		scope.save = function (file){
			var url = URL.createObjectURL(file.data);
			var a = document.createElement('a');
			a.download = file.name;
			a.href = url;
			document.body.appendChild(a);
			a.click();
			a.parentNode.removeChild(a);
		};

	}
]);