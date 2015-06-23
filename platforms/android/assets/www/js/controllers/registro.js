angular.module('starter')
.controller("reg",function($scope){
$(".input_registro").focusin(function(e) {
        	$(".input_registro").css("font-size",$(".input_registro").css("font-size"))
			$(".input_registro").css("margin-top",$(".input_registro").css("margin-top"))
			  
});
})
.controller("registro",function($scope,$http,$location,$ionicSlideBoxDelegate,$timeout,$rootScope){
	//window.localStorage.removeItem("Registro");
	$timeout(function(){ 
		$ionicSlideBoxDelegate.enableSlide(false);
		if(window.localStorage.getArray("Registro")){
			$ionicSlideBoxDelegate.slide(1,1);
			$scope.nuser=window.localStorage.getArray("Registro");
		}
	},300);
	
	$scope.nuser={
		email:"",
		pass:"",
		passc:"",
		codigo:"",
		promo:""
		}
	$scope.slideHasChangedr=function($index){
		$("#rpaso1").removeClass("ractivo");
		$("#rpaso2").removeClass("ractivo");
		$("#rpaso3").removeClass("ractivo");
		var i=$index+1;
		$("#rpaso"+i).addClass("ractivo");
	}
	$scope.regresar=function(){
		switch($ionicSlideBoxDelegate.currentIndex()){
		case 0: $location.path('/login');
		break;
		case 1: $ionicSlideBoxDelegate.slide(0,200)
		break;
		case 2:	$ionicSlideBoxDelegate.slide(1,200)
		break;
		}
		//window.localStorage.removeItem("Usuario");
		//$location.path('/login');
	}
		$scope.continuar=function(){
			
		switch($ionicSlideBoxDelegate.currentIndex()){
		case 0: 
		if($scope.nuser.email=="") $rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[9],function(){});
		else if(!$scope.evalid($scope.nuser.email)) $rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[10],function(){});
		else if($scope.nuser.pass=="" || $scope.nuser.pass!=$scope.nuser.passc)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[12],function(){});
		else if(!$scope.validac($scope.nuser.pass)) $rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[11],function(){});
		else{
		$rootScope.showCargando($scope.idioma.general[1]);
		$http.post("http://www.virtual-guardian.com/api/registro",{
				Correo:$scope.nuser.email,
				Contrasena:$scope.nuser.pass,
				Promo:$("#reg_pass3").val(),
				})
		.success(function(data,status,header,config){
			$rootScope.hideCargando();
			if(data==1){
				window.localStorage.setArray("Registro",$scope.nuser);
				$ionicSlideBoxDelegate.slide(1,200);
			}else if(data==0)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[15],function(){});
			else if(data==2)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[16],function(){});
			})
		.error(function(error,status,header,config){
			$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[16],function(){});
			})
		}
		break;
		case 1: if($scope.nuser.codigo.length==5){
		$rootScope.showCargando($scope.idioma.general[1]);
		$http.post("http://www.virtual-guardian.com/api/registro/code",{
				Correo:$scope.nuser.email,
				Codigo:$scope.nuser.codigo
				})
		.success(function(data,status,header,config){
			$rootScope.hideCargando();
			if(data==1){
					$ionicSlideBoxDelegate.slide(2,200);
					window.localStorage.removeItem("Registro");
			}else if(data==2)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[16],function(){});
			else if(data==0)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[17],function(){});
			})
		.error(function(error,status,header,config){
			$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[16],function(){});
			})
		
		}else $rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[17],function(){});
		break;
		case 2:	$location.path('/login');
		break;
		}
	}
	$scope.sendAgain=function(){
		
		$rootScope.showCargando($scope.idioma.general[1]);
		$http.post("http://www.virtual-guardian.com/api/registro/resend",{
				Correo:$scope.nuser.email
				})
		.success(function(data,status,header,config){
			$rootScope.hideCargando();
			if(data==1)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[19],function(){});
			else if(data==0)$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[16],function(){});
			})
		.error(function(error,status,header,config){
			$rootScope.alert($scope.idioma.registro[1],$scope.idioma.registro[16],function(){});
			})
	}
	$scope.cancelarR=function(){
	$http.post("http://www.virtual-guardian.com/api/registro/clean",{
					Correo:$scope.nuser.email
					})
				.success(function(data,status,header,config){
					window.localStorage.removeItem("Registro");
					$location.path('/login');		
		});
		
	}
	$scope.aviso=function(){
	
	}
	$scope.validac=function(pass){
		var re = /[0-9]/;
		var re2 = /[a-z]/;
		var re3 = /[A-Z]/;
		if(pass.lenght<8)return false;
		else if(!re.test(pass))return false;
		else if(!re2.test(pass) && !re3.test(pass))return false;
		else return true;
	}
})
	
	
	