angular.module('starter.controllers')
.controller('Mapa', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,Mapa,uiGmapIsReady,uiGmapMapScriptLoader) {
	$scope.mapaCargado=false;
	$scope.googleMaps=Mapa;
	uiGmapIsReady.promise()
	.then(function(maps){
		$scope.mapaCargado=true;
		
	})
})