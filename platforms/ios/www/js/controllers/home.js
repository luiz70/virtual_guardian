angular.module('starter.controllers')
.controller('Home', function($scope,$timeout,$ionicSideMenuDelegate,$state,socket,$rootScope) {
	$scope.menuWidth=window.innerWidth*0.85;
	$scope.menuAbierto=false;
	$scope.seccion=1;
	$scope.menuOpen=false
	$scope.$watch(function () {
    	return $ionicSideMenuDelegate.isOpenLeft();
  	},
     function (isOpen) {
    if (isOpen){
		$("disable-screen").addClass('display');
		$scope.menuOpen=true
	}else {
		$("disable-screen").removeClass('display');
		$scope.menuOpen=false
	}
  });
	$scope.isCover=function(){
		return $ionicSideMenuDelegate.isOpen()
	}
	$scope.$on('$ionicView.beforeEnter',function(){
		$scope.seccion=$state.current.id;
	})
	$scope.$on('$ionicView.enter',function(){
        if(navigator.splashscreen)navigator.splashscreen.hide();
		$(".animate-enter-up").animate({
			top:0,
			opacity:1
		},500);
		
	})
})