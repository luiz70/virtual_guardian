angular.module('starter')
.controller("general",function($scope,$ionicLoading,$rootScope,$ionicPlatform,$ionicPopup,$ionicPopover,$ionicModal,$timeout,$cordovaToast){
	$scope.Diccionario={
		es:
			{
				general:{
					1:"Cargando...",
					2:"Aceptar",
					3:"Conexión a internet",
					4:"No hay conexión a internet.",
					5:"Actualizar",
					6:"Cancelar",
					7:"Actualización de historial",
					8:"<div style='font-size:2vh'>Para minimizar el consumo de datos móviles necesitamos descargar el historial de eventos desde una conexión WiFi. Esta operación puede tardar unos minutos.</div>¿Desea hacerlo en este momento?",
					9:"Actualizando...",
					10:"Su tranquilidad, nuestro territorio",
					11:"Suscripción",
					12:"Su período de prueba ha finalizado, pero aún puede seguir utilizando Virtual Guardian en la versión limitada o contratar alguno de nuestros paquetes completos.",
					13:"!Suscribirme!",
					14:"Continuar limitado",
					15:"Ver más...",
					16:"Selecciona",
					17:"Activados",
					18:"Desactivados",
					19:"Desactivar",
					20:"Activar",
					21:"Activadas",
					22:"Desactivadas",
					23:"Virtual Guardian",
					24:"Alguien mas ha iniciado sesión con este usuario.<br>Inicie sesión de nuevo",
					25:"Virtual Guardian es una marca comercial de Virtualapp S.A. de C.V. Todos los derechos reservados.",
					26:"Virtual Guardian para dispositivos móviles fue creado con software de licencia abierta.",
					27:"Versión ",
					28:"Configuración GPS",
					29:"El servicio de localización no está disponible en este momento, intente más tarde.",
                    30:"Para resolver todas tus dudas sobre el uso de la aplicación hemos creado un recorrido por todas las funciones que virtual guardian te ofrece",
                    31:"¿Deseas verlo?",
                    32:"¿Quieres ver el recorrido de las funciones de la aplicación?",
					33:"Guardando...",
34:"La suscripción gratuita no permite modificar estas propiedades, adquiere una suscripcion completa en este momento y aprovecha al máximo Virtual Guardian.",
35:"La suscripción gratuita no permite utilizar esta herramienta, adquiere una suscripcion completa en este momento y aprovecha al máximo Virtual Guardian.",
36:"Salir",
37:"Virtualapp S.A. de C.V.",
38:"Cerrar",
39:"Virtual Guardian nunca guardará tu ubicación GPS, nuestros algoritmos de prevención de riesgos están creados para que solo tu teléfono conozca tu ubicación y esta nunca se envíe por internet a nuestros servidores o a otros usuarios, así que despreocúpate, nuestro objetivo es que estés protegido."
					
				},
				mapa:{
					1:"Fecha:",
					2:"Hora:",
					3:"Dirección:",
                    4:"¡Ubicación actualizada!",
                    5:"¡Eventos actualizados!",
					6:"Escribe para buscar lugares",
					7:'No hay resultados para "',
					8:'Buscador de lugares',
                    9:"¡Fuera de zona de cobertura!"
				},
				llamada:{
					1:"LLAMADA ENTRANTE",
					2:"LLAMADA SALIENTE",
					3:"Esperando respuesta...",
					4:"...",
					5:"Error en la llamada",
					6:"Llamada",
					7:"No se pudo contactar a ",
					8:"Llamada terminada",
					9:"Se ha terminado la llamada.",
					10:"Conectando llamada...",
                    11:" ha terminado la llamada.",
                    12:"Usuario no disponible.",
                    13:" esta ocupado."
					},
				cuenta:{
					1:"Usuario",
					2:"Tipo de suscripción",
					3:"Cambiar contraseña",
					4:"Conseguir versión completa",
					5:"Versión completa",
					6:"La versión completa te permitirá hacer uso ilimitado de Virtual Guardian con la posibilidad de realizar filtros de eventos anteriores a 7 días y recibir notificaciones cuando tu auto corra peligro. ¡Recibe la mejor información y protégete al máximo!",
					7:"Nueva contraseña",
					8:"Escriba su nueva contraseña",
					9:"Su contraseña se ha cambiado correctamente.",
					10:"Inicio suscripción",
					11:"Vigencia suscripción",
					12:"Ajustes de cuenta",
					13:"Código",
					14:"Comparte a tus amigos este código y gana un mes de suscripción completa por cada usuario que se registre.",
					15:"Comprar suscripción",
					16:"Comprar",
            17:"Suscripción",
            18:"Esta cuenta de NOMBRE ya tiene una suscripcion SUSCRIPCION y no corresponde a este usuario de Virtual Guardian. <span>Cambia de CUENTA e intenta de nuevo.</span>",
			19:"Modificar Suscripción",
            20:"Error al conectar con NOMBRE Store, no se realizo ningún cargo, revisa tu conexión a internet e intenta de nuevo.",
            21:"Tu compra se ha realizado exitosamente.",
            22:"Tu suscripción fue comprada desde la tienda de TIENDA. Para modificar tu suscripcion es necesario que ingreses desde un telefono NOMBRE.",
            23:"Suscripción de cortesía.",
            24:"Se ha producido un error al conectarse con la tienda de TIENDA, intente más tarde.",
            25:"Verificando CUENTA",
            26:"Prueba gratuita de 30 días.",
            27:"Ya cuentas con una suscripción, para adquirir una diferente necesitas cancelar tu suscripción actual.",
			28:"Cuentas vinculadas",
			29:"Agregar cuenta",
			30:"Al agregar un usuario, este recibira una invitación para vincularse a tu suscripción.",
			31:"Vincular usuario",
					32:"Introduce el correo electrónico del usuario que deseas agregar a tu Suscripción Familiar",
					33:"No puedes agregar tu propia cuenta",
					34:" se ha vinculado correctamente a tu suscripción.",
					35:" no es miembro de Virtual Guardian.",
					36:" no tiene una cuenta gratuita, debe cancelar sus sucripción actual para ser vinculado.",
					37:"El correo electrónico es obligatorio.",
					38:"Invitaciones",
					39:"Selecciona para aceptar o cancelar",
					40:"Eliminar",
					41:"Invitación de ",
					42:"Cancelar suscripción",
					43:"Da click para abandonar la suscripción familiar a la que te han agregado.",
					44:"Abandonar Suscripción",
					45:"Al abandonar la suscripción volveras a la version limitada y el resto de los miembros seguiran recibiendo los beneficios.",
					46:" ya esta vinculado en tu suscripción.",
					47:"¿Deseas eliminar de tu suscripción a ",
					48:"Este cambio se vera reflejado en 30 días.",
					49:"Esta cuenta ya ha sido eliminada anteriormente, es necesario esperar para verlo reflejado.",
					
					
					
					},
				menu:{
				1:"Filtros",
				2:"Ajustes de aplicación",
				3:"Ajustes de notificaciones",
				4:"Acerca de",
				5:"Términos y condiciones",
				6:"Cerrar sesión",
				7:"Fecha inicial:",
				8:"Fecha final:",
				9:"Estados:",
				10:"Tipos de eventos:",
				11:"Periodo:"	,
				12:"Radio:",
				13:"Eventos:",
				14:"Personas:",
				15:"Auto:",
				16:"Radio personas:",
				17:"Radio auto:",
				18:"Radio personal:",
				19:"Proporciona el radio predefinido en metros para búsqueda de eventos en el mapa. 10m-16,000m",
				20:"El radio proporcionado no es válido, proporciona un valor entre 10 y 16,000 metros.",
				21:"Cuando algo suceda cerca de ti te notificaremos, proporciona la distancia máxima a la que consideras que corres peligro. 10m-5,000m",
				22:"El radio proporcionado no es válido, proporciona un valor entre 10 y 5,000 metros.",
				23:"Cuando algo suceda cerca de tu auto te notificaremos, proporciona la distancia máxima a la que consideras corre peligro. 10m-5,000m",
				24:"Tiempo:",
				25:"Cuando algo suceda dentro de los últimos minutos te notificaremos, proporciona el tiempo máximo en el que consideras que el evento es relevante. 10-180 min.",
				26:"El tiempo no es válido, proporciona un valor entre 10 y 180 minutos.",
                27:"Ayuda",
            28:"Mi cuenta",
            29:"Seleccionar todo",
            30:"Borrar selección",
			31:"Iconos",
			32:"Aviso de privacidad",
			33:"Versión: "
				},
				iconos:[
				{Nombre:"Asalto",
				Descripcion:"Ataque con violencia (arma de fuego y/o arma blanca) a una o varias personas así como a establecimiento.",
				Imagen:"1"
				},
				{Nombre:"Balacera",
				Descripcion:"Intercambio de detonaciones de arma de fuego en contra de una o varias personas, o a establecimiento.",
				Imagen:"2"
				},
				{Nombre:"Ejecución",
				Descripcion:"Situación en la que le quitan la vida a una o varias personas, con arma de fuego o arma blanca.",
				Imagen:"3"
				},
				{Nombre:"Explosión",
				Descripcion:"Detonación de artefacto explosivo.",
				Imagen:"4"
				},
				{Nombre:"Hallazgo",
				Descripcion:"Descubrimiento de uno o varios cuerpos sin vida.",
				Imagen:"5"
				},
				{Nombre:"Movilización",
				Descripcion:"Movimiento de elementos de seguridad tras sucesos delictivoso.",
				Imagen:"6"
				},
				{Nombre:"Persecución",
				Descripcion:"Acto de perseguir a delincuentes tras hecho delictivo.",
				Imagen:"7"
				},
				{Nombre:"Robo",
				Descripcion:"Robo a establecimientos (casa, restaurantes, locales, etc) en donde no hubo violencia y no existen testigos de los hechos.",
				Imagen:"8"
				},
				{Nombre:"Robo mercancía",
				Descripcion:"Robo a vehículo que transporta mercancía en donde no hubo violencia y no existen testigos de los hechos.",
				Imagen:"9"
				},
				{Nombre:"Tips Virtual Guardian",
				Descripcion:"Icono utilizado para representar los consejos que Virtual Guardian te enviará para ayudarte a estar siempre protegido.",
				Imagen:"img"
				},
				{Nombre:"Alerta personal",
				Descripcion:"El evento notificado está cerca de ti, toma tus precauciones para evitar el peligro.",
				Imagen:"ap"
				},
				{Nombre:"Alerta personas",
				Descripcion:"El evento notificado está cerca de una de tus personas, asegúrate que se encuentre bien.",
				Imagen:"aps"
				},
				{Nombre:"Alera auto",
				Descripcion:"El evento notificado está cerca de tu auto, toma tus precauciones para evitar el peligro.",
				Imagen:"aa"
				},
				{Nombre:"Solicitud de personas",
				Descripcion:"Un usuario de Virtual Guardian te ha enviado o ha aceptado una solicitud de personas.",
				Imagen:"sp"
				},
				{Nombre:"Mapa",
				Descripcion:"Sección principal de la aplicación que te muestra el mapa de México con los eventos reportados.",
				Imagen:"map"
				},
				{Nombre:"Notificaciónes",
				Descripcion:"Sección de la aplicación que te permite revisar tus notificaciones recientes.",
				Imagen:"tasks"
				},
				{Nombre:"Personas",
				Descripcion:"Sección de la aplicación que te permite revisar tu lista de personas, agregar usuarios o llamar por internet.",
				Imagen:"people"
				},
				{Nombre:"Auto",
				Descripcion:"Sección de la aplicación que te permite ubicar tu auto y estar informado si algo sucede cerca de él.",
				Imagen:"car"
				},
				{Nombre:"Menú",
				Descripcion:"En el encontraras opciones para personalizar tu cuenta y revisar tu suscripción.",
				Imagen:"menu"
				},
				{Nombre:"Ubicación",
				Descripcion:"Este icono representa tu ubicación actual en el mapa.",
				Imagen:"ubicacion"
				},
				{Nombre:"Buscar Lugares",
				Descripcion:"Para buscar lugares comerciales en el mapa y revisar sus alrededores utiliza esta herramienta.",
				Imagen:"rb"
				},
				{Nombre:"Actualizar ubicación",
				Descripcion:"Para ajustar el mapa en tu ubicación actual, da clic en este icono.",
				Imagen:"rgps"
				},
				{Nombre:"Actualizar eventos",
				Descripcion:"Utiliza este botón para revisar si se han reportado eventos nuevos o actualizar la información del mapa.",
				Imagen:"rr"
				}
				],
				recorrido:{
					1:"¡Bienvenido!",
					2:"Te daremos un paseo por las secciones de la aplicación para que aproveches al máximo sus funciones.",
					3:"Comenzar",
					4:"Saltar",
					5:'Para ver en otro momento selecciona la opción "Ayuda" del menú lateral.',
					6:'Mi ubicación',
					7:"En tu pantalla principal, te mostraremos un mapa con un punto azul representando tu ubicación y la zona que se está escaneando, puedes mover el punto azul a otra zona para analizar otra región. Cuando el punto no se encuentre en tu ubicación actual, este cambiara a color gris.",
					8:"Radio personal",
					9:"El circulo azul alrededor de tu posición es el 'Radio de búsqueda' este te permite filtrar los eventos que pasen en una zona en específico, se puede modificar en la barra de radio que está en la parte inferior, para mostrarla completamente es necesario tocarla.",
					10:"Una vez mostrada la barra podemos utilizar el ajustador de radio para seleccionar el tamaño que necesitemos.",
					11:"Mueve la ubicación para continuar.",
					12:"Ajusta el radio para continuar.",
					13:"Ahora desactiva y activa el radio.",
					14:"Para activar o desactivar el radio solo es necesario dar click en el círculo naranja que se encuentra en la barra de radio.",
					15:"Actualizar mapa",
					16:"Actualizar posición",
					17:"Actualizar eventos",
					18:"Para reducir el consumo de datos móviles la aplicación no actualiza frecuentemente tu ubicación, esta opción te permitirá actualizarla cuando tu desees para solo utilizar el internet cuando tú lo decidas.",
					19:"La aplicación tampoco realiza búsquedas frecuentes de los eventos, esta opción te permitirá tener siempre los eventos actualizados.",
					20:"Actualiza tu ubicación.",
					21:"Actualiza los eventos.",
					22:"Notificaciones",
					23:"En esta sección podrás revisar todas las notificaciones que recibas para que siempre estés enterado de lo que pasa en tu país.",
					24:"Tipos de notificaciones:",
					25:'Eventos: Este tipo de notificaciones se representan por diferentes iconos que indican el asunto del evento, nos informan de situaciones de peligro que suceden en nuestras zonas de interés.',
					26:"Tips: Los tips son mensajes que te enviaremos para ayudarte a protegerte en tus actividades del día a día",
					27:'Alerta personal: Cuando un evento suceda cerca de ti, te lo notificaremos con este símbolo para que tomes precaución y no te expongas al peligro.',
					28:'Alerta auto: Cuando tu auto este en modo de vigilancia y un evento suceda cerca de él, te notificaremos para ayudarte a protegerlo.',
					29:'Alerta personas: Siempre que un evento suceda cerca de alguien que esté en tu lista de personas te notificaremos para ayudarte a cuidarlo.',
					30:"Personas: Este tipo de notificaciones te informaran cuando alguien te envíe o acepte una solicitud de personas.",
					31:"Personas",
					32:"En esta sección podrás agregar, aceptar o eliminar personas de tu lista, todas las personas que estén aquí recibirán notificaciones cuando algún evento de peligro suceda cerca de ti, de igual manera recibirás notificaciones de 'Alerta de personas' cuando algo suceda cerca de ellos. ",
					33:"Esta herramienta solo informa una distancia aproximada entre la persona y el evento mas no envía la ubicación exacta para proteger la privacidad.",
					34:"Para poder agregar una persona, esta debe tener una cuenta Virtual Guardian.",
					35:"Auto",
					36:"La herramienta de auto te permite:",
					37:"Recordar donde estacionas tu auto",
					38:"Analisis de la zona donde estacionaras tu auto.",
					39:"Recibir notificaciones si algo sucede cerca de tu auto.",
					40:'Para utilizar las funciones de esta herramienta primero es necesario ajustar la posición del auto en el mapa, después seleccionar la opción de "Vigilar auto", esto te mostrara el análisis de la zona y te solicitara una confirmación. Una vez confirmado, tu auto estará siendo cuidado por virtual guardian, la ubicación de tu auto se guardara en tu dispositivo móvil y en ningún momento se enviara a nuestros servidores, esto para proteger tu privacidad.',
					41:'Menú lateral',
					42:"Filtros",
					43:"Esta herramienta te permite especificar: intervalo de fechas, tipos de eventos y estados que te interesan para que solo se muestren en el mapa los resultados que cumplen con tus preferencias.",
					44:"Ajustes de aplicación",
					45:"Esta sección de configuración te permite definir:",
					46:"Periodo: Cuando se realizan búsquedas en el mapa, existen filtros generales que te permiten reducir la información según tus preferencias, esta propiedad mostrará en el mapa los eventos que han sucedido en la última semana, mes, semestre o año.",
					47:"Radio: Esta propiedad te permite predefinir el radio del mapa principal, puedes modificarlo posteriormente en la barra de radio pero al cerrar la aplicación se reestablece al especificado en esta opción",
					48:"Ajustes de notificaciones",
					49:"En esta sección te permitiremos personalizar las notificaciones para que solo recibas lo que te interesa, puedes configurar:",
					50:"Eventos: En esta opción puedes desactivar las notificaciones de eventos, esto bloqueara las notificaciones de auto.",
					51:"Tiempo: Cuando un evento suceda antes del tiempo especificado se te notificará, de lo contrario solo se mostrara en el mapa.",
					52:"Radio personal: Este es un parámetro muy importante ya que te permite especificar la distancia a la que consideras que un evento puede ponerte en peligro, por lo tanto la aplicación solo realizara alertas personales cuando te encuentres a una distancia menor a la especificada.",
					53:"Estados: En esta opción puedes seleccionar los estados de los que te interesa recibir notificaciones, así no te informaremos de lugares que no son relevantes para ti.",
					54:"Tipos de eventos: Al igual que la opción anterior puedes seleccionar los tipos de eventos que te interesan.",
					55:"Personas: En esta opción puedes desactivar las notificaciones para no recibir alertas si algún evento sucede cerca de alguna de tus personas.",
					56:"Auto: En esta opción puedes desactivar las notificaciones para no recibir alertas si algún evento sucede cerca de alguna de tu auto.",
					57:"Radio auto: Este es un parámetro muy importante ya que te permite especificar la distancia a la que consideras que un evento puede poner a tu auto en peligro, por lo tanto la aplicación solo realizara alertas de auto cuando se encuentre a una distancia menor a la especificada.",
					58:"Ajustes de cuenta",
					59:"Aqui puedes ver información relacionada con tu suscripción, vigencia y cambiar tu contraseña.",
					60:"Salir del recorrido",
					61:'Tu cuenta ha quedado activa, tendrás 30 días para usar la versión Premium de la aplicación.'

					
					
					},
				periodos:{
				7:"Semanal",
				30:"Mensual",
				180:"Semestral",
				365:"Anual"
				},
				auto:{
					1:"Vigilar mi auto",
					2:"Detener vigilancia",
					3:"Analizando zona...",
					4:"Análisis de seguridad",
					5:"Estos son los eventos que han sucedido en la semana a menos de ",
					6:"km de tu auto.",
					7:"¿Quieres estacionarlo aquí?",
					8:"Arrastra el auto hasta la ubicación donde lo estacionaste para cuidarlo por ti.",
					9:"(Por tu seguridad Virtual Guardian no almacena la ubicación en sus servidores)"
				},
				personas:{
					1:"Agregar persona",
					2:"Introduce el correo electrónico de la persona que deseas agregar",
					3:"No puedes agregar tu correo electrónico.",
					4:" se han agregado correctamente a tus personas.",
					5:" no es miembro de Virtual Guardian.",
					6:" ya esta en tu lista de personas.",
					7:" no ha aceptado tu solicitud a personas.",
					8:"Activo",
					9:"Solicitud enviada",
					10:"Pendiente de aceptar",
					11:"Eliminar persona",
					12:"¿Estás seguro de que deseas eliminar de tu lista de personas a ",
					13:"Aceptar persona",
					14:"¿Deseas aceptar en tu lista de personas a ",
					15:" se ha eliminado de tu lista de personas",
					16:" se ha aceptado en tu lista de personas",
					17:"No has agregado personas",
                    18:"Agregar persona",
					19:"Llamar",
					20:"Personas"
				},
				login:{
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
				},registro:{
					1:"Registro",
					2:"Virtual Guardian no solicita información personal con el objetivo de brindarte la mayor protección y confidencialidad. Nuestro sistema de prevención de riesgos utiliza un algoritmo que no necesita información personal para funcionar.",
					3:"Correo Elecrónico",
					4:"Contraseña",
					5:"Repetir Contraseña",
					6:"Leer aviso de privacidad",
					7:"Continuar",
					8:"Regresar",
					9:"El correo electrónico es obligatorio para el registro.",
					10:"El correo electrónico proporcionado no es válido",
					11:"La contraseña debe de ser de 8 dígitos como mínimo y contener al menos un número y una letra.",
					12:"Las contraseñas no coinciden.",
					13:"Hemos enviado a tu correo electrónico un mensaje con el código de verificación, introdúcelo en el siguiente campo para completar tu registro",
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
					30:"Código de promoción"
					
				},
				notificaciones:{
					1:"No hay notificaciones recientes",
					2:"Solicitud de personas",
					3:" quiere agregarte a su lista de personas.",
					4:" aceptó tu solicitud de personas.",
					5:" a ",
					6:" de ",
					7:" de tu auto.",
					8:"Código de promoción",
					9:" se registró con tu código de promoción.",
					10:"Buenas noticias, ahora tienes un mes más de suscripción completa por invitar a tus amigos.",
					11:"Tips Virtual Guardian",
					12:"Para ver el tip manten pulsada la notificación.",
					13:"Suscripción Familiar",
					14:" quiere agregarte a su suscripción familiar.",
				},
				meses:{
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
				}
			},
		en:
			{
				general:{
					1:"Loading...",
					2:"Accept",
					3:"Internet connection",
					4:"No internet connection.",
					5:"Refresh",
					6:"Cancel",
					7:"Story refresh",
					8:"<div style='font-size:2vh'>to reduce the mobile data consumption must download the casualties data base from one WiFi connection.</div>would you like to do it now?",
					9:"Refreshing...",
					10:"Your calm, our target",
					11:"Suscription",
					12:"Your trial period has expired, get one of our full versions.",
					13:"See versions",
					14:"Keep limited",
					15:"See more...",
					16:"Select",
					17:"Active",
					18:"Deactive",
					19:"Deactivate",
					20:"Activate",
					21:"Activated",
					22:"Deactivated",
					23:"Virtual Guardian",
					24:"someone has logged on with this account.<br>Log in again",
					25:"Virtual Guardian and logos are trademarks of Red Guardian Virtual S.A. de C.V. All rights reserved.",
					26:"Virtual Guardian for mobile devices was created with free license software.",
					27:"Version ",
					28:"GPS setting",
					29:"Localization is not available, try again.",
                    30:"we have created one tour to guide you thruogh all the virtual guardian features",
                    31:"¿do you want to see it?",
                    32:"¿do you want to see the virtual guardian features tour?",
					33:"Saving..."
					
				},
				mapa:{
					1:"Date:",
					2:"Time:",
					3:"Address:",
                    4:"¡Location refreshed!",
                    5:"¡Events refreshed!"
				},
				cuenta:{
					1:"User",
					2:"suscription",
					3:"change password",
					4:"get full version",
					5:"full version",
					6:"La versión completa te permitirá hacer uso ilimitado de Virtual Guardian con la posibilidad de realizar filtros de eventos anteriores a 7 días y recibir notificaciones cuando tu auto corra peligro. ¡Recibe la mejor información y protégete al máximo!",
					7:"New password",
					8:"Enter your new password",
					9:"The password has been changed.",
					10:"Suscriber since:",
					11:"Suscription vigency:",
					12:"Account",
					13:"Code",
					14:"Share this code and get a full free month completa for each guest."
					},
				menu:{
				1:"Filters",
				2:"App settings",
				3:"Notifications",
				4:"Terms & conditions",
				5:"Info",
				6:"Log out",
				7:"start date:",
				8:"final date:",
				9:"estates:",
				10:"events:",
				11:"period:"	,
				12:"radio:",
				13:"Events:",
				14:"Persons:",
				15:"Car:",
				16:"Persons range:",
				17:"Car range:",
				18:"Personal range:",
				19:"Enter the default range in meters for events displaying on map. 10m-16,000m",
				20:"Range entered is invalid, please enter a value between 10 to 16,000 meters.",
				21:"If an event occurs near you we'll notice you, enter one distance range. 10m-5,000m",
				22:"Range entered is invalid, please enter a value between 10 to 5,000 metros.",
				23:"If something happens near to your car we will notice you, Enter a distance range. 10m-5,000m",
				24:"Time:",
				25:"Cuando algo suceda dentro de los últimos minutos te notificaremos, proporciona el tiempo máximo en el que consideras que el evento es relevante. 10-180 min.",
				26:"Time is invalid, enter one time value between 10 to 180 minutos.",
                27:"Help",
            28:"Account",
            29:"Select all",

            30:"Deselect all"
				},
				recorrido:{
					1:"How to use Virtual Guardian?",
					2:"Know the icons:",
					3:"Next",
					4:"Finish",
					5:'To see later select the side menu "Help".'
					},
				periodos:{
				7:"weekly",
				30:"Monthly",
				180:"Semestral",
				365:"Anual"
				},
				auto:{
					1:"watch my car",
					2:"stop watching",
					3:"Analizaning zone...",
					4:"Security analysis",
					5:"These casualties happened this week at ",
					6:"km from your car.",
					7:"Would you like to park here?",
					8:"Drag the car to the park location",
					9:"(For your safety Virtual Guardian does not store any location)"
				},
				personas:{
					1:"Add person",
					2:"Enter your guest email",
					3:"Cannot add this email",
					4:" These persons has been added",
					5:" is not a Virtual Guardian member",
					6:" is on your person list already",
					7:" has not accepted your request",
					8:"Active",
					9:"Request sent",
					10:"Pending for acceptance",
					11:"Delete person",
					12:"Are you sure to delete from your person list",
					13:"Accept person",
					14:"Would you like to accept to your person list",
					15:" has been deleted from your person list",
					16:" has beed added to your person list",
					17:"No persons added",
                    18:"Add person"
				},
				login:{
					1:"Log In",
					2:"E-mail",
					3:"Password",
					4:"Login",
					5:"Create new account",
					6:" Forgot your password?",
					7:"E-mail and password are incorrect.\nPlease check and try again.",
					8:"Logging in...",
					9:"Logging out...",
					10:"Do you want to log out?"
				},registro:{
					1:"Registry",
					2:"Virtual Guardian no solicita información personal con el objetivo de brindarte la mayor protección y confidencialidad.",
					3:"Email",
					4:"Password",
					5:"Repeat password",
					6:"Privacy advisory",
					7:"Next",
					8:"Back",
					9:"Email is required.",
					10:"Email is invalid",
					11:"Password must be 8 digits and must have a number and letter.",
					12:"Password missmatch.",
					13:"We've sent you a confirmation code, enter it on the next field to complete your registration",
					14:"Code",
					15:"Email is already registrated",
					16:"Unexpected error, try later",
					17:"Code incorrect, check your code",
					18:"Send code again",
					19:"Confirmation code has been sent to your email",
					20:"Welcome to",
					21:"Finish",
					22:"Ahora puedes iniciar sesión, mantenerte informado y protegido con nosotros.",
					23:"Proporciona tu correo electrónico registrado para enviarte un mensaje con las instrucciones necesarias para recuperar tu contraseña.",
					24:"Send recovery email",
					25:"You have not enter your email",
					26:"Recover password",
					27:"The email is not register at Virtual Guardian",
					28:"The recovery email has been sent, follow the instructions to reset your password.",
					29:"Enter your promo code",
					30:"Promo code"
					
				},
				notificaciones:{
					1:"No recent notifications",
					2:"Person request",
					3:" wants to add you to person list.",
					4:" accepted your person request.",
					5:" at",
					6:" from ",
					7:" from your car.",
					8:"promo code",
					9:" registered with your promo code.",
					10:"Good news, now you have a full version extra suscription."
				},
				meses:{
				1:"January",
				2:"February",
				3:"March",
				4:"April",
				5:"May",
				6:"June",
				7:"July",
				8:"August",
				9:"September",
				10:"October",
				11:"November",
				12:"December"
				}
			}
		
	};
            
	$rootScope.cleanMemory=function(){
	  	window.localStorage.removeItem("nPendientes");
            console.log("clean");
        window.localStorage.removeItem("Notificaciones");
		window.localStorage.removeItem("Personas");
		window.localStorage.removeItem("Usuario");
		window.localStorage.removeItem("Filtros");
        window.localStorage.removeItem("Auto");
  	}
            $rootScope.keycover=false;
	$rootScope.idioma=$scope.Diccionario.es;
	$ionicPlatform.ready(function(){
		if(navigator.globalization)
		navigator.globalization.getPreferredLanguage(
    		function (language) {
				$scope.$apply(function(){
				var l=language.value.split("-")
				//if(l[0]=="EN" || l[0]=="en" || l[0]=="En")$rootScope.idioma=$scope.Diccionario.en;
				})
                                                     
			})	
			
			
		});
            
            $rootScope.enterkey=function(event){
            if($rootScope.iOS)if(event.keyCode==13)$rootScope.closekey();
            }
            $rootScope.closekey=function(){
				if($rootScope.iOS){
            $timeout(function(){
                     $rootScope.keycover=false;
                     cordova.plugins.Keyboard.close();
                     },500);
            
				}
            }
            $rootScope.showCover=function(){if($rootScope.iOS){
            $("#input_prompt").css("font-size",$("#input_prompt").css("font-size"))
            $rootScope.keycover=true;
            }}
	
	$rootScope.showCargando = function(texto) {
    	$ionicLoading.show({
      		template: '<div style="width:100%"><ion-spinner icon="android" class="spinner-dark"></ion-spinner></div>'+texto
   		});
 	};
            $rootScope.showToast=function(mensaje){
            $cordovaToast.showShortBottom(mensaje);
            }
            
 	$rootScope.hideCargando = function(){
    	$ionicLoading.hide();
 	};
	$scope.evalid=function(email){
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
	}
	$scope.alertPopup=null;
	$rootScope.alert=function(titulo,texto,funcion){
		/*if(navigator.notification)
		navigator.notification.alert(texto,funcion, titulo,$rootScope.idioma.general[2]);
		else alert(texto);*/
		if($scope.alertPopup)$scope.alertPopup.close();
		$scope.alertPopup = $ionicPopup.alert({
     		title: titulo,
     		template: texto,
			okText:$rootScope.idioma.general[2]
   		});
   		$scope.alertPopup.then(function(res) {
     		funcion();
   		});
	}
	$rootScope.show=function(titulo,text,btn1,btn2,fb1,fb2,tres){
		var btns=[]
		if(tres){
			btns=[{ 
    			text: $rootScope.idioma.general[6],
    			type: 'button-default',
    			onTap: function(){
					$scope.confirmPopup.close(); 
				}
  			}, {
    			text: btn1,
    			type: 'button-positive',
    			onTap: function(){
				$timeout(function(){

				fb1();
				},300);
				}
  			}, {
    			text: btn2,
    			type: 'button-positive',
    			onTap: function(){
				$timeout(function(){

				fb2();
				},300);
				}
			}]
		}else{
			btns=[{ 
    			text: $rootScope.idioma.general[6],
    			type: 'button-default',
    			onTap: function(){
					$scope.confirmPopup.close();
				}
  			}, {
    			text: btn1,
    			type: 'button-positive',
    			onTap: function(){
					$timeout(function(){
				fb1();
				},300);
				}
  			}]
		}
		
   		$scope.confirmPopup = $ionicPopup.confirm({
     		title: titulo,
     		template: "<div>"+text+"</div>"+
			'<div id="botones_confirm"></div>'
			
			,
			buttons: btns
   		});
		
		
   		
 	};
	$scope.confirm = function(titulo,pregunta,funcion,btn1,btn2,closable,rtr) {
		rtr=rtr || false
		closable=closable||function(){return true};
		btn1 = btn1 || $rootScope.idioma.general[2];
    	btn2 = btn2 || $rootScope.idioma.general[6];
   		$scope.confirmPopup = $ionicPopup.confirm({
     		title: titulo,
     		template: "<div>"+pregunta+"</div>"+
			'<div id="botones_confirm"></div>'
			
			,
			buttons: [{ 
    			text: btn2,
    			type: 'button-default',
    			onTap: function(){
					  return 0;
				}
  			}, {
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
		
   		$scope.confirmPopup.then(function(res) {
			if(res) {
				$scope.confirmPopup.close();
				funcion(res);
				
				
			} else {
				if(rtr)funcion(res);
				 $scope.confirmPopup.close();
			}
		})
 	};
	
    $scope.prompt=function(title,subtitle,type,placeholder,funcion,valor){
		valor=valor || "";
	$scope.proptPopup = $ionicPopup.show({
    template: '<input id="input_prompt" type="'+type+'" placeholder="'+placeholder+'" value="'+valor+'" ng-keydown="enterkey($event)"  ng-focus="showCover()" ng-blur="closekey()">',
    title: title,
    subTitle: subtitle,
	inputType: type,
    scope: $scope,
	buttons: [{ 
    			text: $rootScope.idioma.general[6],
    			type: 'button-default',
    			onTap: function(){
					  return 0;
				}
  			}, {
    			text: $rootScope.idioma.general[2],
    			type: 'button-positive',
    			onTap: function(){
				return 1;
				}
  			}]
    
  });
  $scope.proptPopup.then(function(res) {
	  if(res){
		  $rootScope.showCargando("")
		  var val =$("#input_prompt").val();
		  $scope.proptPopup.close(); 
		  $timeout(function(){
			  
    		funcion(val);
			$rootScope.hideCargando();
		  },500);
	
	  }else{
		 $scope.proptPopup.close(); 
	  }
  });
	}
	 $rootScope.popup=function(title,template,funcion){
	var myPopup = $ionicPopup.show({
    template: template,
    title: title,
    scope: $scope,
	cssClass:"popupActivo",
	buttons: [{ 
    			text: $rootScope.idioma.general[2],
    			type: 'button-positive',
    			onTap: function(){
					  return 1;
				}
  			}]
    
  });
  myPopup.then(function(res) {
	  if(res){
    funcion();
	  }
  });
	}
	
  $scope.openSelect = function(opciones,multiple) {
	$scope.opcionesModal=opciones;
	if(multiple)m="pantallas/modalSelect.html"
	else m="pantallas/modalSelectSingle.html"
	
	$scope.modalSelect = $ionicModal.fromTemplateUrl(m, {
    scope: $scope,
    animation: 'slide-in-up',
			   backdropClickToClose:false
  }).then(function(modal) {
    $scope.modalSelect = modal;
	$scope.modalSelect.show();
  });
    
  };
            $scope.selectAll=function(val){
            for(var i=0;i<$scope.opcionesModal.length;i++)
            $scope.opcionesModal[i].Selected=val;
            }
  $scope.closeModal = function() {
    $scope.modalSelect.hide();
	$scope.modalSelect.remove();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modalSelect.remove();
  });
            $scope.modalTerminos=null;
            $scope.openTerminos = function(m) {
            $scope.modalTerminos = $ionicModal.fromTemplateUrl(m, {
               scope: $scope,
               animation: 'slide-in-up',
			   backdropClickToClose:false
               }).then(function(modal) {
				  
                  $scope.modalTerminos = modal;
                  $scope.modalTerminos.show();
               });
            
            };
            $scope.closeModalt = function() {
            $scope.modalTerminos.hide();
            $scope.modalTerminos.remove();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
				
                       $scope.modalTerminos.remove();
                       });


  
}).service('CordovaNetwork', ['$ionicPlatform', '$q', function($ionicPlatform, $q,$rootScope) {
  // Get Cordova's global Connection object or emulate a smilar one
  var Connection = window.Connection || {
    "CELL"     : "cellular",
    "CELL_2G"  : "2g",
    "CELL_3G"  : "3g",
    "CELL_4G"  : "4g",
    "ETHERNET" : "ethernet",
    "NONE"     : "none",
    "UNKNOWN"  : "unknown",
    "WIFI"     : "wifi"
  };
 
  var asyncGetConnection = function () {
    var q = $q.defer();
    $ionicPlatform.ready(function () {
      if(navigator.connection) {
        q.resolve(navigator.connection);
      } else {
        q.reject('navigator.connection is not defined');
      }
    });
    return q.promise;
  };
 
  return {
    isOnline: function () {
      return asyncGetConnection().then(function(networkConnection) {
        var isConnected = false;
 
        switch (networkConnection.type) {
          case Connection.ETHERNET:
          case Connection.WIFI:
          case Connection.CELL_2G:
          case Connection.CELL_3G:
          case Connection.CELL_4G:
          case Connection.CELL:
            isConnected = true;
            break;
        }
		
        return isConnected;
      });
    }
  };
}]);
 