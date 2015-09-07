angular.module('starter')
.controller("llamada",function($scope,$http,$rootScope,CordovaNetwork,$location,$interval,$timeout){
	$scope.enCurso=false;
	$scope.silencio=false;
	$scope.altavoz=false;
	$scope.tiempoLlamada=0;
	$scope.timer=null;
	$scope.roll=0;
	
	$rootScope.realizarLlamada=function(){
		$timeout(function(){
			navigator.proximity.enableSensor();
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
	}
	$rootScope.recibeLlamada=function(){
		$scope.roll=2;
	}
	if($rootScope.PersonaLlamada.Llamando)$rootScope.realizarLlamada();
	else $rootScope.recibeLlamada();
	$scope.contestarLlamada=function(){
		$scope.enCurso=true;
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
		$scope.iniciaTimer();
	}
	$scope.iniciaTimer=function(){
		$scope.timer=$interval(function() {
           $scope.tiempoLlamada++;
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
		$scope.proximitysensorWatchStop();
		$interval.cancel($scope.timer);
		$scope.timer=null;
		$scope.tiempoLlamada=0;
		$location.path('/inicio');
	}
	
	
	$scope.successProx=function(data){
		console.log(data);
	}
	$scope.proximitysensor = {};
	$scope.intevalo=null
$scope.proximitysensorWatchStart= function(_scope, on_approch_callback) {
    if(navigator.proximity != null){
		
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