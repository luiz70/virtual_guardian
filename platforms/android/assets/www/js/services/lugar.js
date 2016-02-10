angular.module('starter.services')
.factory('Lugar',function($rootScope,InfoEvento){
	//funcion que inicializa la ubicacion
	var inicializa=function(){
		
		$rootScope.lugar={
			//la posicion que tiene el marcador
			position:{ latitude: 20.6737919, longitude:  -103.3354131 },
			//opciones de marcadores (google maps api v3)
			options:{
				zIndex:100000000000,
				shadow: 'none',
				content: '<div class="placeMarker"><div class="contIconMarker"><img class="iconMarker" style="-webkit-mask-image: url(img/iconos/mapa/controls/auto.png);" ></div></div>',
				visible:false,
				shape:{
					coords: [0, 0, 0, 51, 40, 51, 40 , 0],
					type: 'poly',
				},
			},
			
		}
		$rootScope.lugar.events={
			click:function(event){
				InfoEvento.select(event)
				InfoEvento.visible(true)
			}
		}
	}
	return {
		inicializa:function(){
			return inicializa();
		},
		setImg:function(data){
			$rootScope.lugar.position={latitude:data.geometry.location.lat(),longitude:data.geometry.location.lng()}
			$rootScope.lugar.options.content= '<div class="placeMarker"><div class="contIconMarker"><img class="iconMarker" style="-webkit-mask-image: url('+data.icon+');" ></div></div>'
			$rootScope.lugar.options.visible=true;
			$rootScope.lugar.options.data=data;
			return $rootScope.lugar
		},
		hide:function(){
			$rootScope.lugar.options.visible=false;
		}
	}
	
})