angular.module('starter.services')
.factory('sql',function($cordovaSQLite,$timeout,$http,socket,$rootScope,Evento){
	//declara la variable de la base de datos
	var db=null
	//declara un circulo que va a servir para obtener el bounds del radio
	var circulo=null
	//funcion que inicializa la base de datos
	var inicializa=function(){
		//carga la base de datos para movil y web
		try{
			//intenta cargar la base de datos para movil
			db=window.sqlitePlugin.openDatabase({ name:"VirtualG.db", location:1, bgType: 1 });
		}catch(err){
			//si no se puede la carga para web
			db = window.openDatabase("VirtualG", "1.0", "VirtualG", 100000000)
		}
		//$cordovaSQLite.execute(db, "DROP TABLE EVENTOS")
		//$cordovaSQLite.execute(db, "DELETE FROM EVENTOS")
		//crea la tabla eventos en caso de que no exista
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS EVENTOS (IdEvento integer primary key, Asunto integer, Latitud real,Longitud real, Estado integer,Fecha integer,Municipio text, Colonia text, Calles text,Hora text,Edicion integer,Edicion_info integer)")
		.then(function(res){
			//Manda llamar a la funcion que revisa que la informacion este actualizada
			//actualizaEventos()			
		})
	}
	//funcion que se comunica con el servidor para revisar ids de edicion y comprobar que este actualizada
	var actualizaEventos=function(){
		//consulta en la base de datos local los ids almacenados y los ids de edicion
		$cordovaSQLite.execute(db, "SELECT IdEvento,Edicion FROM EVENTOS")
			.then(function(res){
				//envia al servidor esta informacion.
				socket.emit('setInfo',parseArray(res.rows));
			})
	}
	var guardaInfoEvento=function(data){
		var id=data.IdEvento;
		delete data.IdEvento;
		var keys=_.keys(data);
		var query=""
		for(var i=0;i<keys.length;i++)
		keys[i]=keys[i]+"='"+data[keys[i]]+"'"
		//se da formato a la informacion a insertar
		//eventos=$.map(eventos, function(v, i){return "('"+_.values(v).join("','")+"')";})
		$cordovaSQLite.execute(db, "UPDATE EVENTOS SET "+keys.join(",")+" WHERE IdEvento="+id)
	}
	//funcion que guarda en la base de datos local los eventos enviados como parametro
	var guardaEventos=function(eventos){
		//se obtienen los nombres de los campos de la tabla
		var keys=_.keys(eventos[0]);
		var evt=eventos[0].IdEvento
		//se da formato a la informacion a insertar
		eventos=_.map(eventos, function(v, i){return "('"+_.values(v).join("','")+"')";})
		//se ejecuta la consulta que inserta todos los registros en la base de datos
		$cordovaSQLite.execute(db, "INSERT OR REPLACE INTO EVENTOS("+keys.join(",")+") VALUES"+eventos.join(" , "))
		.then(function (res){
			
		})
		
	}
	
	//funcion que permite borrar eventos de la base de datos
	var borraEventos=function(eventos){
		//ejecuta la consulta para eliminar los eventos
		$cordovaSQLite.execute(db, "DELETE FROM EVENTOS WHERE IdEvento IN("+eventos.join(",")+")")
	}
	//funcion que convierte en arreglo el resultado de una consulta a base de datos local
	var parseArray=function(res){
		//variable de salida
		var out=[]
		//recorre el resultado de la consulta
		for(var i=0;i<res.length;i++)
		//inserta en el arreglo de salida los elementos del resultado de la consulta
		out.push(res.item(i))
		//regresa el arreglo con los elementos del resultado
		return out;
	}
	//funcion que se ejecuta cuando se crea un evento nuevo desde el portal
	var newEvent=function(data){
		//actualiza la consulta para ver si el evento nuevo pertenece a la busqueda actual
		getEventosServer();
		
	}
	//funcion que se ejecuta cuando se detecta que un evento fue editado y la informacion local no es correcta
	var eventoEditado=function(data){
		//guarda el evento con los cambios en la base de datos local
		guardaEventos([data])
		//actualiza el evento en el mapa
		createEventos([data])
	}
	//funcion que se ejecuta cuando se detecta que un evento fue eliminado de la base de datos.
	var eventosEliminados=function(data){
		//borra el evento de la base de datos
		borraEventos(data)
	}
	//funcion que se ejecuta una ves que se obtienen los ids de la consulta
	var getIdEventos=function(ids){		//se limpian los eventos que no deben de aparecer en el mapa
	
		var temp=$rootScope.eventosMap;
		$rootScope.eventosMap=[]
		for(var i=0;i<temp.length;i++)
			if(ids.indexOf(parseInt(temp[i].id))>=0)$rootScope.eventosMap.push(temp[i])
		//se ejecuta una consulta a la base de datos local para obtener los eventos que esten almacenados
		$cordovaSQLite.execute(db, "SELECT IdEvento,Asunto,Latitud,Longitud,Edicion FROM EVENTOS WHERE IdEvento IN("+ids.join(",")+")")
		.then(function(res){
			//se crea un arreglo con el resultado
			var r=parseArray(res.rows)
			//se substrae del resultado los ids de los eventos que ya estan en la base de datos local
			var guardados=_.map(r, function(v, i){return v.IdEvento;})
			//se compara con los ids que se deben de proyectar para obtener los que faltan
			var nuevos=_.difference(ids,guardados)
			//si hay eventos nuevos se envian al servidor para obtener la informacion faltante
			if(nuevos.length>0)socket.getSocket().emit('getEventos',nuevos)
			//se proyectan en el mapa los eventos que ya estan almacenados
			createEventos(r)
			
		})
	}
	//funcion que proyecta los eventos en el mapa
	var createEventos=function(data){
		//se recorre el arreglo de eventos a proyectar
		for(var i=0;i<data.length;i++){
			//se crea el evento
			var evt=Evento.create(data[i])
			//si el evento es valido se agrega a los eventos del mapa reemplazando en caso de que existiera una version anterior
			if(evt)$rootScope.eventosMap=_.uniq(_.union([evt],$rootScope.eventosMap),function(item) { return item.id;});
		}
	}
	
	
	//funcion que se ejecuta una vez que se obtienen los eventos que faltaban en la base de datos local
	var getEventos=function(data){
		if(data.length>0){
			//se proyectan los eventos en el mapa
			createEventos(data);
			//se guardan los eventos en la base de datos local
			guardaEventos(data);
		}
	}
	
	
	//funcion que elimina y agrega las funciones de socket
	var listeners=function(){
		socket.getSocket().removeListener('newEvent',newEvent)
		socket.getSocket().removeListener('eventoEditado',eventoEditado)
		socket.getSocket().removeListener('eventosEliminados',eventosEliminados)
		socket.getSocket().removeListener('getIdEventos',getIdEventos)
		socket.getSocket().removeListener('getEventos',getEventos)
		socket.getSocket().removeListener("getInfoEvento",getInfoEvento);
		socket.getSocket().on('newEvent',newEvent)
		socket.getSocket().on('eventoEditado',eventoEditado)
		socket.getSocket().on('eventosEliminados',eventosEliminados)
		socket.getSocket().on('getIdEventos',getIdEventos)	
		socket.getSocket().on('getEventos',getEventos)
		socket.getSocket().on("getInfoEvento",getInfoEvento);
	}
	
	var getInfoEvento=function(data){
		if(data!==1)guardaInfoEvento(data);
	}
	
	//funcion que obtiene los parametros de busqueda de los eventos
	var getEventosServer=function(){
		
		if($rootScope.Usuario && $rootScope.filtros)
		if(!$rootScope.auto || ($rootScope.auto && !$rootScope.auto.posicionando)){
		var estados=[];
		var asuntos=[];
	  //se verifica si hay filtros para derifinir las fechas
	  
		if(!$rootScope.filtros.activos){
			//si no hay filtros se definen en base al periodo establecido
			//la fecha final se define como la fecha actual
			f2=new Date();
			f2.setHours(23)
			f2.setMinutes(59)
			f2.setSeconds(59)
			f2.setMilliseconds(999)
			
			//la fecha inicial se inicializa como la fecha actual
			f1=new Date();
			f1.setHours(0)
			f1.setMinutes(0)
			f1.setSeconds(0)
			f1.setMilliseconds(0)
			//se modifica la fecha inicial para restarle el periodo
			f1.setDate(f1.getDate()-$rootScope.Usuario.Periodo)
			//se dividen las fechas para enviar menos datos por la red
			f1=f1.getTime()/1000000;
			f2=f2.getTime()/1000000;
			
		}else{
			//si hay filtros se definen las fechas en base a lo establecido en los filtros
			if($rootScope.filtros.tipo==0){
				f1=$rootScope.filtros.fechaInicial.getTime()/1000000;
				f2=$rootScope.filtros.fechaFinal.getTime()/1000000;
			}else{
				var f1=new Date();
				f1.setDate(f1.getDate()-$rootScope.filtros.periodo)
				f1=f1.getTime()/1000000
				f2=(new Date()).getTime()/1000000;
			}
			estados=_.compact(_.map($rootScope.filtros.estados,function(v,i){if(!v.Selected)return v.Id; else return null;}))
			asuntos=_.compact(_.map($rootScope.filtros.asuntos,function(v,i){if(!v.Selected)return v.Id; else return null;}))
		}
		//si no se ha creado el circulo lo crea con los parametros actuales
		
		if(!circulo )
		circulo=new google.maps.Circle({
			map: $rootScope.map.getGMap(),
			center: {lat: $rootScope.ubicacion.position.latitude, lng: $rootScope.ubicacion.position.longitude},
			radius: $rootScope.radio.radio,
			visible:false
		})
		//modifica el radio del circulo
		circulo.setRadius($rootScope.radio.radio)
		//modifica el centro del circulo
		circulo.setCenter({lat: $rootScope.ubicacion.position.latitude, lng: $rootScope.ubicacion.position.longitude})
		//obtiene del mapa el bounds donde se va a buscar
		var bounds=$rootScope.map.bounds
		//si el radio esta activo crea el bounds con respecto al circulo
		if($rootScope.radio.activo){
			//obtiene del circulo el bounds
			var b=circulo.getBounds()
			//le da el formato que el servidor necesita
			bounds={la1:b.getSouthWest().lat(),
					//latitud northeast
					la2:b.getNorthEast().lat(),
					//longitud southwest
					ln1:b.getSouthWest().lng(),
					//longitud northwest
					ln2:b.getNorthEast().lng()}
		}
		//envia al servidor los parametros de busqueda para que regrese los ids
		if(socket.isConnected())socket.getSocket().emit("getIdEventos",bounds,f1,f2,estados,asuntos)
		else {
			
			if(db)
			$cordovaSQLite.execute(db, "SELECT IdEvento,Asunto,Latitud,Longitud,Edicion FROM EVENTOS WHERE (Latitud BETWEEN "+bounds.la1+" AND "+bounds.la2+" ) AND (Longitud BETWEEN "+bounds.ln1+" AND  "+bounds.ln2+") AND (Fecha BETWEEN "+(f1*1000)+" AND "+(f2*1000)+") AND ASUNTO NOT IN("+asuntos.join(",")+") AND ESTADO NOT IN("+estados.join(",")+")")
			.then(function(res){
				createEventos(parseArray(res.rows))
			})
		}
		}
  }
	return {
		inicializa:function(val){
			if(!db) inicializa();
			if(val) getEventosServer()
			listeners();
		},
		getDb:function(){
			return db;
		},
		listeners:function(){
			listeners();
		},
		getEventos:function(){
			getEventosServer()
		},
		update:function(){
			actualizaEventos();
		},
		getInfoEvento:function(id){
			return $cordovaSQLite.execute(db,"SELECT IdEvento,Calles,Colonia,Municipio,Hora,Estado,Fecha,Edicion_info FROM EVENTOS WHERE IdEvento="+id)
			
		}
	}
})