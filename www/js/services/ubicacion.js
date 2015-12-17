angular.module('starter.services')
.factory('Ubicacion',function($rootScope,uiGmapGoogleMapApi,Memory,Eventos){
	//function que se ejecuta una vez que el script de google maps esta cargado
	uiGmapGoogleMapApi.then(function(maps) {
		getLocation();
	})
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
			location:{ latitude: 20.6737919, longitude:  -103.3354131 },
			track:false,
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
		//define los eventos de la ubicacion
		$rootScope.ubicacion.events={
			//cuando el mouse termina el click
			mouseup:function(event){
				//actualiza la ubicacion actual
				$rootScope.ubicacion.position={latitude:event.position.lat(),longitude:event.position.lng()}
				//muestra el radio una vez posicionada la ubicación
				$rootScope.radio.visible=true;
				//muestra los marcadores
				Eventos.showHide();
				//intenta aplicar para apresurar la proyeccion.
				if(!$rootScope.$$phase) {
  					$rootScope.$apply(function(){})
				}
			},
			mousedown:function(event){
				//esconde a los marcadores
				Eventos.hideAll();
				//esconde el radio mientras se mueve la ubicacion
				$rootScope.radio.visible=false;
				
			},
			position_changed:function(event){
				//$rootScope.$apply(function(){})
			}
		}
	}
	//function que se ejecuta cada que la posicion del marcador cambia
	$rootScope.$watch('ubicacion.position', function(newValue, oldValue) {
  		if(newValue){
			$rootScope.radio.center={ latitude: newValue.latitude, longitude:  newValue.longitude};
			//centra el mapa en la nueva ubicación
			$rootScope.map.center={ latitude: newValue.latitude, longitude:  newValue.longitude}
			//actualiza el icono
			$rootScope.ubicacion.options.icon=getIconUbicacion();
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
			url: (!$rootScope.ubicacion)?'img/iconos/mapa/ubicacion.png':(($rootScope.ubicacion.position.latitude==$rootScope.ubicacion.location.latitude && $rootScope.ubicacion.position.longitude==$rootScope.ubicacion.location.longitude)?'img/iconos/mapa/ubicacion.png':'img/iconos/mapa/ubicacion_des.png'),
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
	//funcion que se ejecuta una vez que se obtiene la ubicacion del usuario
	var mapSuccess=function(position){ 
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
	var mapError=function(error){
    }
	//
	var getLocation=function(){
		navigator.geolocation.getCurrentPosition(mapSuccess, mapError);
	}
	
	return {
		inicializa:function(){
			return inicializa();
		},
		refreshLocation:function(){
			getLocation();
		},
		getPosition:function(){
			return $rootScope.ubicacion.position
		}
	}
	
})