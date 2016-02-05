angular.module('starter.services')
.factory('Message', function(localStorageService,$ionicLoading,$ionicPopup,$cordovaToast,$ionicActionSheet,$ionicModal,$rootScope,$timeout) {
	var dictionary=null
	var alertPopUp=null;
	var confirmPopUp=null;
	var promptPopUp=null
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
				okText: this.dictionary.General[2],
				okType:"button",
   			});
   			alertPopUp.then(function(res) {
     			funcion();
   			});
		},
		prompt:function(titulo,texto,funcion,tipo,placeholder){
			tipo=tipo || "text";
			placeholder=placeholder || "";
			if(promptPopUp)promptPopUp.close();
			promptPopUp=$ionicPopup.prompt({
   				title: titulo,
   				template: texto,
   				inputType: tipo,
				cancelText:this.dictionary.General[6],
				cancelType:"button-default",
				okText:this.dictionary.General[2],
				okType:"button",
   				inputPlaceholder: placeholder
 			})
			promptPopUp.then(function(res) {
				if(!_.isUndefined(res))funcion(res);
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
    				type: "button",
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
		showModal:function(template,direction){
			var direction=direction || ''
			switch(direction){
				case 'left':direction='slide-in-left'
				break;
				case 'right': direction='slide-in-right'
				break;
				case 'up': direction='slide-in-down'
				break;
				default: direction='slide-in-up'
				break
			}
			 $ionicModal.fromTemplateUrl(template, {
				scope: $rootScope,
				animation: direction,
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