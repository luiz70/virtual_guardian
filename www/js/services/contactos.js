// JavaScript Document
angular.module('starter.services')
.factory('Contactos',function($rootScope,socket,Memory,$timeout){
	var inicializa=function(){
		$rootScope.contactos=Memory.get("Contactos")
		if(!$rootScope.contactos)$rootScope.contactos=[];
	}
	
	$rootScope.$watch("contactos",function(newValue,oldValue){
		if(newValue && oldValue)Memory.set("Contactos",$rootScope.contactos)
	},true)
	var listeners=function(){
		socket.getSocket().removeListener("getContactos",getContactos)
		socket.getSocket().on("getContactos",getContactos)
	}
	var getContactos=function(res){
		$rootScope.contactos=res;
		
	}
	var actualiza=function(){
		socket.getSocket().emit("getContactos");
		
		
	}
	return {
		inicializa:function(){
			if(!$rootScope.contactos){
			inicializa();
			listeners();
			}
		},
		getContactos:function(){
			actualiza();
		}
	}
})