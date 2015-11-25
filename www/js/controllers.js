angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope,$rootScope,Memory,$state) {
	
	//inicializa usuario
	$rootScope.Usuario=Memory.get("Usuario");
	if(!$rootScope.Usuario){
			$state.go("app.login")
	}
	$scope.$on('$locationChangeStart', function(event, next, current) {
		if(!next.indexOf("registro")){
		$rootScope.Usuario=Memory.get("Usuario");
    	if(!$rootScope.Usuario){
			$state.go("app.login")
		}else{
			if(next.indexOf("login")>=0){
				event.preventDefault();
			}
			
		}
		}
	});
	
	//if(navigator.splashscreen)navigator.splashscreen.hide();
	$scope.cerrarSesion=function(){
		Message.showLoading($scope.idioma.Login[9]);
		
		$timeout(function(){
			Memory.clean();
		$ionicViewSwitcher.nextDirection('back');
		$state.go('app.login')
		Message.hideLoading();
		
		},300)
	}
	$scope.getState=function(name){
		var st = name.split(".")
		return st[st.length-1];
	}
})

.controller('Login', function($scope,Memory,Message) {
	//Variable: almacena los datos proporcionados por el cliente.
	$scope.login={
		email:"",
		password:""	
	}
	//Funcion: revisa si se preciona enter en el teclado para realizar accion dependiendo del campo en el que se encuentre.
	$scope.loginKeyDown=function(event,field){
		//verificar si se preciono enter
		if(event.keyCode==13){
			//verificar en que campo se encuentra
			switch(field){
				case 1://Email
					$("#login_password").focus();
				break;
				case 2://Password
					if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
            		$scope.singIn()
				break;
			}
		}
	}
	
	
	//Funcion: enviar datos al servidor y validar credenciales
	$scope.singIn=function(){
		if(!$scope.login.email || $scope.login.password.length<6)Message.alert($scope.idioma.Login[1],$scope.idioma.Login[7],function(){});
		else{
		Message.showLoading($scope.idioma.Login[8]);
		Memory.clean();
		}
	}
})
.controller('Registro', function($scope,Memory,Message,$state,$ionicViewSwitcher) {
	$scope.nuevoUsuario={
		Correo:"",
		Contrasena:"",
		Contrasena2:"",
		Codigo:"",
		Promocion:""
		}
		$scope.botonSiguiente=$scope.idioma.Registro[7];
		$scope.botonAtras=$scope.idioma.Registro[8];
		$scope.state=$scope.getState($state.current.name)
		$scope.$watch('state', function() {
       		switch($scope.state){
				case "datos":
					$scope.botonSiguiente=$scope.idioma.Registro[7];
					$scope.botonAtras=$scope.idioma.Registro[8];
				break; 
				case "codigo":
					$scope.botonSiguiente=$scope.idioma.Registro[7];
					$scope.botonAtras=$scope.idioma.General[6];
				break;
				case "final":
					$scope.botonSiguiente=$scope.idioma.Registro[21];
				break;
			}
   		});
		
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		$scope.state=$scope.getState(toState.name)
	})
	$scope.siguiente=function(){
		
		switch($scope.state){
			case "datos":
				$ionicViewSwitcher.nextDirection('forward');
				$state.go('app.registro.codigo')
			break; 
			case "codigo":
				$ionicViewSwitcher.nextDirection('forward');
				$state.go('app.registro.final')
			break;
			case "final":
				$ionicViewSwitcher.nextDirection('back');
				$state.go('app.login')
			break;
		}
	}
	$scope.atras=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('app.login')
	}
})
.controller('DashCtrl', function($scope) {
            })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
