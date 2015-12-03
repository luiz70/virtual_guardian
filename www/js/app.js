// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ionic-material', 'starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //if(navigator.splashscreen)navigator.splashscreen.hide();
});
})

.config(function($stateProvider, $urlRouterProvider,localStorageServiceProvider,uiGmapGoogleMapApiProvider) {
	//
	/*$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.views.swipeBackEnabled(false);
	$ionicConfigProvider.platform.ios.views.maxCache(0);
	$ionicConfigProvider.platform.android.views.maxCache(0);
	$ionicConfigProvider.views.transition("ios");
	$ionicConfigProvider.views.forwardCache(false);*/
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
  
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
 $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app.html',
        controller: 'AppCtrl'
    })
	.state('app.login', {
        url: '/login',
        views: {
            'contenido-app': {
                templateUrl: 'templates/login.html',
                controller: 'Login'
            },
        }
    })
	.state('app.registro', {
        url: '/registro',
		abstract: true,
        views: {
            'contenido-app': {
                templateUrl: 'templates/registro.html',
                controller: 'Registro'
            },
        }
    })
	.state('app.registro.datos', {
        url: '/datos',
        views: {
            'contenido-registro': {
                templateUrl: 'templates/registro_datos.html',
            },
        }
    })
	.state('app.registro.codigo', {
        url: '/codigo',
        views: {
            'contenido-registro': {
                templateUrl: 'templates/registro_codigo.html',
            },
        }
    })
	.state('app.registro.final', {
        url: '/final',
        views: {
            'contenido-registro': {
                templateUrl: 'templates/registro_final.html',
            },
        }
    })
	.state('app.recuperar', {
        url: '/recuperar',
        views: {
            'contenido-app': {
                templateUrl: 'templates/recuperar.html',
				controller: 'Recuperar'
            },
        }
    })
	.state('app.home',{
		url:'/home',
		abstract:true,
		views:{
			'contenido-app':{
				templateUrl: 'templates/home.html',
				controller: 'Home'
			}
		}
	})
	.state('app.home.mapa', {
        url: '',
		id:1,
        views: {
            'contenido-home': {
                templateUrl: 'templates/mapa.html',
				controller: 'Mapa'
            },
        }
    })
	.state('app.home.notificaciones', {
        url: '',
		id:2,
        views: {
            'contenido-home': {
                templateUrl: 'templates/notificaciones.html',
				controller: 'Notificaciones'
            },
        }
    })
	.state('app.home.personas', {
        url: '',
		id:3,
        views: {
            'contenido-home': {
                templateUrl: 'templates/personas.html',
				controller: 'Personas'
            },
        }
    })
  /* setup an abstract state for the tabs directive
   .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
	controller:"Login"
  })
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');

});
