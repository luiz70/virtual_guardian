angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope,$rootScope,Memory,$state,$ionicViewSwitcher,$http,$cordovaDevice) {
	//inicializa usuario
	$rootScope.Usuario=Memory.get("Usuario");
	//console.log($cordovaDevice.getUUID())
	$http.defaults.headers.common.accessToken = $rootScope.Usuario?$rootScope.Usuario.Token:'-';
	if(!$rootScope.Usuario && $state.current.name.indexOf("registro")<0 &&  $state.current.name.indexOf("login")<0 && $state.current.name.indexOf("recuperar")<0){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.login")	
	}
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		var state=toState.name
		if(state.indexOf("registro")<0 && state.indexOf("login")<0 && state.indexOf("recuperar")<0){
			//no va a login o registro
			if(!$rootScope.Usuario){
				event.preventDefault();	
			}
		}
	})
	/*if(!$rootScope.Usuario){
			$state.go("app.login")
	}
	$scope.$on('$locationChangeStart', function(event, next, current) {
		if(!next.indexOf("registro") && !next.indexOf("recuperar")){
		$rootScope.Usuario=Memory.get("Usuario");
    	if(!$rootScope.Usuario){
			$state.go("app.login")
		}else{
			if(next.indexOf("login")>=0){
				event.preventDefault();
			}
			
		}
		}
	});*/
	
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

.controller('Login', function($scope,Memory,Message,$timeout,$http) {
	/*$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/recuperacion', data: {Correo:"a00225979@itesm.mx",Codigo:"KNH3B"}})

	.success(function(data){
	console.log(data);
	})
	.error(function(data,error){
		
	})	 */
            
	$scope.$on('$ionicView.afterEnter',function(){
            $timeout(function() {
                if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 500);
    })
	//Variable: almacena los datos proporcionados por el cliente.
	$scope.login={
		email:"",
		password:""	
	}
	$scope.registro="app.registro.datos"
	//if(Memory.get("Registro"))$scope.registro="app.registro.codigo"
		
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
