// JavaScript Document
angular.module('starter.controllers')
//Controlador para la seccion de registro
.controller('Registro', function($scope,Memory,Message,$state,$ionicViewSwitcher,Verificacion,$timeout,$http,Usuario) {
	
	//VARIABLES
	$scope.nuevoUsuario={
		Correo:"",
		Contrasena:"",
		Contrasena2:"",
		Codigo:"",
		Promocion:""
	}
	$scope.botonSiguiente=$scope.idioma.Registro[7];
	$scope.botonAtras=$scope.idioma.Registro[8];
	$scope.state=$scope.getState($state.current.name)
	//FUNCION QUE SE EJECUTA CADA VEZ QUE LA VISTA ENTRA Y REVISA SI EL USUARIO ESTA LOGGEADO
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Usuario.get()){
				$ionicViewSwitcher.nextTransition("none");
				$ionicViewSwitcher.nextDirection('enter');
				$state.go('app.home.mapa');
		}
	})
	//FUNCION QUE SE EJECUTA CADA VEZ QUE LA VISTA ENTRA Y REVISA SI EL USUARIO YA TIENE UN REGISTRO EN PROCESO PARA CARGAR LOS DATOS ALMACENADOS
	$scope.$on('$ionicView.afterEnter',function(){
    	if(Memory.get("Registro"))$scope.nuevoUsuario=Memory.get("Registro");
		if($scope.state=="datos")
			$timeout(function(){
				$("#registro_correo").focus();
				if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
			},500);
    })
	//FUNCION QUE SE EJECUTA CADA QUE CAMBIA DE ESTADO DENTRO DE REGISTRO PARA MOSTRAR LOS BOTONES CORRECTOS EN LA PARTE INFERIOR
	$scope.$watch('state', function() {
    	switch($scope.state){
			case "datos":
				$scope.botonSiguiente=$scope.idioma.Registro[7];
				$scope.botonAtras=$scope.idioma.Registro[8];
			break; 
			case "codigo":
				$scope.botonSiguiente=$scope.idioma.Registro[7];
				$scope.botonAtras=$scope.idioma.General[6];
			break;
			case "final":
				$scope.botonSiguiente=$scope.idioma.Registro[21];
			break;
		}
   	});
	//FUNCION QUE SE EJECUTA CADA QUE CAMBIA DE ESTADO EL REGISTRO PARA ACTUALIZAR LA VARIABLE STATE
	$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
		$scope.state=$scope.getState(toState.name)
	})
	//FUNCION QUE SE EJECUTA AL DAR CLICK EN EL BOTON SIGUIENTE Y TIENE DIFERENTES ACCIONES DEPENDIENTO EL ESTADO EN EL QUE SE ENCUENTRE
	$scope.siguiente=function(){
		switch($scope.state){
			case "datos":
				if(!Verificacion.email($scope.nuevoUsuario.Correo))
					Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[10],function(){
						$timeout(function(){
							$("#registro_correo").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100)
					})
				else if(!Verificacion.password($scope.nuevoUsuario.Contrasena,8))
					Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[11],function(){
						$timeout(function(){
							$scope.nuevoUsuario.Contrasena="";
							$scope.nuevoUsuario.Contrasena2="";
							$("#registro_contrasena").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100);
					})
				else if($scope.nuevoUsuario.Contrasena!=$scope.nuevoUsuario.Contrasena2)
					Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[12],function(){
						$timeout(function(){
							$scope.nuevoUsuario.Contrasena2="";
							$("#registro_contrasena2").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100);
					})
				else{
					if($scope.nuevoUsuario.Promocion!="" && $scope.nuevoUsuario.Promocion){
						Message.showLoading($scope.idioma.Registro[32])
						Verificacion.promocion($scope.nuevoUsuario.Promocion)
						.success(function(data){
							Message.hideLoading()
							if(data.error){
								$scope.nuevoUsuario.Promocion="";
								Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[9],function(){})
							}else{
								if(data.Cantidad==0){
									$scope.nuevoUsuario.Promocion="";
									Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[31],function(){})
								}else $scope.registra(data);
							}
						})
						.error(function(data){
							console.log(data);
						});	
					}else $scope.registra();
				}
			break; 
			case "codigo":
				if($scope.nuevoUsuario.Codigo=="" || !$scope.nuevoUsuario.Codigo || $scope.nuevoUsuario.Codigo.length<5)
				Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[17],function(){
						$timeout(function(){
							$("#registro_correo").focus();
						})
				});
				else{
					Message.showLoading($scope.idioma.Registro[34])
					$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/finalizar', data: {Codigo:$scope.nuevoUsuario.Codigo,Correo:$scope.nuevoUsuario.Correo}})
					.success(function(data){
						Message.hideLoading();
						
						switch(parseInt(data.return)){
							case 0: 
								Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[17],function(){
								});
							break;
							case 1: 
								Memory.set("Registro",null);
								$ionicViewSwitcher.nextDirection('forward');
								$state.go('app.registro.final');
							break;
							case 2:
								Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[36],function(){
									$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/limpia', data: {Correo:$scope.nuevoUsuario.Correo}})
									Memory.set("Registro",null);
									$scope.nuevoUsuario={
										Correo:$scope.nuevoUsuario.Correo,
										Contrasena:"",
										Contrasena2:"",
										Codigo:"",
										Promocion:""
									}
									$ionicViewSwitcher.nextDirection('back');
									$state.go('app.registro.datos')
								})
							break;
						}
					})
					.error(function(data){
						Message.hideLoading();
						Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[16],function(){})
					})
				}
			break;
			case "final":
				$ionicViewSwitcher.nextDirection('back');
				$state.go('app.login')
			break;
		}
	}
	//FUNCTION QUE SE EJECUTA AL DAR ENTER EN TECLADO
	$scope.enter=function(event,field){
		if(event.keyCode==13){
			//verificar en que campo se encuentra
			switch(field){
				case 1://Email
					$("#registro_contrasena").focus();
				break;
				case 2://Password
					$("#registro_contrasena2").focus();
				break;
				case 3://Password
					$("#registro_codigo").focus();
				break;
				case 4:
					if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
            		$scope.siguiente();
				break;
			}
		}
	}
	//FUNCION QUE SE EJECUTA AL DAR CLICK EN REGRESAR O CANCELAR Y ENVIA A LA PANTALLA DE LOGIN, ADICIONAL BORRA LA MEMORIA DEL REGISTRO
	$scope.atras=function(){
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/limpia', data: {Correo:$scope.nuevoUsuario.Correo}})
		Memory.set("Registro",null);
		$ionicViewSwitcher.nextDirection('back');
		$state.go('app.login')
	}
	//FUNCTION QUE SE EJECUTA CUANDO EL PRIMER PASO DEL REGISTRO SE REALIZA CORRECTAMENTE
	$scope.registra=function(promo){
		var promocion=promo || null;
		Message.showLoading($scope.idioma.Registro[33])
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro', data: $scope.nuevoUsuario})
	
	/*.success(function(data){console.log(data)})
		$http.post("https://www.virtual-guardian.com/virtual/registro",$scope.nuevoUsuario)*/
		.success(function(data){
			Message.hideLoading();
			switch(parseInt(data.return)){
				case 0: 
					Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[15],function(){
					});
				break;
				case 1: 
					Memory.set("Registro",$scope.nuevoUsuario);
					if(promocion)Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[35].replace("TIEMPO",promocion.Duracion).replace("TIPO",promocion.Tipo)+(promocion.Duracion>1?"es.":"."),function(){
						$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.registro.codigo')
						});
					else{
						$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.registro.codigo')
					}
					
				break;
				case 2:
					Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[16],function(){
					})
				break;
			}
		})
		.error(function(data){
			Message.hideLoading();
			Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[16],function(){
			})
		})
		
	}
	//FUNCION QUE ENVIA EL CORREO DE CONFIRMACION
	$scope.reeviarCorreo=function(){
		Message.showLoading("")
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/reenvio', data: {Correo:$scope.nuevoUsuario.Correo}})
		.success(function(data){
			Message.hideLoading()
			if(!data.error) Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[19],function(){})
			else Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[36],function(){
				$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/limpia', data: {Correo:$scope.nuevoUsuario.Correo}})
				Memory.set("Registro",null);
				$scope.nuevoUsuario={
					Correo:$scope.nuevoUsuario.Correo,
					Contrasena:"",
					Contrasena2:"",
					Codigo:"",
					Promocion:""
				}
				$ionicViewSwitcher.nextDirection('back');
				$state.go('app.registro.datos')
			})
			
			
		})
		.error(function(data){
			Message.hideLoading()
			Message.alert($scope.idioma.Registro[1],$scope.idioma.Registro[16],function(){})
		})
	}
})

//CONTROLADOR PARA RECUPERAR CONTRASEÑA
.controller('Recuperar', function($scope,Memory,Message,$state,$ionicViewSwitcher,Verificacion,$timeout,$http,Usuario) {
	//FUNCION QUE SE EJECUTA CADA VEZ QUE LA VISTA ENTRA Y REVISA SI EL USUARIO ESTA LOGGEADO
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Usuario.get()){
				$ionicViewSwitcher.nextTransition("none");
				$ionicViewSwitcher.nextDirection('enter');
				$state.go('app.home.mapa');
		}
	})
	$scope.$on('$ionicView.afterEnter',function(){
			$timeout(function(){
				$("#recuperar_correo").focus();
				if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
			},500);
    })
	//VARIABLES
	$scope.recuperar={
		Correo:""
	}
	//FUNCION QUE SE EJECURA AL DAR CLIC EN EL BOTON DE ENVIAR CORREO DE RECUPERACION
	$scope.siguiente=function(){
		if(!Verificacion.email($scope.recuperar.Correo))
					Message.alert($scope.idioma.Registro[26],$scope.idioma.Registro[10],function(){
						$timeout(function(){
							$("#recuperar_correo").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100)
					})
		else{
			Message.showLoading("");
			$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/recuperacion', data: $scope.recuperar})
			//$http.post("https://www.virtual-guardian.com/virtual/recuperacion",$scope.recuperar)
		.success(function(data){
			Message.hideLoading()
			console.log(data);
			switch(parseInt(data.return)){
				case 0: 
					Message.alert($scope.idioma.Registro[26],$scope.idioma.Registro[27],function(){
					});
				break;
				case 1: 
					Message.alert($scope.idioma.Registro[26],$scope.idioma.Registro[28],function(){
						$timeout(function(){
							$ionicViewSwitcher.nextDirection('back');
							$state.go('app.login')
						},100);
					})
				break;
			}
			
		})
		.error(function(data){
			Message.hideLoading()
			Message.alert($scope.idioma.Registro[26],$scope.idioma.Registro[16],function(){})
		})
		}
	}
	//FUNCTION QUE SE EJECUTA AL DAR ENTER EN TECLADO
	$scope.enter=function(event){
		if(event.keyCode==13){
			if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
            $scope.siguiente();
		}
	}
	//FUNCION QUE SE EJECURA AL DAR CLIC EN EL BOTON REGRESAR 
	$scope.atras=function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('app.login')
	}
})