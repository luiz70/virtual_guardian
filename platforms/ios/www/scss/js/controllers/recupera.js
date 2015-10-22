angular.module('starter')
.controller("recupera",function($scope,$http,$location,$ionicSlideBoxDelegate,$timeout,$rootScope){
	
	$scope.emailrec="";
	$scope.regresar=function(){
		$location.path('/login');
	}
	$scope.continuarRec=function(){
		$scope.emailrec=$("#emrec").val();
		if($scope.emailrec=="")$rootScope.alert($scope.idioma.registro[26],$scope.idioma.registro[25],function(){});
		else if(!$scope.evalid($scope.emailrec)) $rootScope.alert($scope.idioma.registro[26],$scope.idioma.registro[10],function(){});
		else{
		$rootScope.showCargando($scope.idioma.general[1]);
		$http.post("https://www.virtual-guardian.com/api/recupera",{
				Correo:$scope.emailrec,
				})
		.success(function(data,status,header,config){
			$rootScope.hideCargando();
			if(data==1){
				$rootScope.alert($scope.idioma.registro[26],$scope.idioma.registro[28],function(){$location.path('/login');});
				
			}else if(data==0)$rootScope.alert($scope.idioma.registro[26],$scope.idioma.registro[27],function(){});
			else if(data==2)$rootScope.alert($scope.idioma.registro[26],$scope.idioma.registro[16],function(){});
			})
		.error(function(error,status,header,config){
			$rootScope.alert($scope.idioma.registro[26],$scope.idioma.registro[16],function(){});
			})
		}
	}
	
	
	
})
	
	
	