// define angular module/app
var app = angular.module('AssetManager', ['ngRoute', 'ui.bootstrap', 'nvd3ChartDirectives', 'colorpicker.module']);

app.factory('Session', function($http, $q) {
  var Session = {
    data: {'configured' : true,
           'loggedin': false,
           'userinfo': {'userid': '-1',
                        'username': 'unknown',
                        'displayname': 'Unknown',
                        'accessroles': [-1],
                       }
    },
    currentuser: {
        'username': 'unknown',
        'displayname': 'unknown',
        'admin': false
    },
    defferred: $q.defer(),
    updateSession: function() {
      Session.defferred = $q.defer();

      /* load data from db */
      $http.post('login/get_login_info').then(function(r) {
            Session.data = r.data;
            Session.currentuser['username'] = Session.data['userinfo']['username'];
            Session.currentuser['displayname'] = Session.data['userinfo']['displayname'];
            Session.currentuser['admin'] = Session.data['userinfo']['admin'];

            Session.defferred.resolve();
        }, function(r) {Session.defferred.resolve();});
    },

    assetsotherinfo: {},
    assetsotherinfodefferred: $q.defer(),
    getAssetsOtherInfo: function() {
      Session.assetsotherinfodefferred = $q.defer();

      /* load data from db */
      $http.post('home/getotherinfo').then(function(r) {
            Session.assetsotherinfo = r.data;

            Session.assetsotherinfodefferred.resolve();
        }, function(r) {Session.assetsotherinfodefferred.resolve();});
    },

    assetsinfo: {},
    assetsinfodefferred: $q.defer(),
    getAssetsInfo: function() {
      Session.assetsinfodefferred = $q.defer();

      /* load data from db */
      $http.post('home/getnetassets').then(function(r) {
            Session.assetsinfo = r.data;
            //console.log(Session.assetsinfo)

            Session.assetsinfodefferred.resolve();
        }, function(r) {Session.assetsinfodefferred.resolve();});
    },
    initialassstsupdate: $q.defer()
  };


  // Resolve the original promises of assets
  Session.assetsotherinfodefferred.resolve()
  Session.assetsinfodefferred.resolve();

  // Get the session
  Session.updateSession();

  return Session;
});

app.config(function($routeProvider, $locationProvider){
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl : "ui/partials/home.html",
        resolve: {
            toAllowOrNot: checkStatus
        }
    })
    .when("/login", {
        controller : "loginController",
        templateUrl : "ui/partials/login.html",
        resolve: {
            toAllowOrNot: checkStatus
        }
    })
    .when("/user/users", {
        templateUrl : "ui/partials/usersinfo.html",
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

app.directive('assets', function() {
    return {
      restrict: 'E',
      templateUrl: 'ui/partials/assets.html'
    };
});

app.directive('categories', function() {
    return {
      restrict: 'E',
      templateUrl: 'ui/partials/categories.html',
    };
});

app.directive('subcategories', function() {
    return {
      restrict: 'E',
      templateUrl: 'ui/partials/subcategories.html',
    };
});

app.directive('riskbasedassets', function() {
    return {
      restrict: 'E',
      templateUrl: 'ui/partials/riskbasedassets.html',
    };
});

app.directive('customgroups', function() {
    return {
      restrict: 'E',
      templateUrl: 'ui/partials/customgroups.html',
    };
});