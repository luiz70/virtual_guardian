angular.module('starter.services')
.factory('Filtros',function($rootScope,uiGmapGoogleMapApi){
	uiGmapGoogleMapApi.then(function(maps) {
		$rootScope.map.filtros={
			activos:false,
		}
	})
	return {
		func:function(){
			
		},
	}
})