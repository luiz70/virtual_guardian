// JavaScript Document
angular.module('starter.services')
.factory('Reporte',function($rootScope,socket,Memory,$timeout){
	
	var inicializa=function(){
		$rootScope.reportes=Memory.get("Reportes")
		if(!$rootScope.reportes)$rootScope.reportes=[];
		if(socket.isConnected()){
			if($rootScope.reportes.length>0)
				socket.getSocket().emit("setReportes",_.map($rootScope.reportes,function(v){return {IdR:v.IdReporte,Edi:v.Editado}}))
		}
		socket.getSocket().removeListener("reportesEliminados",reportesEliminados)
		socket.getSocket().on("reportesEliminados",reportesEliminados)	
	}
	var reportesEliminados=function(data){
		/*
		for(var i=0; i<data.length;i++)
		if(!$rootScope.$$phase) 
		$rootScope.$apply(function(){
			$rootScope.notificaciones.splice(_.findIndex($rootScope.notificaciones,{IdNotificacion:data[i]}),1);
		})
		else $rootScope.notificaciones.splice(_.findIndex($rootScope.notificaciones,{IdNotificacion:data[i]}),1);
		*/
	}
	$rootScope.$watch("reportes",function(newValue,oldValue){
		if(newValue && oldValue)Memory.set("Reportes",$rootScope.reportes.slice(0, 15))
	},true)
	var listeners=function(){
		socket.getSocket().removeListener("getReportes",getReportes)
		socket.getSocket().on("getReportes",getReportes)
	}
	var getReportes=function(res){
		switch(res.Tipo){
			case 0: $rootScope.reportes=_.uniq(_.union(res.Data,$rootScope.reportes),function(item) { return item.IdReporte;}) 
			break;
			case 1:$rootScope.reportes=_.uniq(_.union($rootScope.reportes,res.Data),function(item) { return item.IdReporte;}) 
			break;
		}
	}
	var actualiza=function(val){
		switch(val){
			case 0: 
			socket.getSocket().emit("getReportes",{Val:($rootScope.reportes.length>0)?$rootScope.reportes[0].IdReporte:0 ,Tipo:0,Limit:15});
			break;
			case 1:
			socket.getSocket().emit("getReportes",{Val:($rootScope.reportes.length>0)?$rootScope.reportes[$rootScope.reportes.length-1].IdReporte:0 ,Tipo:1,Limit:5});
			break;
		}
		
	}
	return {
		inicializa:function(){
			if(!$rootScope.reportes){
			inicializa();
			listeners();
			}
		},
		getReportes:function(val){
			actualiza(val);
		}
	}
})