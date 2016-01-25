angular.module('starter.services', ['LocalStorageModule','ngError'])
.factory('Mapa',function($rootScope,uiGmapGoogleMapApi,uiGmapIsReady,socket,Memory,$timeout,Ubicacion,Radio,Auto,Filtros,Eventos){//,Cluster,Lugar){
	
	//function que se ejecuta una vez que el script de google maps esta cargado
	
		//inicializa los componentes del mapa
		//inicializa();
	//})
	var inicializa=function(){
		uiGmapGoogleMapApi.then(function(maps) {
		
		Ubicacion.inicializa();
		Auto.inicializa();
		Radio.inicializa();
		Filtros.inicializa();
		Eventos.inicializa();
		/*
		
		Cluster.inicializa();
		Lugar.inicializa()*/
		
		//carga la informacion del mapa guardada
   		if(!$rootScope.map)$rootScope.map=Memory.get('Mapa')
		//Si no hay informacion guardada, inicializa el mapa
		if(!$rootScope.map)
		$rootScope.map = { 
			//centro inicial del mapa
			center: { latitude: 0, longitude:  0}, 
			//Zoom inicial del mapa, da una vista de toda la ZMG
			zoom:12,
			//opciones de mapa (google maps api v3 docs)
			options:{
				//define que no se van a manejar tipos de mapas por medio de control
				mapTypeControl: false,
				//define que no se va a manejar navegacion por medio de control
				panControl: false,
				//define que no se va a projectar el control default de zoom 
				zoomControl: false,
				//define que no se va a mostrar la escala
				scaleControl: false,
				//define que no se va a utilizar el control de vista
				streetViewControl: false,
				//define los estilos del mapa (color)
				styles:[
				   	{
						featureType: "poi",
						stylers: [{ visibility: "off" }]   
					},
					{
						"featureType": "road",
    					"stylers": [
      						{ "gamma": 1.07 },
      						{ "lightness": 6 },
      						{ "hue": "#00bbff" },
      						{ "saturation": -67 }
    					]
					}
				],
        	},
			//propiedad que permite controlar el cambio en la vista de mapa
			bounds:{la1:0,la2:0,ln1:0,ln2:0},
			//opacidad de los marcadores
       		markerOpacity:0.9,
		};
		//
		//eventos del mapa
		
		$rootScope.map.events={
			//cuando se mueve la pantalla
			tilesloaded:function(){
				google.maps.event.trigger($rootScope.map.getGMap(), 'resize');
			},
			bounds_changed:function(event){
				google.maps.event.trigger($rootScope.map.getGMap(), 'resize');
				//declaracion del contenido actual del mapa
				var bounds=$rootScope.map.getGMap().getBounds();
				//declaracion del objeto de contenido.
				$rootScope.map.bounds={
					//latitud soutwest
					la1:bounds.getSouthWest().lat(),
					//latitud northeast
					la2:bounds.getNorthEast().lat(),
					//longitud southwest
					ln1:bounds.getSouthWest().lng(),
					//longitud northwest
					ln2:bounds.getNorthEast().lng()
				}
				
			}
		}
		})
		uiGmapIsReady.promise().then(function(maps){
		//carga los eventos
		//Eventos.refresh();
		//animacion del mapa una vez cargado
		
		angular.element(document.getElementsByClassName("angular-google-map")).addClass("aparece-map")
		$timeout(function(){
			angular.element(document.getElementsByClassName("angular-google-map")).addClass("visible")
			//angular.element(document.getElementsByClassName("angular-google-map")).removeClass("aparece-map")
			//angular.element(document.getElementsByClassName("angular-google-map")).addClass("aparece-map")
		},1000)
    	/*$(".angular-google-map").animate({
			opacity:1,
        },500);*/
		
	})   
	};
	//function que vigila la region visualizada en el mapa
	$rootScope.$watch('map.bounds', function(newValues, oldValues, scope) {
		if(newValues){
			//if(!$rootScope.radio.activo)Eventos.refresh();
		}
	},true)
	//function que vigila las propiedades del mapa para guardarlas en caso de algun cambio
	$rootScope.$watch('map', function(newValue, oldValue) {
		if(newValue)Memory.set('Mapa',$rootScope.map)
	}, true)
	//function que se ejecuta una vez que el mapa esta cargado
	
	return {
		inicializa:function(){
			inicializa();
		},
	}
})