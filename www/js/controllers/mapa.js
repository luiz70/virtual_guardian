angular.module('starter')
.controller("mapa",function($scope,$rootScope,$http,$ionicPopover,$timeout,$window,$ionicScrollDelegate,$interval,$cordovaNetwork){
	//VARIABLES
	$scope.radio=$rootScope.Usuario.Rango;
	$scope.mapLoaded=false;
	//funciones
	$scope.createMap=function(){
      
	}
	//$scope.
	$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
		alert(networkState);
		})
		$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
		alert(networkState);
		})
})
