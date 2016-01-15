// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers','ionic-material', 'starter.services','ngCordova','btford.socket-io','ngTouch','ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	  StatusBar.backgroundColorByHexString("#242424");
	  //StatusBar.backgroundColorByHexString("#059DB5");
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider,localStorageServiceProvider,uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCmZHupxphffFq38UTwBiVB-dbAZ736hLs',
        //v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'places',
        preventLoad: true
    });
	// LocalStorage config
  localStorageServiceProvider
  .setPrefix('VirtualGuardian')
  .setStorageType('localStorage');
  $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'screens/app.html',
        controller: 'Aplicacion'
    })
	.state('app.login', {
        url: '/login',
        views: {
            'contenido-app': {
                templateUrl: 'screens/login.html',
                controller: 'Login'
            },
        }
    })
	.state('app.registro', {
        url: '/registro',
		abstract: true,
        views: {
            'contenido-app': {
                templateUrl: 'screens/registro.html',
                controller: 'Registro'
            },
        }
    })
	.state('app.registro.datos', {
        url: '/datos',
        views: {
            'contenido-registro': {
                templateUrl: 'screens/registro_datos.html',
            },
        }
    })
	.state('app.registro.codigo', {
        url: '/codigo',
        views: {
            'contenido-registro': {
                templateUrl: 'screens/registro_codigo.html',
            },
        }
    })
	.state('app.registro.final', {
        url: '/final',
        views: {
            'contenido-registro': {
                templateUrl: 'screens/registro_final.html',
            },
        }
    })
	.state('app.recuperar', {
        url: '/recuperar',
        views: {
            'contenido-app': {
                templateUrl: 'screens/recuperar.html',
				controller: 'Recuperar'
            },
        }
    })
	$urlRouterProvider.otherwise('/app/login');
})
