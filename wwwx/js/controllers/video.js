angular.module('starter')
.controller("video",function($scope,$timeout){
	$scope.video={currentTime:0};
	$timeout(function(){
	$scope.video=document.getElementById("videoTutorial");
             $("#videoTutorial").css("opacity",1);
	},500);
	$scope.isPlay=true;
	$scope.play=function(){
		$scope.isPlay=true;
		
		$scope.video.play();
	}
            $scope.playPause=function(){
            if($scope.isPlay)$scope.pause()
            else $scope.play()
            }
	$scope.pause=function(){
		$scope.isPlay=false;
		$scope.video.pause();
	}
	$scope.replay=function(){
		 $scope.video.currentTime = 0;
		 $scope.play();
	}
});