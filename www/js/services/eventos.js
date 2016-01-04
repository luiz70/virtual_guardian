angular.module('starter.services')
.factory('Eventos',function($rootScope,uiGmapGoogleMapApi,socket,Memory,Evento,$timeout,$interval){
	var server=null;
	var circulo=null;
	var inicializa=function(){
		//se intenta recuperar lo guardado en memoria
		//Memory.set("Eventos",null);
		$rootScope.eventos=Memory.get('Eventos');
		//si no hay datos guardados se inicializa un arreglo vacio
		if(!$rootScope.eventos) $rootScope.eventos=[];
		//else for(var i=0; i<$rootScope.eventos.length;i++)
		//Evento.inicialize($rootScope.eventos[i]);
		$rootScope.eventosMap=[];
		//se declara un arreglo con los ids de los eventos almacenados
		$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.edit;})
		//se envian los ids al servidor
		socket.emit('setInfo',{ids:$rootScope.idEventos,edit:$rootScope.editEventos});	
	}
	var newEvent=function(data){
		getEventosServer();
	}
	var eventosEditados=function(data){
		for(var i=0;i<data.length;i++){
			
			var e=_.findIndex($rootScope.eventos, { id: data[i].id });
			if(e)$rootScope.eventos[e]=data[i];
			Evento.load(data[i].id);
		}
	}
	var eventosEliminados=function(data){
		for(var i=0;i<data.length;i++){
			var e=_.findIndex($rootScope.eventos, { id: parseInt(data[i])})
			var em=_.findIndex($rootScope.eventosMap, { id: data[i].id });
			if(e>=0){
				$rootScope.eventos.splice(e,1);
			}
			if(em)$rootScope.eventosMap.splice(em,1);
		}
	}
	var getEventos=function(ids){
		$rootScope.eventosMap=[];
		for(var i=0; i<ids.length;i++)
			Evento.load(ids[i]);
	}
	var listeners=function(){
		socket.getSocket().removeListener('newEvent',newEvent)
		socket.getSocket().removeListener('eventosEditados',eventosEditados)
		socket.getSocket().removeListener('eventosEliminados',eventosEliminados)
		socket.getSocket().removeListener('getEventos',getEventos)
		socket.getSocket().on('newEvent',newEvent)
		socket.getSocket().on('eventosEditados',eventosEditados)
		socket.getSocket().on('eventosEliminados',eventosEliminados)
		socket.getSocket().on('getEventos',getEventos)	
	}
	
	var getEventosServer=function(){
		if(server)$timeout.cancel(server)
		server=$timeout(function(){
			serverCall()
		},400)
	}
	var serverCall=function(){
		
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
		
		if(!circulo)
		var circulo=new google.maps.Circle({
			map: $rootScope.map.getGMap(),
			center: {lat: $rootScope.ubicacion.position.latitude, lng: $rootScope.ubicacion.position.longitude},
			radius: $rootScope.radio.radio,
			visible:false
		})
		circulo.setRadius($rootScope.radio.radio)
		circulo.setCenter({lat: $rootScope.ubicacion.position.latitude, lng: $rootScope.ubicacion.position.longitude})
		
		var bounds=$rootScope.map.bounds
		if($rootScope.radio.activo){
			var b=circulo.getBounds()
			bounds={la1:b.getSouthWest().lat(),
					//latitud northeast
					la2:b.getNorthEast().lat(),
					//longitud southwest
					ln1:b.getSouthWest().lng(),
					//longitud northwest
					ln2:b.getNorthEast().lng()}
		}
		//se envia la peticion al servidor de los eventos en el bounds seleccionado en las fechas seleccionadas.
		if(socket.isConnected)socket.getSocket().emit('getEventos',bounds,f1,f2);
	}
	
	
	$rootScope.$watch('fechaEventos', function(newValue, oldValue) {
		if(newValue)Memory.set('FechaEventos',$rootScope.fechaEventos)
	})
	$rootScope.$watch('eventos', function(newValue, oldValue) {
  		if(newValue){
			if($rootScope.eventos.length>10000)console.log("FULL");
			//revisaEventos($rootScope.map.ubicacion.position);
			$rootScope.idEventos = $.map($rootScope.eventos, function(v, i){return v.id;});
			$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.edit;})
			Memory.set('Eventos',$rootScope.eventos)
			//revisashowHide();
		}
	},true);
	
	var revisashowHide=function(){
		for(var i=0;i<$rootScope.eventos.length;i++){
			//$rootScope.eventos[i].options.visible=Evento.review($rootScope.eventos[i]);
		}
	}
    var hideAll=function(){
		
         for(var i=0;i<$rootScope.eventos.length;i++){
			//$rootScope.eventos[i].options.visible=false;
		}
    }
	return {
		inicializa:function(){
			inicializa();
			listeners();
			Evento.listeners();
		},
		listeners:function(){
			listeners();
		},
		refresh:function(){
			
			getEventosServer();
		},
		showHide:function(){
			Evento.hide(false);
			//revisashowHide();
		},
		hideAll:function(){
        	 Evento.hide(true);
			 hideAll()
         
		}
	}
})