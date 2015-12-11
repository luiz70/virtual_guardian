angular.module('starter.controllers')
.controller('Login', function($scope,Memory,Message,$timeout,$http,Usuario,$ionicViewSwitcher,Notificaciones,$state,$rootScope) {
	
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Usuario.get()){
				$ionicViewSwitcher.nextTransition("none");
				$ionicViewSwitcher.nextDirection('enter');
				$state.go('app.home.mapa');
		}
	})
	
	$scope.$on('$ionicView.afterEnter',function(){
            $timeout(function() {
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
    })
	//Variable: almacena los datos proporcionados por el cliente.
	$scope.login={
		Correo:"",
		Contrasena:""	
	}
	$scope.registro="app.registro.datos"
	//if(Memory.get("Registro"))$scope.registro="app.registro.codigo"
		
	//Funcion: revisa si se preciona enter en el teclado para realizar accion dependiendo del campo en el que se encuentre.
	$scope.enter=function(event,field){
		//verificar si se preciono enter
		if(event.keyCode==13){
			//verificar en que campo se encuentra
			switch(field){
				case 1://Email
					$("#login_contrasena").focus();
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
			Usuario.login($scope.login)
			.success(function(data){
				Message.hideLoading();
				if (data.error){
					Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.Login[7],function(){
					$scope.login.Contrasena="";
					});
				}else{
					Usuario.set(data);
					$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.home.mapa');
					if(window.cordova)Notificaciones.registra(true);
				}
			})
			.error(function(){
				Message.hideLoading();
				
			})
		}
	}
})