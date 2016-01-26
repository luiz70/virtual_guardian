angular.module('starter.services')
.factory('Radio',function($rootScope,uiGmapIsReady,Ubicacion,Memory,$timeout){//,Eventos
	//function que inicializa el radio
	var inicializa=function(){
		$rootScope.radio=Memory.get("Radio");
		if(!$rootScope.radio)
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
		$rootScope.radio.Val=0;
		if($rootScope.auto && $rootScope.auto.posicionando)$rootScope.radio.visible=false;
		//inicializa los eventos del radio
		$rootScope.radio.events={
			radius_changed:function(data){
				$rootScope.radio.Val=$rootScope.radio.radio;
				//Eventos.hideAll();
				//$rootScope.radio.visible=false;
				//$rootScope.radio.visible=data.visible;	
			},
			
		}
		$timeout(function(){
			console.log($rootScope.radio)
		},2000)
		$rootScope.$watch('radio.visible', function(newValue, oldValue) {
			
		})
		//funcion que se ejecuta cada que el radio es cambiado
		$rootScope.$watch('radio.radio', function(newValue, oldValue) {
			if(newValue){
				$rootScope.eventosMap=[];
				if(!$rootScope.$$phase) {
                    $rootScope.$apply(function(){
						$rootScope.radio.radio=parseInt(newValue);
					})
				}else{
					$rootScope.radio.radio=parseInt(newValue);
				}
				//revisaEventos($rootScope.map.ubicacion.position);
			}
		});
		//funcion que se ejecuta cada que cambia el estado del radio
		$rootScope.$watch('radio.activo', function(newValue, oldValue) {
			if($rootScope.radio) {
				$rootScope.radio.activo=newValue
				$rootScope.eventosMap=[];
				try{Eventos.refresh();}catch(err){}
				if(newValue)$rootScope.map.center={ latitude: $rootScope.ubicacion.position.latitude, longitude:  $rootScope.ubicacion.position.longitude}
				
			}
			
		});
		$rootScope.$watch('radio', function(newValue, oldValue) {
			Memory.set("Radio",$rootScope.radio)
		},true)
	}
	//function que se ejecuta una vez que el script de google maps esta cargado
	uiGmapIsReady.promise().then(function(maps){
	
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
		},
		hide:function(){
			$rootScope.radio.fill={color:'#39bbf7',opacity:0};
			$rootScope.radio.stroke={color:'#ffffff',weight:2,opacity:0};
		},
		show:function(){
			$rootScope.radio.fill={color:'#39bbf7',opacity:0.13};
			$rootScope.radio.stroke={color:'#ffffff',weight:2,opacity:0.6};
		}
	}
})