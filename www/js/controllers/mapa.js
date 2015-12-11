angular.module('starter.controllers')
.controller('Mapa', function($scope,Mapa,uiGmapIsReady,$ionicHistory) {
	//variable que controla si se cargo el mapa en pantalla
	$scope.mapaCargado=false;
	//funcion que se ejecuta cuando el mapa se carga 
	uiGmapIsReady.promise().then(function(maps){
		//declara que el mapa se cargo
		$scope.mapaCargado=true;
		//limpia historial para evitar incompatibilidad con ios
		$ionicHistory.clearHistory();		
	})
})
//filtro que convierte la distancia en metros a km o metros con 2 decimales
.filter('distance', function () {
return function (input) {
    if (input >= 1000) {
        return (input/1000).toFixed(2) + ' km';
    } else {
        return input + ' m';
    }
}
})