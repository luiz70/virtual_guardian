angular.module('starter.controllers')
.controller('Mapa', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,Mapa,uiGmapGoogleMapApi) {
	$scope.mapaCargado=false;
	uiGmapGoogleMapApi.then(function(maps) {
		$scope.mapaCargado=true;
	})
})