angular.module('starter.services')
.factory('Eventos',function($rootScope,uiGmapGoogleMapApi,socket,Memory,Evento,$timeout,$interval){
	var server=null;
	var inicializa=function(){
		//se intenta recuperar lo guardado en memoria
		$rootScope.eventos=Memory.get('Eventos');
		//si no hay datos guardados se inicializa un arreglo vacio
		if(!$rootScope.eventos) $rootScope.eventos=[];
		else for(var i=0; i<$rootScope.eventos.length;i++)
		Evento.inicialize($rootScope.eventos[i]);
		//se declara un arreglo con los ids de los eventos almacenados
		$rootScope.idEventos=$.map($rootScope.eventos, function(v, i){return v.id;})
		$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.editado;})
		
		//se envian los ids al servidor
		socket.emit('setInfo',{ids:$rootScope.idEventos,edit:$rootScope.editEventos});
		
	}
		
	uiGmapGoogleMapApi.then(function(maps) {		
	})
	var getEventosServer=function(){
		if(server)$timeout.cancel(server)
		server=$timeout(function(){
			serverCall()
		},500)
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
		//se envia la peticion al servidor de los eventos en el bounds seleccionado en las fechas seleccionadas.
		socket.getSocket().emit('getEventos', $rootScope.map.bounds,f1,f2);
	}
	
	socket.getSocket().on('eventosEditados',function(data){
		console.log("editados");
		console.log(data);
	})
	socket.getSocket().on('test',function(data){
		alert(data);
	})
	//socket.getSocket().emit('test');
	socket.getSocket().on('eventosEliminados',function(data){
		console.log("eliminados");
		console.log(data);
	})
	socket.getSocket().on('getEventos',function(data){
		for(var i=0; i<data.length;i++)
		data[i]=Evento.create(data[i]);
		/*data[i].icono=getIconoEvento(data[i]);*/
		$rootScope.eventos=_.uniq(_.union($rootScope.eventos,data),function(item) { return item.id;});
		revisashowHide();
	})
	
	$rootScope.$watch('fechaEventos', function(newValue, oldValue) {
		if(newValue)Memory.set('FechaEventos',$rootScope.fechaEventos)
	})
	$rootScope.$watch('eventos', function(newValue, oldValue) {
  		if(newValue){
			//revisaEventos($rootScope.map.ubicacion.position);
			$rootScope.idEventos = $.map($rootScope.eventos, function(v, i){return v.id;});
			$rootScope.editEventos=$.map($rootScope.eventos, function(v, i){return v.editado;})
			Memory.set('Eventos',$rootScope.eventos)
			revisashowHide();
		}
	},true);
	
	
	var revisashowHide=function(){
		for(var i=0;i<$rootScope.eventos.length;i++){
			$rootScope.eventos[i].options.visible=Evento.review($rootScope.eventos[i]);
		}
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