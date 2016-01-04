angular.module('starter.controllers', ['uiGmapgoogle-maps'])
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
	alert(3);
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
.controller('Menu', function($scope,$rootScope,Message) {
	$scope.cerrarSesion=function(){
		Message.confirm($rootScope.idioma.Menu[7],$rootScope.idioma.Login[10],function(res){
			if(res){
				$rootScope.cerrarSesion();
			}
		},null,null,false,true)
	}
})
.controller('Notificaciones', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,socket) {
	alert(4);
	$scope.notificaciones=[]
	console.log(4);
	/*socket.getSocket().emit("getNotificaciones");*/
	$scope.animate=function(){
		$timeout(function() {
				// Set Motion
				ionicMaterialMotion.fadeSlideInRight();
				// Set Ink
				ionicMaterialInk.displayEffect();
				}, 200);
	}
	$scope.animate
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
