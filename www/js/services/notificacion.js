// JavaScript Document
angular.module('starter.services')
.factory('Notificacion',function($rootScope,socket,Memory,$timeout){
	var inicializa=function(){
		$rootScope.notificaciones=Memory.get("Notificaciones")
		if(!$rootScope.notificaciones)$rootScope.notificaciones=[];
		if(socket.isConnected()){
			if($rootScope.notificaciones.length>0)socket.getSocket().emit("setNotificaciones",_.map($rootScope.notificaciones,function(v){return {IdN:v.IdNotificacion,IdE:v.IdEvento,Edi:v.Editado}}))
			
		}
		socket.getSocket().removeListener("notificacionesEliminadas",notificacionesEliminadas)
		socket.getSocket().on("notificacionesEliminadas",notificacionesEliminadas)	
	}
	var notificacionesEliminadas=function(data){
		console.log(3);
		for(var i=0; i<data.length;i++)
		if(!$rootScope.$$phase) 
		$rootScope.$apply(function(){
			$rootScope.notificaciones.splice(_.findIndex($rootScope.notificaciones,{IdNotificacion:data[i]}),1);
		})
		else $rootScope.notificaciones.splice(_.findIndex($rootScope.notificaciones,{IdNotificacion:data[i]}),1);
	}
	$rootScope.$watch("notificaciones",function(newValue,oldValue){
		if(newValue && oldValue)Memory.set("Notificaciones",$rootScope.notificaciones.slice(0, 15))
	},true)
	var listeners=function(){
		socket.getSocket().removeListener("getNotificaciones",getNotificaciones)
		socket.getSocket().on("getNotificaciones",getNotificaciones)
	}
	var getNotificaciones=function(res){
		switch(res.Tipo){
			case 0: $rootScope.notificaciones=_.uniq(_.union(res.Data,$rootScope.notificaciones),function(item) { return item.IdNotificacion;}) 
			break;
			case 1:$rootScope.notificaciones=_.uniq(_.union($rootScope.notificaciones,res.Data),function(item) { return item.IdNotificacion;}) 
			break;
		}
	}
	var actualiza=function(val){
		switch(val){
			case 0: 
			socket.getSocket().emit("getNotificaciones",{Val:($rootScope.notificaciones.length>0)?$rootScope.notificaciones[0].IdNotificacion:0 ,Tipo:0,Limit:15});
			break;
			case 1:
			socket.getSocket().emit("getNotificaciones",{Val:($rootScope.notificaciones.length>0)?$rootScope.notificaciones[$rootScope.notificaciones.length-1].IdNotificacion:0 ,Tipo:1,Limit:5});
			break;
		}
		
	}
	return {
		inicializa:function(){
			inicializa();
			listeners();
		},
		getNotificaciones:function(val){
			actualiza(val);
		}
	}
})