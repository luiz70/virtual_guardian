angular.module('starter.controllers')
.controller('bottom-center',function($scope,$rootScope,uiGmapIsReady,Radio,Eventos){
	//define el diccionario
	$scope.idioma=$rootScope.idioma;
	//importa la configuracion del radio
	$scope.radio=$rootScope.radio
	//funcion que se ejecuta cuando se cargo el mapa para inicializar el touch event
	uiGmapIsReady.promise().then(function(maps){
		//activa el touch event en el mapa para ocultar la barra
		$(".gm-style div").first().on("touch",$scope.hideBarra)
	})
	//function para mejorar el movimiento de el range de radio
	$scope.onTap = function(e) {
      if(ionic.Platform.isIOS()) {
        $scope.barProgress = (e.target.max / e.target.offsetWidth)*(e.gesture.touches[0].screenX - e.target.offsetLeft);
      }
    };
	//funcion que se ejecuta cuando se inicia el cambio en valor numerico de rango
		$scope.iniciaCambio=function(){
			Eventos.hideAll();
		}
		//function que se ejecuta cuando se termina el cambio en valor de rango
		$scope.terminaCambio=function(){
			Eventos.showHide();
			Eventos.refresh();
		}
	//funcion que oculta la barra de radio
	$scope.hideBarra=function(){
		//desactiva el touch event en el mapa para ocultar la barra
		$(".gm-style div").first().off("touch",$scope.hideBarra)
		//activa el touch event en la barra para mostrarla
		$(".contenedor-mapa-pie").on("touch",$scope.showBarra)
		//detiene las animaciones en curso
		$(".contenedor-mapa-pie").stop( true, false );
		//anima la barra para ocultarla
		$(".contenedor-mapa-pie").animate({
			height:'7vh',
		},1000);
	}
	//function que muestra la barra de radio
	$scope.showBarra=function(){
		//activa el touch event en el mapa para ocultar la barra
		$(".gm-style div").first().on("touch",$scope.hideBarra)
		//desactiva el touch event en la barra para mostrarla
		$(".contenedor-mapa-pie").off("touch",$scope.showBarra)
		//detiene las animaciones en curso
		$(".contenedor-mapa-pie").stop( true,false);
		//anima la barra para mostrarla
		$(".contenedor-mapa-pie").animate({
			height:'14vh',
		},500);
	}
})