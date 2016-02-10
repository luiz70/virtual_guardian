// JavaScript Document
angular.module('starter.services')
.factory('InfoEvento',function($rootScope,uiGmapGoogleMapApi,$timeout,$animate){
	$rootScope.info=false;
	$rootScope.selectedMarker=null;
	var open=false;
	
	var showInfo=function(){
		$rootScope.info=true;
		open=true;
		$animate.addClass(document.getElementsByClassName("mapa-descripcion-evento-contenedor")[0],'show-info')
		$animate.removeClass(document.getElementsByClassName("mapa-descripcion-evento-contenedor")[0],'hide-info')
		$animate.addClass(document.getElementsByClassName("mapa-descripcion-evento-cover")[0],'show-search')
		$animate.removeClass(document.getElementsByClassName("mapa-descripcion-evento-cover")[0],'hide-search')
		angular.element(document.getElementsByClassName("mapa-descripcion-evento-cover")[0]).on("touch",hideInfo)
		angular.element(document.getElementsByClassName("mapa-descripcion-evento-close")[0]).on("touch",hideInfo)
		if(!$rootScope.$$phase) $rootScope.$digest();
	}
	var hideInfo=function(){
		open=false;
		$animate.removeClass(document.getElementsByClassName("mapa-descripcion-evento-contenedor")[0],'show-info')
		$animate.addClass(document.getElementsByClassName("mapa-descripcion-evento-contenedor")[0],'hide-info')
		$animate.removeClass(document.getElementsByClassName("mapa-descripcion-evento-cover")[0],'show-search')
		$animate.addClass(document.getElementsByClassName("mapa-descripcion-evento-cover")[0],'hide-search')
		angular.element(document.getElementsByClassName("mapa-descripcion-evento-cover")[0]).off("touch",hideInfo)
		angular.element(document.getElementsByClassName("mapa-descripcion-evento-close")[0]).off("touch",hideInfo)
		if(!$rootScope.$$phase) $rootScope.$digest();
		$timeout(function(){
			if(!$rootScope.$$phase) {
    	        $rootScope.$apply(function(){
					$rootScope.info=false;
					$rootScope.selectedMarker=null;
				})
			}else {
				$rootScope.info=false;
				$rootScope.selectedMarker=null;
			}
		},500)
	}
	
	return {
		visible:function(data){
			if(data)showInfo();
			else hideInfo();
		},
		select:function(marker){
			$rootScope.selectedMarker=null;
			if(!open){
				if(marker.IdEvento)
				$rootScope.sql.getInfoEvento(marker.IdEvento)
				.then(function(res){
					
					if(res.rows.length)
						marker.Info=res.rows.item(0)
					$rootScope.selectedMarker=null
					$rootScope.selectedMarker=marker
				})
				else $rootScope.selectedMarker=marker
			/*if(!marker.data)
			$rootScope.selectedMarker=_.findWhere($rootScope.eventosMap,{id:marker});
			else{
				//if(marker.data.photos && marker.data.photos.length>0)
				//marker.data.foto=marker.data.photos[0].getUrl({'maxWidth': marker.data.photos[0].width, 'maxHeight': marker.data.photos[0].height})
				$rootScope.selectedMarker=marker
			}*/
			}
		}
	}
})