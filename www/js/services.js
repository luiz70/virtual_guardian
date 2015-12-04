angular.module('starter.services', ['LocalStorageModule','ngError'])
.factory('Memory', function(localStorageService) {
	
	return {
		set: function(key,val){
			localStorageService.set(key, val);
		},
		get: function(key){
			return localStorageService.get(key);
		},
		clean: function(){
			localStorageService.clearAll();
		}
	}
})
.factory('Message', function(localStorageService,$ionicLoading,$ionicPopup) {
	var dictionary=null
	var alertPopUp=null;
	return {
		setDictionary:function(dictionary){
			this.dictionary=dictionary
		},
		showLoading: function(texto){
			$ionicLoading.show({
      			template: '<div style="width:100%"><ion-spinner icon="android" class="spinner-dark"></ion-spinner></div>'+texto
   			});
		},
		hideLoading:function(){
			$ionicLoading.hide();
		},
		alert:function(titulo,texto,funcion){
			if(alertPopUp)alertPopUp.close();
			alertPopUp = $ionicPopup.alert({
     			title: titulo,
     			template: texto,
				okText: this.dictionary.General[2]
   			});
   			alertPopUp.then(function(res) {
     			funcion();
   			});
		}
	}

})
.factory('Verificacion',function($http){
	var re = /[0-9]/;
	var re2 = /[a-z]/;
	var re3 = /[A-Z]/;
	var remail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	
	return {
		password:function(pass,length){
			if(pass.lenght<length)return false;
			else if(!re.test(pass))return false;
			else if(!re2.test(pass) && !re3.test(pass))return false;
			else return true;
		},
		email:function(email){
    		return remail.test(email);
		},
		promocion:function(promo){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/promocion', data: {Promocion:promo}})
		}
	}
})
.factory('Usuario',function($http,$rootScope){
	$rootScope.Usuario;
	
	return {
		login:function(credentials){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
		},
		refresh:function(){
			$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
    		return true;
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			return true;
		},
		get:function(){
			return $rootScope.Usuario;
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
.factory('Mapa',function($http,$rootScope,uiGmapGoogleMapApi,$timeout,uiGmapIsReady){
	uiGmapGoogleMapApi.then(function(maps) {
	var r2 = document.createElement('script'); 
    r2.src = 'js/res/richardMarker.js';
    document.body.appendChild(r2);
	$rootScope.map = { 
		center: { latitude: 20.6737919, longitude:  -103.3354131 }, 
		zoom:12,
		options:{
    		mapTypeControl: false,
    		panControl: false,
	    	zoomControl: false,
    		scaleControl: false,
    		streetViewControl: false,
			styles:[
		   {
			featureType: "poi",
			stylers: [{ visibility: "off" }]   
			},
			{
			"featureType": "road",
    		"stylers": [
      			{ "gamma": 1.07 },
      			{ "lightness": 6 },
      			{ "hue": "#00bbff" },
      			{ "saturation": -67 }
    		]
			}
		],
		},
		
		position:{ latitude: 20.734684, longitude:  -103.455187 }
		};
		//maps.
		//$rootScope.mapa=$scope.map
	//navigator.geolocation.getCurrentPosition($scope.mapSuccess, $scope.mapError);
		
    });
	uiGmapIsReady.promise()
	.then(function(maps){
		$(".angular-google-map").animate({
			opacity:1,
			},500);
	})
	
	return {
		login:function(credentials){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
		},
		refresh:function(){
			$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
    		return true;
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			return true;
		},
		getUbicacion:function(){
			return { latitude: 20.734684, longitude:  -103.455187 };
		}
	}
})
.factory('Notificaciones',function($http,$rootScope){
	var iosConfig = {
    	"badge": true,
    	"sound": true,
    	"alert": true,
  	}; 
	var androidConfig = {
    	"senderID": "12591466094",
  	};
  	var registra=function(token){
		$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: {
			Id:$rootScope.Usuario.Id,
			Registro:deviceToken,
			Os:window.device.platform.toUpperCase()
		}})
		.success(function(){
			console.log("registrado");
			$rootScope.Usuario.Registro=deviceToken;
		})
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
				switch(window.device.platform.toLowerCase()){
					case "android":
						$cordovaPush.register(androidConfig).then(function(result){});
					break;
					case "ios":
						$cordovaPush.register(iosConfig).then(registra)
					break;
				}
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
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
