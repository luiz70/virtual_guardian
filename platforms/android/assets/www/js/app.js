// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pushNotification ;

angular.module('starter', ['ionic', 'ngCordova','ui.bootstrap','btford.socket-io','ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform,$rootScope,$location, $cordovaPush, $ionicHistory,$ionicSlideBoxDelegate,$timeout,$cordovaAppVersion,$http){
	var iosConfig = {
    "badge": true,
    "sound": true,
    "alert": true,
  }; 
  var androidConfig = {
    "senderID": "12591466094",
  };
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
                       window.onerror=function(message, url, line){
                       console.log("Error: "+message+ " in "+url+" at line "+line);
                       }
  	$rootScope.Usuario=window.localStorage.getArray("Usuario");
	//if(navigator.splashscreen)
	//navigator.splashscreen.show();
	if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
	}
	$rootScope.version="0.0.1";
	if(window.cordova){
		$cordovaAppVersion.getAppVersion().then(function (version) {
        $rootScope.version=version
      });
	}
	$rootScope.Update=new Date();
	$rootScope.UpdateEvt=new Date();
        //window.localStorage.removeItem("UpdateHistorial")
        if(!window.localStorage.getItem("UpdateHistorial")){
            $rootScope.UpdateHistorial=0;
            window.localStorage.setItem("UpdateHistorial",$rootScope.UpdateHistorial);
        }
        else $rootScope.UpdateHistorial=window.localStorage.getItem("UpdateHistorial");
                       
	$rootScope.front=true;	
	$rootScope.sinMapa=false;
    if(window.localStorage.getArray("nPendientes")) $rootScope.notPendientes=window.localStorage.getArray("nPendientes");
	else $rootScope.notPendientes=0;	
	$rootScope.tabInicial=1;
	$rootScope.scriptMapa=false;
	$rootScope.vh=window.innerHeight/100;
	$rootScope.vw=window.innerWidth/100;
	if(window.innerWidth<=320)$rootScope.small=true;
	else $rootScope.small=false;
	$rootScope.platform=window.device.platform;
	$rootScope.OS=window.device.platform;
	$rootScope.iOS=(window.device.platform=="iOS");
    if($rootScope.iOS && window.cordova && window.cordova.plugins.Keyboard)window.cordova.plugins.Keyboard.disableScroll(true)
    $rootScope.ipad=(window.device.model.substring(0,4).toLowerCase()=="ipad");
	window.addEventListener('native.keyboardshow', keyboardShowHandler);
	window.addEventListener('native.keyboardhide', keyboardHideHandler);
	document.addEventListener("pause", $rootScope.onPause);
	document.addEventListener("resume", $rootScope.onResume);
	
	
	if($rootScope.Usuario==null){
				$rootScope.Usuario=null;
				$location.path('/login');
				
		}else{
			
				$rootScope.Usuario=window.localStorage.getArray("Usuario");
				console.log($rootScope.Usuario);
				$location.path('/inicio');
				
				
				//$rootScope.unregister();	
				//if(pushNotification)registerNotification();
			}
		

	
	
  });
  $rootScope.registraiOS=function(){
     if(window.cordova)$cordovaPush.register(iosConfig).then(function(deviceToken) {
      // Success -- send deviceToken to server, and store for future use
	  /*$.post("https://www.virtual-guardian.com/movil/php.php",{funcion:"logIn_reg",Id:window.localStorage.getArray("Usuario").Id,Registro:deviceToken,Os:window.device.platform},function(data){
		  $rootScope.Usuario.Registro=deviceToken;
			   window.localStorage.setArray("Usuario",$rootScope.Usuario);
			});*/
			$http.post("https://www.virtual-guardian.com/api/logIn_reg",{
				Id:window.localStorage.getArray("Usuario").Id,
				Registro:deviceToken,
				Os:window.device.platform
				})
		.success(function(data,status,header,config){
			$rootScope.Usuario.Registro=deviceToken;
			window.localStorage.setArray("Usuario",$rootScope.Usuario);
		})
    }, function(err) {
      alert("Registration error: " + err)
    });
  }
  $rootScope.registraAndroid=function(){
	$cordovaPush.register(androidConfig).then(function(result) {
      // Success
    }, function(err) {
      // Error
    })
	
	
};
$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    if(window.device.platform=="Android"){
        switch(notification.event) {
            case 'registered':
               if (notification.regid.length > 0 ) {
                    if(notification.regid!=$rootScope.Usuario.Registro)
                    $http.post("https://www.virtual-guardian.com/api/logIn_reg",{
                          Id:window.localStorage.getArray("Usuario").Id,
                          Registro:notification.regid,
                          Os:window.device.platform
                    })
                    .success(function(data,status,header,config){
                        $rootScope.Usuario.Registro=notification.regid;
                        window.localStorage.setArray("Usuario",$rootScope.Usuario);
                    })
               }
          break;

          case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
		  
           	if(notification.coldstart){
               if(notification.notificaciones>0){
                    $rootScope.notPendientes+=notification.notificaciones;
                    window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
               }
			}else if(notification.foreground){
				if($ionicSlideBoxDelegate.currentIndex()!=1){
				$rootScope.notPendientes+=notification.notificaciones;
				window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
				}else{
					$rootScope.notPendientes+=notification.notificaciones;
					$rootScope.cargando=true;
					$rootScope.doRefreshNotification();
				}
			}else if(notification.notificaciones>0){
				//$rootScope.onTab(2);
				
				$rootScope.notPendientes+=notification.notificaciones;
				window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
			}
			
			for(var i=0;i<notification.notificaciones;i++){
			if(notification["Notif"+i].Tipo=="8"){
				$timeout($rootScope.muestraTip(notification["Notif"+i]),1000);
			}else if(notification["Notif"+i].Tipo=="10"){
				$rootScope.PersonaLlamada={
					IdCliente:notification["Notif"+i].IdUsuario,
					Correo:notification["Notif"+i].Correo,
					Llamando:false,
					notificacion:notification["Notif"+i],
					Contestada:!notification.foreground
				}
				$location.path("/llamada");
			}
			}
            break;

            case 'error':
          
            break;

            default:
          
            break;
        }
    }else{
        if(notification.Tipo=="8"){
            $timeout($rootScope.muestraTip(notification),1000);
        }
        else if(notification.Tipo=="10"){
            $rootScope.PersonaLlamada={
               IdCliente:notification.IdUsuario,
               Correo:notification.Correo,
               Llamando:false,
               notificacion:notification,
               Contestada:!Boolean(notification.foreground)
            }
            $location.path("/llamada");
        }else
        if(notification.foreground){
                
			if($ionicSlideBoxDelegate.currentIndex()!=1){
				$rootScope.notPendientes+=parseInt(notification.notificaciones);
				window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
            }else{
                $rootScope.notPendientes+=parseInt(notification.notificaciones);
                $rootScope.cargando=true;
                $rootScope.doRefreshNotification();
            }
        
        }else if(parseInt(notification.notificaciones)>0){
               $rootScope.onTab(2);
        }
        
        
		  	
    }
});
	
$rootScope.unregister=function(){
	$cordovaPush.unregister().then(function(result) {
      // Success!
    }, function(err) {
      // Error
    })

}
  $ionicPlatform.onHardwareBackButton(function(event){
	 event.preventDefault();
     event.stopPropagation();
	 $ionicHistory.clearHistory();
	 
	 })
	 $ionicPlatform.registerBackButtonAction(function () {
    	navigator.app.exitApp();
		}, 100);
	 //$ionicPlatform.on("volumedownbutton",function(){});
	 //$ionicPlatform.on("volumeupbutton",function(){});
	 $rootScope.onResume=function(){
	if(((new Date()).getTime()-$rootScope.Update.getTime())/60000>=30)$rootScope.isVigente();
	if(((new Date()).getTime()-$rootScope.UpdateEvt.getTime())/60000>=15)$rootScope.showEventos();
	
	}
	$rootScope.onPause=function(){
	//guarda estado		
	}
})
 /*.run(function (signaling) {
    signaling.on('messageReceived', function (name, message) {
      switch (message.type) {
        case 'call':
          if ($state.current.name === 'app.call') { return; }
          
          //ESTAN LLAMANDO$state.go('app.call', { isCalling: false, contactName: name });
          break;
      }
    });
 })*/
.controller("home",function($rootScope,$location){
	/*if(!window.localStorage.getArray("Usuario")){
				$rootScope.Usuario=null;
				$location.path('/login');
				
		}else{
			
				$rootScope.Usuario=window.localStorage.getArray("Usuario");
				console.log($rootScope.Usuario);
				$location.path('/inicio');
				
				
				$rootScope.unregister();	
				if(pushNotification)registerNotification();
			}*/
	})
.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {
 $ionicConfigProvider.views.maxCache(0);
 $ionicConfigProvider.views.swipeBackEnabled(false);
 $ionicConfigProvider.platform.ios.views.maxCache(0);
 $ionicConfigProvider.platform.android.views.maxCache(0);
 $ionicConfigProvider.views.transition("ios");
 $ionicConfigProvider.views.forwardCache(false);
 var headers = {
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			};
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
	$httpProvider.defaults.headers.post['Access-Control-Allow-Origin']='https://www.virtual-guardian.com';
	$httpProvider.defaults.withCredentials = false;
	
  $stateProvider
  .state('index', {
    url: "/",
	views: {
      '': {
        templateUrl: "pantallas/home.html"
      }
	}
  })
  .state('ajustes', {
    url: "/ajustes",
	views: {
      '': {
        templateUrl: "pantallas/ajustes.html"
      }
	}
  })
   .state('login', {
    url: "/login",
	views: {
      '': {
        templateUrl: "pantallas/login.html"
      }
	}
    
    //controller: 'idioma'
  })
   .state('llamada', {
    url: "/llamada",
	views: {
      '': {
        templateUrl: "pantallas/llamada.html"
      }
	}
    
    //controller: 'idioma'
  })
  .state('rcuperar', {
    url: "/recuperar",
	views: {
      '': {
        templateUrl: "pantallas/recuperar.html"
      }
	}
    
    //controller: 'idioma'
  })
  .state('registro', {
    url: "/registro",
	views: {
      '': {
        templateUrl: "pantallas/registro.html"
      },
	  'vista-r1@registro': {
        templateUrl: "pantallas/registro1.html"
      },
	  'vista-r2@registro': {
        templateUrl: "pantallas/registro2.html"
      }/**/,
	  'vista-r3@registro': {
        templateUrl: "pantallas/registro3.html"
      }
	}
    
    //controller: 'idioma'
  })
  .state('inicio', {
    url: "/inicio",
	views: {
      '': {
        templateUrl: "pantallas/inicio.html"
      },
	  'vista-mapa@inicio': {
        templateUrl: "pantallas/mapa.html"
      },
	  'vista-notificaciones@inicio': {
        templateUrl: "pantallas/notificaciones.html"
      },
	  'vista-personas@inicio': {
        templateUrl: "pantallas/personas.html"
      },
	  'vista-auto@inicio': {
        templateUrl: "pantallas/auto.html"
      }
	}
  })
   
  
  // if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/');
}).filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
}
})
.factory('signaling', function (socketFactory) {
    var socket = io.connect('http://www.virtual-guardian.com:8303');
    var socketFactory = socketFactory({
      ioSocket: socket
    });

    return socketFactory;
})
.factory('ContactsService', function (signaling) {
    var onlineUsers = [];

    signaling.on('online', function (name) {
      if (onlineUsers.indexOf(name) === -1) {
        onlineUsers.push(name);
      }
    });

    signaling.on('offline', function (name) {
      var index = onlineUsers.indexOf(name);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
    });

    return {
      onlineUsers: onlineUsers,
      setOnlineUsers: function (users, currentName) {
        this.currentName = currentName;
        
        onlineUsers.length = 0;
        users.forEach(function (user) {
          if (user !== currentName) {
            onlineUsers.push(user);
          }
        });
      }
    }
  });
function keyboardShowHandler(e){
    if(window.device.platform=="Android")
        $("#navview").height($("#navview").height()-e.keyboardHeight+20);
               }
function keyboardHideHandler(e){
    if(window.device.platform=="Android")
        $("#navview").height("100vh");
}
Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function cleanutf(st){
	
	if(st.indexOf("Ã�")>=0)st=replaceAll(st,"Ã�","Ã¡");
	return st;
}
function replaceAll( text, busca, reemplaza ){
  while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca,reemplaza);
  return text;
}