angular.module('starter.controllers')
.controller('Login', function($scope,Memory,Message,$timeout,$http,$ionicViewSwitcher,$state,$rootScope,Usuario,socket) {
	
	$scope.$on('$ionicView.beforeEnter',function(){
			
		if(Memory.get("Usuario")){
				$ionicViewSwitcher.nextTransition("none");
				$ionicViewSwitcher.nextDirection('enter');
				$state.go('app.home.mapa');
				
		}
		$scope.login={
			Correo:"",
			Contrasena:""	
		}
	})
	
	$scope.$on('$ionicView.afterEnter',function(){
            if(!Memory.get("Usuario"))
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
			
			
    })
	//Variable: almacena los datos proporcionados por el cliente.
	$scope.login={
		Correo:"",
		Contrasena:""	
	}
	
	//Funcion: revisa si se preciona enter en el teclado para realizar accion dependiendo del campo en el que se encuentre.
	$scope.enter=function(event,field){
		//verificar si se preciono enter
		if(event.keyCode==13){
			//verificar en que campo se encuentra
			switch(field){
				case 1://Email
					document.getElementById("login_contrasena").focus();
				break;
				case 2://Password
					if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
            		$scope.iniciaSesion()
				break;
			}
		}
	}
	
	
	
	//Funcion: enviar datos al servidor y validar credenciales
	$scope.iniciaSesion=function(){
		if(!$scope.login.Correo || $scope.login.Contrasena.length<8)Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.Login[7],function(){});
		else{
			Message.showLoading($rootScope.idioma.Login[8]);
			Memory.clean();
			var us=Usuario.login($scope.login)
			if(us){
			us.success(function(data){
				
				if (data.error){
					Message.hideLoading();
					Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.Login[7],function(){
					$scope.login.Contrasena="";
					});
				}else{
					$rootScope.Usuario=data;
					$timeout(function(){
						Message.hideLoading();
						$ionicViewSwitcher.nextDirection('forward');
						$state.go('app.home.mapa');
					},500)
				}
				
			})
			.error(function(){
				Message.hideLoading();
				Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.General[7],function(){
				});
				
			})
			}else{
				Message.hideLoading();
				Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.General[7],function(){
				});
			}
		}
	}
})