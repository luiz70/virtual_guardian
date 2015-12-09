angular.module('starter.controllers')
.controller('Idioma', function($scope,Message,$rootScope) {
  // Might use a resource here that returns a JSON array
	
  // Some fake testing data
  var idiomas = {
  	es:{
		General:{
			1:"Cargando...",
			2:"Aceptar",
			3:"Conexión a internet",
			4:"No hay conexión a internet.",
			5:"Actualizar",
			6:"Cancelar",
		},
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
		},
		Registro:{
			1:"Registro",
			2:"Virtual Guardian no solicita información personal con el objetivo de brindarte la mayor protección y confidencialidad. Nuestro sistema de prevención de riesgos utiliza un algoritmo que no necesita información personal para funcionar.",
			3:"Correo Elecrónico",
			4:"Contraseña",
			5:"Repetir Contraseña",
			6:"Leer aviso de privacidad",
			7:"Continuar",
			8:"Regresar",
			9:"El código proporcionado no es válido.",
			10:"El correo electrónico proporcionado no es válido",
			11:"La contraseña debe de ser de 8 dígitos como mínimo y contener al menos un número y una letra.",
			12:"Las contraseñas no coinciden.",
			13:'Hemos enviado a tu correo electrónico un mensaje con el código de verificación, introdúcelo en el siguiente campo para completar tu registro. Revisa tu papelera de "correos no deseados".',
			14:"Código",
			15:"El correo electrónico ya esta registrado",
			16:"Se ha producido un error inesperado, intente más tarde",
			17:"El código proporcionado es incorrecto, verifica tu correo electrónico",
			18:"Enviar código de nuevo",
			19:"El código de verificación ha sido enviado nuevamente a tu correo electrónico",
			20:"Bienvenido a",
			21:"Terminar",
			22:"Ahora puedes iniciar sesión, mantenerte informado y protegido con nosotros.",
			23:"Proporciona tu correo electrónico registrado para enviarte un mensaje con las instrucciones necesarias para recuperar tu contraseña.",
			24:"Enviar correo de recuperación",
			25:"No has proporcionado tu correo electrónico.",
			26:"Recuperar contraseña",
			27:"El correo proporcionado no esta registrado en Virtual Guardian",
			28:"El correo de recuperación se ha enviado correctamente, sigue las instrucciones para reestablecer tu contraseña.",
			29:"Si tienes algún código de promocion, ingrésalo ahora para hacerlo válido.",
			30:"Código de promoción",
			31:"El código de promoción proporcionado ya se ha utilizado.",
			32:"Verificando código de promoción...",
			33:"Creando cuenta...",
			34:"Completando registro...",
			35:"El código proporcionado ha activado una suscripción TIPO por TIEMPO mes",
			36:"Tu registro ha caducado, es necesario que realices el registro de nuevo."
		},
		Mapa:{
			1:"Radio: "
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
  $rootScope.idioma=idiomas.es;
  if(navigator.globalization)
	navigator.globalization.getPreferredLanguage(function (language) {
			var l=language.value.split("-")
			//if(l[0]=="EN" || l[0]=="en" || l[0]=="En")$rootScope.idioma=idiomas.en;
   	})
	Message.setDictionary($rootScope.idioma);
	
})