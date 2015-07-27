angular.module('starter')
.controller("mapa",function($scope,$rootScope,$http,$ionicPopover,$timeout,$window,$ionicScrollDelegate){
	
	//VARIABLES
	$rootScope.map;
	$scope.marcadores=[];
	$rootScope.mapCarro;
	$rootScope.miubicacion;
	$scope.infos;
	$scope.panorama;
	$scope.watchID;
	$rootScope.ubicacionMarker;
	$scope.carroMarker;
	$scope.circuloRadio;
	$scope.radio;
	$scope.swit=true;
	$scope.first=1;
	$scope.vigilando=false;
	$rootScope.Peligros=[];
	$scope.time=null;
	$scope.Infobox=null;
	$scope.selectedMarker=null;
	$scope.markerLoaded=false;
	$scope.buscandoDireccion=false;
	$scope.searchBox;
	$scope.textoBuscado="";
	$scope.resultadoLugares=[];

	if(window.localStorage.getArray("Peligros"))$rootScope.Peligros=window.localStorage.getArray("Peligros");
	$scope.createMap=function(){
            
		$scope.first=0;
		if($scope.Conexion(1,function(){
			$rootScope.sinMapa=true;
			$rootScope.cargando=false;
		})){
			$scope.loadMaps();
			
		}
		$scope.radio=$rootScope.Usuario.Rango;
		if(window.localStorage.getArray("Auto"))$scope.vigilando=true;
	}
	$rootScope.inicializaMapaRecorrido=function(){
		if($rootScope.miubicacion==null)$rootScope.miubicacion=new google.maps.LatLng(20.6737919,-103.3354131);
		$rootScope.ubicacionMarker.setPosition($rootScope.miubicacion);
		$rootScope.ubicacionMarker.setIcon($scope.getImgUbicacion($rootScope.ubicacionMarker.getPosition()));
		$rootScope.map.setCenter($rootScope.miubicacion);
		$scope.circuloRadio.setCenter($rootScope.miubicacion);
		$rootScope.showEventos();
		$scope.radio=$rootScope.Usuario.Rango;
		$scope.dibujaRadio();
		$scope.swit=true;
		$rootScope.muestraEventos();
		$scope.circuloRadio.setMap($rootScope.map);
		$rootScope.ubicacionMarker.setDraggable((!$rootScope.recorrido) || $rootScope.stepRecorrido==1);
		}
		$scope.loaded=false;
		
	initialize =function (){
		$scope.generaBounds()
		$scope.loaded=true;
		$rootScope.scriptMapa=true;
		var e = document.createElement('script'); // use global document since Angular's $document is weak
            e.src = 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js';
            document.body.appendChild(e);
			$rootScope.sinMapa=false;
			$rootScope.cargando=true;
			navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError,{enableHighAccuracy: true,timeout:10000 });
			
			
	}
    $scope.loadMaps=function(){
		if(!$rootScope.scriptMapa){
			var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp?key=AIzaSyCmZHupxphffFq38UTwBiVB-dbAZ736hLs&sensor=false&libraries=places&callback=initialize';
            document.body.appendChild(s);
		}else initialize();
			
			
			
    }
            $scope.initialize=function(){alert(1);}
	$scope.revisaPos=function(){
		if(!$rootScope.recorrido || $rootScope.stepRecorrido==7)
		navigator.geolocation.getCurrentPosition($rootScope.onSPos, $scope.onErrorc,{enableHighAccuracy: true,timeout:10000 });	
		
	}
	$scope.revisaPosCarro=function(){
		if(!$rootScope.recorrido)
		if(!window.localStorage.getArray("Auto"))
		navigator.geolocation.getCurrentPosition($rootScope.onSPosc, $scope.onErrorc,{enableHighAccuracy: true,timeout:10000 });
	}
	$rootScope.onSPos=function(position){
		$rootScope.miubicacion=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		$rootScope.ubicacionMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$rootScope.ubicacionMarker.setIcon($scope.getImgUbicacion($rootScope.ubicacionMarker.getPosition()));
		$rootScope.map.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$scope.circuloRadio.setCenter($rootScope.ubicacionMarker.getPosition());
		$rootScope.showEventos();
        if(!$rootScope.recorrido || $rootScope.stepRecorrido==7)$rootScope.showToast($rootScope.idioma.mapa[4])
		if($rootScope.stepRecorrido==7)$timeout(function(){
				$rootScope.nextRecorrido();	
				},500)
	}
	$scope.onErrorc=function(){
            if(!$rootScope.recorrido){
		$rootScope.alert($rootScope.idioma.general[28],$rootScope.idioma.general[29],function(){});
            
            }else{
		$timeout(function(){
				$rootScope.nextRecorrido();	
				},500)
		}
	}
	$rootScope.onSPosc=function(position){
		$scope.carroMarker.setPosition(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
		$rootScope.mapCarro.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
        $rootScope.showToast($rootScope.idioma.mapa[4])
		
	}
	$scope.onSuccess=function (position) {
		$rootScope.miubicacion=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
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
		var styles = [
		   {
			 featureType: "poi",
			 stylers: [
			  { visibility: "off" }
			  
			 ]   
			},
			{
			featureType:"all",
			stylers:[
			{ hue: "#D07C24" },
			{ saturation: -20 }
			]
			}
			
		];
		 var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});
		$rootScope.map = new google.maps.Map(document.getElementById('inicio_mapa'), mapOptions);
		
		
		//$scope.searchBox = new google.maps.places.SearchBox(document.getElementById("searchBox"));
		

		
		
		$rootScope.map.mapTypes.set('map_style', styledMap);
  		$rootScope.map.setMapTypeId('map_style');
		//mapCarro = new google.maps.Map(document.getElementById('carro_mapa'), mapOptions);
		
	
		google.maps.event.addListenerOnce($rootScope.map,"idle",function (){
			$scope.setPosicion($rootScope.map, $rootScope.miubicacion.lat(),$rootScope.miubicacion.lng())
			$rootScope.map.setCenter(new google.maps.LatLng(position.coords.latitude,position.coords.longitude));
			$rootScope.showEventos();
			$rootScope.cargando=false;
			$scope.hideBarra();
			
			
		});
		
		$scope.poscar=new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		$rootScope.mapCarro = new google.maps.Map(document.getElementById('auto_mapa'), mapOptions);
		$rootScope.mapCarro.mapTypes.set('map_style', styledMap);
  		$rootScope.mapCarro.setMapTypeId('map_style');
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
	if(!$rootScope.recorrido || $rootScope.stepRecorrido==4)
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
            $rootScope.miubicacion=new google.maps.LatLng(0,0);
            $rootScope.cargando=false;
		
		$rootScope.alert($rootScope.idioma.general[28],$rootScope.idioma.general[29],function(){});
		if($scope.Conexion(1,function(){
			$rootScope.sinMapa=true;
			$rootScope.cargando=false;
		})){
			$rootScope.sinMapa=false;
		var mapOptions = {
    		zoom: 12,
			center:new google.maps.LatLng(20.6737919,-103.3354131),
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
	var styles = [
		   {
			 featureType: "poi",
			 stylers: [
			  { visibility: "off" }
			 ]   
			}
			,
			{
			featureType:"all",
			stylers:[
			{ hue: "#D07C24" },
			{ saturation: -20 }
			]
			}
		];
		 var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});
		$rootScope.map = new google.maps.Map(document.getElementById('inicio_mapa'), mapOptions);
		$rootScope.map.mapTypes.set('map_style', styledMap);
  		$rootScope.map.setMapTypeId('map_style');
		google.maps.event.addListenerOnce($rootScope.map,"idle",function (){
			$scope.setPosicion($rootScope.map, 20.6737919,-103.3354131)
			$rootScope.map.setCenter(new google.maps.LatLng(20.6737919,-103.3354131));
			$rootScope.showEventos();
			$rootScope.cargando=false;
			$scope.hideBarra();
			
		});
		
		$scope.poscar=new google.maps.LatLng(20.6737919,-103.3354131);
		$rootScope.mapCarro = new google.maps.Map(document.getElementById('auto_mapa'), mapOptions);
		$rootScope.mapCarro.mapTypes.set('map_style', styledMap);
  		$rootScope.mapCarro.setMapTypeId('map_style');
		$rootScope.mapCarro.setZoom(17);
		if(window.localStorage.getArray("Auto")){
			$scope.poscar=new google.maps.LatLng(window.localStorage.getArray("Auto").Latitud,window.localStorage.getArray("Auto").Longitud);
		}
		google.maps.event.addListenerOnce($rootScope.mapCarro,"idle",function (){//iniciaFiltro();}
			$scope.setCarro($scope.poscar.lat(),$scope.poscar.lng())
			$rootScope.mapCarro.setCenter($scope.poscar);
		});
		}
	}
	$rootScope.Reload=function(){
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
			center:$rootScope.ubicacionMarker.getPosition(),
    		zIndex: 3,
    	}
		$scope.circuloRadio = new google.maps.Circle(circleOptions);
		}
	//cambiaRadio(circuloRadio.getRadius());
	}
	$scope.getImgUbicacion=function(position){
		var img="";
		if(position.lat()==$rootScope.miubicacion.lat() && position.lng()==$rootScope.miubicacion.lng())img='img/marcadores/ubicacion.png'
		else img='img/marcadores/ubicacion_des.png'
		var icono = {
			url: img,
			size: new google.maps.Size(20, 20),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(10, 10),
			scaledSize:new google.maps.Size(20, 20)
		}
		return icono;
	}
	$scope.setPosicion=function (map, lat,long) {
		
		var shape = {
			coords: [0, 0, 0, 20, 20, 20, 20 , 0],
			type: 'poly'
		};
		var icono=$scope.getImgUbicacion(new google.maps.LatLng(lat, long)); 
		var myLatLng = new google.maps.LatLng(lat, long);
		$rootScope.ubicacionMarker = new google.maps.Marker({
			position: myLatLng,
			map: $scope.map,
			icon: icono,
			shape: shape,
			zIndex: 4,
			draggable:true
		});
		google.maps.event.addListener($rootScope.ubicacionMarker, 'mousedown', function() {
			$scope.circuloRadio.setVisible(false);
		});
		google.maps.event.addListener($rootScope.ubicacionMarker, 'mouseup', function() {
			$rootScope.ubicacionMarker.setIcon($scope.getImgUbicacion($rootScope.ubicacionMarker.getPosition()));
			$scope.circuloRadio.setCenter($rootScope.ubicacionMarker.getPosition());
			$scope.circuloRadio.setVisible(true);
			$rootScope.showEventos();
			if($rootScope.recorrido && $rootScope.stepRecorrido==2){
				if($rootScope.ubicacionMarker.getPosition().lat()!=$rootScope.miubicacion.lat() || $rootScope.ubicacionMarker.getPosition().lng()!=$rootScope.miubicacion.lng()){
				$timeout(function(){
				$rootScope.nextRecorrido();	
				},500)
				}
			}
			//if($("#switch").is(':checked'))actualizaHoy()
			//if(ubicacionMarker.getPosition().lat()!=miUbicacion.lat() || ubicacionMarker.getPosition().lng()!=miUbicacion.lng())ubicacion(0);
		});
		google.maps.event.addListener($rootScope.ubicacionMarker, "dblclick", function() {
			if(!$rootScope.recorrido){
			$rootScope.map.setCenter($rootScope.ubicacionMarker.getPosition())
			$rootScope.map.setZoom(16);
			}
		});
		$scope.dibujaRadio();
		
	}	
	/*$scope.$watch(
  		function() { return $scope.radio },
  		function(newValue, oldValue) {
			if($rootScope.ubicacionMarker)
    	//console.log(newValue);
	});*/
			 $scope.updateBar=function(val){
				 $scope.radio=val;
				 $scope.dibujaRadio();
				 $scope.limpia();
			}
$scope.generaBounds=function(){
		$scope.points=[
new google.maps.LatLng(32.579220642875676, -117.147216796875),
new google.maps.LatLng(32.74570253945518, -114.7027587890625),
new google.maps.LatLng(32.46806060917602, -114.5928955078125),
new google.maps.LatLng(31.400535326863935, -111.0662841796875),
new google.maps.LatLng(31.37708906055048, -108.2647705078125),
new google.maps.LatLng(31.80289258670676, -108.270263671875),
new google.maps.LatLng(31.784216884487382, -106.314697265625),
new google.maps.LatLng(30.619004797647808, -104.8809814453125),
new google.maps.LatLng(29.022551511168352, -103.1781005859375),
new google.maps.LatLng(29.778681776917633, -102.76611328125),
new google.maps.LatLng(29.9120909187815, -102.3486328125),
new google.maps.LatLng(29.73099249532227, -101.3433837890625),
new google.maps.LatLng(29.305561325527698, -100.7830810546875),
new google.maps.LatLng(28.801359986481774, -100.458984375),
new google.maps.LatLng(28.270520445825415, -100.21728515625),
new google.maps.LatLng(27.989550873955807, -99.86572265625),
new google.maps.LatLng(27.561851783388512, -99.4427490234375),
new google.maps.LatLng(26.46073804319089, -99.03076171875),
new google.maps.LatLng(26.00248714194576, -97.1630859375),
new google.maps.LatLng(25.304303764403617, -97.20703125),
new google.maps.LatLng(21.570610571132676, -97.27294921875),
new google.maps.LatLng(18.8543103618898, -95.4052734375),
new google.maps.LatLng(19.186677697957833, -91.7578125),
new google.maps.LatLng(21.57571893245848, -90.4833984375),
new google.maps.LatLng(22.06527806776582, -86.572265625),
new google.maps.LatLng(17.936928637549443, -87.4951171875),
new google.maps.LatLng(18.432713391700855, -88.2806396484375),
new google.maps.LatLng(17.79576579725599, -88.846435546875),
new google.maps.LatLng(17.76438107778209, -90.94482421875),
new google.maps.LatLng(16.388661170759384, -90.296630859375),
new google.maps.LatLng(16.035254862350413, -90.3955078125),
new google.maps.LatLng(16.024695711685315, -91.6864013671875),
new google.maps.LatLng(15.066819284539045, -91.988525390625),
new google.maps.LatLng(14.487871434931572, -92.230224609375),
new google.maps.LatLng(15.580710739162123, -96.8170166015625),
new google.maps.LatLng(17.18277905643184, -101.5576171875),
new google.maps.LatLng(20.117839630491634, -105.9521484375),
new google.maps.LatLng(23.079731762449878, -111.6650390625),
new google.maps.LatLng(27.741884632507087, -115.29052734375),
new google.maps.LatLng(32.44836169353613, -117.15476989746094),
new google.maps.LatLng(32.5791935209833, -117.14720606803894),
new google.maps.LatLng(32.579220642875676, -117.147216796875)
]
$scope.bnds=new google.maps.LatLngBounds();
for(var i=0;i<$scope.points.length;i++)$scope.bnds=$scope.bnds.extend($scope.points[i]);
}
$rootScope.buscaEnMap=function(){
	$scope.resultadoLugares=[];
   
	$("#textoBuscado").val("");
	$scope.textoBuscado="";
	$(".buscadorDir").css("opacity",0);
	$scope.buscandoDireccion=true;
	$(".buscadorDir").animate({
		opacity:1
	},300,function(){
		
	$("#textoBuscado").focus();
	 $("#textoBuscado").css("font-size",$("#textoBuscado").css("font-size"));
	 $("#mensajeBuscador").css("font-size",$("#mensajeBuscador").css("font-size"));
	 
	
	if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.show();
	});
}
$scope.cierrateclado=function(){
	if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
	
}
$scope.searchEnter=function(event){
	if(event.keyCode==13){
       if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
    }
}


$scope.loadingPlaces=false;
$scope.buscaLugar=function(){
	$ionicScrollDelegate.scrollTop();
	$scope.resultadoLugares=[];
	$scope.loadingPlaces=true;
	$scope.searchBox = new google.maps.places.PlacesService($rootScope.map);
	$scope.textoBuscado=$("#textoBuscado").val()
	if($scope.textoBuscado){
	if($scope.textoBuscado!=""){
		$scope.searchBox.textSearch({query:$scope.textoBuscado,bounds:$scope.bnds},$scope.resultadosBusq);
	}else $scope.resultadoLugares=[];
	} else $scope.loadingPlaces=false;
	
}
$scope.resultadosBusq=function(results, status) {
		$scope.loadingPlaces=false;
		var lugares=[];
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				var place = results[i];
				
				if($scope.bnds.contains(place.geometry.location)){
					lugares.push(results[i]);
				}
			}
			
		}
		console.log(lugares);
		$scope.$apply(function () {
          	$scope.resultadoLugares=lugares;
        });
		
	}
	$scope.lugarSeleccionado=function(place){
		$rootScope.ubicacionMarker.setPosition(place.geometry.location);
		$rootScope.ubicacionMarker.setIcon($scope.getImgUbicacion(place.geometry.location));
		$rootScope.map.setCenter(place.geometry.location);
		$scope.circuloRadio.setCenter(place.geometry.location);
		$rootScope.showEventos();
		$rootScope.ocultaBuscador()
	}
$rootScope.ocultaBuscador=function(){
	$scope.textoBuscado="";
	if(window.cordova && window.cordova.plugins.Keyboard)cordova.plugins.Keyboard.close();
	$("#textoBuscado").blur();
	$("#textoBuscado").val("");
	$(".buscadorDir")
	.animate({
		opacity:0
	},300,function(){
	
	$scope.$apply(function () {
            $scope.buscandoDireccion=false;
        });
	});
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
	
    
            $timeout(function(){
                     $scope.cargaInfoCarro(true);
                     },300);
                    
  	google.maps.event.addListener($scope.carroMarker, 'mouseup', function() {
		if($scope.carroMarker.getDraggable())$rootScope.mapCarro.setCenter($scope.carroMarker.getPosition());
  	});
	}
	google.maps.event.addListener($scope.carroMarker, "click", function() {
		if($scope.vigilando)$scope.muestraPeligrosGuardados();
		//$scope.cargaInfoCarro(false);
        //$rootScope.mapCarro.panTo(loc);
	});
	
	google.maps.event.addListener($scope.carroMarker, "mouseover", function() {
		//$scope.cargaInfoCarro(false);
	});
	google.maps.event.addListener($scope.carroMarker, "mouseout", function() {
		//$scope.cargaInfoCarro(true);
	});
	$scope.carroMarker.setPosition(myLatLng);
	$rootScope.mapCarro.setCenter($scope.carroMarker.getPosition());
}	
$scope.cargaInfoCarro=function(val){
	
	if(!$scope.Infobox)$scope.Infobox = new InfoBox({
         content: document.getElementById("infobox"),
		 alignBottom:true,
         disableAutoPan: false,
         maxWidth: window.innerWidth*0.9,
         pixelOffset: new google.maps.Size($rootScope.ipad?-(window.innerWidth*0.7)*0.5:-(window.innerWidth*0.9)*0.5, -25),
         zIndex: null,
         boxStyle: {
            opacity: 0.9,
            width: $rootScope.ipad?(window.innerWidth*0.7)+"px":(window.innerWidth*0.9)+"px"
        },
        closeBoxMargin: "2vh 2vh 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1)
    	});
		if(val){if(!$scope.vigilando)$scope.Infobox.open($rootScope.mapCarro, $scope.carroMarker);
		}else $scope.Infobox.close();
	
}	
$scope.cargaInfoEvento=function(val){
	
	if(!$scope.InfoboxEvento)$scope.InfoboxEvento = new InfoBox({
         content: document.getElementById("infoboxEvento"),
		 alignBottom:true,
         disableAutoPan: false,
         maxWidth: window.innerWidth*0.9,
         pixelOffset: new google.maps.Size($rootScope.ipad?(-(window.innerWidth*0.8)*0.5):-(window.innerWidth*0.9)*0.5, -57),
         zIndex: null,
         boxStyle: {
            //background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
            opacity: 0.95,
            width: $rootScope.ipad?(window.innerWidth*0.8)+"px":(window.innerWidth*0.9)+"px"
        },
        closeBoxMargin: -"2vh -2vh  0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1)
    	});
		if(val){
            $scope.InfoboxEvento.open($rootScope.map, $scope.selectedMarker);
            }else {
            $scope.markerLoaded=false;
            $scope.selectedMarker=null;
            $scope.InfoboxEvento.close();
            
            }
            
	
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
		if(!$rootScope.recorrido){
		$rootScope.map.setCenter(marker.getPosition())
    	$rootScope.map.setZoom(16);
		}
	});
	google.maps.event.addListener(marker, "click", function() {
		if(!$rootScope.recorrido)
		$scope.clickEvento(marker);
	});
}
$scope.clickEvento=function (marker){
	
	
		$scope.markerLoaded=false;
        $scope.selectedMarker=marker;
            
        $rootScope.sqlGetExtras(marker.data.IdEvento,function(res){
                                console.log(res);
            if(res==null || res.Asunto==null){
                $http.get("https://www.virtual-guardian.com/api/evento/"+marker.data.IdEvento)
                .success(function(data,status,header,config){
                    var d=data;
                    //console.log(d);
                    if(d.Direccion.substr(0,2)==", ")d.Direccion=d.Direccion.substr(2)
                    d.Subtitulo=d.Estado;
                    if(d.Municipio!="")d.Subtitulo=d.Municipio+', '+d.Estado;
                    $rootScope.sqlSaveExtras(d,marker.data.IdEvento);
                    $scope.selectedMarker.data.Info=d;
                    $scope.markerLoaded=true;
                })
                .error(function(error,status,header,config){
                    console.log(error);
                    $scope.cargaInfoEvento(false);
                })
            }else{
                console.log("LOCAL");
                $scope.selectedMarker.data.Info=res;
                $scope.markerLoaded=true;
                
            }
        });

  	$scope.cargaInfoEvento(true);
    
	//$rootScope.map.setCenter(marker.getPosition())
	
}
var cierraInfo=function(){
alert(1);
//$scope.infos.close();
}

	$scope.cambiaSwitch=function (){
		$scope.swit=!$scope.swit;
		if($scope.swit){
			$scope.circuloRadio.setMap($rootScope.map);
			$rootScope.map.setCenter($rootScope.ubicacionMarker.getPosition())
			$scope.circuloRadio.setCenter($rootScope.ubicacionMarker.getPosition())
			if($rootScope.recorrido && $rootScope.stepRecorrido==5){
				$rootScope.muestraEventos();
				$timeout(function(){
				$rootScope.nextRecorrido();	
				},500)
			}
		}else{
			$scope.circuloRadio.setMap(null);
		}
		$rootScope.showEventos();
	}
	$scope.vigilar=function(){
	if(!$scope.vigilando){
        if($rootScope.Usuario.IdSuscripcion>1){
		$scope.showCargando($scope.idioma.auto[3]);
		$scope.getEventosAuto($scope.carroMarker);
            }else{
            $scope.confirm($rootScope.idioma.general[23],$rootScope.idioma.general[35],function(){
                           //ENVIA A PAGINA A VER PAQUETES
                           $rootScope.abrePaquetes();
                           },$scope.idioma.general[13],$scope.idioma.general[14]);
            }
		}else{
			
			window.localStorage.removeItem("Auto");
			window.localStorage.removeItem("Peligros")
			$scope.carroMarker.setDraggable(true);
			$scope.vigilando=!$scope.vigilando;	
			$scope.cargaInfoCarro(!$scope.vigilando);
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
		$http.post("https://www.virtual-guardian.com/api/eventosRadio",{
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
		$scope.cargaInfoCarro(false);
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
		$scope.cargaInfoEvento(false);
		for( var i=0; i<$scope.marcadores.length;i++)
			$scope.marcadores[i].setMap(null);
		$scope.marcadores=[];
	}
            $scope.radioViejo=$scope.radio;
            $rootScope.startRange=function(){
            $scope.radioViejo=$scope.radio;
            }
            $scope.loadEventos=function(){
				
            if($scope.radio!=$scope.radioViejo)
			if(!$rootScope.recorrido){
				$rootScope.showEventos();
				}else if($rootScope.stepRecorrido==4){
					$rootScope.muestraEventos();
					$timeout(function(){
				$rootScope.nextRecorrido();	
				},500)
				}
            }
	$rootScope.showEventos=function(toast){
		
		if(!$rootScope.recorrido){
            toast=toast || 0;
		//if($rootScope.Eventos.length>0)
		if($scope.Conexion(1,function(){
			$rootScope.cargando=false;
			$rootScope.sinMapa=true;
                           })){
            $scope.getEventos();
            if(toast)$rootScope.showToast($rootScope.idioma.mapa[5]);
            }
		}else if($rootScope.stepRecorrido==8){
			if(toast)$rootScope.showToast($rootScope.idioma.mapa[5]);
			$rootScope.Eventos.push({"IdEvento":"2","IdAsunto":"2","Latitud":$rootScope.miubicacion.lat()-0.003,"Longitud":$rootScope.miubicacion.lng()-0.002});
			$rootScope.muestraEventos();
			$timeout(function(){
				$rootScope.nextRecorrido();	
				},500)

			
		}
	}
	$rootScope.muestraEventos=function(){
		
	$scope.limpia();
		for(var i=0; i<$rootScope.Eventos.length;i++)
		if($scope.swit){
			if($scope.cumpleRadio($rootScope.Eventos[i],$rootScope.ubicacionMarker,$scope.radio))$scope.setMarcador($rootScope.Eventos[i])
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
		if(!$rootScope.recorrido){
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
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d2.setHours(0);
            d2.setMinutes(0);
            d2.setSeconds(0);
		var rad=0;
		if($scope.swit)rad=$scope.radio/1000;
            $rootScope.Eventos=[];
            $rootScope.sqlGetEventos($rootScope.ubicacionMarker.getPosition().lat(),$rootScope.ubicacionMarker.getPosition().lng(),d,d2,rad,st,tp,function(ids){
		$http.post("https://www.virtual-guardian.com/api/eventosRadioMapa",{
				Latitud:$rootScope.ubicacionMarker.getPosition().lat(),
				Longitud:$rootScope.ubicacionMarker.getPosition().lng(),
				FechaF:""+d2.getFullYear()+"-"+(d2.getMonth()+1)+"-"+d2.getDate(),
				FechaI:""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),
				Radio:rad,
				Estados:st,
				Tipos:tp,
                Ids:ids
				})
		.success(function(data,status,header,config){
			$rootScope.UpdateEvt=new Date();
			for(var i=0;i<data.length;i++){
                 $rootScope.sqlInsertEvento(JSON.parse(data[i]));
			}
                 if(data.length>0)$rootScope.sqlGetEventos($rootScope.ubicacionMarker.getPosition().lat(),$rootScope.ubicacionMarker.getPosition().lng(),d,d2,rad,st,tp,function(){});
                 
			
			})
		.error(function(error,status,header,config){
			console.log(error);
			})
        });
		}
	}
	$rootScope.notificacionTip=false;
	
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
			$rootScope.onTab(3);
			break;
			case "6":
			$rootScope.onTab(3);
			break;
			case "7":
			$rootScope.alert($scope.idioma.notificaciones[8],$scope.idioma.notificaciones[10],function(){});
			break;
			
		}
	}
            $scope.ontouch=false;
	$scope.notificacionTouch=function(evento){
            if(parseInt(evento.Tipo)==8){
            
			$rootScope.tipImg="https://www.virtual-guardian.com/documentos/notificaciones/"+evento.IdNotificacion+".png";
			$rootScope.notificacionTip=true;
            }
	}
            $scope.startTouch=function(evento){
            if(parseInt(evento.Tipo)==8){
				$scope.ontouch=true;
			$("#barraNot"+evento.IdNotificacion).css("width","0px");
			$("#barraNot"+evento.IdNotificacion).animate({
				width:"100%"
				},500,function(){
				
				})
			}
            }
            $scope.dragEnd=function(){
            if(!$rootScope.notificacionTip)$scope.ontouch=false;
            }
	$scope.notificacionEnd=function(){
            $scope.ontouch=false;
	$rootScope.notificacionTip=false;
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
