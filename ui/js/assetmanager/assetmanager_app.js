// define angular module/app
var app = angular.module('AssetManager', ['ngRoute', 'ui.bootstrap', 'nvd3ChartDirectives']);

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


app.directive('assetchart', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    template: '<div id="assetchartcontainer" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs) {
      console.log('here we are');
      console.log(scope.items);
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'assetchartcontainer',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
          percentageDecimals: 1
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' % ' +this.point.y;
              }
            }
          }
        },
        series: [{
          type: 'pie',
          data: scope.items,
          name: 'Browser share',
        }]
      });
    }
  }
});

/* How to use  a dyraph with a directive */
/*

myApp.controller('MyCtrl', function($scope) {
    $scope.graphs = [
        {
            data: [ [1,10,100], [2,20,80], [3,50,60], [4,70,80] ],
            opts: { labels: [ "x", "A", "B" ] }

        },
        {
            data: [ [1,10,200], [2,20,42], [3,50,10], [4,70,30] ],
            opts: { labels: [ "label1", "C", "D" ] }

        }
    ];
});

myApp.directive('graph', function() {
    return {
        restrict: 'E', // Use as element
        scope: { // Isolate scope
            data: '=', // Two-way bind data to local scope
            opts: '=?' // '?' means optional
        },
        template: "<div></div>", // We need a div to attach graph to
        link: function(scope, elem, attrs) {

            var graph = new Dygraph(elem.children()[0], scope.data, scope.opts );
        }
    };
});

<div ng-controller="MyCtrl">
    <graph ng-repeat="graph in graphs" data="graph.data" opts="graph.opts"></graph>
</div>

*/

/* How to use HighCharts as directive */
/* Note - Needs jquery */
/*
app.directive('assetchart', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    template: '<div id="assetchartcontainer" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs) {
      console.log('here we are');
      console.log(scope.items);
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'assetchartcontainer',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
          percentageDecimals: 1
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' % ' +this.point.y;
              }
            }
          }
        },
        series: [{
          type: 'pie',
          data: scope.items,
          name: 'Browser share',
        }]
      });
    }
  }
});
*/
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