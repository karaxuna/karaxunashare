angular.module('app.directives').directive('cdFile', [function(){
	return {
		restrict: 'E',
		templateUrl: '/directives/file/file.html',
		replace: true,
		require: 'ngModel',
		scope: {
			files: '=ngModel'
		},

		link: function(scope, element, attrs, ngModel){
			element.find('button').click(function(){
				element.find('input').click();
			});

			scope.onchange = function(){
				async.parallel(utils.toArray(this.files).map(function(file){
					return function(callback){
						var reader = new FileReader();
						reader.onload = function(e){
							callback(null, {
								name: file.name,
								size: file.size,
								data: e.target.result
							});
						};
						reader.onerror = callback;
						reader.readAsArrayBuffer(file);
					};
				}),
				function(err, files){
				    if(err)
				    	console.error(err);
				    else
				    	scope.$apply(function(){
				    		ngModel.$setViewValue(files);
				    	});
				});
			};
		}
	};
}]);