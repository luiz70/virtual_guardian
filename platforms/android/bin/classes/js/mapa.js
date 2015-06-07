var map;
var mapCarro;
var infos;
var panorama;
var watchID;
var ubicacionMarker;
var carroMarker;
var circuloRadio;
 
function createMap(){
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy: true });
}

function onSuccess(position) {
	
	//$("#inicio_pie").show();
	var mapOptions = {
    	zoom: 12,
		center:new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
    	mapTypeControl: false,
    	panControl: false,
	    zoomControl: false,
    	scaleControl: false,
    	streetViewControl: false,
    	streetViewControlOptions: {
        	position: google.maps.ControlPosition.RIGHT_BOTTOM
    	}
	}
	infos = new google.maps.InfoWindow({
    	content: '',
		disableAutoPan:false,
  	});
	
	map = new google.maps.Map(document.getElementById('inicio_mapa'), mapOptions);
	//mapCarro = new google.maps.Map(document.getElementById('carro_mapa'), mapOptions);
	//mapCarro.setZoom(17);
	
	google.maps.event.addListenerOnce(map,"idle",function (){
		setPosicion(map, position.coords.latitude,position.coords.longitude)
		map.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		//dibujaRadio();
	});
	/*google.maps.event.addListenerOnce(mapCarro,"idle",function (){//iniciaFiltro();
		setCarro(position.coords.latitude,position.coords.longitude)
		mapCarro.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$("#carro_pie").show();
	});*/
	//watchID = navigator.geolocation.watchPosition(onWatch, onError, { timeout: 30000 });
}
function onWatch(position){
	alert(1);
}

// onError Callback receives a PositionError object
//
function onError(error) {
    $("#inicio_mapa").load("error_mapa.html");
	$("#inicio_pie").hide();
}

// Options: throw an error if no update is received every 30 seconds.
//
function dibujaRadio(){
	var radio =parseInt(window.localStorage.getArray("Usuario").Preferencias.Rango);
	var circleOptions= {
    	fillColor: '#39bbf7',
    	fillOpacity: 0.15,
    	strokeWeight: 2,
		strokeColor:'#ffffff',
		strokeOpacity: 0.6,
		map: map,
		radius:radio,
		center:ubicacionMarker.getPosition(),
    	zIndex: 3,
    }
	circuloRadio = new google.maps.Circle(circleOptions);
	
	//cambiaRadio(circuloRadio.getRadius());
}
function setPosicion(map, lat,long) {
	
	var icono = {
		url: 'img/marcadores/ubicacion.png',
		size: new google.maps.Size(20, 20),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(10, 10)
	}
	var shape = {
    	coords: [0, 0, 0, 20, 20, 20, 20 , 0],
      	type: 'poly'
  	};
    var myLatLng = new google.maps.LatLng(lat, long);
    ubicacionMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: icono,
        shape: shape,
       	zIndex: 4,
		draggable:true
    });
	google.maps.event.addListener(ubicacionMarker, 'mousedown', function() {
    	circuloRadio.setVisible(false);
  	});
  	google.maps.event.addListener(ubicacionMarker, 'mouseup', function() {
    	circuloRadio.setCenter(ubicacionMarker.getPosition());
		circuloRadio.setVisible(true);
		//if($("#switch").is(':checked'))actualizaHoy()
		//if(ubicacionMarker.getPosition().lat()!=miUbicacion.lat() || ubicacionMarker.getPosition().lng()!=miUbicacion.lng())ubicacion(0);
  	});
  	google.maps.event.addListener(ubicacionMarker, "dblclick", function() {
		map.setCenter(ubicacionMarker.getPosition())
    	map.setZoom(16);
	});
}	

function cargaCarro(){
	
	if(!window.localStorage.getArray("Carro")){
		navigator.geolocation.getCurrentPosition(onSuccessCarro, onError,{enableHighAccuracy: true });
		$("#carro_pie").html("Vigilar mi auto");
		carroMarker.setDraggable(true);
		$("#carro_pie").val(0);
	}else {
		setCarro(window.localStorage.getArray("Carro").Latitud,window.localStorage.getArray("Carro").Longitud);
		carroMarker.setDraggable(false);
		$("#carro_pie").html("Detener vigilacia");
		$("#carro_pie").val(1);
	}
	 
	 
}
function onSuccessCarro(position) {
	setCarro(position.coords.latitude,position.coords.longitude);
}
function setCarro(lat,long) {
	if(carroMarker)carroMarker.setMap(null);
	
	var icono = {
		url: 'img/marcadores/carro.png',
		size: new google.maps.Size(45, 15),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(22.5, 7.5)
	}
	var shape = {
    	coords: [0, 0, 0, 15, 45, 15, 45 , 0],
      	type: 'poly'
  	};
    var myLatLng = new google.maps.LatLng(lat, long);
    carroMarker = new google.maps.Marker({
        position: myLatLng,
        map: mapCarro,
        icon: icono,
        shape: shape,
       	zIndex: 4,
		draggable:true
    });
	mapCarro.setCenter(carroMarker.getPosition());
  	google.maps.event.addListener(carroMarker, 'mouseup', function() {
		mapCarro.setCenter(carroMarker.getPosition());
  	});
}	
