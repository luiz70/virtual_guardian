angular.module('starter.controllers')
.controller('Contactos', function($scope,$rootScope,$timeout,$ionicScrollDelegate,Contactos,socket,ionicMaterialMotion,ionicMaterialInk,Llamada,Message) {
	$scope.idioma=$rootScope.idioma;
	$scope.cargando=true;
	$scope.cargandoContactos=true;
	
	$scope.$on('$ionicView.afterEnter',function(){
		$scope.cargandoContactos=true;
		$timeout(function(){
		$ionicScrollDelegate.scrollTop();
        $scope.loadContactos();
		},100)
	})
	var getContactos=function(data){
		socket.getSocket().removeListener("getContactos",getContactos)
		$timeout(function(){
			$ionicScrollDelegate.resize()
			$scope.animate();
		},300)
		$timeout(function(){
		$scope.cargandoContactos=false;
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
		},100)
	}
	
	var connect=function(){
		/*if($rootScope.notificaciones && $rootScope.notificaciones.length>0)socket.getSocket().emit("setNotificaciones",_.map($rootScope.notificaciones,function(v){return {IdN:v.IdNotificacion,IdE:v.IdEvento,Edi:v.Editado}}))
		socket.getSocket().removeListener("connect",connect)
		$scope.loadNotifications(0)
		$scope.cargandoNotificaciones=true;
		$scope.moreData=true;*/
		
	}
	var connectError=function(){
		//socket.getSocket().removeListener("connect_error",connectError);
		//getNotificaciones([]);
		//$scope.moreData=false;
	}
	
	$scope.loadContactos=function(){
		socket.getSocket().removeListener("getContactos",getContactos)
		socket.getSocket().removeListener("connect",connect)
		socket.getSocket().removeListener("connect_error",connectError);
		socket.getSocket().on("getContactos",getContactos)
		socket.getSocket().on("connect",connect)
		socket.getSocket().on("connect_error",connectError);
		if(socket.isConnected())Contactos.getContactos();
		else{ 
			getContactos([])
			$scope.moreData=false;
		}
	}
	
	$scope.animate=function(){
		
		// Set Motion
		ionicMaterialMotion.fadeSlideInRight();
		// Set Ink
		ionicMaterialInk.displayEffect();
	}
	
	if($rootScope.contactos.length>0){
		$timeout(function(){
			$scope.animate();
		},300)
		
	}
	$scope.abreContacto=function(contacto){
		var buttons=[];
		if(contacto.Estatus==1){
		//opciones regulares
		buttons.push({text:$rootScope.idioma.Llamada[14]+contacto.Correo,funcion:$scope.llamaPersona,data:contacto})
		buttons.push({text:$rootScope.idioma.Contactos[11],funcion:$scope.eliminarContacto,data:contacto})
		}
		else{
		   	if(contacto.Tipo==1){
		   	//aceptar / rechazar
			}else{
			//eliminar
			}
		}
		Message.showActionSheet(null,buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				res.funcion(res.data);
			}
		})
	}
	$scope.eliminarContacto=function(){
	}
	$scope.llamaPersona=function(data){
		if(socket.isConnected()){
			$rootScope.llamada.Correo=data.Correo;
			$rootScope.llamada.Usuario=data.IdUsuario;
			Llamada.abre(true);
		}else{
			Message.alert($rootScope.idioma.Llamada[6],$rootScope.idioma.Llamada[7]+data.Persona,function(){})
		}
		
	}
	/*
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
		if(data.Tipo<5)buttons.push({text:"Ver evento en mapa",funcion:$scope.verEvento,data:data})
		if(data.Tipo>1 && data.Tipo<5){
			buttons.push({text:"Directorio de servicios",funcion:$scope.verDirectorio,data:data})
		}
		if(data.Tipo==3)buttons.push({text:"Llamar a "+data.Persona,funcion:$scope.llamaPersona,data:data})
		if(data.Tipo==5 || data.Tipo==9){
			buttons.push({text:"Aceptar solicitud",funcion:$scope.aceptarSolicitud,data:data})
			buttons.push({text:"Cancelar solicitud",funcion:$scope.cancelarSolicitud,data:data})
		}
		if(data.Tipo==5 || data.Tipo==6)buttons.push({text:"Ver lista de contactos",funcion:$scope.verContactos,data:data})
		Message.showActionSheet(null,buttons,{text:$rootScope.idioma.Notificaciones[17],funcion:function(data){
				$scope.eliminaNotificacion(data.data)
		},data:data},$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				res.funcion(res.data);
			}
		})
		}
	}*/
})