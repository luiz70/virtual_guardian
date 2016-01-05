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
.factory('Message', function(localStorageService,$ionicLoading,$ionicPopup,$cordovaToast,$ionicActionSheet) {
	var dictionary=null
	var alertPopUp=null;
	var confirmPopUp=null;
	var options=null;
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
		},
		confirm:function(titulo,texto,funcion,btn1,btn2,closable,callback){
			if(confirmPopUp)confirmPopUp.close();
			callback=callback || false
			btn1 = btn1 || this.dictionary.General[2];
    		btn2 = btn2 || this.dictionary.General[6];
			closable=closable||function(){return true};
			confirmPopUp = $ionicPopup.confirm({
     			title: titulo,
     			template: "<div>"+texto+"</div>"+
				'<div id="botones_confirm"></div>',
				buttons: [{ 
    				text: btn2,
    				type: 'button-default',
    				onTap: function(){
					  return 0;
					}
  				},{
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
			confirmPopUp.then(function(res) {
			if(res) {
				confirmPopUp.close();
				funcion(res);
			} else {
				if(callback)funcion(res);
				confirmPopUp.close();
			}
		})
		},
		showActionSheet:function(title,buttons,destructive,cancel,result){
			var settings={
     			buttons: buttons,
				 buttonClicked: function(index) {
				   result(index,buttons[index])
				 },
				 cancel:function(){
					 result(-1,null)
				 }
   			}
			if(cancel)settings.cancelText=cancel
			if(title)settings.titleText=title
			if(destructive)settings.destructiveText=destructive
			 var options = $ionicActionSheet.show(settings);
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
.factory('Usuario',function($http,$rootScope,socket,$interval,Message){
	$rootScope.Usuario;
	var interval=null;
	var refresh=function(){
		if($rootScope.Usuario){
			socket.getSocket().emit("getUsuario",$rootScope.Usuario.Id)
		}else console.log("no logged");
		socket.getSocket().on("getUsuario",revisaUsuario)
	}
	var revisaUsuario=function(data){
		console.log(3);
		socket.getSocket().removeListener("getUsuario",revisaUsuario);
		if($rootScope.Usuario.Registro!=data.Registro){
			if(interval)$interval.cancel(interval);
				//cuanta iniciada por alguien mas
				Message.alert($rootScope.idioma.General[0],$rootScope.idioma.Login[11],function(){
					$rootScope.cerrarSesion();
				})
		}else{
		}
	}
	
	return {
		login:function(credentials){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
		},
		refresh:function(){
			if(interval)$interval.cancel(interval);
			refresh();
			interval=$interval(function(){
				refresh();
			},900000)
    		return true;
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			if(usuario==null && interval){
				$interval.cancel(interval);
				socket.close();
			}
			return true;
		},
		get:function(){
			return $rootScope.Usuario;
		}
	}
})
.factory('socket', function (socketFactory,$rootScope,Memory) {
    var conectado=false;
	var socket ;
	var socketFactory;
	var inicializa=function(){
		if(!socket){socket = io.connect('https://www.virtual-guardian.com:3200/socket',{
                                    reconnection:true,
									query: "Token="+$rootScope.Usuario.Token
                                 });
			socketFactory = socketFactory({
        		ioSocket: socket
    		});
		}else socket.connect();
    	
	
    socketFactory.on("connect",function(){
        conectado=true;
    })
    socketFactory.on("connect_error",function(){
        conectado=false;
    })
    socketFactory.on("reconnect",function(){
		if($rootScope.eventos){
		$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.editado;})
		//se envian los ids al servidor
		socket.emit('setInfo',{ids:$rootScope.idEventos,edit:$rootScope.editEventos});
		}
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
	}
         
    return {
		inicializa:function(){
			inicializa()
		},
         getSocket:function(){
            return socketFactory
         },
         connect:function(){
            if(!conectado)socketFactory.connect();
            return true;
         },
         isConnected:function(){
            return conectado;
         },
		 emit:function(event,obj){
			 socketFactory.emit(event,obj);
		 
		 },
		 close:function(){
			 socket.removeAllListeners();
			 socket.disconnect();
		 }
    };
})


.factory('Notificaciones',function($http,$rootScope,$cordovaPush,socket){
	var iosConfig = {
    	"badge": true,
    	"sound": true,
    	"alert": true,
  	}; 
	var androidConfig = {
    	"senderID": "12591466094",
  	};
  	var registra=function(token){
		/*$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: {
			Id:$rootScope.Usuario.Id,
			Registro:deviceToken,
			Os:window.device.platform.toUpperCase()
		}})
		.success(function(){
			console.log("registrado");
			$rootScope.Usuario.Registro=deviceToken;
		})*/
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
