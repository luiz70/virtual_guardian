angular.module('starter.services')
.factory('socket', function (socketFactory,$rootScope,Memory) {
    var conectado=false;
	$rootScope.socketState=true;
	var socket ;
	var socketFactory;
	
	var inicializa=function(){
		var usuario=Memory.get("Usuario")
		if(!socket && usuario){socket = io.connect('https://www.virtual-guardian.com:3200/socket',{
                                    reconnection:true,
									query: "token="+usuario.Token
                                 });
			socketFactory = socketFactory({
        		ioSocket: socket
    		});
		}else socket.connect();
    
	socketFactory.on("autenticated",function(val){
		$rootScope.socketState=val;
		conectado=val;
		$rootScope.$broadcast("socket.connect",val)
	})
	
    socketFactory.on("connect",function(){
		
        conectado=true;
		$rootScope.socketState=true;
		
    })
    socketFactory.on("connect_error",function(){
        conectado=false;
		$rootScope.socketState=false;
		
    })
    socketFactory.on("reconnect",function(){
		if($rootScope.eventos){
		$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.editado;})
		//se envian los ids al servidor
		socket.emit('setInfo',{ids:$rootScope.idEventos,edit:$rootScope.editEventos});
		}
        conectado=true;
		$rootScope.socketState=true;
    })
    socketFactory.on("reconnect_error",function(){
        conectado=false;
		$rootScope.socketState=false;
    })
    socketFactory.on("disconnect",function(){
        conectado=false;
		$rootScope.socketState=false;

    })
	socketFactory.on("token",function(token){
        //$rootScope.Usuario.Token=token
		console.log(token);
    })
    socketFactory.on("error",function(){
        conectado=false;
		$rootScope.socketState=false;
    })
	return socketFactory;
	}
         
    return {
		inicializa:function(){
			return inicializa()
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