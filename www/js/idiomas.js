angular.module('starter.controllers')
.controller('Idioma', function($scope,Message,$rootScope) {
  // Might use a resource here that returns a JSON array
	
  // Some fake testing data
  var idiomas = {
  	es:{
		General:{
			0:"Virtual Guardian",
			1:"Cargando...",
			2:"Aceptar",
			3:"Conexión a internet",
			4:"No hay conexión a internet.",
			5:"Actualizar",
			6:"Cancelar"
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
			10:"¿Desea cerrar su sesión?",
			11:"Alguien mas ha iniciado sesión con este usuario.<br>Inicie sesión de nuevo",
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
			24:"Enviar correo",
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
			1:"Radio: ",
			2:"Buscador de eventos",
			3:"Escribe para buscar lugares",
			4:"No hay resultados para",
			5:"Mostrar los eventos de los ultimos:",
			
			
		},
		Periodos:{
			7:"7 días",
			30:"30 días",
			180:"6 meses",
			365:"12 meses"
		},
		Filtros:{
			1:"Filtros de eventos",
			2:"Fechas",
			3:"Periodo",
			4:"Fecha inicial",
			5:"Fecha final",
			6:"Periodo",
			7:"Estados",
			8:"Eventos",
			9:"Seleccionar todo",
			10:"Borrar selección"
		},
		Asuntos:{
			1:"Asalto",
			2:"Balacera",
			3:"Ejecución",
			4:"Explosión",
			5:"Hallazgo",
			6:"Movilización",
			7:"Persecución",
			8:"bloqueo",
			9:"Robo",
			10:"Robo mercancía",
		},
		Info:{
			1:"Fecha: ",
			2:"Hora: ",
			3:"Dirección: ",
			4:"Error al cargar la información",
			5:"Escala Virtual",
			6:"10 es el valor mas seguro"
		},
		Menu:{
			1:"Suscripción",
			2:"Ajustes de cuenta",
			3:"Ajustes de notificaciones",
			4:"Iconos",
			5:"Ayuda",
			6:"Acerca de",
			7:"Cerrar sesión"
		},
		Notificaciones:{
			1:" en "
		},
		Auto:{
			1:"Arrastra el marcador hasta la ubicación donde estacionaste tu auto.",
			2:"Inicial vigilancia",
			3:"Análisis de seguridad",
			4:"Mi auto",
			5:"Detener vigilacia",
			6:"Editar ubicación",
			7:"Revisar la zona",
			8:"Analizando zona...",
			9:"No se pudo realizar el análisis de seguridad. <p>¿Deseas iniciar la vigilancia?</p>",
			10:"No hay eventos registrados en esta zona."
		},
		Estados:{
			1:"Aguascalientes",
			2:"Baja California",
			3:"Baja California Sur",
			4:"Campeche",
			5:"Coahuila",
			6:"Colima",
			7:"Chiapas",
			8:"Chihuahua",
			9:"Distrito Federal",
			10:"Durango",
			11:"Guanajuato",
			12:"Guerrero",
			13:"Hidalgo",
			14:"Jalisco",
			15:"México",
			16:"Michoacán",
			17:"Morelos",
			18:"Nayarit",
			19:"Nuevo León",
			20:"Oaxaca",
			21:"Puebla",
			22:"Querétaro",
			23:"Quintana Roo",
			24:"San Luis Potosí",
			25:"Sinaloa",
			26:"Sonora",
			27:"Tabasco",
			28:"Tamaulipas",
			29:"Tlaxcala",
			30:"Veracruz",
			31:"Yucatán",
			32:"Zacatecas"
		},
		Meses:{
			1:"Enero",
			2:"Febrero",
			3:"Marzo",
			4:"Abril",
			5:"Mayo",
			6:"Junio",
			7:"Julio",
			8:"Agosto",
			9:"Septiembre",
			10:"Octubre",
			11:"Noviembre",
			12:"Diciembre"
			
		},
		Semana:[
			"Domingo",
			"Lunes",
			"Martes",
			"Miercoles",
			"Jueves",
			"Viernes",
			"Sabado"
			
		]
		
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