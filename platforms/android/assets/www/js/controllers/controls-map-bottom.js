angular.module('starter.controllers')
.controller('bottom-center',function($scope,$rootScope,uiGmapIsReady,Radio){
	//define el diccionario
	$scope.idioma=$rootScope.idioma;
	//define las variables para control local que seran pasadas al mapa
	$scope.barra={
		//variable que controla el valor del radio, inicializada con el valor predefinido del usuario, se puede inicializar tambien con datos guardados
		radio:$rootScope.Usuario.Rango,
		//estado del radio, esto permite que se muestre o no en el mapa el radio
		activo:true
	}
	//funcion que se ejecuta al modificar el estado del radio
	$scope.$watch('barra.activo',function(val){
		Radio.setActivo(val);
	})
	//funcion que se ejecuta al modificar el valor del radio
	$scope.$watch('barra.radio',function(val){
		Radio.setRadio(val);
	})
	//funcion que se ejecuta cuando se cargo el mapa para inicializar el touch event
	uiGmapIsReady.promise().then(function(maps){
		//activa el touch event en el mapa para ocultar la barra
		$(".gm-style div").first().on("touch",$scope.hideBarra)
	})
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