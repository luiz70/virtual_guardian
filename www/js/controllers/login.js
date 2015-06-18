angular.module('starter')
.controller("login",function($scope,$http,$rootScope,CordovaNetwork,$location){
	
	$scope.email="";
	$scope.contrasena="";
	$scope.iniciaSesion=function(){
	/*CordovaNetwork.isOnline(true).then(function(isConnected) {
   		 if(isConnected){*/
			 $scope.StartSesion();
		 /*} else $rootScope.alert($rootScope.idioma.general[3],$rootScope.idioma.general[4],function(){});
  			}).catch(function(err){
				console.log(err);
   			 $scope.StartSesion();
  			});*/
            
	}
            $scope.enterapp=function(event){
            if(event.keyCode==13){
            $rootScope.keycover=false;
            cordova.plugins.Keyboard.close();
            $scope.iniciaSesion()
            }
            }
	$("input").focusin(function(e) {
    	$("#log_email").css("font-size",$("#log_email").css("font-size"))
		$("#log_contrasena").css("font-size",$("#log_contrasena").css("font-size"))
                       
	});
	$scope.StartSesion=function(){
		$rootScope.cleanMemory();
		if(!$scope.email || $scope.contrasena.length<6)$rootScope.alert($rootScope.idioma.login[1],$rootScope.idioma.login[7],function(){});
		else {
		$scope.showCargando($scope.idioma.login[8]);
			$http.post("http://www.virtual-guardian.com/api/login",{
				correo:$scope.email,
				contra:$scope.contrasena
				})
		.success(function(data,status,header,config){
			//$scope.email="";
			console.log(data);
			$scope.contrasena="";
				$scope.hideCargando();
				if(data.Id){
				$rootScope.Usuario=data;
				window.localStorage.setArray("Usuario",data);
				window.localStorage.removeItem("Filtros");
				$location.path('/inicio');
                 $rootScope.front=true;
                 $rootScope.sinMapa=false;
                 if(window.localStorage.getArray("nPendientes")) $rootScope.notPendientes=window.localStorage.getArray("nPendientes");
                 else $rootScope.notPendientes=0;
                 $rootScope.tabInicial=1;
                 $rootScope.iOS=(window.device.platform=="iOS");
				if(window.device.platform=="Android" || window.device.platform=="android" )$rootScope.registraAndroid();	
				else if(window.device.platform=="iOS")$rootScope.registraiOS();
				}else $rootScope.alert($rootScope.idioma.login[1],$rootScope.idioma.login[7],function(){});
			})
		.error(function(error,status,header,config){
			//CAmbiar este texto es el de not match
			$scope.hideCargando();
			$rootScope.alert($rootScope.idioma.login[1],$rootScope.idioma.login[7],function(){});
			})
		 
		
		}
	
	}
	$scope.registra=function(){
		
		$location.path('/registro');
		//$ionicHistory.clearCache();
	}
	$scope.recupera=function(){
            $location.path('/recuperar');
	}
	
})
	
	/*$scope.iniciaSesion=function(){
		var tx="";
		if(!$scope.email || $scope.contrasena.length<6)alert($scope.$parent.idioma.login[7]);
		else{
			$http.post("http://jsonplaceholder.typicode.com/posts",{
			title:"hola",
			body:"hola",
			userId:1
			})
			.success(function(data,status,header,config){
			alert(1);
			})
		.error(function(error,status,header,config){
			alert(2);"http://www.virtual-guardian.com/movil/api.php"
			})
	$http.post("http://jsonplaceholder.typicode.com/posts",{
		title:"hola",
			body:"hola",
			userId:1
		})
		.success(function(data){
			alert(data);
		})
		.error(function(error){
		console.log(error);
		})
	
		
		}
	}
	
})*/