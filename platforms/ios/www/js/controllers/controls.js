angular.module('starter.controllers')
.controller('controls',function($scope,$rootScope,Mapa,uiGmapIsReady,$timeout,Ubicacion,Message,socket,Lugar,$animate){
	$scope.map=$rootScope.map;
	$scope.ubicacion=$rootScope.ubicacion;
	$scope.radio=$rootScope.radio;
	$scope.auto=$rootScope.auto;
	$scope.idioma=$rootScope.idioma
	$rootScope.controls=[
		{nombre:"buscar",
			id:1,
			activo:false,
			activable:true,
			content:"",
			label:$rootScope.idioma.Mapa[7],
			onClick:function(){
				$rootScope.controls[0].activo=false;
				Lugar.hide();
				$rootScope.search=true;
			},
		},
		{nombre:"ubicacion",
			id:2,
			activo:false,
			activable:true,
			content:"",
			label:$rootScope.idioma.Mapa[8],
			onClick:function(){
				$scope.refreshLocation();
			},
		},
		{nombre:"auto",
			id:3,
			activo:(true && $rootScope.auto.activo),
			activable:true,
			posicionando:false,
			content:"",
			label:$rootScope.idioma.Mapa[9],
			onClick:function(){
			$scope.carPark();
			},
		},
		{nombre:"filtro",
			id:4,
			activo:(true && $rootScope.filtros.activos),
			activable:true,
			content:"",
			label:$rootScope.idioma.Mapa[10],
			onClick:function(){
			Message.showModal("screens/modal/filtros.html");
			},
		},
		{nombre:"periodo",
			id:5,
			activo:false,
			activable:false,
			label:$rootScope.idioma.Mapa[11],
			content:"<div class='letra-periodo'>{{$rootScope.Usuario.Periodo}}</div>",
			onClick:function(){
				var buttons=[]
				buttons.push({text:$rootScope.idioma.Periodos[7],valor:7})
				buttons.push({text:$rootScope.idioma.Periodos[30],valor:30})
				buttons.push({text:$rootScope.idioma.Periodos[180],valor:180})
				buttons.push({text:$rootScope.idioma.Periodos[365],valor:365})
				
				Message.showActionSheet($rootScope.idioma.Mapa[5],buttons,null,$rootScope.idioma.General[6],function(res,data){
					$rootScope.eventosMap=[];
					if(data){
						$rootScope.Usuario.Periodo=data.valor;
						if(socket.isConnected()){
							socket.getSocket().emit("setPeriodo",$rootScope.Usuario.Periodo);
						}
					}
				})
			},
		},
	]
	$scope.controls=$rootScope.controls;
	$scope.controlClick=function(i){
		//if($scope.controls[i].activable)$scope.controls[i].activo=!$scope.controls[i].activo
		$rootScope.controls[i].onClick()
		
	}
	uiGmapIsReady.promise()
	.then(function(maps){
		$scope.mapa=$rootScope.map;
		angular.element(angular.element(document.getElementsByClassName("gm-style")[0]).children()[0]).on("touch",$scope.hideControls)
		$scope.showControls();
	})
	$scope.showControls=function(){
		
		$animate.removeClass(document.getElementsByClassName("more")[0],'show-more')
		$animate.addClass(document.getElementsByClassName("more")[0],'hide-more')
		$animate.removeClass(document.getElementsByClassName("dead-items")[0],'hide-options')
		$animate.addClass(document.getElementsByClassName("dead-items")[0],'show-options')
		/*var deads=document.getElementsByClassName("dead")
		
		for(var i=0;i<deads.length;i++){
		$animate.removeClass(deads[i],'hide-options')
		$animate.addClass(deads[i],'show-options')
		
		}*/
		$timeout(function(){
			
			angular.element(document.getElementsByClassName("more")[0]).addClass("ng-hide")
			var labs=document.getElementsByClassName("boton-mapa-top-right-label")
			for(var i=0;i<labs.length;i++){
				angular.element(labs[i]).css("display","block")
				$animate.removeClass(labs[i],'hide-info-label')
				$animate.addClass(labs[i],'show-info-label')
			}
		},500)
		if($scope.hidelabel)$timeout.cancel($scope.hidelabel)
		/*$scope.hidelabel=$timeout(function(){
			$animate.addClass(document.getElementsByClassName("dead-items")[0],'no-label')
			try{$scope.$digest();}catch(err){}
		},4000);*/
		try{$scope.$digest();}catch(err){}
		
	}
	$scope.hideControls=function(){
		angular.element(document.getElementsByClassName("more")[0]).removeClass("ng-hide")
		$animate.addClass(document.getElementsByClassName("more")[0],'show-more')
		$animate.removeClass(document.getElementsByClassName("more")[0],'hide-more')
		$animate.removeClass(document.getElementsByClassName("dead-items")[0],'show-options')
		$animate.addClass(document.getElementsByClassName("dead-items")[0],'hide-options')
		
		//$timeout(function(){angular.element(document.getElementsByClassName("dead-items")[0]).removeClass('no-label')},600)
		$timeout(function(){angular.element(document.getElementsByClassName("dead-items")[0]).addClass('no-label')},600)
		try{$scope.$digest();}catch(err){}
		
	}
	$scope.refreshLocation=function(){
		$rootScope.eventosMap=[];
		Ubicacion.refreshLocation();
		
	}
	$scope.carPark=function(){
		if(!$scope.auto.activo){
			
			$scope.auto.posicionando=true;
			
			
		}else{
			var buttons=[{text:$rootScope.idioma.Auto[5],id:1},{text:$rootScope.idioma.Auto[6],id:2},{text:$rootScope.idioma.Auto[7],id:3}]
			Message.showActionSheet($rootScope.idioma.Auto[4],buttons,null,$rootScope.idioma.General[6],function(res,data){
				if(data)
				switch(data.id){
					case 1:
						$rootScope.auto.options.visible=false;
						$rootScope.auto.options.draggable=true;
						$rootScope.auto.activo=false;
						$rootScope.controls[2].activo=false;
					break;
					case 2:
						$rootScope.auto.posicionando=true;
					break;
					case 3: 
						$rootScope.map.zoom=16;
						$rootScope.map.center={latitude:$rootScope.auto.position.latitude,longitude:$rootScope.auto.position.longitude}
					break;
				}
			})
		}
	}
	$scope.setAuto=function(){
		Message.showLoading($rootScope.idioma.Auto[8]);
		if(socket.isConnected()){
			socket.getSocket().removeListener("getAnalisisAuto",$scope.getAnalisis)
			socket.getSocket().removeListener("errorAnalisisAuto",$scope.errorAnalisis)
			socket.getSocket().on("errorAnalisisAuto",$scope.errorAnalisis)
			socket.getSocket().on("getAnalisisAuto",$scope.getAnalisis)
			socket.getSocket().emit("getAnalisisAuto",$rootScope.auto.position)
		}else{
			$scope.errorAnalisis();
		}
		//Message.showModal("templates/modal/resumen-auto.html");
	}
	$scope.getAnalisis=function(escala,eventos){
		socket.getSocket().removeListener("getAnalisisAuto",$scope.getAnalisis)
		Message.hideLoading();
		$rootScope.auto.escala=escala;
		$rootScope.auto.eventos=eventos;
		Message.showModal("screens/modal/resumen-auto.html");
	}
	$scope.errorAnalisis=function(data){
		socket.getSocket().removeListener("errorAnalisisAuto",$scope.errorAnalisis)
		Message.hideLoading();
		Message.confirm($rootScope.idioma.Auto[3],$rootScope.idioma.Auto[9],function(res){
			$rootScope.auto.posicionando=false;
			$rootScope.auto.activo=true;
			$rootScope.controls[2].activo=true;
		})
	}
	$scope.cancelarAuto=function(){
		$rootScope.auto.posicionando=false;
		$rootScope.auto.activo=false;
		$rootScope.auto.options.visible=false;
		$rootScope.auto.options.draggable=true;
		$rootScope.controls[2].activo=false;
	}
	$scope.actualizaAuto=function(){
		Ubicacion.stopPosition();
		navigator.geolocation.getCurrentPosition($scope.mapSuccessAuto, $scope.mapError,{enableHighAccuracy: true,timeout:15000 });
	}
	$scope.mapSuccessAuto=function(position){
		$rootScope.auto.position={latitude:position.coords.latitude,longitude:position.coords.longitude}
		Ubicacion.startPosition();
	}
	$scope.mapError=function(error){
		Ubicacion.startPosition();
	}
	
})
.controller('top-center',function($scope,$rootScope,Mapa,uiGmapIsReady,$timeout){
	$scope.auto=$rootScope.auto
	$scope.idioma=$rootScope.idioma;
	$scope.map=$rootScope.map;
})
.controller('bottom-center',function($scope,$rootScope,uiGmapIsReady,$timeout,$animate,Eventos){//,Radio
	//define el diccionario
	$scope.idioma=$rootScope.idioma;
	//importa la configuracion del radio
	$scope.radio=$rootScope.radio
	$scope.auto=$rootScope.auto;
	//funcion que se ejecuta cuando se cargo el mapa para inicializar el touch event
	uiGmapIsReady.promise().then(function(maps){
		//activa el touch event en el mapa para ocultar la barra
		angular.element(angular.element(document.getElementsByClassName("gm-style")[0]).children()[0]).on("touch",$scope.hideBarra)
		angular.element(document.getElementsByClassName("contenedor-mapa-pie")[0]).on("touch",$scope.showBarra)
		
	})
	//function para mejorar el movimiento de el range de radio
	$scope.onTap = function(e) {
      if(ionic.Platform.isIOS()) {
        $scope.barProgress = (e.target.max / e.target.offsetWidth)*(e.gesture.touches[0].screenX - e.target.offsetLeft);
      }
    };
	//funcion que se ejecuta cuando se inicia el cambio en valor numerico de rango
		$scope.iniciaCambio=function(){
			//Eventos.hideAll();
		}
		//function que se ejecuta cuando se termina el cambio en valor de rango
		$scope.terminaCambio=function(){
			$timeout(function(){
				$rootScope.radio.visible=false;
				$rootScope.radio.visible=true;
			},200)
			//Eventos.showHide();
			try{Eventos.refresh();}catch(err){}
		}
	//funcion que oculta la barra de radio
	$scope.hideBarra=function(){
		//activa el touch event en la barra para mostrarla
		//angular.element(document.getElementsByClassName("contenedor-mapa-pie")[0]).on("touch",$scope.showBarra)
		//desactiva el touch event en el mapa para ocultar la barra
		//angular.element(angular.element(document.getElementsByClassName("gm-style")[0]).children()[0]).off("touch",$scope.hideBarra)
		
		$animate.removeClass(document.getElementsByClassName("contenedor-mapa-bottom-center")[0],'show-barra')
		$animate.addClass(document.getElementsByClassName("contenedor-mapa-bottom-center")[0],'hide-barra')
		$scope.$digest();
	}
	//function que muestra la barra de radio
	$scope.showBarra=function(){
		//angular.element(angular.element(document.getElementsByClassName("gm-style")[0]).children()[0]).on("touch",$scope.hideBarra)
		//angular.element(document.getElementsByClassName("contenedor-mapa-pie")[0]).off("touch",$scope.showBarra)
		 
		$animate.removeClass(document.getElementsByClassName("contenedor-mapa-bottom-center")[0],'hide-barra')
		$animate.addClass(document.getElementsByClassName("contenedor-mapa-bottom-center")[0],'show-barra')
		$scope.$digest();
	}
})
