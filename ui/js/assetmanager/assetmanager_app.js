// define angular module/app
var app = angular.module('AssetManager', []);

//when the application runs
//Session, is a service that takes care of the session persistence
app.run(function ($rootScope, $location, Session, $timeout) {    
    // register listener to watch for route changes
    // this event will fire every time the route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        //ask the service to check if the user is in fact logged in
        if (!Session.isUserLoggedIn()) {
            // no logged user, we should be going to the login route
            if (next.templateUrl == "partials/login.html") {
                // already going to the login route, no redirect needed
            } else {
                // not going to the login route, we should redirect now
                $location.path("/login");
            }
        }
    });
});