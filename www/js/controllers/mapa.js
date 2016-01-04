angular.module('starter.controllers')
.controller('Mapa', function($scope,Mapa,uiGmapIsReady,$ionicHistory,$rootScope,Evento,$timeout,socket,$ionicScrollDelegate,Lugar) {
	//variable que controla si se cargo el mapa en pantalla
	$scope.mapaCargado=false;
	$scope.timeout=null
	$scope.showInfo=$rootScope.info;
	$rootScope.search=false;
	$scope.showSearch=$rootScope.search;
	$scope.cargandoInfo=true;
	$scope.selectedMarker=$rootScope.selectedMarker;
	$scope.idioma=$rootScope.idioma;
	$scope.error=false;
	$scope.buscador="";
	$scope.resultados=[];
	$scope.buscando=false;
	Mapa.inicializa();
	$scope.socket=socket;
	$scope.lugar=$rootScope.lugar
	$scope.timeoutEscala=null;
	$scope.$on('$ionicView.afterEnter',function(){
		if($rootScope.cerrada){
			//Mapa.inicializa();
		}
	})
	$scope.buscaLugares=function(){
		$scope.buscando=true;
		if($scope.timeout)$timeout.cancel($scope.timeout)
		$scope.timeout=$timeout($scope.busca,1000);
	}
	$scope.busca=function(){
		$scope.resultados=[]
		$ionicScrollDelegate.scrollTop();
		$scope.buscando=true;
		if($scope.buscador){
		if($scope.buscador.trim()!=""){
			$scope.searchBox = new google.maps.places.PlacesService($rootScope.map.getGMap());
		var service = new google.maps.places.AutocompleteService();
 		service.getPlacePredictions({ input: $scope.buscador ,componentRestrictions: {country: 'mx'},language:"es"}, $scope.predicciones);
		}else $scope.resultados=[]
		}else $scope.buscando=false;
	}
	$scope.predicciones = function(predictions, status) {
		$scope.resultados=[]
		if(!predictions)
		$scope.$apply(function () {
			$scope.buscando=false
		})
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        predictions.forEach(function(prediction) {
		$scope.searchBox.getDetails({placeId:prediction.place_id}, $scope.placeDetails);	
    	});
	}
  };
  
  $scope.placeDetails=function(result,status){
	 $scope.buscando=false;
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
	  $scope.$apply(function () {
          	$scope.resultados.push(result);
        });
	  }
	  
  }
  $scope.abreLugar=function(lugar){
	  $rootScope.eventosMap=[];
	  $scope.cierraBuscador();
	  console.log(lugar.geometry.location.lat(),lugar.geometry.location.lng());
	  $rootScope.map.center={latitude: lugar.geometry.location.lat(), longitude:  lugar.geometry.location.lng()}
	  if($rootScope.radio.activo)$rootScope.ubicacion.position={latitude: lugar.geometry.location.lat(), longitude:  lugar.geometry.location.lng()}
	  $timeout(function(){
	  	$scope.lugar=Lugar.setImg(lugar)
	  },100)
	  
  }
	$scope.$watch("resultados",function(newValue){
		if(newValue){
			if($scope.timeoutEscala)$timeout.cancel($scope.timeoutEscala)
			$scope.timeoutEscala=$timeout($scope.revisaEscala,1000);
		}
	},true)
	$rootScope.$watch("search",function(newValue){
		if(newValue){
			
			$(".mapa-search").css("opacity","0")
			$scope.showSearch=newValue;
			$(".mapa-search").animate({
				opacity:1
			},300)
		}else{
			$(".mapa-search").css("opacity","1")
			$(".mapa-search").animate({
				opacity:0
			},300,function(){
				$scope.$apply(function(){
					$scope.resultados=[]
					$scope.showSearch=false;
					$scope.buscador=""
				});
				
			})
		}
	})
	$scope.cierraBuscador=function(){
		$rootScope.search=false;
	}
	$scope.revisaEscala=function(){
		socket.getSocket().on("getEscalaVirtual",getEscalaVirtual);
		for(var i=0; i<$scope.resultados.length;i++)
		if($scope.resultados[i].types.length>0)
		socket.emit("getEscalaVirtual",{lat:$scope.resultados[i].geometry.location.lat(),lng:$scope.resultados[i].geometry.location.lng(),type:$scope.resultados[i].types.join(" "),nom:$scope.resultados[i].name,id:$scope.resultados[i].id})
	}
	var getEscalaVirtual=function(data){
		socket.getSocket().removeListener("getEscalaVirtual",getEscalaVirtual);
		var d=_.findWhere($scope.resultados,{id:data.id})
		if(d)d.escala=data.v
	}
	//funcion que se ejecuta cuando el mapa se carga 
	uiGmapIsReady.promise().then(function(maps){
		//declara que el mapa se cargo
		$scope.mapaCargado=true;
		//limpia historial para evitar incompatibilidad con ios
		$ionicHistory.clearHistory();		
	})
	$rootScope.$watch("info",function(newValue){
		$scope.showInfo=newValue
	})
	$scope.loadData=function(){
		//$timeout(function(){$scope.cargandoInfo=false;},2000)
		if($scope.selectedMarker.options){
		if(!$scope.selectedMarker.options.data.info){
			socket.emit("getInfoEvento",{id:$scope.selectedMarker.id,edit:-1})
			socket.getSocket().on("getInfoEvento",getInfoEvento);
		}
		else {
			if(!socket.isConnected){
				$scope.cargandoInfo=false;
			}else	{
				socket.emit("getInfoEvento",{id:$scope.selectedMarker.id,edit:$scope.selectedMarker.options.data.info.Edit})
				socket.getSocket().on("getInfoEvento",getInfoEvento);
			}
		}
		}else{
			//carga lugar
			$scope.cargandoInfo=false;
		}
	}
	
	var getInfoEvento=function(data){
		socket.getSocket().removeListener("getInfoEvento",getInfoEvento);
		if(data){
			if(data!==1) $scope.selectedMarker.options.data.info=data;
			$scope.cargandoInfo=false;
		}else {
			//error
			console.log("error");
			$scope.cargandoInfo=false;
			$scope.error=true;
		}
	}
	$rootScope.$watch("selectedMarker",function(newValue){
		if(newValue){
			$scope.selectedMarker=newValue
			$scope.loadData();
		}else $scope.cargandoInfo=true;
	})
})
//filtro que convierte la distancia en metros a km o metros con 2 decimales
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
}
})
.filter('subtituloInfo', function () {
return function (input,scope) {
   if(input){
	   	var direc=[]
		if(input.Municipio.trim()!="")direc.push(input.Municipio)
		if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		var direc=direc.join(", ").split(" ");
		for(var i=0;i<direc.length;i++)
			direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase()
		return direc.join(" ")
   }else return "";
}
})
.filter('direccion', function () {
return function (input,scope) {
   if(input){
	   var palabras=["del","la","al","de","por","y","a","e"]
	   	var direc=[]
		if(input.Calles.trim()!="")direc.push(input.Calles)
		if(input.Colonia.trim()!="")direc.push(input.Colonia)
		if(input.Municipio.trim()!="")direc.push(input.Municipio)
		if(parseInt(input.Estado)>0)direc.push(scope.idioma.Estados[parseInt(input.Estado)])
		var direc=direc.join(", ").toLowerCase().split(" ");
		for(var i=0;i<direc.length;i++)
			if(palabras.indexOf(direc[i])<0)direc[i]=direc[i].substr(0,1).toUpperCase()+direc[i].substr(1).toLowerCase();
		return direc.join(" ")
   }else return "";
}
})
.filter('fechaInfo', function () {
	return function (input,scope) {
	   if(input){
		   var d=input.split("-");
		   return d[0]+" de "+scope.idioma.Meses[parseInt(d[1])]+" de "+d[2];
	   }
	}
})

.filter('escalaV', function () {
	return function (input) {
	   if(input){
		   if(!input.Prom)input.Prom=0;
		   var escala=(input.Val*5)/input.Prom;
		   if(escala>10)escala=10;
		   if(escala<0) escala=0;
		   return (10-escala).toFixed(1);
	   }
	}
})


/*var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': new google.maps.LatLng($scope.selectedMarker.latitude,$scope.selectedMarker.longitude)}, function(results, status) {
    		if (status === google.maps.GeocoderStatus.OK) {
				console.log(results);
			}
		})*/