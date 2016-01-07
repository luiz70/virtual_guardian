angular.module('starter.controllers')
.controller('Filtros', function($scope,$rootScope,Filtros,Message) {
	Filtros.inicializa()
	$scope.idioma=$rootScope.idioma
  	$scope.filtros=$rootScope.filtros
	$scope.minDate=new Date(2010,6,3)
	$scope.maxDate=new Date()
	
	$scope.guardaFiltros=function(){
		Message.hideModal();
	}
  $scope.cambiaTipoFecha=function(val){
	 $scope.filtros.tipo=val
  }
  $scope.cambioFecha=function(date){
	  console.log(date);
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