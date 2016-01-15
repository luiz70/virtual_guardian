angular.module('starter.services')
.factory('Verificacion',function($http){
	var re = /[0-9]/;
	var re2 = /[a-z]/;
	var re3 = /[A-Z]/;
	var remail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	
	return {
		password:function(pass,length){
			if(pass.lenght<length)return false;
			else if(!re.test(pass))return false;
			else if(!re2.test(pass) && !re3.test(pass))return false;
			else return true;
		},
		email:function(email){
    		return remail.test(email);
		},
		promocion:function(promo){
			return $http({method: 'Post', url: 'https://www.virtual-guardian.com:3200/promocion', data: {Promocion:promo}})
		}
	}
})