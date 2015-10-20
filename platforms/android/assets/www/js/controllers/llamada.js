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
    if(window.cordova) $scope.session = new window.cordova.plugins.phonertc.Session($scope.configCall);
            
	$rootScope.realizarLlamada=function(){
		
		$scope.MensajeLlamada=$rootScope.idioma.llamada[2];
		$scope.EstadoLlamada=$rootScope.idioma.llamada[3];
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
	  signaling.connect();
	  signaling.emit('login', $rootScope.Usuario.Id);
    };

    signaling.on('login_error', function (message) {
      	$scope.EstadoLlamada=$rootScope.idioma.llamada[5];
        $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[7]+$rootScope.PersonaLlamada.Correo,function(){
            $scope.cuelgaCall()
        })
    });

	signaling.on('disconnect', function (id) {
		if($rootScope.SocketOn){
			$rootScope.SocketOn=false;
			$scope.EstadoLlamada=$rootScope.idioma.llamada[8];
			$timeout(function(){
            $scope.cuelgaCall()
		  	$rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[9],function(){
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
                $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){})
            break;
            case 'handshake':
                $scope.session.receiveMessage(JSON.parse(data));
            break;
        }
    })
    signaling.on('colgaron',function(){
                 $scope.cuelgaCall()
                 $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){});
                 });
    signaling.on('usuarioOcupado',function(user){
                $scope.cuelgaCall()
                    $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[13],function(){})
                 });
    signaling.on('offline',function(user){
        if(user==$rootScope.PersonaLlamada.IdCliente){
            $scope.cuelgaCall()
            $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){})
        }
    })
            
    if($scope.session)
        $scope.session.on('answer', function(){
            $scope.enCurso=true;
            if($scope.noAl)$timeout.cancel($scope.noAl);
            //if($scope.soundFile)$scope.soundFile.pause();
            AudioToggle.stopTone();
            $scope.iniciaTimer();
            //alert(2);
        })
    if($scope.session)
        $scope.session.on('disconnect', function(){
            if($scope.enCurso){
                $scope.cuelgaCall()
                $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.PersonaLlamada.Correo+$rootScope.idioma.llamada[11],function(){})
            }
        })
    $scope.done=false;
    $scope.tokenBack=function(data){
        /*if(!$scope.done && $scope.configCall.isInitiator){
            $scope.done=true;
            signaling.emit('call', $rootScope.PersonaLlamada.IdCliente,JSON.stringify(data));
            $scope.session.off('sendMessage',$scope.tokenBack);
            //signaling.emit('handshake',$scope.PersonaLlamada.IdCliente,"handshake",JSON.stringify(data));
            }else{*/
        signaling.emit('handshake',$scope.PersonaLlamada.IdCliente,"handshake",JSON.stringify(data));
    //}
    }
    if($scope.session)
        $scope.session.on('sendMessage',$scope.tokenBack)
    
    signaling.on('callResult', function (data) {
        if(data.result){
		
        //SONAR
		
        }else{
            $scope.cuelgaCall()
            $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[12],function(){})
        }
    })
    signaling.on('login_successful', function (users) {
		$rootScope.SocketOn=true;
        if($scope.configCall.isInitiator){
            $scope.EstadoLlamada=$rootScope.idioma.llamada[3];
            //if($scope.session)$scope.session.call();
            signaling.emit('call', $rootScope.PersonaLlamada.IdCliente,"");
                 AudioToggle.setAudioMode(AudioToggle.EARPIECE)
                 AudioToggle.playTone();
            $scope.noAl=$timeout(function(){
                AudioToggle.playBye();
                $scope.cuelgaCall()
                $rootScope.alert($rootScope.idioma.llamada[6],$rootScope.idioma.llamada[12],function(){})
            },30000)
        }else {
				signaling.emit('listening', $rootScope.PersonaLlamada.IdCliente);
                 if($rootScope.PersonaLlamada.notificacion.foreground=="0"){
                 $scope.contestarLlamada();
                 }else{
                 $scope.MensajeLlamada=$rootScope.idioma.llamada[1];
                 $scope.EstadoLlamada=$rootScope.idioma.llamada[4];
                 }
				 
        }
    });
        signaling.on('isConnected', function (data) {   
		console.log(data);
		})
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
		$scope.session.call();
        signaling.emit('sendMessage',$rootScope.PersonaLlamada.IdCliente,"conectado");
        
        //$scope.session.receiveMessage(JSON.parse($rootScope.notificacion.Token));
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
			if($scope.enCurso){
			$scope.silencio=!$scope.silencio;
            if($scope.silencio)$scope.session.streams.audio = false;
            else $scope.session.streams.audio = true;
            $scope.session.renegotiate();
			}
        }
	}
            
$scope.cuelgaCall=function(){
    
    $timeout.cancel($scope.noAl);
    $scope.EstadoLlamada=$rootScope.idioma.llamada[8];
    
    signaling.emit('colgar',$rootScope.Usuario.Id,$rootScope.PersonaLlamada.IdCliente);
    $rootScope.SocketOn=false;
    signaling.removeAllListeners();
    signaling.disconnect();
    if($scope.session && $scope.enCurso)$scope.session.close();
    $scope.session=null;
    $scope.enCurso=false;
    $scope.proximitysensorWatchStop();
    $interval.cancel($scope.timer);
    $scope.timer=null;
    $scope.tiempoLlamada=0;
    AudioToggle.stopTone();
    AudioToggle.setAudioMode(AudioToggle.SPEAKER)
            
    //if($scope.soundFile)$scope.soundFile.pause();
    $location.path('/inicio');
}
	
	
$scope.proximitysensor = {};
$scope.intevalo=null
$scope.proximitysensorWatchStart= function(_scope, on_approch_callback) {
    if(navigator.proximity && navigator.proximity != null){
        $scope.intevalo=$interval(function(){
            navigator.proximity.getProximityState(function(){});
		},1000);
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
    $scope.session.isInitiator=false;
    $scope.loginSocket();
	
    
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