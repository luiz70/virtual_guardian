angular.module('starter.services')
.factory('Cluster',function($rootScope,uiGmapGoogleMapApi){
	var inicializa=function(){
		$rootScope.cluster={
			styles:[
				  {
					textColor: '#EAEAEA',
					url: 'img/iconos/mapa/marcadores/g1.png',
					height: 51,
					width: 40,
					textSize:20,
					clusterClass:"cluster"
				  },
				 {
					textColor: '#232323',
					url: 'img/iconos/mapa/marcadores/g2.png',
					height: 51,
					width: 40,
					textSize:20,
					clusterClass:"cluster"
				  },
				 {
					textColor: '#EAEAEA',
					url: 'img/iconos/mapa/marcadores/g3.png',
					height: 51,
					width: 40,
					textSize:20,
					clusterClass:"cluster"
				  }
				],
			maxZoom:14,
			minimumClusterSize:25,
			averageCenter:true,
			printable:true,
		}
		$rootScope.cluster.events={
			click: function(cluster, clusterModels){
			},
			mouseout: function(cluster, clusterModels){
			//cluster.setMinimumClusterSize(10);
			},
  			mouseover: function(cluster, clusterModels){
				
			} 
		}
	}
	uiGmapGoogleMapApi.then(function(maps) {
	})
	return {
		inicializa:function(){
			inicializa();
		}
	}
})