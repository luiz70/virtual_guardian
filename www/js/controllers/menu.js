angular.module('starter.controllers')
.controller('Menu', function($scope,$rootScope,Message) {
	$scope.cerrarSesion=function(){
		Message.confirm($rootScope.idioma.Menu[7],$rootScope.idioma.Login[10],function(res){
			if(res){
				$rootScope.cerrarSesion();
			}
		},null,null,false,true)
	}
})