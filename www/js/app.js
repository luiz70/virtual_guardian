// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pushNotification ;

angular.module('starter', ['ionic', 'ngCordova','ui.bootstrap'])

.run(function($ionicPlatform,$rootScope,$location, $cordovaPush, $ionicHistory,$ionicSlideBoxDelegate,$timeout,$cordovaAppVersion){
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
	$rootScope.front=true;	
	$rootScope.sinMapa=false;
    if(window.localStorage.getArray("nPendientes")) $rootScope.notPendientes=window.localStorage.getArray("nPendientes");
	else $rootScope.notPendientes=0;	
	$rootScope.tabInicial=1;
	$rootScope.iOS=(window.device.platform=="iOS");
    $rootScope.ipad=(window.device.model.substring(0,4).toLowerCase()=="ipad");
	window.addEventListener('native.keyboardshow', keyboardShowHandler);
	window.addEventListener('native.keyboardhide', keyboardHideHandler);
	document.addEventListener("pause", $rootScope.onPause);
	document.addEventListener("resume", $rootScope.onResume);
	
	
	
	
		if(!window.localStorage.getArray("Usuario")){
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
	  $.post("http://www.virtual-guardian.com/movil/php.php",{funcion:"logIn_reg",Id:window.localStorage.getArray("Usuario").Id,Registro:deviceToken,Os:window.device.platform},function(data){
		  $rootScope.Usuario.Registro=deviceToken;
			   window.localStorage.setArray("Usuario",$rootScope.Usuario);
			});/*$.post("http://www.virtual-guardian.com/movil/php.php",{funcion:"logIn_reg",Id:window.localStorage.getArray("Usuario").Id,Registro:deviceToken,Os:window.device.platform},function(data){
			});*/
      //$http.post("http://server.co/", {user: "Bob", tokenID: deviceToken})
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
           $.post("http://www.virtual-guardian.com/movil/php.php",{funcion:"logIn_reg",Id:window.localStorage.getArray("Usuario").Id,Registro:notification.regid,Os:window.device.platform},function(data){
			   $rootScope.Usuario.Registro=notification.regid;
			   window.localStorage.setArray("Usuario",$rootScope.Usuario);
			});
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          	if(notification.coldstart){
				$rootScope.tabInicial=2;
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
				$scope.onTab(2);
			}
          break;

        case 'error':
          
          break;

        default:
          
          break;
      }
		}else{
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
            $scope.onTab(2);
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
	 
	 $ionicPlatform.on("volumedownbutton",function(){alert(1)});
	 $ionicPlatform.on("volumeupbutton",function(){alert(2)});
	 $rootScope.onResume=function(){
		//$rootScope.front=true;
	}
	$rootScope.onPause=function(){
	//$rootScope.front=false;		
	}
})
.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {
 $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.platform.ios.views.maxCache(0);
 $ionicConfigProvider.platform.android.views.maxCache(0);
 $ionicConfigProvider.views.transition("ios");
 $ionicConfigProvider.views.forwardCache(false);
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
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
function keyboardShowHandler(e){
    if(window.device.platform=="Android")$("#navview").height($("#navview").height()-e.keyboardHeight+20);
               }
function keyboardHideHandler(e){
    if(window.device.platform=="Android")$("#navview").height("100vh");
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
	
	if(st.indexOf("Á")>=0)st=replaceAll(st,"Á","á");
	return st;
}
function replaceAll( text, busca, reemplaza ){
  while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca,reemplaza);
  return text;
}