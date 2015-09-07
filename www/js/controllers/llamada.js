angular.module('starter')
.controller("llamada",function($scope,$http,$rootScope,CordovaNetwork,$location,$interval,$timeout){
	$scope.enCurso=false;
	$scope.silencio=false;
	$scope.altavoz=false;
	$scope.tiempoLlamada=0;
	$scope.timer=null;
	$scope.roll=0;
	
	$rootScope.realizarLlamada=function(){
		$scope.roll=1;
		//$scope.enCurso=true;
		$("#boton_colgar").animate({
    		width: '100vw',
			borderRadius: '0px',
			marginRight:'0px',
			borderWidth: '0px',
			height: '12vh',
			marginBottom: '0px',
			marginTop: '2vh'
  		}, 200, "linear", function() {});
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
		$interval.cancel($scope.timer);
		$scope.timer=null;
		$scope.tiempoLlamada=0;
		$location.path('/inicio');
	}
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