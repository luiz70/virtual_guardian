angular.module('starter')
.controller("notificaciones",function($scope,$http,$rootScope,$timeout){
	
	//VARIABLES
	$scope.cargandoN=false;
	$scope.isRefresh=false;
	if(window.localStorage.getArray("Notificaciones")){
		$rootScope.Notificaciones=window.localStorage.getArray("Notificaciones");
		$scope.todasOld=false;
		$scope.loadOlder=false;
	}
	else {
		$rootScope.Notificaciones=[];
		$scope.todasOld=true;
		$scope.loadOlder=false;
	}
	
			
	$scope.refreshOlder=function(){
		$rootScope.notPendientes=0;
		window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
		$scope.isRefresh=true;
		$scope.todasOld=false;
		var last=$rootScope.Notificaciones[$rootScope.Notificaciones.length-1].IdNotificacion;
		$scope.loadOlder=true;
		if($scope.Conexion()){
			$http.post("https://www.virtual-guardian.com/api/notificaciones/refresh",{
				Id:window.localStorage.getArray("Usuario").Id,
				Last:last,
				Limit:5
			},{timeout:20000})
			.success(function(data,status,header,config){
				for(var i=0;i<data.length;i++){			
					var tmp=JSON.parse(data[i])
					if(tmp.Subtitulo && tmp.Subtitulo.substring(0,2)==", ")tmp.Subtitulo=tmp.Subtitulo.substring(2);
					tmp.Subtitulo=cleanutf(tmp.Subtitulo);
					if(tmp.Titulo==""){
						if(tmp.Tipo<5){
							tmp.Titulo=tmp.Asunto+$scope.idioma.notificaciones[5]+tmp.Distancia;
							if(tmp.Tipo==3)tmp.Titulo+=$scope.idioma.notificaciones[6]+tmp.Involucrado;
							else if(tmp.Tipo==4)tmp.Titulo+=$scope.idioma.notificaciones[7];
						}else{
							if(tmp.Tipo<7){
							tmp.Titulo=$scope.idioma.notificaciones[2];
							tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[3];
							if(tmp.Tipo==6)tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[4];
							}else if(tmp.Tipo==7){
							tmp.Titulo=$scope.idioma.notificaciones[8];
							tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[9];
							}else if(tmp.Tipo==8){
							tmp.Titulo=$scope.idioma.notificaciones[11];
							tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[12];
							}else if(tmp.Tipo==9){
								tmp.Titulo=$scope.idioma.notificaciones[13];
								tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[14];
							}
						}
					}
					if(!$scope.existenoti(tmp.IdNotificacion))$rootScope.Notificaciones.push(tmp)
				}
				if(data.length<5)$scope.todasOld=true;
				window.localStorage.setArray("Notificaciones",$rootScope.Notificaciones)
				$scope.loadOlder=false;
				$scope.isRefresh=false;
			})
			.error(function(error,status,header,config){
				$scope.$broadcast('scroll.refreshComplete');
				$scope.loadOlder=false;
				$scope.isRefresh=false;
				$scope.Conexion(1);
			})
			.finally(function() {
       			// Stop the ion-refresher from spinning
       			$scope.$broadcast('scroll.refreshComplete');
				$scope.loadOlder=false;
     		});
		}else {
			$timeout(function(){ 
				$scope.isRefresh=false;
				$scope.todasOld=false;
				$scope.loadOlder=false;
			},1000);
		}
	}
	
	$rootScope.refreshNotification=function(){
		$rootScope.notPendientes=0;
		window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
		if($scope.Conexion()){
			if(!$scope.cargandoN){
				$scope.isRefresh=true;
				$rootScope.doRefreshNotification();
			}else $scope.$broadcast('scroll.refreshComplete');
		}else $scope.$broadcast('scroll.refreshComplete');
	}
	
	$rootScope.doRefreshNotification=function(){
		$rootScope.notPendientes=0;
		window.localStorage.setArray("nPendientes",$rootScope.notPendientes);
		if($scope.Conexion()){
			$rootScope.cargando=true;
			var last=0;
			if($rootScope.Notificaciones.length>0){
				last=$rootScope.Notificaciones[0].IdNotificacion;
				$rootScope.cargando=false;
				if(!$scope.isRefresh)$scope.cargandoN=true;
			}
			$http.post("https://www.virtual-guardian.com/api/notificaciones",{
				Id:window.localStorage.getArray("Usuario").Id,
				Last:last,
				Limit:15
			},{timeout:20000})
			.success(function(data,status,header,config){
				$scope.todasOld=false;
				//$rootScope.Notificaciones=[];
				data.reverse();
				for(var i=0;i<data.length;i++){
					var tmp=JSON.parse(data[i])
					if(tmp.Subtitulo && tmp.Subtitulo.substring(0,2)==", ")tmp.Subtitulo=tmp.Subtitulo.substring(2);
					tmp.Subtitulo=cleanutf(tmp.Subtitulo);
					if(tmp.Titulo==""){
						if(tmp.Tipo<5){
							tmp.Titulo=tmp.Asunto+$scope.idioma.notificaciones[5]+tmp.Distancia;
							if(tmp.Tipo==3)tmp.Titulo+=$scope.idioma.notificaciones[6]+tmp.Involucrado;
							else if(tmp.Tipo==4)tmp.Titulo+=$scope.idioma.notificaciones[7];
						}else{
							if(tmp.Tipo<7){
							tmp.Titulo=$scope.idioma.notificaciones[2];
							tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[3];
							if(tmp.Tipo==6)tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[4];
							}else if(tmp.Tipo==7){
							tmp.Titulo=$scope.idioma.notificaciones[8];
							tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[9];
							}else if(tmp.Tipo==8){
								tmp.Titulo=$scope.idioma.notificaciones[11];
							tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[12];
							}
							else if(tmp.Tipo==9){
								tmp.Titulo=$scope.idioma.notificaciones[13];
								tmp.Subtitulo=tmp.Involucrado+$scope.idioma.notificaciones[14];
							}
						}
					}
					if(!$scope.existenoti(tmp.IdNotificacion))$rootScope.Notificaciones.unshift(tmp);
					//if($rootScope.Notificaciones.length>0)
					//else $rootScope.Notificaciones.push(tmp);
				}
				if($rootScope.Notificaciones.length==0)$scope.todasOld=true;
				window.localStorage.setArray("Notificaciones",$rootScope.Notificaciones)
				$rootScope.cargando=false;
				$scope.cargandoN=false;
				$scope.isRefresh=false;
			})
			.error(function(error,status,header,config){
				$scope.$broadcast('scroll.refreshComplete');
				$rootScope.cargando=false;
				$scope.cargandoN=false;
				$scope.isRefresh=false;
				$scope.Conexion(1);
			})
			.finally(function() {
       			// Stop the ion-refresher from spinning
       			$scope.$broadcast('scroll.refreshComplete');
				$rootScope.cargando=false;
     		});
			$scope.existenoti=function (id){
				for(var i=0; i<$rootScope.Notificaciones.length;i++)
				if($rootScope.Notificaciones[i].IdNotificacion==id)return true
				return false;
			}
		}
	}		
})