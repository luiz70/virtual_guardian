// JavaScript Document
angular.module('starter.services')
.factory('Evento',function($rootScope,uiGmapGoogleMapApi,$timeout){
	var rad = function(x) {return x*Math.PI/180;}
	var R     =6378.137 ;      
	var timer=1000
	var create=function(data){
		return {
			id:data.id,
			latitude:data.latitude,
			longitude:data.longitude,
			asunto:data.asunto,
			editado:data.edit,
			icono:{
				url: 'img/iconos/mapa/marcadores/'+data.asunto+".png",
				size: new google.maps.Size(40, 51),
   				origin: new google.maps.Point(0,0),
   				anchor: new google.maps.Point(20, 51),
				scaledSize:new google.maps.Size(40, 51)
			},
			options:{
				visible:false,
				opacity:$rootScope.map.markerOpacity,
				data:data
			}
		};
	}
	var addFunctions=function(data){
		data.options.opacity=0.9
		/*if(data.options.visible){
			data.interval=$timeout(function(){
				revisaEvento(data)
			},timer)
		}*/
		data.events={
			click:function(){
				console.log(3);
			},
			visible_changed:function(event){
				data=(_.findWhere($rootScope.eventos, { id: event.key }));
				if(data.interval)$timeout.cancel(data.interval)
				if(event.visible){
					/*data.interval=$timeout(function(){
						revisaEvento(data)
					},timer)*/
				}
			}
		}
	}
	var revisaEvento=function(data){
		console.log(data.id);
	}
	return {
		create:function(data){
			create(data);
			return addFunctions(data);
		},
		review:function(data){
			if(!$rootScope.radio.activo) {
				return true;
			}else {
				var pos=$rootScope.ubicacion.position;
				var dLat  = rad( pos.latitude - data.latitude );
  				var dLong = rad( pos.longitude - data.longitude );
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(data.latitude)) * Math.cos(rad(pos.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  				var d = R * c;
				if( (d.toFixed(3)*1000)>$rootScope.radio.radio)return false;
				else return true;	
			}
			
		},
		inicialize:function(data){
			return addFunctions(data);
		},
		hide:function(data){
			data.options.visible=false;
		}
	}
})