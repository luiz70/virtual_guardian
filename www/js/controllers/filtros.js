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
})
.filter('fechaMx', function () {
	return function (input,scope) {
	   if(input){
		   var d=input.getDate()
		   return (d<10?"0"+d:d)+" - "+scope.idioma.Meses[parseInt(input.getMonth()+1)].substring(0,3)+" - "+input.getFullYear();
	   }
	}
})