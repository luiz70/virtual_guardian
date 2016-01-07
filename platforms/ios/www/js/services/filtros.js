angular.module('starter.services')
.factory('Filtros',function($rootScope,uiGmapGoogleMapApi){
	var inicializa = function(){
		$rootScope.filtros={
			activos:false,
			tipo:0,
			fechaInicial:new Date()
		}
	}
	uiGmapGoogleMapApi.then(function(maps) {
		
	})
	return {
		inicializa:function(){
			inicializa();
		},
	}
})