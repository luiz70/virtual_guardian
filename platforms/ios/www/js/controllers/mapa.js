angular.module('starter.controllers')
.controller('Mapa', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,Mapa,uiGmapIsReady,uiGmapMapScriptLoader,$ionicHistory) {
	$scope.mapaCargado=false;
	$scope.googleMaps=Mapa;
	uiGmapIsReady.promise()
	.then(function(maps){
		$scope.mapaCargado=true;
          $ionicHistory.clearHistory();
		
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