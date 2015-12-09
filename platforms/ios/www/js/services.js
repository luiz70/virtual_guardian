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
.factory('Message', function(localStorageService,$ionicLoading,$ionicPopup,$cordovaToast) {
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
         toast:function(msg){
         $cordovaToast.showShortBottom(msg);
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
.factory('socket', function (socketFactory,$rootScope) {
    var conectado=false;
         var socket = io.connect('https://www.virtual-guardian.com:3200/socket',{
                                    reconnection:true,
									query: "Token="+$rootScope.Usuario.Token
                                 });
    var socketFactory = socketFactory({
        ioSocket: socket
    });
    socketFactory.on("connect",function(){
        conectado=true;
    })
    socketFactory.on("connect_error",function(){
        conectado=false;
    })
    socketFactory.on("reconnect",function(){
        conectado=true;
    })
    socketFactory.on("reconnect_error",function(){
        conectado=false;
    })
    socketFactory.on("disconnect",function(){
        conectado=false;

    })
	socketFactory.on("token",function(token){
        //$rootScope.Usuario.Token=token
		console.log(token);
    })
    socketFactory.on("error",function(){
        conectado=false;
    })
         
    return {
         getSocket:function(){
            return socketFactory
         },
         connect:function(){
            if(!conectado)socketFactory.connect();
            return true;
         },
         isConnected:function(){
            return conectado;
         }
    };
})

.factory('Mapa',function($http,$rootScope,uiGmapGoogleMapApi,$timeout,uiGmapIsReady,socket){
	var getIconUbicacion=function(){
		
		var icono = {
			url: (!$rootScope.map)?'img/iconos/mapa/ubicacion.png':(($rootScope.map.ubicacion.position.latitude==$rootScope.map.ubicacion.location.latitude && $rootScope.map.ubicacion.position.longitude==$rootScope.map.ubicacion.location.longitude)?'img/iconos/mapa/ubicacion.png':'img/iconos/mapa/ubicacion_des.png'),
			size: new google.maps.Size(20, 20),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(10, 10),
			scaledSize:new google.maps.Size(20, 20)
		}
		return icono;
	}
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
		bounds:{
			la1:0,
			la2:0,
			ln1:0,
			ln2:0
		},
        events:{
			bounds_changed:function(event){
				var bounds=$rootScope.map.getGMap().getBounds();
				$rootScope.map.bounds={
					la1:bounds.getSouthWest().lat(),
					la2:bounds.getNorthEast().lat(),
					ln1:bounds.getSouthWest().lng(),
					ln2:bounds.getNorthEast().lng()
				}
				//$rootScope.$apply(function(){})
			}
		},
		eventos:[],
        radio:{
			center:{ latitude: 20.6737919, longitude:  -103.3354131 },
        	radius:3000,
            fill:{color:'#39bbf7',opacity:0.15},
            stroke:{color:'#ffffff',weight:2.5,opacity:0.6},
            editable:false,
            activo:true,
			visible:true,
            events:{
            }
        },
		filtros:{
			activos:false,
		},
		ubicacion:{
			position:{ latitude: 20.6737919, longitude:  -103.3354131 },
			location:{ latitude: 20.6737919, longitude:  -103.3354131 },
			options:{
				draggable:true,
				zIndex:10000,
				icon:getIconUbicacion(),
				shape:{
					coords: [0, 0, 0, 20, 20, 20, 20 , 0],
					type: 'poly',
				},
			},
			visible:false,
			events:{
				mouseup:function(event){
					$rootScope.map.ubicacion.position={latitude:event.position.lat(),longitude:event.position.lng()}
                    //$rootScope.$apply(function(){})
				},
				position_changed:function(event){
					$rootScope.map.radio.center={latitude:event.position.lat(),longitude:event.position.lng()}
					if($rootScope.map.radio.activo)revisaEventos($rootScope.map.radio.center);
					//$rootScope.$apply(function(){})
				}
			}
		}
		};
        
		
    });
	$rootScope.$watch('map.bounds', function(newValues, oldValues, scope) {
		//console.log($rootScope.map.bounds);
		if(newValues)refreshEventos();
	})
	var refreshEventos=function(){
		if(!$rootScope.map.filtros.activos){
			f2=new Date();
			f1=new Date();
			f1.setDate(f1.getDate()-$rootScope.Usuario.Periodo)
			f1=f1.getTime()/1000000;
			f2=f2.getTime()/1000000;
		}
		socket.getSocket().emit('getEventos', $rootScope.map.bounds,f1,f2);
	}
	var getIconoEvento=function(evt){
		var icono = {
			url: 'img/iconos/mapa/marcadores/'+evt.asunto+".png",
			size: new google.maps.Size(40, 51),
   			origin: new google.maps.Point(0,0),
   			anchor: new google.maps.Point(20, 51),
			scaledSize:new google.maps.Size(40, 51)
		}
		return icono;
	}
	socket.getSocket().on('getEventos',function(data){
		for(var i=0; i<data.length;i++)
		data[i].icono=getIconoEvento(data[i]);
		$rootScope.map.eventos=data;
	})
	$rootScope.$watch('map.ubicacion.position', function(newValue, oldValue) {
  		if(newValue){
			$rootScope.map.radio.center=$rootScope.map.ubicacion.position
            $rootScope.map.ubicacion.options.icon=getIconUbicacion();
			$rootScope.map.center={ latitude: newValue.latitude, longitude:  newValue.longitude}
			$rootScope.map.ubicacion.options.icon=getIconUbicacion();
		}
	});
	$rootScope.$watch('map.eventos', function(newValue, oldValue) {
  		if(newValue)revisaEventos($rootScope.map.ubicacion.position);
	});
	$rootScope.$watch('map.radio.radius', function(newValue, oldValue) {
  		if(newValue)$rootScope.map.radio.radius=parseInt(newValue);
	});
	$rootScope.$watch('map.radio.activo', function(newValue, oldValue) {
  		if($rootScope.map)revisaEventos($rootScope.map.ubicacion.position);
	});
	var revisaEventos=function(pos){
		for(var i=0; i<$rootScope.map.eventos.length;i++){
			if($rootScope.map.radio.activo){
			rad = function(x) {return x*Math.PI/180;}
			var R     =6378.137 ;      
  			var dLat  = rad( pos.latitude - $rootScope.map.eventos[i].latitude );
  			var dLong = rad( pos.longitude - $rootScope.map.eventos[i].longitude );
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad($rootScope.map.eventos[i].latitude)) * Math.cos(rad(pos.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  			var d = R * c;
			
			
				if( (d.toFixed(3)*1000)>$rootScope.map.radio.radius)$rootScope.map.eventos[i].options={visible:false}
				else $rootScope.map.eventos[i].options={visible:true}
			}else $rootScope.map.eventos[i].options={visible:true}
		}
	}
	
	
	
	
	uiGmapIsReady.promise()
	.then(function(maps){
          getLocation();console.log($rootScope.map.radio)
          $(".angular-google-map").animate({
                opacity:1,
        },500);
	})
         var getLocation=function(){
			 navigator.geolocation.getCurrentPosition(mapSuccess, mapError);
			 $(".location").addClass("loading");
		 }
         var mapSuccess=function(position){ 
			$rootScope.map.ubicacion.location={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
         	$rootScope.map.ubicacion.position={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
         	$rootScope.map.ubicacion.visible=true;
			$rootScope.$apply(function(){})
			$(".location").removeClass("loading");
         }
        var mapError=function(position){
         console.log(position);
         }
	return {
		login:function(credentials){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
		},
		refresh:function(){
			$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
    		return true;
		},
		refreshLocation:function(){
			getLocation();
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			return true;
		},
		getMapa:function(){
			return $rootScope.map;
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
