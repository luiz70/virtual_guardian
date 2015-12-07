angular.module('starter.controllers', ['uiGmapgoogle-maps'])
.controller('AppCtrl', function($scope,$rootScope,Memory,$state,$ionicViewSwitcher,$http,$cordovaDevice,$cordovaNetwork,socket) {
	//inicializa usuario
	$rootScope.internet={state:true,type:""};
	$rootScope.Usuario=Memory.get("Usuario");
	//$rootScope.iOS=(window.device.platform=="iOS");
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
		if((state.indexOf("login")>=0 || state.indexOf("recuperar")>=0 || state.indexOf("recuperar")>=0) && $rootScope.Usuario){
			$ionicViewSwitcher.nextTransition("none");
			$ionicViewSwitcher.nextDirection('enter');
			$state.go('app.home.mapa');
		}
        if(fromState.name.indexOf("mapa")>=0 && state.indexOf("notificaciones")>=0)$ionicViewSwitcher.nextDirection('forward');
        if(fromState.name.indexOf("personas")>=0 && state.indexOf("notificaciones")>=0)$ionicViewSwitcher.nextDirection('back');
               
	})
	$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
		$rootScope.internet={state:true,type:networkState};
	})
	$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
		$rootScope.internet={state:false,type:networkState};
	})
	$rootScope.$watch('Usuario', function(newValue, oldValue) {
  		Memory.set("Usuario",newValue)
	});
    $rootScope.$watch('internet', function(newValue, oldValue) {
        console.log(newValue);
    });
	
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
.controller('top-right',function($scope,$rootScope,Mapa,uiGmapIsReady,$timeout){
$scope.refreshLocation=function(){
		Mapa.refreshLocation();
	}
})
.controller('bottom-center',function($scope,$rootScope,Mapa,uiGmapIsReady,$timeout){
	$scope.mapa=null;
	uiGmapIsReady.promise()
	.then(function(maps){
		$scope.mapa=$rootScope.map;
		$timeout(function(){
			$scope.hideBarra();
		},1000)
	})
	
	$scope.hideBarra=function(){
		$(".contenedor-mapa-pie").animate({
		height:'7vh',
		},1000);
	}
	$scope.showBarra=function(){
		$(".contenedor-mapa-pie").animate({
		height:'14vh',
		},1000);
	}
	$(".gm-style div").first().mouseover($scope.hideBarra)
	
	/*ng-mouseout="hideBarra()"*/
 
})
.controller('Login', function($scope,Memory,Message,$timeout,$http,Usuario,$ionicViewSwitcher,Notificaciones,$state) {
	
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
		if(!$scope.login.Correo || $scope.login.Contrasena.length<8)Message.alert($scope.idioma.Login[1],$scope.idioma.Login[7],function(){});
		else{
			Message.showLoading($scope.idioma.Login[8]);
			Memory.clean();
			Usuario.login($scope.login)
			.success(function(data){
				Message.hideLoading();
				if (data.error){
					Message.alert($scope.idioma.Login[1],$scope.idioma.Login[7],function(){
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

.controller('Home', function($scope,$timeout,$ionicSideMenuDelegate,$state) {
	$scope.menuWidth=window.innerWidth*0.85;
	$scope.menuAbierto=false;
	$scope.seccion=1;
	
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.seccion=$state.current.id;
	})
	$scope.$on('$ionicView.enter',function(){
        if(navigator.splashscreen)navigator.splashscreen.hide();
		$(".animate-enter-up").animate({
			top:0,
			opacity:1
		},500);
		
	})
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
.controller('Notificaciones', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk) {
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
