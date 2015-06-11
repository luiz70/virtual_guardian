angular.module('starter')
.controller("general",function($scope,$ionicLoading,$rootScope,$ionicPlatform,$ionicPopup,$ionicPopover,$ionicModal,$timeout){
	$scope.Diccionario={
		es:
			{
				general:{
					1:"Cargando...",
					2:"Aceptar",
					3:"Conexión a internet",
					4:"No hay conexión a internet.",
					5:"Actualizar",
					6:"Cancelar",
					7:"Actualizacion de historial",
					8:"<div style='font-size:2vh'>Para minimizar el consumo de datos móviles necesitamos descargar el historial de eventos desde una conexión Wifi.</div>¿Desea hacerlo en este momento?",
					9:"Actualizando...",
					10:"Su tranquilidad, nuestro territorio",
					11:"Suscripción",
					12:"Su periodo de prueba ha finalizado, pero aún puede seguir utilizando virtual en la versión limitada o contratar alguno de nuestros paquetes completos.",
					13:"Ver paquetes",
					14:"Continuar limitado",
					15:"Ver más..",
					16:"Selecciona",
					17:"Activados",
					18:"Desactivados",
					19:"Desactivar",
					20:"Activar",
					21:"Activadas",
					22:"Desactivadas",
					23:"Virtual Guardian",
					24:"Alguien mas ha iniciado sesión con este usuario.<br>Inicie sesión de nuevo",
					25:"Virtual Guardian y los logotipos de la aplicación son marcas comerciales de Red Guardian Virtual S.A. de C.V. Todos los derechos reservados.",
					26:"Virtual Guardian para dispositivos móviles fue creado con software de licencia abierta.",
					27:"Versión ",
					28:"Configuración GPS",
					29:"El servicio de localización de "+$rootScope.platform+" no está disponible en este momento, intente más tarde.",
                    30:"Para resolver todas tus dudas sobre el uso de la aplicacion hemos creado un recorrido por todas las funciones que virtual guardian te ofrece",
                    31:"¿Deseas verlo?",
                    32:"¿Quieres ver el recorrido de las funciones de la aplicación?",
					33:"Guardando..."
					
				},
				mapa:{
					1:"Fecha:",
					2:"Hora:",
					3:"Dirección:"
				},
				cuenta:{
					1:"Usuario",
					2:"Tipo de suscripcion",
					3:"Cambiar contraseña",
					4:"Conseguir versión completa",
					5:"Versión completa",
					6:"La version completa te permitira hacer uso ilimitado de Virtual Guardian con la posibilidad de realizar filtros de eventos anteriores a 7 días y recibir notificaciones cuando tu auto corra peligro. ¡Recibe la mejor informacion y protegete al máximo!",
					7:"Nueva contraseña",
					8:"Escriba su nueva contraseña",
					9:"Su contraseña se ha cambiado correctamente.",
					10:"Inicio suscripción",
					11:"Vigencia suscripción",
					12:"Ajustes de cuenta",
					13:"Código",
					14:"Comparte a tus amigos este código y gana un mes de suscripción completa por cada usuario que se registre."
					},
				menu:{
				1:"Filtros",
				2:"Ajustes de aplicación",
				3:"Ajustes de notificaciones",
				4:"Términos y condiciones",
				5:"Información",
				6:"Cerrar sesión",
				7:"Fecha inicial:",
				8:"Fecha final:",
				9:"Estados:",
				10:"Tipos de eventos:",
				11:"Periodo:"	,
				12:"Radio:",
				13:"Eventos:",
				14:"Personas:",
				15:"Auto:",
				16:"Rango personas:",
				17:"Rango auto:",
				18:"Rango personal:",
				19:"Proporciona el rango predefinido en metros para búsqueda de eventos en el mapa. 10m-16,000m",
				20:"El rango proporcionado no es valido, proporciona un valor entre 10 y 16,000 metros.",
				21:"Cuando algo suceda cerca de ti te notificaremos, proporciona la distancia máxima a la que consideras que corres peligro. 10m-5,000m",
				22:"El rango proporcionado no es valido, proporciona un valor entre 10 y 5,000 metros.",
				23:"Cuando algo suceda cerca de tu auto te notificaremos, proporciona la distancia máxima a la que consideras corre peligro. 10m-5,000m",
				24:"Tiempo:",
				25:"Cuando algo suceda dentro de los ultimos minutos te notificaremos, proporciona el tiempo máximo en el que consideras que el evento es relevante. 10-180 min.",
				26:"El tiempo no es valido, proporciona un valor entre 10 y 180 minutos.",
                27:"Ayuda",
            28:"Mi cuenta"
				},
				recorrido:{
					1:"¿Cómo usar Virtual Guardian?",
					2:"Empezaremos por conocer los iconos de los eventos que reportamos para ti:",
					3:"Siguiente",
					4:"Terminar",
					5:'Para ver en otro momento selecciona la opción "Ayuda" del menú lateral.'
					},
				periodos:{
				7:"Semanal",
				30:"Mensual",
				180:"Semestral",
				365:"Anual"
				},
				auto:{
					1:"Vigilar mi auto",
					2:"Detener vigilancia",
					3:"Analizando zona...",
					4:"Análisis de seguridad",
					5:"Estos son los eventos que han sucedido en la semana a menos de ",
					6:"km de tu auto.",
					7:"¿Quieres estacionarlo aquí?",
					8:"Arrastra el auto hasta la ubicación donde lo estacionaste para cuidarlo por ti.",
					9:"(Por tu seguridad Virtual Guardian no almacena la ubicación en sus servidores)"
				},
				personas:{
					1:"Agregar persona",
					2:"Introduce el correo electrónico de la persona que deseas agregar",
					3:"No puedes agregar tu correo electrónico.",
					4:" se ha agregado correctamente a tus personas.",
					5:" no es miembro de Virtual Guardian.",
					6:" ya esta en tu lista de personas.",
					7:" no ha aceptado tu solicitud a personas.",
					8:"Activo",
					9:"Solicitud enviada",
					10:"Pendiente de aceptar",
					11:"Eliminar persona",
					12:"¿Estas seguro de que deseas eliminar de tu lista de personas a ",
					13:"Aceptar persona",
					14:"¿Deseas aceptar en tu lista de personas a ",
					15:" se ha eliminado de tu lista de personas",
					16:" se ha aceptado en tu lista de personas",
					17:"No has agregado personas",
                    18:"Agregar persona"
				},
				login:{
					1:"Iniciar Sesión",
					2:"Correo electrónico",
					3:"Contraseña",
					4:"Entrar",
					5:"Crear cuenta nueva",
					6:"¿Olvidaste tu contraseña?",
					7:"El correo electrónico y la contraseña que ingresaste no coinciden con nuestros registros.\nPor favor, revisa e inténtalo de nuevo.",
					8:"Iniciando sesión...",
					9:"Cerrando sesión...",
					10:"¿Desea cerrar su sesión?"
				},registro:{
					1:"Registro",
					2:"Virtual Guardian no solicita información personal con el objetivo de brindarte la mayor protección y confidencialidad.",
					3:"Correo Elecrónico",
					4:"Contraseña",
					5:"Repetir Contraseña",
					6:"Leer aviso de privacidad",
					7:"Continuar",
					8:"Regresar",
					9:"El correo electrónico es obligatorio para el registro.",
					10:"El correo electrónico proporcionado no es válido",
					11:"La contraseña debe de ser de 8 dígitos como mínimo y contener al menos un número y una letra.",
					12:"Las contraseñas no coinciden.",
					13:"Hemos enviado a tu correo electrónico proporcionado, un mensaje con el código de verificación, introdúcelo en el siguiente campo para completar tu registro",
					14:"Código",
					15:"El correo electrónico ya esta registrado",
					16:"Se ha producido un error inesperado, intente más tarde",
					17:"El código proporcionado es incorrecto, verifica tu correo electrónico",
					18:"Enviar código de nuevo",
					19:"El código de verificación ha sido enviado nuevamente a tu correo electrónico",
					20:"Bienvenido a",
					21:"Terminar",
					22:"Ahora puedes iniciar sesión y mantenerte informado y protegido con nosotros.",
					23:"Proporciona tu correo electrónico registrado para enviarte un mensaje con las instrucciones necesarias para recuperar tu contraseña.",
					24:"Enviar correo de recuperación",
					25:"No has proporcionado tu correo electrónico.",
					26:"Recuperar contraseña",
					27:"El correo proporcionado no esta registrado en Virtual Guardian",
					28:"El correo de recuperación se ha enviado correctamente, sigue las instrucciones para reestablecer tu contraseña.",
					29:"Si tienes algún código de promocion, ingresalo ahora para hacerlo válido.",
					30:"Código de promoción"
					
				},
				notificaciones:{
					1:"No hay notificaciones recientes",
					2:"Solicitud de personas",
					3:" quiere agregarte a su lista de personas.",
					4:" acepto tu solicitud de personas.",
					5:" a ",
					6:" de ",
					7:" de tu auto.",
					8:"Codigo de promoción",
					9:" se registró con tu código de promoción.",
					10:"Buenas noticias, ahora tienes un mes mas de suscripción completa por invitar a tus amigos."
				},
				meses:{
				1:"Enero",
				2:"Febrero",
				3:"Marzo",
				4:"Abril",
				5:"Mayo",
				6:"Junio",
				7:"Julio",
				8:"Agosto",
				9:"Septiembre",
				10:"Octubre",
				11:"Noviembre",
				12:"Diciembre"
				}
			},
		en:
			{
				general:{
					1:"Loading...",
					2:"Acept",
					3:"Internet connection",
					4:"No internet connection.",
					5:"Pull to refresh...",
					6:"Cancel",
					7:"Update history",
					8:"<div style='font-size:2vh'>To minimize the use of mobile data is need to download the event history from a Wifi connection.</div>you like to do now?",
					9:"Updating..."
				},
				auto:{
					1:"Watch my car",
					2:"Stop watching"
				},
				login:{
					1:"Login",
					2:"Email",
					3:"Password",
					4:"Login",
					5:"Create new account",
					6:"Forgot your password?",
					7:"The email and password you entered did not match our records.\nPlease double-check and try again.",
					8:"Logging in...",
					9:"Logging out..."
				}
			}
	};
	$rootScope.cleanMemory=function(){
	  	window.localStorage.removeItem("nPendientes");
            console.log("clean");
        window.localStorage.removeItem("Notificaciones");
		window.localStorage.removeItem("Personas");
		window.localStorage.removeItem("Usuario");
		window.localStorage.removeItem("Filtros");
        window.localStorage.removeItem("Auto");
  	}
            $rootScope.keycover=false;
	$rootScope.idioma=$scope.Diccionario.es;
	$ionicPlatform.ready(function(){
		if(navigator.globalization)
		navigator.globalization.getPreferredLanguage(
    		function (language) {
				$scope.$apply(function(){
				var l=language.value.split("-")
				//if(l[0]=="EN" || l[0]=="en" || l[0]=="En")$rootScope.idioma=$scope.Diccionario.en;
				})
                                                     
			})	
			
			
		});
            
            $rootScope.enterkey=function(event){
            if($rootScope.iOS)if(event.keyCode==13)$rootScope.closekey();
            }
            $rootScope.closekey=function(){
				if($rootScope.iOS){
            $timeout(function(){
                     $rootScope.keycover=false;
                     cordova.plugins.Keyboard.close();
                     },500);
            
				}
            }
            $rootScope.showCover=function(){if($rootScope.iOS)$rootScope.keycover=true;}
	
	$rootScope.showCargando = function(texto) {
    	$ionicLoading.show({
      		template: '<div style="width:100%"><ion-spinner icon="android" class="spinner-dark"></ion-spinner></div>'+texto
   		});
 	};
 	$rootScope.hideCargando = function(){
    	$ionicLoading.hide();
 	};
	$scope.evalid=function(email){
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
	}
	$rootScope.alert=function(titulo,texto,funcion){
		/*if(navigator.notification)
		navigator.notification.alert(texto,funcion, titulo,$rootScope.idioma.general[2]);
		else alert(texto);*/
		var alertPopup = $ionicPopup.alert({
     		title: titulo,
     		template: texto,
			okText:$rootScope.idioma.general[2]
   		});
   		alertPopup.then(function(res) {
     		funcion();
   		});
	}
	$scope.confirm = function(titulo,pregunta,funcion,btn1,btn2,closable) {
		
		closable=closable||function(){return true};
		btn1 = btn1 || $rootScope.idioma.general[2];
    	btn2 = btn2 || $rootScope.idioma.general[6];
   		$scope.confirmPopup = $ionicPopup.confirm({
     		title: titulo,
     		template: "<div>"+pregunta+"</div>"+
			'<div id="botones_confirm"></div>'
			
			,
			buttons: [{ 
    			text: btn2,
    			type: 'button-default',
    			onTap: function(){
					  return 0;
				}
  			}, {
    			text: btn1,
    			type: 'button-positive',
    			onTap: function(){
				return 1;
				}
  			}]
   		});
		if(!closable())$timeout(function(){
			$(".popup-buttons").addClass("ng-hide");
			$(".popup-visible").removeClass("ng-hide");
			
		},10);
		
   		$scope.confirmPopup.then(function(res) {
			if(res) {
				funcion();
				$scope.confirmPopup.close();
				
			} else {
				 $scope.confirmPopup.close();
			}
		})
 	};
	
    $scope.prompt=function(title,subtitle,type,placeholder,funcion,valor){
		valor=valor || "";
	var myPopup = $ionicPopup.show({
    template: '<input id="input_prompt" type="'+type+'" placeholder="'+placeholder+'" value="'+valor+'" ng-keydown="enterkey($event)"  ng-focus="showCover()" ng-blur="closekey()">',
    title: title,
    subTitle: subtitle,
	inputType: type,
    scope: $scope,
	buttons: [{ 
    			text: $rootScope.idioma.general[6],
    			type: 'button-default',
    			onTap: function(){
					  return 0;
				}
  			}, {
    			text: $rootScope.idioma.general[2],
    			type: 'button-positive',
    			onTap: function(){
				return 1;
				}
  			}]
    
  });
  myPopup.then(function(res) {
	  if(res){
    funcion($("#input_prompt").val());
	  }
  });
	}
	 $scope.popup=function(title,template,funcion){
	var myPopup = $ionicPopup.show({
    template: template,
    title: title,
    scope: $scope,
	cssClass:"popupActivo",
	buttons: [{ 
    			text: $rootScope.idioma.general[2],
    			type: 'button-positive',
    			onTap: function(){
					  return 1;
				}
  			}]
    
  });
  myPopup.then(function(res) {
	  if(res){
    funcion();
	  }
  });
	}
	
  $scope.openSelect = function(opciones,multiple) {
	$scope.opcionesModal=opciones;
	if(multiple)m="pantallas/modalSelect.html"
	else m="pantallas/modalSelectSingle.html"
	
	$scope.modalSelect = $ionicModal.fromTemplateUrl(m, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalSelect = modal;
	$scope.modalSelect.show();
  });
    
  };
  $scope.closeModal = function() {
    $scope.modalSelect.hide();
	$scope.modalSelect.remove();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalSelect.remove();
  });
            $scope.modalTerminos=null;
            $scope.openTerminos = function(m) {
            $scope.modalTerminos = $ionicModal.fromTemplateUrl(m, {
                                                             scope: $scope,
                                                             animation: 'slide-in-up'
                                                             }).then(function(modal) {
                                                                     $scope.modalTerminos = modal;
                                                                     $scope.modalTerminos.show();
                                                                     });
            
            };
            $scope.closeModalt = function() {
            $scope.modalTerminos.hide();
            $scope.modalTerminos.remove();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                       $scope.modalTerminos.remove();
                       });


  
}).service('CordovaNetwork', ['$ionicPlatform', '$q', function($ionicPlatform, $q,$rootScope) {
  // Get Cordova's global Connection object or emulate a smilar one
  var Connection = window.Connection || {
    "CELL"     : "cellular",
    "CELL_2G"  : "2g",
    "CELL_3G"  : "3g",
    "CELL_4G"  : "4g",
    "ETHERNET" : "ethernet",
    "NONE"     : "none",
    "UNKNOWN"  : "unknown",
    "WIFI"     : "wifi"
  };
 
  var asyncGetConnection = function () {
    var q = $q.defer();
    $ionicPlatform.ready(function () {
      if(navigator.connection) {
        q.resolve(navigator.connection);
      } else {
        q.reject('navigator.connection is not defined');
      }
    });
    return q.promise;
  };
 
  return {
    isOnline: function () {
      return asyncGetConnection().then(function(networkConnection) {
        var isConnected = false;
 
        switch (networkConnection.type) {
          case Connection.ETHERNET:
          case Connection.WIFI:
          case Connection.CELL_2G:
          case Connection.CELL_3G:
          case Connection.CELL_4G:
          case Connection.CELL:
            isConnected = true;
            break;
        }
		
        return isConnected;
      });
    }
  };
}]);
 