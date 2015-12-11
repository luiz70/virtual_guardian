angular.module('starter.controllers', ['uiGmapgoogle-maps'])
.controller('AppCtrl', function($scope,$rootScope,Memory,$state,$ionicViewSwitcher,$http,$cordovaDevice,$cordovaNetwork,$ionicHistory) {
	//inicializa usuario
	//Memory.clean();
	$rootScope.internet={state:true,type:""};
	$rootScope.Usuario=Memory.get("Usuario");
	console.log($rootScope.Usuario);
	//$rootScope.iOS=(window.device.platform=="iOS");
	//console.log($cordovaDevice.getUUID())
	
	$http.defaults.headers.common.accessToken = $rootScope.Usuario?$rootScope.Usuario.Token:'-';
	if(!$rootScope.Usuario && $state.current.name.indexOf("registro")<0 &&  $state.current.name.indexOf("login")<0 && $state.current.name.indexOf("recuperar")<0){
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.login")	
	}
            
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
               //$ionicHistory.clearCache();
               $ionicHistory.clearHistory();
               
               })
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
		Message.showLoading($rootScope.idioma.Login[9]);
		
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
})
.filter('firstMayus', function () {
return function (input) {
    return input.substring(0,1).toUpperCase()+input.substring(1).toLowerCase()
}
})
