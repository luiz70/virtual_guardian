angular.module('starter.services')
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