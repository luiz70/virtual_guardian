angular.module('starter.controllers')
.controller('Home', function($scope,$timeout,$ionicSideMenuDelegate,$state,socket,$rootScope,Memory,$ionicViewSwitcher,Usuario,Notificacion,Contactos,Llamada,Mapa,sql,Usuario,Push,uiGmapGoogleMapApiManualLoader,uiGmapGoogleMapApi) {
	$scope.$on('$ionicView.afterEnter',function(){
		if(Memory.get("Usuario"))
			$timeout(function() {
				angular.element(document.getElementById("app_content")).removeClass("invisible")
                angular.element(document.getElementsByClassName("animate-enter-up").item(0)).addClass("animate")
				if(navigator.splashscreen)navigator.splashscreen.hide();
            }, 100);
			
    })
	$scope.cambiaPantalla=function(val){
		switch(val){
			case 1:$state.go("app.home.mapa")
			break;
			case 2:$state.go("app.home.notificaciones")
			break;
			case 3:$state.go("app.home.contactos")
			break;
		}
		
	}
	
	if(!Memory.get("Usuario")){
		$ionicViewSwitcher.nextTransition("none");
		$ionicViewSwitcher.nextDirection('enter');
		$state.go("app.login")
	}else{
		$timeout(function(){
		angular.element(document.getElementsByClassName("mapa-search")[0]).css("display","block")
		$rootScope.Usuario=Memory.get("Usuario")
		socket.inicializa();
		$rootScope.sql=sql;
		$scope.loadMapa();
		},500)
	}
	$scope.loadMapa=function(){
		uiGmapGoogleMapApiManualLoader.load();
	}
	uiGmapGoogleMapApi.then(function(){
		Mapa.inicializa();
	})
	
	$scope.conectedonce=function(evt,res){
		$scope.conectado();
		sql.inicializa(true)
		if(res){
			sql.update();
			Push.registra(true);
			Usuario.refresh();
			Contactos.inicializa()
			Notificacion.inicializa()
		}
		Contactos.inicializa()
		Notificacion.inicializa()
		socket.getSocket().on("connect",$scope.conected)
	}
	$scope.conected=function(){
		sql.inicializa(true);
		getasuntos();
		Push.registra(true);
		Usuario.refresh();
		sql.update();
		Contactos.inicializa()
		Notificacion.inicializa()
	}
	
	$scope.conectado=$rootScope.$on("socket.connect",$scope.conectedonce)
	
		
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
		angular.element(document.getElementsByTagName("disable-screen").item(0)).addClass("display")
		$scope.menuOpen=true
	}else {
		angular.element(document.getElementsByTagName("disable-screen").item(0)).removeClass("display")
		$scope.menuOpen=false
	}
  });
	$scope.isCover=function(){
		return $ionicSideMenuDelegate.isOpen()
	}
	
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.seccion=$state.current.id;
	})
	
	
	$rootScope.Asuntos=Memory.get("Asuntos")
	var getasuntos=function(){
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
	
	
	
	
	$rootScope.$watch("Asuntos",function(newValue){
		if(newValue) Memory.set("Asuntos",$rootScope.Asuntos)	
	})
	
})