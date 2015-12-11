angular.module('starter.services')
.factory('Mapa',function($http,$rootScope,uiGmapGoogleMapApi,$timeout,uiGmapIsReady,socket,Memory){
	var getIconUbicacion=function(){
		
		var icono = {
			url: (!$rootScope.map)?'img/iconos/mapa/ubicacion.png':(($rootScope.map.ubicacion.position.latitude==$rootScope.map.ubicacion.location.latitude && $rootScope.map.ubicacion.position.longitude==$rootScope.map.ubicacion.location.longitude)?'img/iconos/mapa/ubicacion.png':'img/iconos/mapa/ubicacion_des.png'),
			size: new google.maps.Size(20, 20),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(10, 10),
			scaledSize:new google.maps.Size(20, 20)
		}
		return icono;
	}
	uiGmapGoogleMapApi.then(function(maps) {
   	//$rootScope.map=Memory.get('Mapa')
	//if(!$rootScope.map)
	$rootScope.map = { 
		center: { latitude: 20.6737919, longitude:  -103.3354131 }, 
		zoom:12,
		options:{
    		mapTypeControl: false,
    		panControl: false,
	    	zoomControl: false,
    		scaleControl: false,
    		streetViewControl: false,
			styles:[
		   {
			featureType: "poi",
			stylers: [{ visibility: "off" }]   
			},
			{
			"featureType": "road",
    		"stylers": [
      			{ "gamma": 1.07 },
      			{ "lightness": 6 },
      			{ "hue": "#00bbff" },
      			{ "saturation": -67 }
    		]
			}
		],
        },
		bounds:{
			la1:0,
			la2:0,
			ln1:0,
			ln2:0
		},
       
		eventos:[],
		idEventos:[],
        radio:{
			center:{ latitude: 20.6737919, longitude:  -103.3354131 },
        	radius:$rootScope.Usuario.Radio,
            fill:{color:'#39bbf7',opacity:0.15},
            stroke:{color:'#ffffff',weight:2.5,opacity:0.6},
            editable:false,
            activo:true,
			visible:true,
            events:{
            }
        },
		filtros:{
			activos:false,
		},
		markerOpacity:0.9,
		cluster:{
			styles:[
				  {
					textColor: '#EAEAEA',
					url: 'img/iconos/mapa/marcadores/g1.png',
					height: 51,
					width: 40,
					textSize:20
				  },
				 {
					textColor: '#232323',
					url: 'img/iconos/mapa/marcadores/g2.png',
					height: 51,
					width: 40,
					textSize:20
				  },
				 {
					textColor: '#EAEAEA',
					url: 'img/iconos/mapa/marcadores/g3.png',
					height: 51,
					width: 40,
					textSize:20
				  }
				],
			maxZoom:10,
			minimumClusterSize:10,
		},
		ubicacion:{
			position:{ latitude: 20.6737919, longitude:  -103.3354131 },
			location:{ latitude: 20.6737919, longitude:  -103.3354131 },
			options:{
				draggable:true,
				zIndex:10000,
				icon:getIconUbicacion(),
				shape:{
					coords: [0, 0, 0, 20, 20, 20, 20 , 0],
					type: 'poly',
				},
				visible:false,
			},
			
		},
		auto:{
			position:{ latitude: 20.6737919, longitude:  -103.3354131 },
			posicionando:false,
			activo:false,
			options:{
				draggable:true,
				zIndex:10000,
				shadow: 'none',
				content: '<div class="placeMarker"><div class="contIconMarker"><img class="iconMarker" style="-webkit-mask-image: url(img/iconos/mapa/controls/auto.png);" ></div></div>',
				visible:false,
				shape:{
					coords: [0, 0, 0, 40, 40, 40, 40 , 0],
					type: 'poly',
				},
			},
		
		}
		};
		//comentar para no poner esa opcion extra, innecesaria
		
		$rootScope.map.radio.radius=$rootScope.Usuario.Rango
		$rootScope.map.events={
			bounds_changed:function(event){
				var bounds=$rootScope.map.getGMap().getBounds();
				$rootScope.map.bounds={
					la1:bounds.getSouthWest().lat(),
					la2:bounds.getNorthEast().lat(),
					ln1:bounds.getSouthWest().lng(),
					ln2:bounds.getNorthEast().lng()
				}
				//$rootScope.$apply(function(){})
			}
		}
		
		
		$rootScope.map.cluster.events={
			click: function(cluster, clusterModels){
			},
			mouseout: function(cluster, clusterModels){
			//cluster.setMinimumClusterSize(10);
			},
  			mouseover: function(cluster, clusterModels){
				
			} 
		}
		$rootScope.map.ubicacion.events={
				mouseup:function(event){
					$rootScope.map.ubicacion.position={latitude:event.position.lat(),longitude:event.position.lng()}
                    revisaEventos($rootScope.map.ubicacion.position);
					$rootScope.map.radio.visible=true;
				},
				mousedown:function(event){
					hideAllMarkers();
					$rootScope.map.radio.visible=false;
				},
				position_changed:function(event){
					//$rootScope.$apply(function(){})
				}
			}
		socket.getSocket().emit('setIds',$rootScope.map.idEventos);
		
    });
	$rootScope.$watch('map.bounds', function(newValues, oldValues, scope) {
		//console.log($rootScope.map.bounds);
		if(newValues)refreshEventos();
	})
	var refreshEventos=function(){
		if(!$rootScope.map.filtros.activos){
			f2=new Date();
			f1=new Date();
			f1.setDate(f1.getDate()-$rootScope.Usuario.Periodo)
			f1=f1.getTime()/1000000;
			f2=f2.getTime()/1000000;
		}
		socket.getSocket().emit('getEventos', $rootScope.map.bounds,f1,f2);
	}
	var getIconoEvento=function(evt){
		var icono = {
			url: 'img/iconos/mapa/marcadores/'+evt.asunto+".png",
			size: new google.maps.Size(40, 51),
   			origin: new google.maps.Point(0,0),
   			anchor: new google.maps.Point(20, 51),
			scaledSize:new google.maps.Size(40, 51)
		}
		return icono;
	}
	socket.getSocket().on('getEventos',function(data){
		for(var i=0; i<data.length;i++)
		data[i].icono=getIconoEvento(data[i]);
		$rootScope.map.eventos=_.uniq(_.union($rootScope.map.eventos,data),function(item) { return item.id;});
	})
	$rootScope.$watch("map.auto.posicionando",function(newVal){
		if($rootScope.map){
			navigator.geolocation.getCurrentPosition(mapSuccessAuto, mapError);
			$rootScope.map.radio.visible=!newVal;
			$rootScope.map.ubicacion.options.visible=!newVal;
			$rootScope.map.auto.options.visible=newVal;
			if(newVal){
				
				$rootScope.map.markerOpacity=0;
				$rootScope.map.zoom=17
				$rootScope.map.center=$rootScope.map.auto.position
			}
		}
	})
	$rootScope.$watch('map.ubicacion.position', function(newValue, oldValue) {
  		if(newValue){
            $rootScope.map.ubicacion.options.icon=getIconUbicacion();
			$rootScope.map.center={ latitude: newValue.latitude, longitude:  newValue.longitude}
			$rootScope.map.ubicacion.options.icon=getIconUbicacion();
		}
	});
	$rootScope.$watch('map', function(newValue, oldValue) {
		if(newValue)Memory.set('Mapa',$rootScope.map)
	}, true)
	$rootScope.$watch('map.eventos', function(newValue, oldValue) {
  		if(newValue){
			revisaEventos($rootScope.map.ubicacion.position);
			$rootScope.map.idEventos = $.map($rootScope.map.eventos, function(v, i){return v.id;});
			Memory.set('Mapa',$rootScope.map)
		}
	});
	$rootScope.$watch('map.radio.radius', function(newValue, oldValue) {
  		if(newValue){
			$rootScope.map.radio.radius=parseInt(newValue);
			revisaEventos($rootScope.map.ubicacion.position);
		}
	});
	$rootScope.$watch('map.radio.activo', function(newValue, oldValue) {
  		if($rootScope.map)revisaEventos($rootScope.map.ubicacion.position);
	});
	var hideAllMarkers=function(){
		for(var i=0; i<$rootScope.map.eventos.length;i++)$rootScope.map.eventos[i].options={visible:false,opacity:$rootScope.map.markerOpacity}
	}
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
	
	
	
	
	uiGmapIsReady.promise()
	.then(function(maps){
          getLocation();
          $(".angular-google-map").animate({
                opacity:1,
        },500);
	})
         var getLocation=function(){
			 navigator.geolocation.getCurrentPosition(mapSuccess, mapError);
		 }
		 
         var mapSuccess=function(position){ 
			$rootScope.map.ubicacion.location={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
         	$rootScope.map.ubicacion.position={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
         	$rootScope.map.ubicacion.options.visible=true;
			$rootScope.$apply(function(){})
			revisaEventos($rootScope.map.ubicacion.position);
			console.log(3);
         }
		 var mapSuccessAuto=function(position){ 
			$rootScope.map.ubicacion.location={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
         	$rootScope.map.auto.position={ latitude: position.coords.latitude, longitude:  position.coords.longitude }
			$rootScope.$apply(function(){})
         }
        var mapError=function(error){
         }
	return {
		login:function(credentials){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
		},
		refresh:function(){
			$http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/login', data: credentials})
    		return true;
		},
		refreshLocation:function(){
			getLocation();
		},
		set:function(usuario){
			$rootScope.Usuario=usuario
			return true;
		},
		getMapa:function(){
			return $rootScope.map;
		},
		getUbicacion:function(){
			return { latitude: 20.734684, longitude:  -103.455187 };
		}
	}
})