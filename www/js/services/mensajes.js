angular.module('starter.services')
.factory('Message', function(localStorageService,$ionicLoading,$ionicPopup,$cordovaToast,$ionicActionSheet,$ionicModal,$rootScope,$timeout) {
	var dictionary=null
	var alertPopUp=null;
	var confirmPopUp=null;
	var options=null;
	var modal=null;
	return {
		setDictionary:function(dictionary){
			this.dictionary=dictionary
		},
		showLoading: function(texto){
			$ionicLoading.show({
      			template: '<div style="width:100%"><ion-spinner icon="android" class="spinner-dark"></ion-spinner></div>'+texto
   			});
		},
		hideLoading:function(){
			$ionicLoading.hide();
		},
         toast:function(msg){
         $cordovaToast.showShortBottom(msg);
         },
		alert:function(titulo,texto,funcion){
			if(alertPopUp)alertPopUp.close();
			alertPopUp = $ionicPopup.alert({
     			title: titulo,
     			template: texto,
				okText: this.dictionary.General[2]
   			});
   			alertPopUp.then(function(res) {
     			funcion();
   			});
		},
		confirm:function(titulo,texto,funcion,btn1,btn2,closable,callback){
			if(confirmPopUp)confirmPopUp.close();
			callback=callback || false
			btn1 = btn1 || this.dictionary.General[2];
    		btn2 = btn2 || this.dictionary.General[6];
			closable=closable||function(){return true};
			confirmPopUp = $ionicPopup.confirm({
     			title: titulo,
     			template: "<div>"+texto+"</div>"+
				'<div id="botones_confirm"></div>',
				buttons: [{ 
    				text: btn2,
    				type: 'button-default',
    				onTap: function(){
					  return 0;
					}
  				},{
    				text: btn1,
    				type: 'button-positive',
    				onTap: function(){
						return 1;
					}
  				}]
   			});
			if(!closable())$timeout(function(){
				$(".popup-buttons").addClass("ng-hide");
				$(".popup-visible").removeClass("ng-hide");
			},10);
			confirmPopUp.then(function(res) {
			if(res) {
				confirmPopUp.close();
				funcion(res);
			} else {
				if(callback)funcion(res);
				confirmPopUp.close();
			}
		})
		},
		showActionSheet:function(title,buttons,destructive,cancel,result){
			var settings={
     			buttons: buttons,
				 buttonClicked: function(index) {
				   result(index,buttons[index])
				   options();
				 },
				 cancel:function(){
					 result(-1,null)
				 }
   			}
			if(cancel)settings.cancelText=cancel
			if(title)settings.titleText=title
			if(destructive){
				settings.destructiveText=destructive.text
				settings.destructiveButtonClicked=function(){
					options();
					destructive.funcion(destructive)
				}
			}
			 options = $ionicActionSheet.show(settings);
		},
		showModal:function(template){
			 $ionicModal.fromTemplateUrl(template, {
				scope: $rootScope,
				animation: 'slide-in-up',
				hardwareBackButtonClose:false
			  }).then(function(mod) {
    			modal = mod;
				modal.show();
  			});
			  
		},
		hideModal:function(){
			if(modal){
				modal.hide();
				modal.remove();
			}
		}
	}

})