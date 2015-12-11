angular.module('starter.services')
.factory('Auto',function($rootScope,uiGmapGoogleMapApi){
	uiGmapGoogleMapApi.then(function(maps) {
		$rootScope.map.auto={
			position:{ latitude: 20.6737919, longitude:  -103.3354131 },
			posicionando:false,
			activo:false,
			options:{
				draggable:true,
				zIndex:10000,
				shadow: 'none',
				content: '<div class="placeMarker"><div class="contIconMarker"><img class="iconMarker" style="-webkit-mask-image: url(img/iconos/mapa/controls/auto.png);" ></div></div>',
				visible:false,
				shape:{
					coords: [0, 0, 0, 40, 40, 40, 40 , 0],
					type: 'poly',
				},
			},
		
		}
	})
	$rootScope.$watch("map.auto.posicionando",function(newVal){
		if($rootScope.map){
			navigator.geolocation.getCurrentPosition(mapSuccessAuto, mapError);
			$rootScope.map.radio.visible=!newVal;
			$rootScope.map.ubicacion.options.visible=!newVal;
			$rootScope.map.auto.options.visible=newVal;
			if(newVal){
				$rootScope.map.markerOpacity=0;
				$rootScope.map.zoom=17
				$rootScope.map.center=$rootScope.map.auto.position
			}
		}
	})
	var mapSuccessAuto=function(position){ 
			$rootScope.map.ubicacion.location={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
         	$rootScope.map.auto.position={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
			$rootScope.$apply(function(){})
         }
		  var mapError=function(error){
         }
	return {
		func:function(){
			
		},
	}
})