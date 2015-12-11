angular.module('starter.services')
.factory('Radio',function($rootScope,uiGmapGoogleMapApi,Ubicacion){
	//function que inicializa el radio
	var inicializa=function(){
		//define el objeto radio que sera quien controla el mapa
		$rootScope.radio={
			center:$rootScope.ubicacion.position,
			//define el radio inicial (default 3000) 
        	radio:3000,
			//define el color de relleno y la opacidad
            fill:{color:'#39bbf7',opacity:0.13},
			//define el color de la linea el grosor y la opacidad
            stroke:{color:'#ffffff',weight:2,opacity:0.6},
			//define si el usuario puede editarlo con los controles de google maps
            editable:false,
			//define si el circulo esta activo o no (validacion de marcadores)
            activo:true,
			//define si el circulo esta visible o no (solo proyeccion)
			visible:true,
        }
		//inicializa los eventos del radio
		$rootScope.radio.events={}
		//funcion que se ejecuta cada que el radio es cambiado
		$rootScope.$watch('radio.radio', function(newValue, oldValue) {
			if(newValue){
				$rootScope.radio.radio=parseInt(newValue);
				//revisaEventos($rootScope.map.ubicacion.position);
			}
		});
		//funcion que se ejecuta cada que cambia el estado del radio
		$rootScope.$watch('map.radio.activo', function(newValue, oldValue) {
			//if($rootScope.radio) revisaEventos($rootScope.map.ubicacion.position);
		});
	}
	//function que se ejecuta una vez que el script de google maps esta cargado
	uiGmapGoogleMapApi.then(function(maps) {
		
	
	})
	return {
		inicializa:function(){
			inicializa();
		},
		setActivo:function(val){
			$rootScope.radio.activo=val
		},
		setRadio:function(val){
			$rootScope.radio.radio=parseInt(val)
		}
	}
})