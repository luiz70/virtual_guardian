angular.module('starter.services')
.factory('Eventos',function($rootScope,uiGmapGoogleMapApi,socket,Memory,Evento,$timeout,$interval,sql){
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
		//$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		//$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.edit;})
		//se envian los ids al servidor
		//socket.emit('setInfo',{ids:$rootScope.idEventos,edit:$rootScope.editEventos});	
	}
	
	
	var listeners=function(){
		/*socket.getSocket().removeListener('newEvent',newEvent)
		socket.getSocket().removeListener('eventosEditados',eventosEditados)
		socket.getSocket().removeListener('eventosEliminados',eventosEliminados)
		socket.getSocket().removeListener('getEventos',getEventos)
		socket.getSocket().on('newEvent',newEvent)
		socket.getSocket().on('eventosEditados',eventosEditados)
		socket.getSocket().on('eventosEliminados',eventosEliminados)
		socket.getSocket().on('getEventos',getEventos)	*/
	}
	
	var getEventosServer=function(){
		if(server)$timeout.cancel(server)
		server=$timeout(function(){
			serverCall()
		},400)
	}
	var serverCall=function(){
		
		
		sql.getEventos();
		//se envia la peticion al servidor de los eventos en el bounds seleccionado en las fechas seleccionadas.
		//if(socket.isConnected)socket.getSocket().emit('getEventos',bounds,f1,f2);
	}
	$rootScope.$watch('Usuario.Periodo', function(newValue, oldValue) {
		if(newValue!=oldValue)getEventosServer();
	})
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