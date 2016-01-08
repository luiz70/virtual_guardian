angular.module('starter.services')
.factory('Filtros',function($rootScope,uiGmapGoogleMapApi,Memory){
	var inicializa = function(){
		if(Memory.get("Filtros")){
			$rootScope.filtros=Memory.get("Filtros")
			$rootScope.filtros.fechaInicial=new Date($rootScope.filtros.fechaInicial)
			$rootScope.filtros.fechaFinal=new Date($rootScope.filtros.fechaFinal)
		}else{
			var d=new Date()
			d.setDate(d.getDate()-7)
			$rootScope.filtros={
				activos:false,
				tipo:0,
				fechaInicial:d,
				fechaFinal:new Date(),
				periodo:7,
				estados:[],
				asuntos:[]
			}
			for(var i=0;i<Object.keys($rootScope.idioma.Estados).length;i++)
			$rootScope.filtros.estados.push({Nombre:$rootScope.idioma.Estados[i+1],Id:i+1,Selected:true})
			for(var i=0;i<Object.keys($rootScope.idioma.Asuntos).length;i++)
			$rootScope.filtros.asuntos.push({Nombre:$rootScope.idioma.Asuntos[i+1],Id:i+1,Selected:true})
		}
	}
	$rootScope.$watch("filtros",function(newValue,oldValue){
		if(newValue && oldValue){
			Memory.set("Filtros",$rootScope.filtros)
		}
	},true)
	uiGmapGoogleMapApi.then(function(maps) {
		
	})
	return {
		inicializa:function(){
			inicializa();
		},
	}
})