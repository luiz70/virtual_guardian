angular.module('starter')
.controller("llamada",function($scope,$http,$rootScope,CordovaNetwork,$location,$interval,$timeout,signaling,ContactsService){
	signaling.removeAllListeners();
	$scope.enCurso=false;
	$scope.silencio=false;
	$scope.altavoz=false;
	$scope.tiempoLlamada=0;
	$scope.timer=null;
	$scope.roll=0;
	$scope.SocketOn=false;
	$scope.MensajeLlamada="";
	$scope.EstadoLlamada="";
            
  	$scope.configCall = {
    isInitiator: $rootScope.PersonaLlamada.Llamando,
    turn: {
        host:'turn:45.40.137.37:5349',
        username: 'virtualg',
        password: '4138596'
    },
    streams: {
        audio: true,
        video: false
    }
}
            //alert(JSON.stringify(window.cordova.plugins))
           $scope.session = new window.cordova.plugins.phonertc.Session($scope.configCall);
            
	$rootScope.realizarLlamada=function(){
		$scope.MensajeLlamada=$rootScope.idioma.llamada[2];
		$scope.EstadoLlamada=$rootScope.idioma.llamada[10];
		$timeout(function(){
			if( navigator.proximity)navigator.proximity.enableSensor();
		$scope.proximitysensorWatchStart($scope.proximitysensor);
		},500)
		$scope.roll=1;
		//$scope.enCurso=true;
		$("#boton_colgar").hide();
		$("#boton_colgar").animate({
    		width: '100vw',
			borderRadius: '0px',
			marginRight:'0px',
			borderWidth: '0px',
			height: '12vh',
			marginBottom: '0px',
			marginTop: '2vh'
  		}, 200, "linear", function() {
			$("#boton_colgar").show();
			});
		$timeout(function(){
		$(".callbtn").animate({
    		width: '10vh',
			height: '10vh',
			opacity: '1'
  		}, 200, "linear", function() {});
		},300);
		$scope.iniciaCall();
	}
	$scope.iniciaCall=function(){
		$scope.configCall.isInitiator=true;
		
	$scope.loginSocket();
	//else $scope.session = new phonertc.Session($scope.configCall);
	}
 	$scope.loginSocket = function () {
      //$scope.loading = true;
	  signaling.connect();
	  signaling.emit('login', $rootScope.Usuario.Id);
    };

    signaling.on('login_error', function (message) {
      	//$scope.loading = false;
      	/*$scope.MensajeLlamada=$rootScope.idioma.llamada[5];
	  	$timeout(function(){
		  	$rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[7]+$rootScope.PersonaLlamada.Correo,function(){
		  		$scope.cuelgaCall()
	  		})
		},3000);*/
		console.log(message);
		
    });

	signaling.on('disconnect', function (id) {
		if($rootScope.SocketOn){
			$rootScope.SocketOn=false;
			$scope.MensajeLlamada=$rootScope.idioma.llamada[8];
			$timeout(function(){
		  	$rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[9],function(){
		  		$scope.cuelgaCall()
	  		})
			},2000);
		}
		
	})
	 signaling.on('messageReceived', function (user, message,data) {
                  
                  switch(message){
                  case 'conectado':
                  if($scope.configCall.isInitiator){
                        signaling.emit('sendMessage',user,"conectado");
                        $scope.session.call();
                  }
                  
                  break;
                  case 'colgar':
                  $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){
                        $scope.cuelgaCall()
                    })
                  break;
                  case 'handshake':
                  //aalert("handshake: "+data)
                  $scope.session.receiveMessage(JSON.parse(data));
                  break;
                  
                  }
		 
		
	 })
            
            $scope.session.on('answer', function(){
                              //alert("answered");
                              $scope.enCurso=true;
                              })
            $scope.session.on('sendMessage',function(data){
                              //alert(2);
                              signaling.emit('handshake',$scope.PersonaLlamada.IdCliente,"handshake",JSON.stringify(data));
                              })
    signaling.on('login_successful', function (users) {
      //ContactsService.setOnlineUsers(users, $rootScope.Usuario.Id);
	 $rootScope.SocketOn=true;
                 
	  if($scope.configCall.isInitiator){
		$scope.EstadoLlamada=$rootScope.idioma.llamada[3];
		  $scope.sendNotification($rootScope.PersonaLlamada.IdCliente,$rootScope.Usuario.Id,1,null,function(){
		//esperando respuesta 
		//empieza timer
		//da linea 
                })
	  }else {
	  	//responde
		//$scope.iniciaTimer();
		signaling.emit('sendMessage',$rootScope.PersonaLlamada.IdCliente,"conectado");
                 $scope.session.call();
	  }
                 
                 
    });
	$scope.inicioSesion=function(){
		 
	}
	$scope.sendNotification=function(destino,origen,operacion,token,funcion){
		
		$http.post("https://www.virtual-guardian.com/api/llamar",{
				IdDestino:destino,
				IdOrigen:origen,
				Operacion:operacion,
				Token:token
				})
		.success(function(data){
			console.log(data);
			funcion(data);
		})
		.error(function(error){
		console.log(error);
		})
	}
  
	/*signaling.on('login_successful', function (users) {
      ContactsService.setOnlineUsers(users, $rootScope.Usuario.Id);
      $rootScope.SocketUsers=users;
	  $rootScope.SocketOn=true;
	  $scope.configCall.isInitiator=true;
	  //$scope.session = new phonertc.Session($scope.configCall);
    });*/

	$scope.contestarLlamada=function(){
        $rootScope.PersonaLlamada.Contestada=true;
		$scope.MensajeLlamada=$rootScope.idioma.llamada[1];
		$scope.EstadoLlamada=$rootScope.idioma.llamada[10];
		//$scope.enCurso=true
		$("#boton_colgar").animate({
    		width: '100vw',
			borderRadius: '0px',
			marginRight:'0px',
			borderWidth: '0px',
			height: '12vh',
			marginBottom: '0px',
			marginTop: '2vh'
  		}, 200, "linear", function() {});
		$(".callbtn").animate({
    		width: '10vh',
			height: '10vh',
			opacity: '1'
  		}, 200, "linear", function() {});
		
           
            
            
	}
	$scope.iniciaTimer=function(){
		$scope.timer=$interval(function() {
          $scope.$apply(function () {
            $scope.tiempoLlamada++;
       	 });
		   
          }, 1000);
	}
	$scope.activaFuncion=function(val){
		if(val==1){
			//altavoz
			$scope.altavoz=!$scope.altavoz;
		}else{
			//mute
			$scope.silencio=!$scope.silencio;
		}
	}
	$scope.cuelgaCall=function(){
            $scope.session.disconnect();
        signaling.emit('sendMessage',$rootScope.PersonaLlamada.IdCliente,"colgar");
		$rootScope.SocketOn=false;
        signaling.removeAllListeners();
		signaling.disconnect()
		$scope.proximitysensorWatchStop();
		$interval.cancel($scope.timer);
		$scope.timer=null;
		$scope.tiempoLlamada=0;
		$location.path('/inicio');
            
	}
	
	
	$scope.successProx=function(data){
	//console.log(data);
	}
	$scope.proximitysensor = {};
	$scope.intevalo=null
$scope.proximitysensorWatchStart= function(_scope, on_approch_callback) {
    if(navigator.proximity && navigator.proximity != null){
		
		$scope.intevalo=$interval(function(){
			navigator.proximity.getProximityState($scope.successProx);
		},1000);
		// Start watch timer to get proximity sensor value
    	/*var frequency = 100;
    	$scope.proximitysensor.id = window.setInterval(function() {
        	navigator.proximity.getProximityState(function(val) { // on success
            	var timestamp = new Date().getTime();
				console.log(val);
            	if(timestamp - $scope.proximitysensor.lastemittedtimestamp > 1000) { // test on each 1 secs
                	if( $scope.proximitysensor.lastval == 1 && val == 0 ) { // far => near changed
                    	$scope.proximitysensor.lastemittedtimestamp = timestamp;
                    	$scope.proximitysensor.lastval = val;
                    	on_approch_callback(timestamp);
                	}
            	}
            	$scope.proximitysensor.lastval = val;
        	});
    	}, frequency);*/
	}
}

$scope.proximitysensorWatchStop = function(_scope) {
    if(navigator.proximity != null){
	
   $interval.cancel($scope.intevalo);

    navigator.proximity.disableSensor();
	
	}
};

            
if($rootScope.PersonaLlamada.Llamando)$rootScope.realizarLlamada();
	else {
            $scope.configCall.isInitiator=false;
            $scope.loginSocket();
            
		if($rootScope.PersonaLlamada.Contestada){
            $scope.contestarLlamada();
            }else{
            $scope.MensajeLlamada=$rootScope.idioma.llamada[1];
            $scope.EstadoLlamada=$rootScope.idioma.llamada[4];
            }
	}
// .... after testing
//proximitysensorWatchStop(proximitysensor);
})
.filter("duracion",function(){
	return function(t){
		var sec_num = parseInt(t, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    
		return time;
	}
})