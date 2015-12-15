// JavaScript Document
angular.module('starter.services')
.factory('Evento',function($rootScope,uiGmapGoogleMapApi){
	var rad = function(x) {return x*Math.PI/180;}
	var R     =6378.137 ;      
  	
	
	var create=function(data){
		return {
			id:data.id,
			latitude:data.latitude,
			longitude:data.longitude,
			asunto:data.asunto,
			icono:{
				url: 'img/iconos/mapa/marcadores/'+data.asunto+".png",
				size: new google.maps.Size(40, 51),
   				origin: new google.maps.Point(0,0),
   				anchor: new google.maps.Point(20, 51),
				scaledSize:new google.maps.Size(40, 51)
			},
			options:{
				visible:true,
				opacity:$rootScope.map.markerOpacity,
			}
		};
	}
	
	return {
		create:function(data){
			return create(data);
		},
		review:function(data){
			if(!$rootScope.radio.activo) data.options.visible=true;
			else {
				var pos=$rootScope.ubicacion.position;
				var dLat  = rad( pos.latitude - data.latitude );
  				var dLong = rad( pos.longitude - data.longitude );
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(data.latitude)) * Math.cos(rad(pos.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  				var d = R * c;
				if( (d.toFixed(3)*1000)>$rootScope.radio.radio)data.options.visible= false;
				else data.options.visible= true;	
			}
			
		},
		hide:function(data){
			data.options.visible=false;
		}
	}
})