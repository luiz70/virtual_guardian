angular.module('starter.controllers')
.controller('Home', function($scope,$timeout,$ionicSideMenuDelegate,$state,socket,$rootScope,Memory,$ionicViewSwitcher,Usuario//,Notificaciones,Usuario,sql,$ionicPlatform,Mapa,Notificacion,Message,Llamada
) {
	$scope.$on('$ionicView.afterEnter',function(){
		if(Memory.get("Usuario"))
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                angular.element(document.getElementsByClassName("animate-enter-up").item(0)).addClass("animate")
				if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 100);
			
    })
	
	
	if(!Memory.get("Usuario")){
		$ionicViewSwitcher.nextTransition("none");
		$ionicViewSwitcher.nextDirection('enter');
		$state.go("app.login")
	}else{
		$rootScope.Usuario=Memory.get("Usuario")
		socket.inicializa();
		Usuario.refresh();
		/*Mapa.inicializa();
		Llamada.inicializa();
		$rootScope.sql=sql;*/
	}
	
	
	$scope.conected=function(evt,res){
		$scope.listener();
		console.log(res);
		/*Notificaciones.registra(true);
		Usuario.refresh();
        sql.inicializa(true)
		sql.update();
		Notificacion.inicializa()*/
	}
	$scope.listener=$rootScope.$on("socket.connect",$scope.conected)
	
	/*var connectError=function(){
		socket.getSocket().removeListener("connect_error",connectError);
		 sql.inicializa(false);
		 Notificacion.inicializa()
	}
	socket.getSocket().on("connect_error",connectError);*/
	
	$scope.menuWidth=function(){
		if(window.innerHeight> window.innerWidth)return window.innerWidth*0.85;
		else return window.innerHeight*0.85;
	}
	$scope.menuAbierto=false;
	$scope.seccion=1;
	$scope.menuOpen=false
	
	$scope.$watch(function () {
    	return $ionicSideMenuDelegate.isOpenLeft();
  	},
     function (isOpen) {
    if (isOpen){
		//$("disable-screen").addClass('display');
		$scope.menuOpen=true
	}else {
		//$("disable-screen").removeClass('display');
		$scope.menuOpen=false
	}
  });
	$scope.isCover=function(){
		return $ionicSideMenuDelegate.isOpen()
	}
	
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.seccion=$state.current.id;
	})
	
	
	/*$rootScope.Asuntos=Memory.get("Asuntos")
	if(!$rootScope.Asuntos && Memory.get("Usuario")){
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
	*/
	
	$rootScope.$watch("Asuntos",function(newValue){
		if(newValue) Memory.set("Asuntos",$rootScope.Asuntos)	
	})
	
})