angular.module('starter.services')
.factory('Auto',function($rootScope,uiGmapGoogleMapApi,Memory,$timeout,Eventos){//
	
		var inicializa=function(){
			$rootScope.auto=Memory.get("Auto")
			if(!$rootScope.auto)
		$rootScope.auto={
			position:{latitude:0+$rootScope.ubicacion.position.latitude,longitude:0+$rootScope.ubicacion.position.longitude},
			posicionando:false,
			activo:false,
			options:{
				draggable:true,
				zIndex:10000,
				shadow: 'none',
				content: '<div class="carMarker"><div class="contIconMarker"><img class="iconMarker" style="-webkit-mask-image: url(img/iconos/mapa/controls/auto.png); background: #02788A;" ></div></div>',
				visible:false,
				shape:{
					coords: [0, 0, 0, 51, 51, 40, 40 , 0],
					type: 'poly',
				},
			},
			
		}
		
		$rootScope.auto.events={
			/*position_changed:function(event){
				if(!$rootScope.$$phase) {
					$rootScope.$apply(function(){
						//actualiza la ubicacion actual
						$rootScope.auto.position={latitude:event.position.lat(),longitude:event.position.lng()}
						$rootScope.map.center={latitude:event.position.lat(),longitude:event.position.lng()}
					})
				}else{
					//actualiza la ubicacion actual
					$rootScope.auto.position={latitude:event.position.lat(),longitude:event.position.lng()}
					$rootScope.map.center={latitude:event.position.lat(),longitude:event.position.lng()}
				}
			},
			dblclick:function(event){
				$rootScope.map.zoom=18
				$rootScope.map.center={ latitude: 0+$rootScope.auto.position.latitude, longitude:  0+$rootScope.auto.position.longitude}
			}*/
		}
		
		if($rootScope.auto.posicionando)
		$timeout(function(){
			$rootScope.map.center={latitude:$rootScope.auto.position.latitude,longitude:$rootScope.auto.position.longitude};
		},100)
	}
	uiGmapGoogleMapApi.then(function(maps) {
	})
	$rootScope.$watch("auto",function(newVal,oldVal){
		if(newVal)Memory.set("Auto",$rootScope.auto);
	},true)
	$rootScope.$watch("auto.position",function(newVal,oldVal){
		if(newVal && oldVal){
			$rootScope.map.center={latitude:$rootScope.auto.position.latitude,longitude:$rootScope.auto.position.longitude};
		}
	},true)
	$rootScope.$watch("auto.activo",function(newVal,oldVal){
		if(!_.isUndefined(newVal) && !_.isUndefined(oldVal)){
			if(newVal){
				if(window.plugins.pushNotification)window.plugins.pushNotification.carLocation(function () {}, function () {},
        		{"Estatus":"1","Latitud":""+$rootScope.auto.position.latitude,"Longitud":""+$rootScope.auto.position.longitude});
			}else{
				if(window.plugins.pushNotification)window.plugins.pushNotification.carLocation(function () {}, function () {}, {"Estatus":"0","Latitud":"","Longitud":"",});
			}
		}
	},true)
	
	$rootScope.$watch("auto.posicionando",function(newVal,oldVal){
		if(!_.isUndefined(newVal) && !_.isUndefined(oldVal)){
			if(newVal){
				$timeout(function(){
				$rootScope.auto.options.visible=true;
				$rootScope.auto.options.draggable=true;
				$rootScope.radio.visible=false;
				$rootScope.eventosMap=[];
				$rootScope.ubicacion.options.visible=false;
				if(!$rootScope.auto.activo)
				$rootScope.auto.position={latitude:$rootScope.ubicacion.position.latitude,longitude:$rootScope.ubicacion.position.longitude}
				$rootScope.map.zoom=17;
				$rootScope.map.center={latitude:$rootScope.auto.position.latitude,longitude:$rootScope.auto.position.longitude}
				},200)
				//navigator.geolocation.getCurrentPosition(mapSuccessAuto, mapError);
			}
			else{
				$timeout(function(){
				//$rootScope.auto.options.visible=true;
				$rootScope.auto.options.draggable=false;
				$rootScope.radio.visible=true;
				$rootScope.ubicacion.options.visible=true;
				$rootScope.map.center={latitude:$rootScope.ubicacion.position.latitude,longitude:$rootScope.ubicacion.position.longitude}
				$rootScope.map.zoom=12;
				Eventos.refresh();
				},100)
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
		inicializa:function(){
			inicializa();
		},
	}
})