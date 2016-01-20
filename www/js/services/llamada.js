angular.module('starter.services')
.factory('Llamada',function($rootScope,uiGmapGoogleMapApi,Memory,Message){
	var inicializa = function(){
		$rootScope.llamada={
			Activa:false,
			Usuario:0,
			Correo:"",
			Llamando:false,
			notificacion:null,
			Contestada:false,
			TiempoLlamada:0,
			Estado:0,
			Altavoz:false,
			Silencio:false,
		}
	}
	$rootScope.$watch("llamada",function(newVal,oldVal){
		if(oldVal && newVal){
			if(newVal.Activa && !oldVal.Activa){
				Message.hideModal();
				Message.showModal("templates/modal/llamada.html")
			}else if(!newVal.Activa && oldVal.Activa){
				Message.hideModal()
			}
		}
	},true)
	var llamando=function(val){
		$rootScope.llamada.Llamando=val;
		$rootScope.llamada.Contestada=false
		$rootScope.llamada.TiempoLlamada=0;
		$rootScope.llamada.Altavoz=false;
		$rootScope.llamada.Silencio=false;
		if(val)$rootScope.llamada.Estado=0
		else $rootScope.llamada.Estado=2
		$rootScope.llamada.Activa=true;
	}
	return {
		inicializa:function(){
			inicializa();
		},
		abre:function(val){
			llamando(val)
		}
	}
})