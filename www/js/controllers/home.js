angular.module('starter.controllers')
.controller('Home', function($scope,$timeout,$ionicSideMenuDelegate,$state,socket,$rootScope,Memory,Notificaciones,Usuario,sql,$ionicPlatform) {
	socket.inicializa();
	
	
	socket.getSocket().on("connect",function(){
		Notificaciones.registra(true);
		Usuario.refresh();
        sql.inicializa()
		sql.update();
	})
	socket.getSocket().on("connect_error",function(){
		 sql.inicializa()
	})
	$scope.menuWidth=window.innerWidth*0.85;
	$scope.menuAbierto=false;
	$scope.seccion=1;
	$scope.menuOpen=false
	
	$scope.$watch(function () {
    	return $ionicSideMenuDelegate.isOpenLeft();
  	},
     function (isOpen) {
    if (isOpen){
		$("disable-screen").addClass('display');
		$scope.menuOpen=true
	}else {
		$("disable-screen").removeClass('display');
		$scope.menuOpen=false
	}
  });
	$scope.isCover=function(){
		return $ionicSideMenuDelegate.isOpen()
	}
	
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
	$rootScope.Asuntos=Memory.get("Asuntos")
	if(!$rootScope.Asuntos){
	socket.emit("getAsuntos")
	socket.getSocket().on("getAsuntos",function(data){
		if(data){
			$rootScope.Asuntos={};
			for(var i=0;i<data.length;i++)
			$rootScope.Asuntos[data[i].Id]=data[i].Nombre;
			$rootScope.idioma.Asuntos=$rootScope.Asuntos;
		}else{
			//no hay asuntos!!!
		}
	})
	}
	
	$rootScope.idioma.Asuntos=$rootScope.Asuntos;
	
	$rootScope.$watch("Asuntos",function(newValue){
		if(newValue) Memory.set("Asuntos",$rootScope.Asuntos)	
	})
})