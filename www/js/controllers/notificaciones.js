angular.module('starter.controllers')
.controller('Notificaciones', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk,socket,$rootScope,Message,Notificacion,$ionicScrollDelegate,$state,$ionicViewSwitcher,Llamada) {
	$scope.idioma=$rootScope.idioma;
	$scope.cargando=true;
	$scope.moreData=true;
	$scope.cargandoNotificaciones=true;
	
	$scope.$on('$ionicView.afterEnter',function(){
		$scope.cargandoNotificaciones=true;
		$timeout(function(){
		$ionicScrollDelegate.scrollTop();
        $scope.loadNotifications(0);
		$rootScope.notificaciones=$rootScope.notificaciones.slice(0, 15)
		$scope.moreData=true;
		},100)
})
	
	var getNotificaciones=function(data){
		
		socket.getSocket().removeListener("getNotificaciones",getNotificaciones)
		$timeout(function(){
		$ionicScrollDelegate.resize()
		$scope.animate();
		},300)
		$timeout(function(){
		$scope.cargandoNotificaciones=false;
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
		if(data.Tipo==1 && data.Data.length==0)$scope.moreData=false;
		},100)
		
		
	}
	var connect=function(){
		if($rootScope.notificaciones && $rootScope.notificaciones.length>0)socket.getSocket().emit("setNotificaciones",_.map($rootScope.notificaciones,function(v){return {IdN:v.IdNotificacion,IdE:v.IdEvento,Edi:v.Editado}}))
		socket.getSocket().removeListener("connect",connect)
		$scope.loadNotifications(0)
		$scope.cargandoNotificaciones=true;
		$scope.moreData=true;
		
	}
	var connectError=function(){
		socket.getSocket().removeListener("connect_error",connectError);
		getNotificaciones([]);
		$scope.moreData=false;
	}
	$scope.loadNotifications=function(val){
		socket.getSocket().removeListener("getNotificaciones",getNotificaciones)
		socket.getSocket().removeListener("connect",connect)
		socket.getSocket().removeListener("connect_error",connectError);
		socket.getSocket().on("getNotificaciones",getNotificaciones)
		socket.getSocket().on("connect",connect)
		socket.getSocket().on("connect_error",connectError);
		if(socket.isConnected())Notificacion.getNotificaciones(val);
		else{ 
			getNotificaciones([])
			$scope.moreData=false;
		}
	}
	
	$scope.animate=function(){
		
		// Set Motion
		ionicMaterialMotion.fadeSlideInRight();
		// Set Ink
		ionicMaterialInk.displayEffect();
	}
	if($rootScope.notificaciones.length>0){
		$timeout(function(){
		$scope.animate();
		},300)
		
	}
	$scope.verEvento=function(data){
		$rootScope.radio.activo=false;
		$rootScope.map.zoom=18;
		$rootScope.map.center={latitude:data.Latitud,longitude:data.Longitud}
		$ionicViewSwitcher.nextDirection('back');
		$state.go("app.home.mapa");
	}
	$scope.verDirectorio=function(data){
		Message.showModal("templates/modal/directorio.html")
	}
	var getPersona=function(data){
		if(data){
			socket.getSocket().removeListener("getPersona",getPersona)
			$rootScope.llamada.Usuario=data.Id;
			Llamada.abre(true)
		}
		
	}
	$scope.llamaPersona=function(data){
		if(socket.isConnected()){
			$rootScope.llamada.Correo=data.Persona;
			socket.getSocket().removeListener("getPersona",getPersona)
			socket.getSocket().on("getPersona",getPersona)
			socket.getSocket().emit("getPersona",data.Persona)
		}else{
			Message.alert($rootScope.idioma.Llamada[6],$rootScope.idioma.Llamada[7]+data.Persona,function(){})
		}
		
	}
	var aceptaPersona=function(data){
		socket.getSocket().removeListener("aceptaPersona",aceptaPersona)
		Message.alert($rootScope.idioma.Notificaciones[7],data+$rootScope.idioma.Contactos[4],function(){
			$scope.loadNotifications(1);
		})
	}
	$scope.aceptarSolicitud=function(data){
		if(data.Tipo==5){
			Message.confirm($rootScope.idioma.Notificaciones[7],$rootScope.idioma.Contactos[14]+data.Persona+"?",function(res){
				if(socket.isConnected()) {
					socket.getSocket().on("aceptaPersona",aceptaPersona)
					socket.getSocket().emit("aceptaPersona",data.Persona,$rootScope.Usuario.Id)
				}else Message.alert($rootScope.idioma.Notificaciones[7],$rootScope.idioma.General[7],function(){})
			},null,null,false)
		}else{
			
		}
	}
	var personaEliminada=function(data){
		socket.getSocket().removeListener("eliminaPersona",personaEliminada)
		Message.alert($rootScope.idioma.Notificaciones[7],data+$rootScope.idioma.Contactos[15],function(){
			$scope.loadNotifications(1);
		})
	}
	var eliminaNotificacion=function(data){
		socket.getSocket().removeListener("eliminaNotificacion",eliminaNotificacion)
		console.log(data);
	}
	$scope.eliminaNotificacion=function(data){
		Message.confirm($rootScope.idioma.Notificaciones[18],$rootScope.idioma.Notificaciones[19],function(){
			if(socket.isConnected()) {
				socket.getSocket().removeListener("eliminaNotificacion",eliminaNotificacion)
				socket.getSocket().on("eliminaNotificacion",eliminaNotificacion)
				socket.getSocket().emit("eliminaNotificacion",data.IdNotificacion)
			}else Message.alert($rootScope.idioma.Notificaciones[18],$rootScope.idioma.General[7],function(){})
		},null,null,false)
	}
	$scope.cancelarSolicitud=function(data){
		if(data.Tipo==5){
			Message.confirm($rootScope.idioma.Notificaciones[7],$rootScope.idioma.Contactos[19]+data.Persona+"?",function(res){
				if(socket.isConnected()) {
					socket.getSocket().on("eliminaPersona",personaEliminada)
					socket.getSocket().emit("eliminaPersona",data.Persona,$rootScope.Usuario.Id)
				}else Message.alert($rootScope.idioma.Notificaciones[7],$rootScope.idioma.General[7],function(){})
			},null,null,false)
		}else{
			
		}
	}
	$scope.verContactos=function(data){
		$ionicViewSwitcher.nextDirection('forward');
		$state.go("app.home.personas");
	}
	$scope.abreNotificacion=function(data){
		if(data.Tipo==8){
			//TIPS VIRTUAL
		}else{
		var buttons=[];
		if(data.Tipo<5)buttons.push({text:$rootScope.idioma.Notificaciones[20],funcion:$scope.verEvento,data:data})
		if(data.Tipo>1 && data.Tipo<5){
			buttons.push({text:$rootScope.idioma.Notificaciones[21],funcion:$scope.verDirectorio,data:data})
		}
		if(data.Tipo==3)buttons.push({text:$rootScope.idioma.Llamada[14]+data.Persona,funcion:$scope.llamaPersona,data:data})
		if(data.Tipo==5 || data.Tipo==9){
			buttons.push({text:$rootScope.idioma.Contactos[13],funcion:$scope.aceptarSolicitud,data:data})
			buttons.push({text:$rootScope.idioma.Contactos[20],funcion:$scope.cancelarSolicitud,data:data})
		}
		if(data.Tipo==5 || data.Tipo==6)buttons.push({text:$rootScope.idioma.Notificaciones[22],funcion:$scope.verContactos,data:data})
		Message.showActionSheet(null,buttons,{text:$rootScope.idioma.Notificaciones[17],funcion:function(data){
				$scope.eliminaNotificacion(data.data)
		},data:data},$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				res.funcion(res.data);
			}
		})
		}
	}
	
})

