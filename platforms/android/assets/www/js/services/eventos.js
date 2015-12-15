angular.module('starter.services')
.factory('Eventos',function($rootScope,uiGmapGoogleMapApi,socket,Memory,Evento){
	
	var inicializa=function(){
		//se intenta recuperar lo guardado en memoria
		$rootScope.eventos=Memory.get('Eventos');
		//si no hay datos guardados se inicializa un arreglo vacio
		if(!$rootScope.eventos) $rootScope.eventos=[];
		//se declara un arreglo con los ids de los eventos almacenados
		$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		//se envian los ids al servidor
		socket.emit('setIds',$rootScope.idEventos);
	}
		
	uiGmapGoogleMapApi.then(function(maps) {		
	})
	
	
	var getEventosServer=function(){
		//se verifica si hay filtros para derifinir las fechas
		if(!$rootScope.filtros.activos){
			//si no hay filtros se definen en base al periodo establecido
			//la fecha final se define como la fecha actual
			f2=new Date();
			//la fecha inicial se inicializa como la fecha actual
			f1=new Date();
			//se modifica la fecha inicial para restarle el periodo
			f1.setDate(f1.getDate()-$rootScope.Usuario.Periodo)
			//se dividen las fechas para enviar menos datos por la red
			f1=f1.getTime()/1000000;
			f2=f2.getTime()/1000000;
		}else{
			//si hay filtros se definen las fechas en base a lo establecido en los filtros
			
		}
		//se envia la peticion al servidor de los eventos en el bounds seleccionado en las fechas seleccionadas.
		socket.getSocket().emit('getEventos', $rootScope.map.bounds,f1,f2);
	}
	
	socket.getSocket().on('getEventos',function(data){
		for(var i=0; i<data.length;i++)
		data[i]=Evento.create(data[i]);
		/*data[i].icono=getIconoEvento(data[i]);*/
		$rootScope.eventos=_.uniq(_.union($rootScope.eventos,data),function(item) { return item.id;});
		revisashowHide();
		//console.log(data);
	})
	$rootScope.$watch('eventos', function(newValue, oldValue) {
  		if(newValue){
			//revisaEventos($rootScope.map.ubicacion.position);
			$rootScope.idEventos = $.map($rootScope.eventos, function(v, i){return v.id;});
			Memory.set('Mapa',$rootScope.map)
		}
	});
	
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
	var revisashowHide=function(){
		for(var i=0;i<$rootScope.eventos.length;i++)
			Evento.review($rootScope.eventos[i]);
	}
	return {
		inicializa:function(){
			inicializa();
		},
		refresh:function(){
			getEventosServer();
		},
		showHide:function(){
			revisashowHide();
		},
		hideAll:function(){
			for(var i=0;i<$rootScope.eventos.length;i++)
			Evento.hide($rootScope.eventos[i]);
		}
	}
})