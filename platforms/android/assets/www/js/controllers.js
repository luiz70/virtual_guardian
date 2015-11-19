angular.module('starter.controllers', [])
.controller('Login', function($scope,Memory) {
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
	Memory.clean();
	console.log(Memory.get("hola"));
	
	//Funcion: enviar datos al servidor y validar credenciales
	$scope.singIn=function(){
		localMemory.cleanAll();
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
