angular.module('starter.services')
.factory('Cluster',function($rootScope,uiGmapGoogleMapApi){
	
	uiGmapGoogleMapApi.then(function(maps) {
		$rootScope.map.cluster={
			styles:[
				  {
					textColor: '#EAEAEA',
					url: 'img/iconos/mapa/marcadores/g1.png',
					height: 51,
					width: 40,
					textSize:20
				  },
				 {
					textColor: '#232323',
					url: 'img/iconos/mapa/marcadores/g2.png',
					height: 51,
					width: 40,
					textSize:20
				  },
				 {
					textColor: '#EAEAEA',
					url: 'img/iconos/mapa/marcadores/g3.png',
					height: 51,
					width: 40,
					textSize:20
				  }
				],
			maxZoom:10,
			minimumClusterSize:10,
		}
		$rootScope.map.cluster.events={
			click: function(cluster, clusterModels){
			},
			mouseout: function(cluster, clusterModels){
			//cluster.setMinimumClusterSize(10);
			},
  			mouseover: function(cluster, clusterModels){
				
			} 
		}
	})
	return {
		func:function(){
			return 1;
		}
	}
})