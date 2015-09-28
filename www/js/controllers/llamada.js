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
           $scope.session = new window.cordova.plugins.phonertc.Session($scope.configCall);
            
	$rootScope.realizarLlamada=function(){
		$scope.MensajeLlamada=$rootScope.idioma.llamada[2];
		$scope.EstadoLlamada=$rootScope.idioma.llamada[10];
		$timeout(function(){
			if( navigator.proximity)navigator.proximity.enableSensor();
		$scope.proximitysensorWatchStart($scope.proximitysensor);
		},500)
		$scope.roll=1;
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
	}
 	$scope.loginSocket = function () {
            //signaling.disconnect();
	  signaling.connect();
	  signaling.emit('login', $rootScope.Usuario.Id);
    };

    signaling.on('login_error', function (message) {
      	$scope.EstadoLlamada=$rootScope.idioma.llamada[5];
	  	$timeout(function(){
		  	$rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[7]+$rootScope.PersonaLlamada.Correo,function(){
		  		$scope.cuelgaCall()
	  		})
		},3000);
    });

	signaling.on('disconnect', function (id) {
		if($rootScope.SocketOn){
			$rootScope.SocketOn=false;
			$scope.EstadoLlamada=$rootScope.idioma.llamada[8];
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
                  $scope.EstadoLlamada=$rootScope.idioma.llamada[10];
                  if($scope.configCall.isInitiator){
                        signaling.emit('sendMessage',user,"conectado");
                        $scope.session.call();
                  }
                  
                  break;
                  case 'colgar':
                  $scope.cuelgaCall()
                  $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){
                        
                    })
                  break;
                  case 'handshake':
                  $scope.session.receiveMessage(JSON.parse(data));
                  break;
                  
                  }
		 
		
	 })
            signaling.on('offline',function(user){
                         if(user==$rootScope.PersonaLlamada.IdCliente){
                         $scope.cuelgaCall()
                         $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){
                                          
                                          })
                         }
                         })
            
            $scope.session.on('answer', function(){
                              $scope.$apply(function(){
                              $scope.enCurso=true;
                                            });
								$scope.soundFile.pause();
                              $scope.iniciaTimer();
                              })
            $scope.session.on('disconnect', function(){
                              if($scope.enCurso){
                              $scope.cuelgaCall()
                              $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){
                                               
                                               })
                              }
                              })
            $scope.session.on('sendMessage',function(data){
                              signaling.emit('handshake',$scope.PersonaLlamada.IdCliente,"handshake",JSON.stringify(data));
                              })
    signaling.on('login_successful', function (users) {
	 $rootScope.SocketOn=true;
                 
	  if($scope.configCall.isInitiator){
		$scope.EstadoLlamada=$rootScope.idioma.llamada[3];
		  $scope.sendNotification($rootScope.PersonaLlamada.IdCliente,$rootScope.Usuario.Id,1,null,function(){
		//da linea
		AudioToggle.setAudioMode(AudioToggle.EARPIECE);
		$scope.soundFile = document.createElement("audio");
		$scope.soundFile.preload = "auto";

		//Load the sound file (using a source element for expandability)
		var src = document.createElement("source");
		src.src = "audio/tono.mp3";
		$scope.soundFile.appendChild(src);
		$scope.soundFile.currentTime = 0.01;
		//Load the audio tag
		$scope.soundFile.loop=true
		//It auto plays as a fallback
		$scope.soundFile.load();
		//$scope.soundFile.volume = 0.000000;
		$scope.soundFile.play();

               })
	  }else {
    
        }
                 
                 
    });
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
  


	$scope.contestarLlamada=function(){
            $timeout(function(){
                     if( navigator.proximity)navigator.proximity.enableSensor();
                     $scope.proximitysensorWatchStart($scope.proximitysensor);
                     },500)
        $rootScope.PersonaLlamada.Contestada=true;
		$scope.MensajeLlamada=$rootScope.idioma.llamada[1];
		$scope.EstadoLlamada=$rootScope.idioma.llamada[10];
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
		
            signaling.emit('sendMessage',$rootScope.PersonaLlamada.IdCliente,"conectado");
            $scope.session.call();
            
            
	}
	$scope.iniciaTimer=function(){
		$scope.timer=$interval(function() {
            $scope.tiempoLlamada++;
          }, 1000);
	}
	$scope.activaFuncion=function(val){
		if(val==1){
			$scope.altavoz=!$scope.altavoz;
            console.log($scope.altavoz);
            if($scope.altavoz)AudioToggle.setAudioMode(AudioToggle.SPEAKER)
            else AudioToggle.setAudioMode(AudioToggle.EARPIECE)
		}else{
			//mute
			$scope.silencio=!$scope.silencio;
        }
	}
            
	$scope.cuelgaCall=function(){
		$scope.soundFile.pause();
        $scope.EstadoLlamada=$rootScope.idioma.llamada[8];
        $scope.enCurso=false;
        signaling.emit('colgar',$rootScope.Usuario.Id,$rootScope.PersonaLlamada.IdCliente);
		$rootScope.SocketOn=false;
        signaling.removeAllListeners();
        signaling.disconnect();
        $scope.session.close();
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