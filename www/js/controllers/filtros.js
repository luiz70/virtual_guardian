angular.module('starter.controllers')
.controller('Filtros', function($scope,$rootScope,Filtros,Message,Eventos,$timeout) {
	
	$scope.idioma=$rootScope.idioma
  	$scope.filtros=$rootScope.filtros
	$scope.minDate=new Date(2010,6,3)
	$scope.maxDate=new Date()
	//for(var i=0;i<$scope.filtros.estados.length;i++)
	//$scope.filtros.estados[i].Selected=(true && $scope.filtros.estados[i].Selected)
	$scope.guardaFiltros=function(){
		
		var estados=_.compact(_.map($rootScope.filtros.estados,function(v,i){if(v.Selected)return v.Id; else return null;}))
		var asuntos=_.compact(_.map($rootScope.filtros.asuntos,function(v,i){if(v.Selected)return v.Id; else return null;}))
		if($rootScope.filtros.activos && estados.length==0){
			Message.alert($rootScope.idioma.Filtros[1],$rootScope.idioma.Filtros[11],function(){
			
			})
		}else if($rootScope.filtros.activos && asuntos.length==0){
			Message.alert($rootScope.idioma.Filtros[1],$rootScope.idioma.Filtros[12],function(){
			
			})
		}else{
		Message.hideModal();
		$rootScope.eventosMap=[];
		Eventos.refresh();
		if($rootScope.controls[3].activo && !$rootScope.filtros.activos){
			$rootScope.map.center={latitude:$rootScope.ubicacion.position.latitude,longitude:$rootScope.ubicacion.position.longitude}
			$rootScope.radio.activo=true;
			$rootScope.map.zoom=12;
		}
		$rootScope.controls[3].activo=(true && $rootScope.filtros.activos);
		if($rootScope.filtros.activos){
			
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': new google.maps.LatLng($rootScope.ubicacion.position.latitude,$rootScope.ubicacion.position.longitude)}, function(results, status) {
    		if (status === google.maps.GeocoderStatus.OK) {
				var state="";
				for(var i=0;i<results.length;i++)
					if(results[i].address_components.length==2){
						state=results[i].address_components[0].long_name.toLowerCase();
						if(state=="estado de méxico")state="méxico"
						i=results.length
					}
					var estados=_.compact(_.map($rootScope.filtros.estados,function(v,i){if(v.Selected)return v.Nombre.toLowerCase(); else return null;}))
					if(estados.indexOf(state)<0){
						$rootScope.radio.activo=false;
						$rootScope.map.zoom=6
					}
					
			}
		})
		}
		}
	}
	$scope.getEstado=function(){
		
	}
  $scope.cambiaTipoFecha=function(val){
	 $scope.filtros.tipo=val
  }
  $scope.cambioFecha=function(date){
	  //console.log(date);
  }
  $scope.seleccionaEstado=function(id){
	  $scope.filtros.estados[id-1].Selected=!$scope.filtros.estados[id-1].Selected
}
$scope.seleccionaAsunto=function(id){
	  $scope.filtros.asuntos[id-1].Selected=!$scope.filtros.asuntos[id-1].Selected
}
$scope.marcaTodo=function(val){
	for(var i=0;i<$scope.filtros.estados.length;i++)
	$scope.filtros.estados[i].Selected=val;
}
$timeout(function(){
	var resp=JSON.parse(JSON.stringify($scope.filtros.estados));
	document.getElementById("desmarca").click();
	document.getElementById("marca").click();
	for(var i=0;i<$scope.filtros.estados.length;i++)
	$scope.filtros.estados[i].Selected=resp[i].Selected;
},500)
$scope.marcaTodoEventos=function(val){
	for(var i=0;i<$scope.filtros.asuntos.length;i++)
	$scope.filtros.asuntos[i].Selected=val;
}
  $scope.cambiaPeriodo=function(){
	  var buttons=[]
				if($scope.filtros.periodo!=7)buttons.push({text:$rootScope.idioma.Periodos[7],valor:7})
				if($scope.filtros.periodo!=30)buttons.push({text:$rootScope.idioma.Periodos[30],valor:30})
				if($scope.filtros.periodo!=180)buttons.push({text:$rootScope.idioma.Periodos[180],valor:180})
				if($scope.filtros.periodo!=365)buttons.push({text:$rootScope.idioma.Periodos[365],valor:365})
				
				Message.showActionSheet($rootScope.idioma.Mapa[5],buttons,null,$rootScope.idioma.General[6],function(res,data){
					if(data)$scope.filtros.periodo=data.valor;
				})
  }
})
