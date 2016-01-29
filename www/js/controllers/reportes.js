angular.module('starter.controllers')
.controller('Reportes', function($scope,$rootScope,$timeout,$ionicScrollDelegate,socket,ionicMaterialMotion,ionicMaterialInk,Message) {
	$scope.idioma=$rootScope.idioma;
	$scope.cargando=true;
	$scope.cargandoReportes=true;
	/*$scope.$on('$ionicView.afterEnter',function(){
		$scope.cargandoReportes=true;
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
		$scope.cargandoReportes=false;
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
		},100)
	}
	
	var connect=function(){
		socket.getSocket().removeListener("connect",connect)
		$scope.cargandoReportes=true;
		$ionicScrollDelegate.scrollTop();
        $scope.loadContactos();		
	}
	var connectError=function(){
		socket.getSocket().removeListener("connect_error",connectError);
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
	$scope.agregarContacto=function(res,correo){
		Message.hideLoading();
		switch(res){
			case null: console.log("error")
			break;
			case 1:Message.alert($rootScope.idioma.Contactos[1],correo+$rootScope.idioma.Contactos[4],function(){
				$scope.loadContactos();
			})
			break;
			case 2:Message.alert($rootScope.idioma.Contactos[1],correo+$rootScope.idioma.Contactos[6],function(){})
			break;
			case 3:Message.alert($rootScope.idioma.Contactos[1],correo+$rootScope.idioma.Contactos[5],function(){})
			break;
			default:Message.alert($rootScope.idioma.Contactos[1],$rootScope.idioma.General[7],function(){})
			break;
		}
	}
	$scope.agregaContacto=function(){
		if(socket.isConnected())
		Message.prompt($rootScope.idioma.Contactos[1],$rootScope.idioma.Contactos[2],function(res){
			if(res){
				if(res.toLowerCase()==$rootScope.Usuario.Correo.toLowerCase())
					Message.alert($rootScope.idioma.Contactos[1],$rootScope.idioma.Contactos[3],function(){})
				else{
					if(socket.isConnected()){
					Message.showLoading($rootScope.idioma.Contactos[21]);
					socket.getSocket().removeListener("agregarContacto",$scope.agregarContacto)
					socket.getSocket().on("agregarContacto",$scope.agregarContacto)
					socket.getSocket().emit("agregarContacto",$rootScope.Usuario.Id,res)
					}else Message.alert($rootScope.idioma.Contactos[1],$rootScope.idioma.General[7],function(){})
				}
			}else{
				Message.alert($rootScope.idioma.Contactos[1],$rootScope.idioma.Registro[10],function(){})
			}
		},"email",$rootScope.idioma.Login[2])
		else Message.alert($rootScope.idioma.Contactos[1],$rootScope.idioma.General[7],function(){})
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
			buttons.push({text:$rootScope.idioma.Contactos[20],funcion:$scope.cancelarSolicitud,data:contacto})
			}else{
			//eliminar
			buttons.push({text:$rootScope.idioma.Contactos[13],funcion:$scope.aceptarSolicitud,data:contacto})
			buttons.push({text:$rootScope.idioma.Contactos[20],funcion:$scope.cancelarSolicitud,data:contacto})
			}
		}
		Message.showActionSheet(null,buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				if($rootScope.internet.state){
				res.funcion(res.data);
				}else{
				Message.alert($rootScope.idioma.Contactos[18],$rootScope.idioma.General[7],function(){})
				}
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
			Message.alert($rootScope.idioma.Llamada[6],$rootScope.idioma.Llamada[7]+data.Correo,function(){})
		}
		
	}
	var contactoEliminado=function(data){
		Message.hideLoading();
		socket.getSocket().removeListener("eliminaPersona",contactoEliminado)
		Message.alert($rootScope.idioma.Notificaciones[7],data+$rootScope.idioma.Contactos[15],function(){
			$scope.loadContactos();
		})
	}
	$scope.cancelarSolicitud=function(data){
			Message.confirm($rootScope.idioma.Notificaciones[7],$rootScope.idioma.Contactos[19]+data.Correo+"?",function(res){
				if(socket.isConnected()) {
					socket.getSocket().removeListener("eliminaPersona",contactoEliminado)
					socket.getSocket().on("eliminaPersona",contactoEliminado)
					socket.getSocket().emit("eliminaPersona",data.Correo,$rootScope.Usuario.Id)
					Message.showLoading($rootScope.idioma.General[8]);
				}else Message.alert($rootScope.idioma.Notificaciones[7],$rootScope.idioma.General[7],function(){})
			},null,null,false)
	}
	$scope.eliminarContacto=function(data){
		Message.confirm($rootScope.idioma.Notificaciones[11],$rootScope.idioma.Contactos[12]+data.Correo+"?",function(res){
			if(socket.isConnected()) {
				socket.getSocket().removeListener("eliminaPersona",contactoEliminado)
				socket.getSocket().on("eliminaPersona",contactoEliminado)
				socket.getSocket().emit("eliminaPersona",data.Correo,$rootScope.Usuario.Id)
				Message.showLoading($rootScope.idioma.General[8]);
			}else Message.alert($rootScope.idioma.Notificaciones[11],$rootScope.idioma.General[7],function(){})
		},null,null,false)
	}
	$scope.aceptarSolicitud=function(data){
		Message.confirm($rootScope.idioma.Notificaciones[7],$rootScope.idioma.Contactos[14]+data.Correo+"?",function(res){
			if(socket.isConnected()) {
				socket.getSocket().removeListener("aceptaPersona",aceptaContacto)
				socket.getSocket().on("aceptaPersona",aceptaContacto)
				socket.getSocket().emit("aceptaPersona",data.Correo,$rootScope.Usuario.Id)
				Message.showLoading($rootScope.idioma.General[9]);
			}else Message.alert($rootScope.idioma.Notificaciones[7],$rootScope.idioma.General[7],function(){})
		},null,null,false)
	}
	var aceptaContacto=function(data){
		Message.hideLoading();
		socket.getSocket().removeListener("aceptaPersona",aceptaContacto)
		Message.alert($rootScope.idioma.Notificaciones[7],data+$rootScope.idioma.Contactos[4],function(){
			$scope.loadContactos();
		})
	}
*/
})