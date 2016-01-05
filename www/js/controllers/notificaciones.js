angular.module('starter.controllers')
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
		Message.showActionSheet(null,[{ text: 'uno' },{ text: 'dos' }],null,"hola",function(index,res){
		console.log(index,res)
		})
	}
	
})
