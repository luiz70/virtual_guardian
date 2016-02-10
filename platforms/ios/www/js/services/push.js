angular.module('starter.services')
.factory('Push',function($http,$rootScope,$cordovaPush,socket){
	var iosConfig = {
    	"badge": true,
    	"sound": true,
    	"alert": true,
  	}; 
	var androidConfig = {
    	"senderID": "12591466094",
  	};
  	var registra=function(token){
		socket.getSocket().emit("setDevice",$rootScope.Usuario.Id,token,window.device.platform)
		socket.getSocket().on("setDevice",setDevice);
		socket.getSocket().on("errorSetDevice",errorSetDevice);
  	}
	var errorSetDevice=function(data){
		$timeout(function(){
			registra(data);
		},5000);
	}
	var setDevice=function(data){
		socket.getSocket().removeListener("setDevice",setDevice);
		$rootScope.Usuario.Registro=data;
	}
	
	 $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
		switch(notification.event) {
			case 'registered': if(notification.regid.length > 0 )	registra(notification.regid);
          	break;
        	case 'message':
          		console.log(notification);
          	break;
		}
	})
	return {
		registra:function(state){
			if(state){
				if(window.cordova)
				switch(window.device.platform.toLowerCase()){
					case "android":
						$cordovaPush.register(androidConfig).then(function(result){});
					break;
					case "ios":
						$cordovaPush.register(iosConfig).then(registra)
					break;
				}
				else registra("")
			}else{
				$cordovaPush.unregister(options).then(function(result) {
					registra("");
				}, function(err) {
					registra("");
				});
			}
			
			return true;
		},
		desregistra:function(){
			
    		return true;
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			return true;
		}
	}
})