// JavaScript Document
angular.module('starter.services')
.factory('InfoEvento',function($rootScope,uiGmapGoogleMapApi,$timeout){
	$rootScope.info=false;
	$rootScope.selectedMarker=null;
	var open=false;
	
	var showInfo=function(){
		$rootScope.info=true;
		open=true;
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
		open=false;
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