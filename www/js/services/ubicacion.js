angular.module('starter.services')
.factory('Ubicacion',function($rootScope,uiGmapGoogleMapApi,Memory,Eventos,$interval,Message,$timeout,Lugar){
	//function que se ejecuta una vez que el script de google maps esta cargado
	uiGmapGoogleMapApi.then(function(maps) {
		getLocation();
	})
	var eventos=[];
	var pos={}
	var interval=null;
	var positionId=null;
	//funcion que inicializa la ubicacion
	var inicializa=function(){
		//carga los datos guardados de la ubicacion
		$rootScope.ubicacion=Memory.get("Ubicacion");
		//si no esta definida la inicializa
		if(!$rootScope.ubicacion)
		//define el objeto ubicacion que sera mostrado en el mapa
		$rootScope.ubicacion={
			//la posicion que tiene el marcador
			position:{ latitude: 20.6737919, longitude:  -103.3354131 },
			//la ultima ubicacion del usuario obtenida
			location:{ latitude: 20.6737914, longitude:  -103.3354131 },
			estado:"Jalisco",
			//opciones de marcadores (google maps api v3)
			options:{
				//define que se puede arrastrar y cambiar de lugar
				draggable:true,
				//define el idice de psicionamiento
				zIndex:10000,
				//define el icono
				icon:getIconUbicacion(),
				//define el area del marcador
				shape:{
					coords: [0, 0, 0, 20, 20, 20, 20 , 0],
					type: 'poly',
				},
				//define si el marcador esta visible o no
				visible:true,
			},
			
		}
		
		$rootScope.ubicacion.centrar=true
		//define los eventos de la ubicacion
		$rootScope.ubicacion.events={
			//cuando el mouse termina el click
			mouseup:function(event){
				
                //intenta aplicar para apresurar la proyeccion.
                if(!$rootScope.$$phase) {
                    $rootScope.$apply(function(){
                        //actualiza la ubicacion actual
                        $rootScope.ubicacion.position={latitude:event.position.lat(),longitude:event.position.lng()}
                        //muestra el radio una vez posicionada la ubicación
                       	$rootScope.radio.fill={color:'#39bbf7',opacity:0.13};
						$rootScope.radio.stroke={color:'#ffffff',weight:2,opacity:0.6};
						$rootScope.radio.visible=true;
                    })
                }else{
                    //actualiza la ubicacion actual
                    $rootScope.ubicacion.position={latitude:event.position.lat(),longitude:event.position.lng()}
                    //muestra el radio una vez posicionada la ubicación
                    $rootScope.radio.fill={color:'#39bbf7',opacity:0.13};
					$rootScope.radio.stroke={color:'#ffffff',weight:2,opacity:0.6};
					$rootScope.radio.visible=true;
                }
				//muestra los marcadores
				if($rootScope.ubicacion.position.latitude.toFixed(10)==pos.latitude.toFixed(10) && $rootScope.ubicacion.position.longitude.toFixed(10)==pos.longitude.toFixed(10))$rootScope.eventosMap=eventos;
				
			},
			mousedown:function(event){
				eventos=$rootScope.eventosMap;
				pos= {latitude:$rootScope.ubicacion.position.latitude,longitude:$rootScope.ubicacion.position.longitude}
                if(!$rootScope.$$phase) {
                    $rootScope.$apply(function(){
                        //esconde el radio mientras se mueve la ubicacion
                        $rootScope.radio.fill={color:'#39bbf7',opacity:0};
						$rootScope.radio.stroke={color:'#ffffff',weight:2,opacity:0};
						$rootScope.radio.visible=false;
                        //esconde a los marcadores
                        $rootScope.eventosMap=[];
                    })
                }else{
         
                    //esconde el radio mientras se mueve la ubicacion
                   	$rootScope.radio.fill={color:'#39bbf7',opacity:0};
					$rootScope.radio.stroke={color:'#ffffff',weight:2,opacity:0};
					$rootScope.radio.visible=false;
                    //esconde a los marcadores
                    $rootScope.eventosMap=[];
                }
         
				
			},
			position_changed:function(event){
				//$rootScope.$apply(function(){})
			},
			dblclick:function(event){
				$rootScope.map.zoom=18
				$rootScope.map.center={ latitude: $rootScope.ubicacion.position.latitude, longitude:  $rootScope.ubicacion.position.longitude}
			}
		}
		$timeout(function(){
			if(!$rootScope.auto.posicionando)
			$rootScope.ubicacion.centrar=true
			else $rootScope.ubicacion.centrar=false
			getLocation();
		},10)
	}
	document.addEventListener("pause", function(){
		navigator.geolocation.clearWatch(positionId);
		
	}, false);
	document.addEventListener("resume", function(){
		if($rootScope.ubicacion.position.latitude.toFixed(10)==$rootScope.ubicacion.location.latitude.toFixed(10) && $rootScope.ubicacion.position.longitude.toFixed(10)==$rootScope.ubicacion.location.longitude.toFixed(10))getLocation();
		else{
			//preguntar si quiere actualizar ubicacion
		}
	}, false);
	//function que se ejecuta cada que la posicion del marcador cambia
	$rootScope.$watch('ubicacion.position', function(newValue, oldValue) {
  		if(newValue){
			Lugar.hide();
			$rootScope.radio.center={ latitude: newValue.latitude, longitude:  newValue.longitude};
			//centra el mapa en la nueva ubicación
			if($rootScope.ubicacion.centrar){
				$rootScope.ubicacion.centrar=false;
				$rootScope.map.center={ latitude: newValue.latitude, longitude:  newValue.longitude}
				
			}
			//actualiza el icono
			$rootScope.ubicacion.options.icon=getIconUbicacion();
			//if($rootScope.radio.activo)
			Eventos.refresh()
			if(!($rootScope.ubicacion.position.latitude.toFixed(10)==$rootScope.ubicacion.location.latitude.toFixed(10) && $rootScope.ubicacion.position.longitude.toFixed(10)==$rootScope.ubicacion.location.longitude.toFixed(10)))navigator.geolocation.clearWatch(positionId);
		}
	},true);
	$rootScope.$watch('ubicacion', function(newValue, oldValue) {
		if($rootScope.ubicacion)Memory.set("Ubicacion",$rootScope.ubicacion);
	},true);
	//funcion que crea el icono de la ubicacion
	var getIconUbicacion=function(){
		//definicion de objeto
		var icono = {
			//url corresponde a la direccion de la imagen del marcador, verifica si esta en la ultima ubicacion obtenida o no para seleccionar la imagen
			url: (!$rootScope.ubicacion)?'img/iconos/mapa/ubicacion.png':(($rootScope.ubicacion.position.latitude.toFixed(10)==$rootScope.ubicacion.location.latitude.toFixed(10) && $rootScope.ubicacion.position.longitude.toFixed(10)==$rootScope.ubicacion.location.longitude.toFixed(10))?'img/iconos/mapa/ubicacion.png':'img/iconos/mapa/ubicacion_des.png'),
			//define el tamaño del marcador
			size: new google.maps.Size(20, 20),
			//define el punto de orgen
			origin: new google.maps.Point(0,0),
			//define el centro del puntero
			anchor: new google.maps.Point(10, 10),
			//define el tamaño a proyectar 
			scaledSize:new google.maps.Size(20, 20)
		}
		
		return icono;
	}
	var track=function(val){
		/*if(interval)$interval.cancel()
		if(val && ($rootScope.ubicacion.position.latitude.toFixed(10)==$rootScope.ubicacion.location.latitude.toFixed(10) && $rootScope.ubicacion.position.longitude.toFixed(10)==$rootScope.ubicacion.location.longitude.toFixed(10)))
		interval=$interval(function(){
			getLocation();
		},15000)*/
	}
	//funcion que se ejecuta una vez que se obtiene la ubicacion del usuario
	var positionSuccess=function(position){ 
	
		//actualiza el valor de la ultima ubicacion obtenida
		$rootScope.ubicacion.location={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
		//actualiza la posicion del marcador
        $rootScope.ubicacion.position={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
		//aplica cambios por que es una funcion externa a agular
		$rootScope.$apply(function(){})
		//revisa los eventos
		//revisaEventos($rootScope.map.ubicacion.position);
	}
	//funcion que se ejecuta cuando se produce un error en la ubicacion del evento
	var positionError=function(error){
		Eventos.refresh()
    }
	//
	var getLocation=function(){
		
		navigator.geolocation.clearWatch(positionId);
		positionId = navigator.geolocation.watchPosition(positionSuccess, positionError,{enableHighAccuracy: true,timeout:15000 });
		//navigator.geolocation.getCurrentPosition(mapSuccess, mapError,{enableHighAccuracy: true,timeout:15000 });
	}
	
	return {
		inicializa:function(){
			return inicializa();
		},
		refreshLocation:function(){
			$timeout(function(){
				$rootScope.ubicacion.centrar=true
				getLocation();
			},10)
		},
		stopPosition:function(){
			navigator.geolocation.clearWatch(positionId);
		},
		startPosition:function(){
			positionId = navigator.geolocation.watchPosition(positionSuccess, positionError,{enableHighAccuracy: true,timeout:15000 });
		},
		getPosition:function(){
			return $rootScope.ubicacion.position
		}
	}
	
})