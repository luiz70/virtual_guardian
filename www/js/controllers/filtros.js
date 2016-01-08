angular.module('starter.controllers')
.controller('Filtros', function($scope,$rootScope,Filtros,Message,Eventos) {
	Filtros.inicializa()
	$scope.idioma=$rootScope.idioma
  	$scope.filtros=$rootScope.filtros
	$scope.minDate=new Date(2010,6,3)
	$scope.maxDate=new Date()
	
	$scope.guardaFiltros=function(){
		Message.hideModal();
		$rootScope.eventosMap=[];
		Eventos.refresh();
		$rootScope.controls[3].activo=(true && $rootScope.filtros.activos);
		if($rootScope.filtros.activos ){
			
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({'location': new google.maps.LatLng($rootScope.ubicacion.position.latitude,$rootScope.ubicacion.position.longitude)}, function(results, status) {
    		if (status === google.maps.GeocoderStatus.OK) {
				var state="";
				for(var i=0;i<results.length;i++)
					if(results[i].address_components.length==2){
						state=results[i];
						i=results.length
					}
				for(var i=0;i<$rootScope.filtros.estados.length;i++)
					if($rootScope.filtros.estados[i].Nombre.toLowerCase()==state.address_components[0].long_name.toLowerCase()){
						i=$rootScope.filtros.estados.length;
						console.log(state);
						//if(!$rootScope.filtros.estados[i].Selected)
						
					}
			}
		})
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
.filter('fechaFiltros', function () {
	return function (input,scope,id) {
	   if(input){
		   var f=new Date();
		   switch(id){
			   case 1:
			   		if(input.tipo)f.setDate(f.getDate()-input.periodo)
					else f=input.fechaInicial
			   break;
			   case 2:
			   		if(!input.tipo)f=input.fechaFinal
			   break;
		   }
		   var d=f.getDate()
		   return (d<10?"0"+d:d)+" - "+scope.idioma.Meses[parseInt(f.getMonth()+1)].substring(0,3)+" - "+f.getFullYear();
	   }
	}
})