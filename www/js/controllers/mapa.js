angular.module('starter')
.controller("mapa",function($scope,$rootScope,$http,$ionicPopover,$timeout){
	
	//VARIABLES
	$rootScope.map;
	$scope.marcadores=[];
	$rootScope.mapCarro;
	$scope.infos;
	$scope.panorama;
	$scope.watchID;
	$scope.ubicacionMarker;
	$scope.carroMarker;
	$scope.circuloRadio;
	$scope.radio;
	$scope.swit=true;
	$scope.first=1;
	$scope.vigilando=false;
	$rootScope.Peligros=[];
	$scope.time=null;
	if(window.localStorage.getArray("Peligros"))$rootScope.Peligros=window.localStorage.getArray("Peligros");
 	
	$scope.createMap=function(){
		$scope.first=0;
		if($scope.Conexion(1,function(){
			$rootScope.sinMapa=true;
			$rootScope.cargando=false;
		})){
			$rootScope.sinMapa=false;
			$rootScope.cargando=true;
			navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError,{enableHighAccuracy: true });
			$scope.verificaHistorial();
		}
		$scope.radio=$rootScope.Usuario.Rango;
		
		//if(window.localStorage.getArray("Eventos"))$rootScope.Eventos=window.localStorage.getArray("Eventos");
		//else $rootScope.Eventos=[]
		//console.log($rootScope.Eventos.length);
		if(window.localStorage.getArray("Auto"))$scope.vigilando=true;
	}
	
	$scope.revisaPos=function(){
		navigator.geolocation.getCurrentPosition($scope.onSPos, $scope.onError,{enableHighAccuracy: true });	
	}
	$scope.revisaPosCarro=function(){
		if(!window.localStorage.getArray("Auto"))
		navigator.geolocation.getCurrentPosition($scope.onSPosc, $scope.onError,{enableHighAccuracy: true });
	}
	$scope.onSPos=function(position){
		$scope.ubicacionMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$rootScope.map.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$scope.circuloRadio.setCenter($scope.ubicacionMarker.getPosition());
		$rootScope.showEventos();
	}
	$scope.onSPosc=function(position){
		$scope.carroMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$rootScope.mapCarro.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		
	}
	$scope.onSuccess=function (position) {
		$rootScope.sinMapa=false;
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
		$scope.infos = new google.maps.InfoWindow({
    		content: '',
			disableAutoPan:false,
  		});
	
		$rootScope.map = new google.maps.Map(document.getElementById('inicio_mapa'), mapOptions);
		//mapCarro = new google.maps.Map(document.getElementById('carro_mapa'), mapOptions);
		
	
		google.maps.event.addListenerOnce($rootScope.map,"idle",function (){
			$scope.setPosicion($rootScope.map, position.coords.latitude,position.coords.longitude)
			$rootScope.map.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
			$rootScope.showEventos();
			$rootScope.cargando=false;
			$scope.hideBarra();
			
		});
		
		$scope.poscar=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		$rootScope.mapCarro = new google.maps.Map(document.getElementById('auto_mapa'), mapOptions);
		$rootScope.mapCarro.setZoom(17);
		if(window.localStorage.getArray("Auto")){
			$scope.poscar=new google.maps.LatLng(window.localStorage.getArray("Auto").Latitud,window.localStorage.getArray("Auto").Longitud);
		}
		google.maps.event.addListenerOnce($rootScope.mapCarro,"idle",function (){//iniciaFiltro();}
			$scope.setCarro($scope.poscar.lat(),$scope.poscar.lng())
			$rootScope.mapCarro.setCenter($scope.poscar);
		});
		//watchID = navigator.geolocation.watchPosition(onWatch, onError, { timeout: 30000 });
	}
 	$scope.onWatch=function(position){
		alert(1);
	}

// onError Callback receives a PositionError object
//
$scope.showBarra=function(){
		$("#inicio_pie").animate({
			"bottom":"0vh"
		},500,function(){
		});
		}
$scope.hideBarra=function(){
			$("#inicio_pie").animate({
					"bottom":"-40px"
					},1000,function(){});
}
 	$scope.onError=function(error) {
		$rootScope.sinMapa=true;
		$rootScope.cargando=false;
	}
	$rootScope.Reload=function(){
			//window.location.reload();
		$scope.createMap();
	}
	

// Options: throw an error if no update is received every 30 seconds.
//
	$scope.dibujaRadio=function (){
		if($scope.circuloRadio){
		$scope.circuloRadio.setRadius(parseInt($scope.radio));
		}else{
		var circleOptions= {
    		fillColor: '#39bbf7',
    		fillOpacity: 0.15,
    		strokeWeight: 2.5,
			strokeColor:'#ffffff',
			strokeOpacity: 0.6,
			map: $rootScope.map,
			radius:parseInt($scope.radio),
			center:$scope.ubicacionMarker.getPosition(),
    		zIndex: 3,
    	}
		$scope.circuloRadio = new google.maps.Circle(circleOptions);
		}
	//cambiaRadio(circuloRadio.getRadius());
	}
	$scope.setPosicion=function (map, lat,long) {
		var icono = {
			url: 'img/marcadores/ubicacion.png',
			size: new google.maps.Size(20, 20),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(10, 10),
			scaledSize:new google.maps.Size(20, 20)
		}
		var shape = {
			coords: [0, 0, 0, 20, 20, 20, 20 , 0],
			type: 'poly'
		};
		var myLatLng = new google.maps.LatLng(lat, long);
		$scope.ubicacionMarker = new google.maps.Marker({
			position: myLatLng,
			map: $scope.map,
			icon: icono,
			shape: shape,
			zIndex: 4,
			draggable:true
		});
		google.maps.event.addListener($scope.ubicacionMarker, 'mousedown', function() {
			$scope.circuloRadio.setVisible(false);
		});
		google.maps.event.addListener($scope.ubicacionMarker, 'mouseup', function() {
			$scope.circuloRadio.setCenter($scope.ubicacionMarker.getPosition());
			$scope.circuloRadio.setVisible(true);
			$rootScope.showEventos();
			//if($("#switch").is(':checked'))actualizaHoy()
			//if(ubicacionMarker.getPosition().lat()!=miUbicacion.lat() || ubicacionMarker.getPosition().lng()!=miUbicacion.lng())ubicacion(0);
		});
		google.maps.event.addListener($scope.ubicacionMarker, "dblclick", function() {
			$rootScope.map.setCenter($scope.ubicacionMarker.getPosition())
			$rootScope.map.setZoom(16);
		});
		$scope.dibujaRadio();
		
	}	
	/*$scope.$watch(
  		function() { return $scope.radio },
  		function(newValue, oldValue) {
			if($scope.ubicacionMarker)
    	//console.log(newValue);
	});*/
			 $scope.updateBar=function(val){
				 $scope.radio=val;
				 $scope.dibujaRadio();
				 $scope.limpia();
			}
			
	
$scope.setCarro=function (lat,long) {
	var myLatLng = new google.maps.LatLng(lat, long);
	if(!$scope.carroMarker){
	var icono = {
		url: 'img/marcadores/carro.png',
		size: new google.maps.Size(45, 15),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(22.5, 7.5),
		scaledSize:new google.maps.Size(45, 15)
	}
	var shape = {
    	coords: [0, 0, 0, 15, 45, 15, 45 , 0],
      	type: 'poly'
  	};
    
    $scope.carroMarker = new google.maps.Marker({
        position: myLatLng,
        map: $rootScope.mapCarro,
        icon: icono,
        shape: shape,
       	zIndex: 4,
		draggable:!$scope.vigilando
    });
	
  	google.maps.event.addListener($scope.carroMarker, 'mouseup', function() {
		if($scope.carroMarker.getDraggable())$rootScope.mapCarro.setCenter($scope.carroMarker.getPosition());
  	});
	}
	google.maps.event.addListener($scope.carroMarker, "click", function() {
		if($scope.vigilando)$scope.muestraPeligrosGuardados();
	});
	$scope.carroMarker.setPosition(myLatLng);
	$rootScope.mapCarro.setCenter($scope.carroMarker.getPosition());
}		
$scope.setMarcador=function (evento) {
	var icono = {
   	url: 'img/marcadores/'+evento.IdAsunto+'.png',
   	size: new google.maps.Size(40, 49),
   	origin: new google.maps.Point(0,0),
   	anchor: new google.maps.Point(20, 49),
	scaledSize:new google.maps.Size(40, 49)
	}
  	var shape = {
    	coords: [0, 0, 0, 40, 49, 40, 49 , 0],
      	type: 'poly'
  	};
    var myLatLng = new google.maps.LatLng(evento.Latitud, evento.Longitud);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: $rootScope.map,
        icon: icono,
        shape: shape,
       	zIndex: 2,
		data:evento
    });
	$scope.marcadores.push(marker);
	google.maps.event.addListener(marker, "dblclick", function() {
		$rootScope.map.setCenter(marker.getPosition())
    	$rootScope.map.setZoom(16);
	});
	google.maps.event.addListener(marker, "click", function() {
		$scope.clickEvento(marker);
	});
}
$scope.clickEvento=function (marker){
$http.get("http://www.virtual-guardian.com/api/evento/"+marker.data.IdEvento)
		.success(function(data,status,header,config){
			var d=data;
			if(d.Direccion.substr(0,2)==", ")d.Direccion=d.Direccion.substr(2)
			var subt=d.Estado;
			if(d.Municipio!="")subt=d.Municipio+', '+d.Estado;
			$scope.infos.setContent('<div class="list card" style ="margin:0px;  width: 100%">'+
 ' <div class="item item-avatar" style="box-shadow:0 1px 3px rgba(0, 0, 0, 0.3);  z-index: 50; border: none;  height: 7vh;min-height: 0px;padding: 0.5vh; padding-left: 7vh;">'+
   ' <img src="img/marcadores/'+marker.data.IdAsunto+'.png" style="opacity:1;  height: 100%;width: auto;left: 0px;">'+
   ' <p style="  color: #000;  opacity: 1;  font-size: 2.5vh;height:3vh">'+d.Asunto+'</p>'+
   ' <p style="  text-transform: capitalize;height:2.7vh">'+subt+'</p>'+
 ' </div>'+

 ' <div class="item item-image" style="  padding: 10px;  border: none;  text-align: left;">'+
   '<p style="  color: #000;font-size:2vh">Fecha: '+d.Fecha+'</p>'+
   '<p style="  color: #000;font-size:2vh">Hora: '+d.Hora+'</p>'+
   '<p style="  color: #000;font-size:2vh;  white-space: normal;  text-transform: capitalize;">Dirección: '+d.Direccion+'</p>'+
 ' </div>'+
'</div>')
			})
		.error(function(error,status,header,config){
			console.log(data);
			})
		
	
	
  	
	$scope.infos.setContent("<button style='  width: 40vw;  height: 50px;  font-size: 2.5vh;  background: none;  border: none;'>"+$scope.idioma.general[1]+"</button>");
	$scope.infos.open($rootScope.map,marker);
	$rootScope.map.setCenter(marker.getPosition())
}
var cierraInfo=function(){
alert(1);
//$scope.infos.close();
}

	$scope.cambiaSwitch=function (){
		$scope.swit=!$scope.swit;
		if($scope.swit){
			$scope.circuloRadio.setMap($rootScope.map);
			$rootScope.map.setCenter($scope.ubicacionMarker.getPosition())
			$scope.circuloRadio.setCenter($scope.ubicacionMarker.getPosition())
		}else{
			$scope.circuloRadio.setMap(null);
		}
		$rootScope.showEventos();
	}
	$scope.vigilar=function(){
			
	if(!$scope.vigilando){
		$scope.showCargando($scope.idioma.auto[3]);
		$scope.getEventosAuto($scope.carroMarker);
		}else{
			
			window.localStorage.removeItem("Auto");
			window.localStorage.removeItem("Peligros")
			$scope.carroMarker.setDraggable(true);
			$scope.vigilando=!$scope.vigilando;	
			if(window.plugins.pushNotification)window.plugins.pushNotification.carLocation(function () {}, function () {}, {"Estatus":"0","Latitud":"","Longitud":"",});
			
		}
	}
	function isUndefined(value) {
    return typeof value === 'undefined';
}
	$scope.getEventosAuto=function(carro){
		var d=new Date();
		var d2=new Date()
		d.setDate(d.getDate()-7);
		$http.post("http://www.virtual-guardian.com/api/eventosRadio",{
				Latitud:carro.getPosition().lat(),
				Longitud:carro.getPosition().lng(),
				FechaI:""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
				FechaF:""+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate(),
				Radio:$rootScope.Usuario.RangoAuto/1000,
				})
		.success(function(data,status,header,config){
			//console.log(data);
			$rootScope.Peligros=[]
			for(var i=0;i<data.length;i++){
				var tmp=JSON.parse(data[i])
				if(tmp.Subtitulo && tmp.Subtitulo.substring(0,2)==", ")tmp.Subtitulo=tmp.Subtitulo.substring(2);
				tmp.Subtitulo=cleanutf(tmp.Subtitulo);
				if($scope.cumpleRadio(tmp,carro,$rootScope.Usuario.RangoAuto))
				$rootScope.Peligros.push(tmp)
			}
			
			window.localStorage.setArray("Peligros",$rootScope.Peligros);
			$scope.muestraPeligros();
			})
		.error(function(error,status,header,config){
			console.log(error);
			})
	}
	$scope.muestraPeligros=function(){
		$scope.hideCargando();
		$scope.popover = $ionicPopover.fromTemplateUrl("pantallas/popover.html", {
    		scope: $scope
		}).then(function(popover) {
    		$scope.popover = popover;
			$scope.popover.show();
  		});
	}
	$scope.muestraPeligrosGuardados=function(){
		$scope.popover = $ionicPopover.fromTemplateUrl("pantallas/popoverG.html", {
    		scope: $scope
		}).then(function(popover) {
    		$scope.popover = popover;
			$scope.popover.show();
  		});
	}
	$scope.ocultaPeligros=function(){
		$scope.popover.hide();
	}	
	$scope.cuidaAuto=function(){
		window.localStorage.setArray("Auto",{
			Latitud:$scope.carroMarker.getPosition().lat(),
			Longitud:$scope.carroMarker.getPosition().lng(),
			Fecha:new Date()
		});
		if(window.plugins.pushNotification)window.plugins.pushNotification.carLocation(function () {
        }, function () {
        }, {"Estatus":"1","Latitud":""+$scope.carroMarker.getPosition().lat(),"Longitud":""+$scope.carroMarker.getPosition().lng()});
		$scope.carroMarker.setDraggable(false);
		$scope.vigilando=!$scope.vigilando;
		$scope.popover.hide();
	}
	
	$scope.cumpleRadio=function(evento,marcador,radio){
		var d=$scope.Dist(evento.Latitud,evento.Longitud,marcador.getPosition().lat(),marcador.getPosition().lng());
		if(d<=radio)
		return true;
		else return false;
	}
	$scope.Dist=function(lat1,lon1,lat2,lon2) {
	rad = function(x) {return x*Math.PI/180;}
	var R     =6378.137 ;                          //Radio de la tierra en km
  	var dLat  = rad( lat2 - lat1 );
  	var dLong = rad( lon2 - lon1 );
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  	var d = R * c;
	return d.toFixed(3)*1000;                      //Retorna tres decimales
}
	$scope.createMap();
	
	$scope.limpia=function(){
		for( var i=0; i<$scope.marcadores.length;i++)
			$scope.marcadores[i].setMap(null);
		$scope.marcadores=[];
	}
	
	$rootScope.showEventos=function(){
		
		//if($rootScope.Eventos.length>0)
		$scope.getEventos();
	}
	$rootScope.muestraEventos=function(){
	$scope.limpia();
		for(var i=0; i<$rootScope.Eventos.length;i++)
		if($scope.swit){
			if($scope.cumpleRadio($rootScope.Eventos[i],$scope.ubicacionMarker,$scope.radio))$scope.setMarcador($rootScope.Eventos[i])
		}else{
			$scope.setMarcador($rootScope.Eventos[i]);
		}
	}
	$rootScope.getTiposStr=function(buscar){
			var a=[];
			for(var i=0; i<buscar.Tipos.length;i++)
			if(!$rootScope.iOS || buscar.Tipos[i].Selected)a.push(buscar.Tipos[i].Id);
			return a.join(",");
		}
	$rootScope.getEstadosStr=function(buscar){
			var a=[];
			for(var i=0; i<buscar.Estados.length;i++)
			if(!$rootScope.iOS || buscar.Estados[i].Selected)a.push(buscar.Estados[i].Id);
			return a.join(",");
		}
		$rootScope.getNotTiposStr=function(buscar){
			var a=[];
			for(var i=0,j=0; i<$scope.TipoEventos.length;i++){
			if((!$rootScope.iOS && $scope.TipoEventos[i].Id!=buscar.Tipos[j].Id) || ($rootScope.iOS && !buscar.Tipos[i].Selected))a.push($scope.TipoEventos[i].Id);
			else j++;
			}
			return a.join(",");
		}
	$rootScope.getNotEstadosStr=function(buscar){
			var a=[];
			for(var i=0,j=0; i<$scope.Estados.length;i++){
			if((!$rootScope.iOS && $scope.Estados[i].Id!=buscar.Estados[j].Id) ||($rootScope.iOS && !buscar.Estados[i].Selected))a.push($scope.Estados[i].Id);
			else j++;
			}
			return a.join(",");
		}
	$scope.getEventos=function(){
		if($scope.filtros.Estado){
		var d2=$scope.filtros.Final;
		var d=$scope.filtros.Inicial;
		if(!$scope.swit)var st=$rootScope.getEstadosStr($rootScope.filtros);
		else var st="";
		var tp=$rootScope.getTiposStr($rootScope.filtros);
		}else{
		var d=new Date();
		var d2=new Date();
		d.setDate(d.getDate()-$rootScope.Usuario.Periodo);
		var st="";
		var tp="";
		}
		var rad=0;
		if($scope.swit)rad=$scope.radio/1000;
		$http.post("http://www.virtual-guardian.com/api/eventosRadioMapa",{
				Latitud:$scope.ubicacionMarker.getPosition().lat(),
				Longitud:$scope.ubicacionMarker.getPosition().lng(),
				FechaF:""+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate(),
				FechaI:""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
				Radio:rad,
				Estados:st,
				Tipos:tp
				})
		.success(function(data,status,header,config){
			$rootScope.Eventos=[];
			for(var i=0;i<data.length;i++){
				$rootScope.Eventos.push(JSON.parse(data[i]))
			}
			
			//window.localStorage.setArray("Eventos",$rootScope.Eventos);
			$rootScope.muestraEventos();
			
			})
		.error(function(error,status,header,config){
			//console.log(error);
			})
	}
	$scope.notificacionClick=function(evento){
		switch(evento.Tipo){
			case "1":
			$scope.buscaEnMapa(evento);
			break;
			case "2":
			$scope.buscaEnMapa(evento);
			break;
			case "3":
			$scope.buscaEnMapa(evento);
			break;
			case "4":
			$scope.buscaEnMapa(evento);
			break;
			case "5":
			$scope.onTab(3);
			break;
			case "6":
			$scope.onTab(3);
			break;
		}
	}
	$scope.buscaEnMapa=function(evento){
		if($scope.Conexion(1)){
		$scope.swit=false;
		$scope.limpia();
		$scope.circuloRadio.setMap(null);
		$scope.slideTo(1);
		$timeout(function(){
			$scope.setMarcador(evento);
		
		$rootScope.map.setCenter($scope.marcadores[0].getPosition());
		},300);
		}else $scope.slideTo(1);
		
		
	}
})
