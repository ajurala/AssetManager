// define angular module/app
var app = angular.module('AssetManager', ['ngRoute']);

app.factory('Session', function($http, $q) {
  var Session = {
    data: {'configured' : true,
           'loggedin': false,
           'userinfo': {'userid': '-1',
                        'username': 'unknown',
                        'displayname': 'Unknown'
                       }
          },
    defferred: $q.defer(),
    updateSession: function() {
        console.log('someone called updateSession');
      Session.defferred = $q.defer();

      /* load data from db */
      $http.post('login/get_login_info').then(function(r) {Session.defferred.resolve(); Session.data = r.data;}, function(r) {Session.defferred.resolve();});
    }
  };
  Session.updateSession();
  return Session;
});

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when("/login", {
        controller : "loginController",
        templateUrl : "ui/partials/login.html",
        resolve: {
            toAllowOrNot: checkStatus
        }
    })
    .when("/user/:type", {
        controller : "userController",
        templateUrl : "ui/partials/user.html",
        resolve: {
            toAllowOrNot: checkStatus
        }
    })
    .when("/user", {
        //controller : "userProfileController",
        templateUrl : "ui/partials/userprofile.html",
        resolve: {
            toAllowOrNot: checkStatus
        }
    })
    .when("/", {
        controller: "welcomeController",
        templateUrl: "ui/partials/welcome.html",
        resolve: {
            toAllowOrNot: checkStatus
        }
    })
    .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});






/*************************************************************************************************/

/*app.run(function ($rootScope, $location) {
    // register listener to watch for route changes
    // this event will fire every time the route changes
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        //ask the service to check if the user is in fact logged in, if not then go to login
        if(($location.path() === '/')) {
            //$location.path("/login");
        }
    })
});*/

/*
 *   Useful to have the knowledge of using directive to init on load
 */

/*
app.directive('initData', function($parse, $location) {
    return function(scope, element, attrs) {
        //modify scope
        var model = $parse('inputdata.configured');
        var configured = model(scope);

        //if not configured then register page
        if(configured == "1") {
            $location.path("/register");
        }
    };
});
*/