// JavaScript Document
angular.module('starter.services')
.factory('Evento',function($rootScope,uiGmapGoogleMapApi,$timeout,InfoEvento,socket){
	var rad = function(x) {return x*Math.PI/180;}
	var R     =6378.137 ;      
	var timer=1000
	var hidden=false;
	var double=false;
	var sel=null;
	$rootScope.info=false;
	$rootScope.selected=null;
	var create=function(data){
		var d=null
		if(revisa(data))
		d={
			id:data.IdEvento,
			latitude:data.Latitud,
			longitude:data.Longitud,
			asunto:data.Asunto,
			editado:data.Edicion,
			icono:{
				url: 'img/iconos/mapa/marcadores/'+data.Asunto+".png",
				size: new google.maps.Size(40, 51),
   				origin: new google.maps.Point(0,0),
   				anchor: new google.maps.Point(20, 51),
				scaledSize:new google.maps.Size(40, 51)
			},
			options:{
				visible:true,
				opacity:$rootScope.map.markerOpacity,
				data:data
			},
			events:{
				click:function(){
					double=false;
					/**/
					var sel=this;
					$timeout(function(){
						if(!double){
							InfoEvento.select(sel.getGMarker().data)
							InfoEvento.visible(true);
						}
					},300)
				},
				visible_changed:function(event){
					/*data=(_.findWhere($rootScope.eventos, { id: event.key }));
					if(data.interval)$timeout.cancel(data.interval)
					if(event.visible){
						data.interval=$timeout(function(){
							revisaEvento(data)
						},timer)
					}*/
				},
				dblclick:function(event){
					double=true;
					$rootScope.map.zoom=18
					$rootScope.map.center={ latitude: event.position.lat(), longitude:  event.position.lng()}
				}
			}
		};
		return d;
	}
	
	
	var revisaEvento=function(data){
		console.log(data.id);
	}
	var load=function(id){
		var et=_.findWhere($rootScope.eventos,{id:id})
		var dl=_.findIndex($rootScope.eventosMap,{id:id})
		//if(dl>=0)$rootScope.eventosMap.splice(dl,1)
		if(!et)
			socket.getSocket().emit('getEvento',id);
		else{
			
			if(dl<0 && revisa(et)){
				$rootScope.eventosMap=_.uniq(_.union($rootScope.eventosMap,[create(et)]),function(item) { return item.id;});
			} 
		}
	}
	var getEvento=function(data){
		/*	if(data){
				$rootScope.eventos=_.uniq(_.union($rootScope.eventos,[data]),function(item) { return item.id;});
				if(revisa(data))$rootScope.eventosMap=_.uniq(_.union($rootScope.eventosMap,[create(data)]),function(item) { return item.id;});
				//$rootScope.eventosMap.push(create(data))
			}*/
		}
	var listeners=function(){
		//socket.getSocket().removeListener('getEvento',getEvento)
		//socket.getSocket().on('getEvento',getEvento)
	}
	var revisa=function(data){
		/*if(hidden){
			console.log(2);
				return false
			}else*/
			
            if(!$rootScope.radio.visible){
                return false;
            }else 
			if(!$rootScope.radio.activo) {
				return true;
			}else {
				var pos=$rootScope.ubicacion.position;
				var dLat  = rad( pos.latitude - data.Latitud );
  				var dLong = rad( pos.longitude - data.Longitud );
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(data.Latitud)) * Math.cos(rad(pos.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  				var d = R * c;
				if( parseInt(d.toFixed(3)*1000)>$rootScope.radio.radio)return false;
				else return true;	
			}
	}
	return {
		create:function(data){
			var d=create(data)
			return d;
		},
		load:function(id){
			load(id);
		},
		review:function(data){
			return revisa(data);
			
		},
		hide:function(data){
			hidden=data;
            
		},
		listeners:function(){
			listeners();
		}
	}
})