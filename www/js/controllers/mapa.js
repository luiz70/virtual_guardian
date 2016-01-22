angular.module('starter.controllers')
.controller('Mapa', function($scope,Mapa,uiGmapIsReady,$ionicHistory,$rootScope,$timeout,socket,$ionicScrollDelegate){//,Evento,Lugar,Message) {
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
	$scope.socketState=$rootScope.socketState
	$scope.socket=socket;
	$scope.lugar=$rootScope.lugar
	$scope.timeoutEscala=null;
	
	$scope.$on('$ionicView.afterEnter',function(){
		if($rootScope.cerrada){
			//Mapa.inicializa();
		}
	})
	$scope.$on('$ionicView.enter',function(){
		try{
            google.maps.event.trigger($rootScope.map.getGMap(), 'resize');
        }catch(err){}
	})
	//Message.showModal("templates/modal/filtros.html");
	$rootScope.$watch("socketState",function (newValue) {
    	$scope.socketState=$rootScope.socketState;
  	})
	/*$scope.buscaLugares=function(){
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
	  $rootScope.controls[0].activo=true
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
		$scope.error=false;
		//$timeout(function(){$scope.cargandoInfo=false;},2000)
		if($scope.selectedMarker && $scope.selectedMarker.IdEvento){
		if(_.isNull($scope.selectedMarker.Info.Edicion_info)){
			if(socket.isConnected()){
			socket.emit("getInfoEvento",{id:$scope.selectedMarker.IdEvento,edit:-1})
			socket.getSocket().on("getInfoEvento",getInfoEvento);
			}else{
				$scope.cargandoInfo=false;
				$scope.error=true;
			}
		}
		else {
			if(!socket.isConnected()){
				$scope.cargandoInfo=false;
			}else{
				socket.emit("getInfoEvento",{id:$scope.selectedMarker.IdEvento,edit:$scope.selectedMarker.Info.Edicion_info})
				socket.getSocket().on("getInfoEvento",getInfoEvento);
			}
		}
		}else{
			//carga lugar
			$scope.cargandoInfo=true;
			console.log($scope.selectedMarker);
			if(socket.isConnected()){
			socket.getSocket().removeListener("getEscalaVirtual",getEscalaVirtual);
			socket.getSocket().on("getEscalaVirtual",getEscalaVirtualInfo);
			if($scope.selectedMarker.data.types.length>0)
			socket.emit("getEscalaVirtual",{lat:$scope.selectedMarker.position.lat(),lng:$scope.selectedMarker.position.lng(),type:$scope.selectedMarker.data.types.join(" "),nom:$scope.selectedMarker.data.name,id:$scope.selectedMarker.data.id})
			}else{
				$scope.cargandoInfo=false;
				$scope.error=true;
			}
		}
	}
	var getEscalaVirtualInfo=function(data){
		socket.getSocket().removeListener("getEscalaVirtual",getEscalaVirtualInfo);
		$scope.selectedMarker.data.escala=data.v;
		$scope.cargandoInfo=false;
	}
	
	var getInfoEvento=function(data){
		socket.getSocket().removeListener("getInfoEvento",getInfoEvento);
		if(data){
			if(data!==1) $scope.selectedMarker.Info=data;
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
	})*/
})