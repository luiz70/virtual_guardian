// JavaScript Document
angular.module('starter.services')
.factory('Evento',function($rootScope,uiGmapGoogleMapApi,$timeout,InfoEvento,socket){
	var rad = function(x) {return x*Math.PI/180;}
	var R     =6378.137 ;      
	var timer=1000
	var hidden=false;
	$rootScope.info=false;
	$rootScope.selected=null;
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
				visible:true,
				opacity:$rootScope.map.markerOpacity,
				data:data
			},
			events:{
				mouseup:function(){
					InfoEvento.select(this.getGMarker().data.id)
					InfoEvento.visible(true);
				},
				visible_changed:function(event){
					/*data=(_.findWhere($rootScope.eventos, { id: event.key }));
					if(data.interval)$timeout.cancel(data.interval)
					if(event.visible){
						data.interval=$timeout(function(){
							revisaEvento(data)
						},timer)
					}*/
				}
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
			mouseup:function(){
				InfoEvento.select(this.getGMarker().data.id)
				InfoEvento.visible(true);
			},
			visible_changed:function(event){
				/*data=(_.findWhere($rootScope.eventos, { id: event.key }));
				if(data.interval)$timeout.cancel(data.interval)
				if(event.visible){
					data.interval=$timeout(function(){
						revisaEvento(data)
					},timer)
				}*/
			}
		}
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
			
			if(revisa(et)){
				$rootScope.eventosMap=_.uniq(_.union($rootScope.eventosMap,[create(et)]),function(item) { return item.id;});
			} 
		}
	}
	socket.getSocket().on('getEvento',function(data){
		if(data){
			$rootScope.eventos=_.uniq(_.union($rootScope.eventos,[data]),function(item) { return item.id;});
			if(revisa(data))$rootScope.eventosMap=_.uniq(_.union($rootScope.eventosMap,[create(data)]),function(item) { return item.id;});
			//$rootScope.eventosMap.push(create(data))
		}
	})
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
				var dLat  = rad( pos.latitude - data.latitude );
  				var dLong = rad( pos.longitude - data.longitude );
				var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(data.latitude)) * Math.cos(rad(pos.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  				var d = R * c;
				if( (d.toFixed(3)*1000)>$rootScope.radio.radio)return false;
				else return true;	
			}
	}
	return {
		create:function(data){
			var d=create(data)
			addFunctions(d);
			return d;
		},
		load:function(id){
			load(id);
		},
		review:function(data){
			return revisa(data);
			
		},
		inicialize:function(data){
			return addFunctions(data);
		},
		hide:function(data){
			hidden=data;
            
		}
	}
})