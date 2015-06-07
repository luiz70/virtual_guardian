angular.module('starter')
.controller("personas",function($scope,$http,$rootScope,$timeout){
	if(window.localStorage.getArray("Personas")){
		$scope.Personas=window.localStorage.getArray("Personas");
	}
	else {
		$scope.Personas=[];
	}
	$rootScope.getPersonas=function(){
	if($scope.Personas.length>0)$scope.cargandoP=true;
	$rootScope.refreshPersonas();
	}
	$rootScope.refreshPersonas=function(){
		
		if($scope.Personas.length>0)$rootScope.cargando=false;
		else $rootScope.cargando=true;
		if($scope.Conexion()){
		$http.get("http://www.virtual-guardian.com/api/personas/"+$rootScope.Usuario.Id,{timeout:20000})
		.success(function(data,status,header,config){
			$scope.Personas=[];
			for(var i=0;i<data.length;i++){
				var d=JSON.parse(data[i])
				d.Tipo=parseInt(d.Tipo) 
				d.Lugar=parseInt(d.Lugar) 
				$scope.Personas.push(d);				
			}
			$rootScope.cargando=false;
			$scope.cargandoP=false;
			window.localStorage.setArray("Personas",$scope.Personas);
		})
		.error(function(error,status,header,config){
			$rootScope.cargando=false;
			$scope.cargandoP=false;
		}) .finally(function() {
       			// Stop the ion-refresher from spinning
       			$scope.$broadcast('scroll.refreshComplete');
				$rootScope.cargando=false;
     		});
		}else{
			$timeout(function(){ 
				$rootScope.cargando=false;
				$scope.cargandoP=false;
			},1000);
		}
	}
	//$scope.getPersonas();
	$scope.addPerson=function(){
		if($scope.Conexion(1)){
		$scope.prompt ($rootScope.idioma.personas[1],$rootScope.idioma.personas[2],"email",$rootScope.idioma.login[2],function(res){
			if(res==$rootScope.Usuario.Correo)$scope.alert($scope.idioma.personas[1],$scope.idioma.personas[3],function(){});
			else if(res=="")$scope.alert($scope.idioma.personas[1],$scope.idioma.registro[9],function(){});
			else if(!$scope.evalid(res))$scope.alert($scope.idioma.personas[1],$scope.idioma.registro[10],function(){});
			else{
			$http.post("http://www.virtual-guardian.com/api/personas/add",{
				Usuario:$rootScope.Usuario.Id,
				Correo:res
				})
		.success(function(data,status,header,config){
			if(data.Id){
				$scope.alert($scope.idioma.personas[1],res+$scope.idioma.personas[4],function(){});
				$scope.getPersonas();
			}else{
				if(data.type==1)$scope.alert($scope.idioma.personas[1],res+$scope.idioma.personas[5],function(){});
				else if(data.type==2){
					if(data.tipo==0)$scope.alert($scope.idioma.personas[1],res+$scope.idioma.personas[7],function(){});
					else $scope.alert($scope.idioma.personas[1],res+$scope.idioma.personas[6],function(){});
				}
			}
			})
		.error(function(error,status,header,config){
			console.log(error);
			})
			}
			}) ;
		}
	}
	$scope.eliminaPersona=function(usr){
		console.log(usr);
		if($scope.Conexion(1)){
			$scope.confirm($scope.idioma.personas[11],$scope.idioma.personas[12]+usr.Correo+"?",function(){
			$http.post("http://www.virtual-guardian.com/api/personas/rem",{
				Usuario1:usr.IdCliente,
				Usuario2:$rootScope.Usuario.Id
				})
			.success(function(data,status,header,config){
				$scope.alert($scope.idioma.personas[11],usr.Correo+$scope.idioma.personas[15],function(){});
				$scope.getPersonas();
			}).error(function(error,status,header,config){
			console.log(error);
			})
			
		})
		}
		}
	$scope.aceptaPersona=function(usr){
		if($scope.Conexion(1)){
		$scope.confirm($scope.idioma.personas[13],$scope.idioma.personas[14]+usr.Correo+"?",function(){
			
			$http.post("http://www.virtual-guardian.com/api/personas/acp",{
				Usuario1:usr.IdCliente,
				Usuario2:$rootScope.Usuario.Id
				})
			.success(function(data,status,header,config){
				$scope.alert($scope.idioma.personas[13],usr.Correo+$scope.idioma.personas[16],function(){});
				$scope.getPersonas();
			}).error(function(error,status,header,config){
			console.log(error);
			})
			
		})
		}
		}
		/*{
			Titulo:"Hallazgo en puebla",
			Subtitulo:"San Felipe Tepatlan, Comunidad de Guadalupe",
			Evento:"6",
			Fecha:"05/03/2015",
			Hora:"20:04"
		}*/
	
	/*$http.get("http://www.virtual-guardian.com/api/notificaciones/"+window.localStorage.getArray("Usuario").Id)
		.success(function(data,status,header,config){
			$scope.Personas=[];
			for(var i=0;i<data.length;i++){
			var tmp=JSON.parse(data[i])
			if(tmp.Subtitulo && tmp.Subtitulo.substring(0,2)==", ")tmp.Subtitulo=tmp.Subtitulo.substring(2);
			tmp.Subtitulo=cleanutf(tmp.Subtitulo);
			$scope.Personas.push(tmp);
			}
			window.localStorage.setArray("Notificaciones",$scope.Personas)
			})
		.error(function(error,status,header,config){
			
			})
	$scope.doRefresh=function(){
		$http.get("http://www.virtual-guardian.com/api/notificaciones/"+window.localStorage.getArray("Usuario").Id)
		.success(function(data,status,header,config){
			$scope.Personas=[];
			for(var i=0;i<data.length;i++)
			{
			var tmp=JSON.parse(data[i])
			if(tmp.Subtitulo && tmp.Subtitulo.substring(0,2)==", ")tmp.Subtitulo=tmp.Subtitulo.substring(2);
			tmp.Subtitulo=cleanutf(tmp.Subtitulo);
			$scope.Personas.push(tmp);
			}
			window.localStorage.setArray("Notificaciones",$scope.Personas)
			})
			.finally(function() {
       			// Stop the ion-refresher from spinning
       			$scope.$broadcast('scroll.refreshComplete');
     		});
	}*/
		
})