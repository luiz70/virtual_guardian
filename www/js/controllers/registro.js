// JavaScript Document
angular.module('starter.controllers')
//Controlador para la seccion de registro
.controller('Registro', function($scope,Memory,Message,$state,$ionicViewSwitcher,Verificacion,$timeout,$http,Usuario,$rootScope) {
	
	//VARIABLES
	$scope.nuevoUsuario={
		Correo:"",
		Contrasena:"",
		Contrasena2:"",
		Codigo:"",
		Promocion:""
	}
	$scope.botonSiguiente=$rootScope.idioma.Registro[7];
	$scope.botonAtras=$rootScope.idioma.Registro[8];
	$scope.state=$scope.getState($state.current.name)
	$scope.abrePrivacidad=function(){
		window.open("https://www.virtual-guardian.com/privacidad.pdf","_system");
	}
	
	//FUNCION QUE SE EJECUTA CADA VEZ QUE LA VISTA ENTRA Y REVISA SI EL USUARIO ESTA LOGGEADO
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Memory.get("Usuario")){
				$ionicViewSwitcher.nextTransition("none");
				$ionicViewSwitcher.nextDirection('enter');
				$state.go('app.home.mapa');
		}
	})
	//FUNCION QUE SE EJECUTA CADA VEZ QUE LA VISTA ENTRA Y REVISA SI EL USUARIO YA TIENE UN REGISTRO EN PROCESO PARA CARGAR LOS DATOS ALMACENADOS
	$scope.$on('$ionicView.afterEnter',function(){
		angular.element(document.getElementById("app_content")).removeClass("invisible")
    	if(Memory.get("Registro"))$scope.nuevoUsuario=Memory.get("Registro");
    })
	//FUNCION QUE SE EJECUTA CADA QUE CAMBIA DE ESTADO DENTRO DE REGISTRO PARA MOSTRAR LOS BOTONES CORRECTOS EN LA PARTE INFERIOR
	$scope.$watch('state', function() {
    	switch($scope.state){
			case "datos":
				$scope.botonSiguiente=$rootScope.idioma.Registro[7];
				$scope.botonAtras=$rootScope.idioma.Registro[8];
			break; 
			case "codigo":
				$scope.botonSiguiente=$rootScope.idioma.Registro[7];
				$scope.botonAtras=$rootScope.idioma.General[6];
			break;
			case "final":
				$scope.botonSiguiente=$rootScope.idioma.Registro[21];
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
					Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[10],function(){
						$timeout(function(){
							document.getElementById("registro_correo").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100)
					})
				else if(!Verificacion.password($scope.nuevoUsuario.Contrasena,8))
					Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[11],function(){
						$timeout(function(){
							$scope.nuevoUsuario.Contrasena="";
							$scope.nuevoUsuario.Contrasena2="";
							document.getElementById("registro_contrasena").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100);
					})
				else if($scope.nuevoUsuario.Contrasena!=$scope.nuevoUsuario.Contrasena2)
					Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[12],function(){
						$timeout(function(){
							$scope.nuevoUsuario.Contrasena2="";
							document.getElementById("registro_contrasena2").focus();
							if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
						},100);
					})
				else{
					if($scope.nuevoUsuario.Promocion!="" && $scope.nuevoUsuario.Promocion){
						Message.showLoading($rootScope.idioma.Registro[32])
						Verificacion.promocion($scope.nuevoUsuario.Promocion)
						.success(function(data){
							Message.hideLoading()
							if(data.error){
								$scope.nuevoUsuario.Promocion="";
								Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[9],function(){})
							}else{
								if(data.Cantidad==0){
									$scope.nuevoUsuario.Promocion="";
									Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[31],function(){})
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
				Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[17],function(){
						$timeout(function(){
							document.getElementById("registro_correo").focus();
						})
				});
				else{
					Message.showLoading($rootScope.idioma.Registro[34])
					$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/finalizar', data: {Codigo:$scope.nuevoUsuario.Codigo,Correo:$scope.nuevoUsuario.Correo}})
					.success(function(data){
						Message.hideLoading();
						
						switch(parseInt(data.return)){
							case 0: 
								Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[17],function(){
								});
							break;
							case 1: 
								Memory.set("Login",Memory.get("Registro"));
								Memory.set("Registro",null);
								$ionicViewSwitcher.nextDirection('forward');
								$state.go('app.registro.final');
							break;
							case 2:
								Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[36],function(){
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
						Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[16],function(){})
					})
				}
			break;
			case "final":
				var usr=Memory.get("Login");
				Message.showLoading($rootScope.idioma.Login[8]);
				Usuario.login({Correo:usr.Correo,Contrasena:usr.Contrasena})
				.success(function(data){
					Memory.set("Login",null);
					if (data.error){
						Message.hideLoading();
						Message.alert($rootScope.idioma.Login[1],$rootScope.idioma.Registro[37],function(){
							$ionicViewSwitcher.nextDirection('back');
							$state.go('app.login')
						});
					}else{
						$rootScope.Usuario=data;
						$timeout(function(){
							Message.hideLoading();
							$ionicViewSwitcher.nextDirection('forward');
							$state.go('app.home.mapa');
						},500)
					}
					
				})
				.error(function(){
					Message.hideLoading();
					
				})
				
			break;
		}
	}
	//FUNCTION QUE SE EJECUTA AL DAR ENTER EN TECLADO
	$scope.enter=function(event,field){
		if(event.keyCode==13){
			//verificar en que campo se encuentra
			switch(field){
				case 1://Email
					document.getElementById("registro_contrasena").focus();
				break;
				case 2://Password
					document.getElementById("registro_contrasena2").focus();
				break;
				case 3://Password
					document.getElementById("registro_codigo").focus();
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
		if(promocion.Id)$scope.nuevoUsuario.IdPromocion=promocion.Id;
		Message.showLoading($rootScope.idioma.Registro[33])
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro', data: $scope.nuevoUsuario})
	
		.success(function(data){
			Message.hideLoading();
			switch(parseInt(data.return)){
				case 0: 
					Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[15],function(){
					});
				break;
				case 1: 
					Memory.set("Registro",$scope.nuevoUsuario);
					if(promocion)Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[35].replace("TIEMPO",promocion.Duracion).replace("TIPO",promocion.Tipo)+(promocion.Duracion>1?"es.":"."),function(){
						$ionicViewSwitcher.nextDirection('forward');
						$state.go('app.registro.codigo')
						});
					else{
						$ionicViewSwitcher.nextDirection('forward');
					$state.go('app.registro.codigo')
					}
					
				break;
				case 2:
					Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[16],function(){
					})
				break;
			}
		})
		.error(function(data){
			Message.hideLoading();
			Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[16],function(){
			})
		})
		
	}
	//FUNCION QUE ENVIA EL CORREO DE CONFIRMACION
	$scope.reeviarCorreo=function(){
		Message.showLoading("")
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/registro/reenvio', data: {Correo:$scope.nuevoUsuario.Correo}})
		.success(function(data){
			Message.hideLoading()
			if(!data.error) Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[19],function(){})
			else Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[36],function(){
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
			Message.alert($rootScope.idioma.Registro[1],$rootScope.idioma.Registro[16],function(){})
		})
	}
})

//CONTROLADOR PARA RECUPERAR CONTRASEÑA
.controller('Recuperar', function($scope,Memory,Message,$state,$ionicViewSwitcher,Verificacion,$timeout,$http,Usuario,$rootScope) {
	//FUNCION QUE SE EJECUTA CADA VEZ QUE LA VISTA ENTRA Y REVISA SI EL USUARIO ESTA LOGGEADO
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Usuario.get()){
				$ionicViewSwitcher.nextTransition("none");
				$ionicViewSwitcher.nextDirection('enter');
				$state.go('app.home.mapa');
		}
	})
	$scope.$on('$ionicView.afterEnter',function(){
		angular.element(document.getElementById("app_content")).removeClass("invisible")
			
    })
	//VARIABLES
	$scope.recuperar={
		Correo:""
	}
	//FUNCION QUE SE EJECURA AL DAR CLIC EN EL BOTON DE ENVIAR CORREO DE RECUPERACION
	$scope.siguiente=function(){
		if(!Verificacion.email($scope.recuperar.Correo))
					Message.alert($rootScope.idioma.Registro[26],$rootScope.idioma.Registro[10],function(){
						$timeout(function(){
							document.getElementById("recuperar_correo").focus();
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
					Message.alert($rootScope.idioma.Registro[26],$rootScope.idioma.Registro[27],function(){
					});
				break;
				case 1: 
					Message.alert($rootScope.idioma.Registro[26],$rootScope.idioma.Registro[28],function(){
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
			Message.alert($rootScope.idioma.Registro[26],$rootScope.idioma.Registro[16],function(){})
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