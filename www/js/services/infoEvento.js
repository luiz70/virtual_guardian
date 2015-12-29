// JavaScript Document
angular.module('starter.services')
.factory('InfoEvento',function($rootScope,uiGmapGoogleMapApi,$timeout){
	$rootScope.info=false;
	$rootScope.selectedMarker=null;
	
	var showInfo=function(){
		$rootScope.info=true;
		$(".mapa-descripcion-evento-contenedor").animate({
			bottom:"0px"
			},500);
			$(".mapa-descripcion-evento-cover").animate({
			opacity:"1"
			},500,function(){
				$(".mapa-descripcion-evento-cover").on("click",hideInfo);
				$(".mapa-descripcion-evento-close").on("click",hideInfo);
			
			});
	}
	var hideInfo=function(){
		$(".mapa-descripcion-evento-cover").off("click",hideInfo);
		$(".mapa-descripcion-evento-close").off("click",hideInfo);
		$(".mapa-descripcion-evento-contenedor").animate({
			bottom:"-100vh"
			},500);
			$(".mapa-descripcion-evento-cover").animate({
			opacity:"0"
			},500,function(){
				if(!$rootScope.$$phase) {
                    $rootScope.$apply(function(){
						$rootScope.info=false;
						$rootScope.selectedMarker=null;
					})
				}else $rootScope.info=false;
			});
	}
	
	return {
		visible:function(data){
			if(data)showInfo();
			else hideInfo();
		},
		select:function(marker){
			$rootScope.selectedMarker=_.findWhere($rootScope.eventosMap,{id:marker});
		}
	}
})