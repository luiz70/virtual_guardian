angular.module('starter.controllers')
.controller('Idioma', function($scope) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var idiomas = {
  	es:{
		Login:{
			1:"Iniciar Sesión",
			2:"Correo electrónico",
			3:"Contraseña",
			4:"Entrar",
			5:"Crear cuenta nueva",
			6:"¿Olvidaste tu contraseña?",
			7:"El correo electrónico y la contraseña que ingresaste no coinciden con nuestros registros.\nPor favor, revisa e inténtalo de nuevo.",
			8:"Iniciando sesión...",
			9:"Cerrando sesión...",
			10:"¿Desea cerrar su sesión?"
		}
	},
	en:{
		Login:{
			1:"Sign In",
			2:"Email",
			3:"Password",
			4:"Sign In",
			5:"Create new account",
			6:"Forgot your password?",
			7:"E-mail or password are incorrect.\nPlease check and try again.",
			8:"Logging...",
			9:"Signing off...",
			10:"Do you want to log out?"
		}
	}
  }
  $scope.idioma=idiomas.es;
  if(navigator.globalization)
	navigator.globalization.getPreferredLanguage(function (language) {
			var l=language.value.split("-")
			//if(l[0]=="EN" || l[0]=="en" || l[0]=="En")$scope.idioma=idiomas.en;
   	})
	
	
})