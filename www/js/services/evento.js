// JavaScript Document
angular.module('starter.services')
.factory('Evento',function($rootScope,uiGmapGoogleMapApi){
var getIconoEvento=function(evt){
		var icono = {
			url: 'img/iconos/mapa/marcadores/'+evt.asunto+".png",
			size: new google.maps.Size(40, 51),
   			origin: new google.maps.Point(0,0),
   			anchor: new google.maps.Point(20, 51),
			scaledSize:new google.maps.Size(40, 51)
		}
		return icono;
	}
	
	return {
		func:function(){
			
		},
	}
})