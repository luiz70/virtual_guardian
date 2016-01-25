angular.module('starter.controllers')
.controller('Auto', function($scope,$rootScope,Auto,Message,Eventos) {
	$scope.idioma=$rootScope.idioma
	$scope.auto=$rootScope.auto;
	$scope.guardaAuto=function(){
		$rootScope.auto.posicionando=false;
		$rootScope.auto.activo=true;
		$rootScope.controls[2].activo=true;
		Message.hideModal();
	}
	$scope.cierraModal=function(){
		Message.hideModal();
	}
})
