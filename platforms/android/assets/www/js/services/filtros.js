angular.module('starter.services')
.factory('Filtros',function($rootScope,uiGmapGoogleMapApi,Memory){
	var inicializa = function(){
		if(Memory.get("Filtros")){
			$rootScope.filtros=Memory.get("Filtros")
			$rootScope.filtros.fechaInicial=new Date($rootScope.filtros.fechaInicial)
			$rootScope.filtros.fechaFinal=new Date($rootScope.filtros.fechaFinal)
			var ess=_.compact(_.map($rootScope.filtros.estados,function(v,i){if(v.Selected)return v.Id; else return null;}))
			var ass=_.compact(_.map($rootScope.filtros.asuntos,function(v,i){if(v.Selected)return v.Id; else return null;}))
			if(ess.length==0){
			$rootScope.filtros.estados=[];
			for(var i=0;i<Object.keys($rootScope.idioma.Estados).length;i++)
			$rootScope.filtros.estados.push({Nombre:$rootScope.idioma.Estados[i+1],Id:i+1,Selected:true})
			}
			if(ass.length==0){
			$rootScope.filtros.asuntos=[];
			for(var i=0;i<Object.keys($rootScope.idioma.Asuntos).length;i++)
			$rootScope.filtros.asuntos.push({Nombre:$rootScope.idioma.Asuntos[i+1],Id:i+1,Selected:true})
			}
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