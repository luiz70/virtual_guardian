angular.module('starter.controllers')
.controller('Mapa', function($scope,Mapa,uiGmapIsReady,$ionicHistory,$rootScope,Evento,$timeout,socket) {
	//variable que controla si se cargo el mapa en pantalla
	$scope.mapaCargado=false;
	$scope.showInfo=$rootScope.info;
	$scope.cargandoInfo=true;
	$scope.selectedMarker=$rootScope.selectedMarker;
	$scope.idioma=$rootScope.idioma;
	$scope.error=false;
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
		if(!$scope.selectedMarker.options.data.info)socket.emit("getInfoEvento",{id:$scope.selectedMarker.id,edit:-1})
		else socket.emit("getInfoEvento",{id:$scope.selectedMarker.id,edit:$scope.selectedMarker.options.data.info.Edit})
		
	}
	socket.getSocket().on("getInfoEvento",function(data){
		
		if(data){
			if(data!==1) $scope.selectedMarker.options.data.info=data;
			$scope.cargandoInfo=false;
		}else {
			//error
			console.log("error");
			$scope.cargandoInfo=false;
			$scope.error=true;
		}
	})
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
	   var palabras=["y","de"]
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

/*var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': new google.maps.LatLng($scope.selectedMarker.latitude,$scope.selectedMarker.longitude)}, function(results, status) {
    		if (status === google.maps.GeocoderStatus.OK) {
				console.log(results);
			}
		})*/