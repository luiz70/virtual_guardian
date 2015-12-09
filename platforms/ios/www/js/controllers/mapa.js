angular.module('starter.controllers')
.controller('Mapa', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,Mapa,uiGmapIsReady,uiGmapMapScriptLoader,$ionicHistory) {
	$scope.mapaCargado=false;
	$scope.googleMaps=Mapa;
	
	
	uiGmapIsReady.promise()
	.then(function(maps){
		$scope.mapaCargado=true;
		$ionicHistory.clearHistory();
		//$scope.boun={sw:{latitude:maps[0].map.getBounds().getSouthWest().lat(),longitude:maps[0].map.getBounds().getSouthWest().lng()},
		//ne:{latitude:maps[0].map.getBounds().getNorthEast().lat(),longitude:maps[0].map.getBounds().getNorthEast().lng()}}
		//$scope.$apply(function(){})
		console.log($scope.bounds);
		console.log(maps[0].map.getBounds().getNorthEast().lat()+","+maps[0].map.getBounds().getNorthEast().lng())
		console.log(maps[0].map.getBounds().getSouthWest().lat()+","+maps[0].map.getBounds().getSouthWest().lng())
	})
})
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
}
})