angular.module('starter.controllers')
.controller('Aplicacion', function($scope,$rootScope,Memory,$state,$ionicViewSwitcher,$http,$cordovaDevice,$cordovaNetwork,$ionicHistory,Message,$timeout,Usuario) {
	//Memory.clean();
	//Variable que controla el estado de conexion a internet
	$rootScope.internet={state:true,type:""};
	//inicializa usuario
	$rootScope.Usuario=Memory.get("Usuario");
	
	//$rootScope.iOS=(window.device.platform=="iOS");
	//console.log($cordovaDevice.getUUID())
	
	$http.defaults.headers.common.accessToken = $rootScope.Usuario?$rootScope.Usuario.Token:'-';
	//controla que el usuario este iniciado si quiere visitar una pagina
	if(!$rootScope.Usuario && $state.current.name.indexOf("registro")<0 && $state.current.name.indexOf("login")<0 && $state.current.name.indexOf("recuperar")<0){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.login")	
	}
    //function que se ejecuta cada que hay un cambio de pantalla y limpia el historial para evitar errores con ios
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		//limpia el historial
		$ionicHistory.clearHistory();
    })
	//funcion que se ejecuta cada que inicia un cambio de pantalla y verifica que el usuario tenga permisos para acceder a la seccion deseada
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		//define el nombre del estado a acceder
		var state=toState.name
		//verifica que no se este intentando acceder a los estados libres
		if(state.indexOf("registro")<0 && state.indexOf("login")<0 && state.indexOf("recuperar")<0){
			// si no va a un estado libre verifica que este logeado
			if(!$rootScope.Usuario){
				//si no esta logeado no procede el cambio de estado
				event.preventDefault();	
			}
		}
		//si no es un estado libre y esta loggeado permite el acceso y envia al mapa (inicializa)
		if((state.indexOf("login")>=0 || state.indexOf("recuperar")>=0 || state.indexOf("recuperar")>=0) && $rootScope.Usuario){
			//define el tipo de transicion
			$ionicViewSwitcher.nextTransition("none");
			//define la direccion
			$ionicViewSwitcher.nextDirection('enter');
			//entra al mapa
			$state.go('app.home.mapa');
		}
		//control de direccion en cambio de pestañas
		//si  va a cambiar de mapa a notificaciones el estado entra de la derecha 
        if(fromState.name.indexOf("mapa")>=0 && state.indexOf("notificaciones")>=0)
			$ionicViewSwitcher.nextDirection('forward');
		//si va a cambiar de personas a notificaciones el estado entra de la izquierda por que regresa
        if(fromState.name.indexOf("personas")>=0 && state.indexOf("notificaciones")>=0)
			$ionicViewSwitcher.nextDirection('back');
	})
	//funcion que se ejecuta cada que se cambia de desconectado a conectado del internet
	$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
		//modifica la variable internet para que otras secciones puedan usarla
		$rootScope.internet={state:true,type:networkState};
	})
	//funcion que se ejecuta cada que se cambia de conectado a desconectado del internet
	$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
		//modifica la variable internet para que otras secciones puedan usarla
		$rootScope.internet={state:false,type:networkState};
	})
	//function que se ejecuta cada que cambia el usuario
	$rootScope.$watch('Usuario', function(newValue, oldValue) {
		//guarda las nuevas propiedades del usuario
  		Memory.set("Usuario",newValue)
	});
	//function que se ejecuta cada que se cambia el estado del internet
    $rootScope.$watch('internet', function(newValue, oldValue) {
        //
    });
	//function que se ejecuta al cerrar sesion
	$rootScope.cerrarSesion=function(){
		//muestra mensaje de cerrando sesion
		Message.showLoading($rootScope.idioma.Login[9]);
		//realiza un timeout por diseño
		$timeout(function(){
			//limpia la memoria de la aplicacion
			Memory.set("Usuario",null);
			Usuario.set(null)
			//programa la transicion de salida
			$ionicViewSwitcher.nextDirection('back');
			//cambia a pantalla de login
			$state.go('app.login')
			//oculta el mensaje de cerrando sesion
			Message.hideLoading();
			$rootScope.cerrada=true;
		},300)
	}
	//obtiene el ultimo elemento del nombre del estado
	$scope.getState=function(name){
		//separa el nombre del estado en bloques
		var st = name.split(".")
		//obtiene la ultima parte
		return st[st.length-1];
	}
})
.directive('disable-screen', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      scope.$watch(
        function() {
          return scope.sideMenuContentTranslateX;
        }, function(translateVal) {
        if(Math.abs(translateVal) === 275) {
          !element.hasClass('display') && element.addClass('display');
        } else {
          element.hasClass('display') && element.removeClass('display');
        }
      });
    }
  };
})
.controller('Personas', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk) {
	$scope.Amigos=[
		{ 
		IdUsuario:1,
		Nombre: "Luis",
		Apellido:"bobadilla",
		Matricula:"a00225979"
		},
		{ 
		IdUsuario:2,
		Nombre: "Luis",
		Apellido:"bobadilla",
		Matricula:"a00225979"
		}
	]
	$timeout(function() {
        	// Set Motion
    		ionicMaterialMotion.fadeSlideInRight();
			// Set Ink
    		ionicMaterialInk.displayEffect();
    		}, 200);
	
})
.controller('Notificaciones', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,socket,$rootScope,Message) {
	$scope.notificaciones=[]
	$scope.idioma=$rootScope.idioma;
	socket.getSocket().emit("getNotificaciones",{last:($scope.notificaciones.length>0)?$scope.notificaciones[0].id:0 ,first:($scope.notificaciones.length>0)?$scope.notificaciones[$scope.notificaciones.length-1].id:0});
	socket.getSocket().on("getNotificaciones",function(data){
	$scope.notificaciones=data;
	$scope.animate();
	})
	$scope.animate=function(){
		$timeout(function() {
				// Set Motion
				ionicMaterialMotion.fadeSlideInRight();
				// Set Ink
				ionicMaterialInk.displayEffect();
				}, 200);
	}
	$scope.abreNotificacion=function(data){
		console.log(data)
		Message.showActionSheet()
	}
	
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
})
.filter('firstMayus', function () {
return function (input) {
	if(input)
    return input.substring(0,1).toUpperCase()+input.substring(1).toLowerCase()
}
})
