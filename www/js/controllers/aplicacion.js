angular.module('starter.controllers', ['uiGmapgoogle-maps'])
.controller('Aplicacion', function($scope,$rootScope,Memory,$state,$ionicViewSwitcher,$http,$cordovaDevice,$cordovaNetwork,$ionicHistory,Message,$timeout,Usuario) {
	//Memory.clean();
	//Variable que controla el estado de conexion a internet
	$rootScope.internet={state:true,type:""};
	//inicializa usuario
	$rootScope.Usuario=Memory.get("Usuario");
	
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