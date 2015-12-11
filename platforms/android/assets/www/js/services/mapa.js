angular.module('starter.services')
.factory('Mapa',function($rootScope,uiGmapGoogleMapApi,uiGmapIsReady,socket,Memory,Radio,Ubicacion){
	
	//function que se ejecuta una vez que el script de google maps esta cargado
	uiGmapGoogleMapApi.then(function(maps) {
		//inicializa los componentes del mapa
		Ubicacion.inicializa();
		Radio.inicializa();
		//carga la informacion del mapa guardada
   		$rootScope.map=Memory.get('Mapa')
		//Si no hay informacion guardada, inicializa el mapa
		if(!$rootScope.map)
		$rootScope.map = { 
			//centro inicial del mapa
			center: { latitude: 20.6737919, longitude:  -103.3354131 }, 
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
	});
	//function que vigila la region visualizada en el mapa
	$rootScope.$watch('map.bounds', function(newValues, oldValues, scope) {
		//console.log($rootScope.map.bounds);
		//if(newValues)refreshEventos();
	},true)
	//function que vigila las propiedades del mapa para guardarlas en caso de algun cambio
	$rootScope.$watch('map', function(newValue, oldValue) {
		//if(newValue)Memory.set('Mapa',$rootScope.map)
	}, true)
	//function que se ejecuta una vez que el mapa esta cargado
	uiGmapIsReady.promise().then(function(maps){
		//animacion del mapa una vez cargado
    	$(".angular-google-map").animate({
			opacity:1,
        },500);
	})   
	return {
		func:function(){
		},
	}
})