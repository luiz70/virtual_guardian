angular.module('starter')
.controller("ajustes",function($scope,$http,$location,$rootScope){
	$scope.regresaHome=function(){
		$location.path('/inicio');
	}
})
	
	
	