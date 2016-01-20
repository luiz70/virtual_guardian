angular.module('starter.services')
.factory('socket', function ($rootScope,Memory,Message) {
    var conectado=false;
	$rootScope.socketState=true;
	var socket ;
	var socketFactory;
	
	var inicializa=function(){
		
		var usuario=Memory.get("Usuario")
		//if(usuario){
		//if(!socket){
			if(socket){
				socket.removeAllListeners();
				socket.disconnect();
			}
			socket=null;
			
			//socket = io();
			try{
			socket=io.connect('https://www.virtual-guardian.com:3200/socket',{
                                    reconnection:true,
									query: "token="+usuario.Token,
									"force new connection":true
            });
			}catch(err){
				console.log("errorSocketConnect")
			}
			
			/*socketFactory = null;
			socketFactory = socketFactory({
        		ioSocket: socket
    		});*/
		//}else socket.connect();
		
    
	socket.on("autenticated",function(val){
		$rootScope.socketState=val;
		conectado=val;
		
	})
	
    socket.on("connect",function(){
		$rootScope.$broadcast("socket.connect",true)
        conectado=true;
		$rootScope.socketState=true;
		socket.emit('getSesion',{Id:$rootScope.Usuario.Id,Log:$rootScope.Usuario.Log});
		
    })
	socket.on('logIn',function(data){
			if(parseInt(data)===parseInt($rootScope.Usuario.Id)){
				//cerrar sesion
				Message.alert($rootScope.idioma.General[0],$rootScope.idioma.Login[11],function(){
					$rootScope.cerrarSesion();
				})
			}
		})
	socket.on('getSesion',function(val){
		if(!val){
			//cerrar sesion
			Message.alert($rootScope.idioma.General[0],$rootScope.idioma.Login[11],function(){
					$rootScope.cerrarSesion();
				})
		}
	})
    socket.on("connect_error",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;
		
    })
    socket.on("reconnect",function(){
		$rootScope.$broadcast("socket.connect",true)
		if($rootScope.eventos){
		$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.editado;})
		//se envian los ids al servidor
		socket.emit('setInfo',{ids:$rootScope.idEventos,edit:$rootScope.editEventos});
		}
        conectado=true;
		$rootScope.socketState=true;
    })
    socket.on("reconnect_error",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;
    })
    socket.on("disconnect",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;

    })
    socket.on("error",function(){
		$rootScope.$broadcast("socket.connect",false)
        conectado=false;
		$rootScope.socketState=false;
    })
	return socket;
	}
         
    return {
		inicializa:function(){
			return inicializa()
		},
         getSocket:function(){
            return socket
         },
         connect:function(){
            if(!conectado)socket.connect();
            return true;
         },
         isConnected:function(){
            return conectado;
         },
		 emit:function(event,obj){
			 socket.emit(event,obj);
		 
		 },
		 close:function(){
			
			 if(socket){
				socket.removeAllListeners();
			 	socket.disconnect();
			 }
		 }
    };
})