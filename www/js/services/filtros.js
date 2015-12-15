angular.module('starter.services')
.factory('Filtros',function($rootScope,uiGmapGoogleMapApi){
	var inicializa = function(){
		$rootScope.filtros={
			activos:false,
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