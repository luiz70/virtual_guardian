angular.module('starter.services')
.factory('Eventos',function($rootScope,uiGmapGoogleMapApi,socket){
	uiGmapGoogleMapApi.then(function(maps) {
		$rootScope.map.Eventos=[];
		$rootScope.map.events={
			bounds_changed:function(event){
				var bounds=$rootScope.map.getGMap().getBounds();
				$rootScope.map.bounds={
					la1:bounds.getSouthWest().lat(),
					la2:bounds.getNorthEast().lat(),
					ln1:bounds.getSouthWest().lng(),
					ln2:bounds.getNorthEast().lng()
				}
				//$rootScope.$apply(function(){})
			}
		}
		$rootScope.map.ubicacion.events={
				mouseup:function(event){
					$rootScope.map.ubicacion.position={latitude:event.position.lat(),longitude:event.position.lng()}
                    revisaEventos($rootScope.map.ubicacion.position);
					$rootScope.map.radio.visible=true;
				},
				mousedown:function(event){
					hideAllMarkers();
					$rootScope.map.radio.visible=false;
				},
				position_changed:function(event){
					//$rootScope.$apply(function(){})
				}
			}
			socket.emit('setIds',$rootScope.map.idEventos);
	})
	
	
	var refreshEventos=function(){
		if(!$rootScope.map.filtros.activos){
			f2=new Date();
			f1=new Date();
			f1.setDate(f1.getDate()-$rootScope.Usuario.Periodo)
			f1=f1.getTime()/1000000;
			f2=f2.getTime()/1000000;
		}
		socket.getSocket().emit('getEventos', $rootScope.map.bounds,f1,f2);
	}
	
	/*socket.getSocket().on('getEventos',function(data){
		for(var i=0; i<data.length;i++)
		data[i].icono=getIconoEvento(data[i]);
		$rootScope.map.eventos=_.uniq(_.union($rootScope.map.eventos,data),function(item) { return item.id;});
	})*/
	$rootScope.$watch('map.eventos', function(newValue, oldValue) {
  		if(newValue){
			revisaEventos($rootScope.map.ubicacion.position);
			$rootScope.map.idEventos = $.map($rootScope.map.eventos, function(v, i){return v.id;});
			Memory.set('Mapa',$rootScope.map)
		}
	});
	var hideAllMarkers=function(){
		for(var i=0; i<$rootScope.map.eventos.length;i++)$rootScope.map.eventos[i].options={visible:false,opacity:$rootScope.map.markerOpacity}
	}
	var revisaEventos=function(pos){
		for(var i=0; i<$rootScope.map.eventos.length;i++){
			if($rootScope.map.radio.activo){
			rad = function(x) {return x*Math.PI/180;}
			var R     =6378.137 ;      
  			var dLat  = rad( pos.latitude - $rootScope.map.eventos[i].latitude );
  			var dLong = rad( pos.longitude - $rootScope.map.eventos[i].longitude );
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad($rootScope.map.eventos[i].latitude)) * Math.cos(rad(pos.latitude)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  			var d = R * c;
			
			
				if( (d.toFixed(3)*1000)>$rootScope.map.radio.radius)$rootScope.map.eventos[i].options={visible:false,opacity:$rootScope.map.markerOpacity}
				else $rootScope.map.eventos[i].options={visible:true,opacity:$rootScope.map.markerOpacity}
			}else $rootScope.map.eventos[i].options={visible:true,opacity:$rootScope.map.markerOpacity}
		}
	}
	return {
		func:function(){
			
		},
	}
})