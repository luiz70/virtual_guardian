angular.module('starter.controllers')
.controller('Reportes', function($scope,$rootScope,$timeout,$ionicScrollDelegate,socket,ionicMaterialMotion,ionicMaterialInk,Message,Reporte) {
	$scope.cargandoReportes=false;
	$scope.reportesRefresh=false;
	$scope.moreData=true;
	$scope.$on('$ionicView.afterEnter',function(){
		$scope.cargandoReportes=true;
		$timeout(function(){
			$ionicScrollDelegate.scrollTop();
        	$scope.loadReportes(0);
			$rootScope.reportes=$rootScope.reportes.slice(0, 15)
			$scope.moreData=true;
		},100)
	})
	$scope.creaReporte=function(){
		if($rootScope.internet.state){
			Message.showModal("screens/modal/reporte.html",'right');
		}else{
			//no hay internet, no abre
		}
	}
	$scope.animate=function(){
		
		// Set Motion
		ionicMaterialMotion.fadeSlideInRight();
		// Set Ink
		ionicMaterialInk.displayEffect();
	}
	$scope.loadReportes=function(val){
		
		socket.getSocket().removeListener("getReportes",getReportes)
		socket.getSocket().removeListener("connect",connect)
		socket.getSocket().removeListener("connect_error",connectError);
		socket.getSocket().on("getReportes",getReportes)
		socket.getSocket().on("connect",connect)
		socket.getSocket().on("connect_error",connectError);
		if(socket.isConnected())Reporte.getReportes(val);
		else{ 
			getReportes([])
			$scope.moreData=false;
		}
		/*
		
		if(!$scope.$$phase)
			$scope.$apply(function(){
				$scope.reportesRefresh=true;
			})
		else{
			$scope.reportesRefresh=true;
		}*/
		
	}
	function getReportes(data){
		console.log(data);
		socket.getSocket().removeListener("getReportes",getReportes)
		$timeout(function(){
			$ionicScrollDelegate.resize()
			$scope.animate();
		},300)
		$timeout(function(){
			$scope.cargandoReportes=false;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.$broadcast('scroll.refreshComplete');
			if(data.Tipo==1 && data.Data.length==0)$scope.moreData=false;
		},100)
	}
	var connect=function(){
		if($rootScope.reportes && $rootScope.reportes.length>0)
			socket.getSocket().emit("setReportes",_.map($rootScope.reportes,function(v){return {IdR:v.IdReporte,Edi:v.Editado}}))
		socket.getSocket().removeListener("connect",connect)
		$scope.loadReportes(0)
		$scope.cargandoReportes=true;
		$scope.moreData=true;
		
	}
	var connectError=function(){
		socket.getSocket().removeListener("connect_error",connectError);
		getReportes([]);
		$scope.moreData=false;
	}
	$scope.abreReporte=function(data){
		var buttons=[
			{text:$rootScope.idioma.Reportes[7],funcion:$scope.apoyarReporte,data:data},
			{text:$rootScope.idioma.Reportes[8],funcion:$scope.rechazarReporte,data:data},
			/*{text:$rootScope.idioma.Notificaciones[20],funcion:$scope.verEvento,data:data}*/
		];
		Message.showActionSheet(null,buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				if($rootScope.internet.state){
				res.funcion(res.data);
				}else{
				Message.alert($rootScope.idioma.Reportes[6],$rootScope.idioma.General[7],function(){})
				}
			}
		})
	}
	$scope.apoyarReporte=function(data){
		console.log(data);
	}
	$scope.rechazarReporte=function(data){
		console.log(data);
	}
})
.controller('CreaReporte', function($scope,$rootScope,Message,$ionicScrollDelegate,$timeout) {
	$scope.idioma=$rootScope.idioma
	$scope.buscando=false;
	$scope.direccion={search:""};
	$scope.timeout=null;
	$scope.resultados=[]
	$scope.reporte={
		Asunto:1,
		Direccion:"",
		Fecha:new Date()
	}
	$scope.eliminaDireccion=function(){
		$scope.direccion.search="";
	}
	$scope.cierraModal=function(){
		Message.hideModal();
	}
	$rootScope.reporta=function(){
		Message.hideModal();
	}
	$scope.cambiaAsunto=function(){
		var buttons=[];
		for(var i=1;i<=Object.keys($rootScope.idioma.Asuntos).length;i++)
		buttons.push({text:$rootScope.idioma.Asuntos[i],data:i})
		Message.showActionSheet($rootScope.idioma.Reportes[12],buttons,null,$rootScope.idioma.General[6],function(index,res){
			if(index>=0){
				$scope.reporte.Asunto=res.data;
			}
		})
	}
	$scope.buscaDireccion=function(){
		$scope.buscando=true;
		if($scope.timeout)$timeout.cancel($scope.timeout)
		$scope.timeout=$timeout($scope.busca,1000);
	}
	$scope.busca=function(){
		$scope.resultados=[]
		$ionicScrollDelegate.scrollTop();
		$scope.buscando=true;
		if($scope.direccion.search){
		if($scope.direccion.search.trim()!=""){
		$scope.searchBox = new google.maps.places.PlacesService($rootScope.map.getGMap());
		var service = new google.maps.places.AutocompleteService();
 		service.getPlacePredictions({ input: $scope.direccion.search ,componentRestrictions: {country: 'mx'},language:"es"}, $scope.predicciones);
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
})
