function checkStatus($q, $location, $http, Session) {
    return Session.defferred.promise
                .then(function(response){return Session.assetsotherinfodefferred.promise})
                .then(function(response){return Session.assetsinfodefferred.promise})
                .then(function(response){return check_login($q, $location, $http, Session)});
}

function check_login($q, $location, $http, Session) {
    var deferred = $q.defer();
    /*
     *  If login details not present then, get the login details
     *  and then check if need to move to login page or need to configure
     */
    data = Session.data;
    //console.log(data);
    //console.log(data['configured']);
    if(!data['configured']) {
        //Set the configured state in own session
        if($location.path() === '/user/firstrun') {
            resolve_deferred(deferred);
        } else {
            deferred.reject();
            $location.path('/user/firstrun');
        }
    } else {
        if($location.path() === '/user/firstrun'){
            deferred.reject();
            $location.path('/');
        } else if($location.path() === '/login') {
            if(data['loggedin']) {
                deferred.reject();
                $location.path('/');
            } else {
                resolve_deferred(deferred);
            }
        } else {
            if(data['loggedin']) {
                resolve_deferred(deferred);
            } else {
                deferred.reject();
                $location.path('/login');
            }
        }
    }

    function resolve_deferred(deferred) {
        if($location.path() !== '/user/update'
            && Session.data['userinfo']['username'] != Session.currentuser['username']) {
            //reset the current username displayname
            Session.currentuser['username'] = Session.data['userinfo']['username'];
            Session.currentuser['displayname'] = Session.data['userinfo']['displayname'];
        }
        deferred.resolve();
    }

    return deferred.promise;
}

function navbarController($scope, $http, $location, $window, $rootScope, Session) {

    $scope.isCollapsed = true;

    $scope.$watch( function () { return Session.data; }, function ( data ) {
        $rootScope.loggedin = data['loggedin']
        $rootScope.username = data['userinfo']['username'];
        $rootScope.displayname = data['userinfo']['displayname'];
        $rootScope.admin = data['userinfo']['admin'];
    });

    $scope.logout = function() {
        $http({
            method : 'POST',
            url : 'login/logoutUser'
        })
        .success(function() {
            Session.updateSession();
            $window.location.href = '';
        });
    }
}
function userprofileController($scope, $location) {
    $scope.editUserProfile = function() {
        $location.path('/user/update');
    }
}

function usersController($scope, $http, $location, Session) {
    $scope.getUsersInfo = function() {
        $http({
            method : 'POST',
            url : 'user/users/all'
        })
        .success(function(data) {
            //console.log(data);
            if(data) {
                $scope.users = data;
            }
        });
    }

    $scope.editUserProfile = function(username, displayname, admin) {
        //console.log(username);
        Session.currentuser['username'] = username;
        Session.currentuser['displayname'] = displayname;
        Session.currentuser['admin'] = admin;

        $location.path('/user/update');
    }

    $scope.getUsersInfo();
}

app.controller("homeController", function($scope, Session){
    Session.getAssetsOtherInfo();
    Session.getAssetsInfo();

    $scope.ideas = [
        ['ideas1', 1],
        ['ideas2', 8],
        ['ideas3', 5]
    ];
})

app.controller("welcomeController", function($scope, $location){
    //console.log('welcomeController here');

    //$location.path('login')
    $scope.gotohome = function() {
        $location.path( '/home' );
    }
})

app.controller("loginController", function($scope, $http, $location, Session){
    //console.log('loginController here');

    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    $scope.formData = {};
    $scope.formData.name = '';
    $scope.formData.password = '';

    $scope.processForm = function() {
        $scope.errorName = "";
        $scope.errorPassword = "";
        $http({
            method : 'POST',
            url : 'login/loginUser',
            data : $scope.formData, // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
            transformRequest: function(obj) {
                str = [];
                for(p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
        })
        .success(function(data) {
            //console.log(data.success);
            if(data) {
                // Update the session as, server might have reset some information, like configured !!!
                Session.updateSession();

                if (!data.success) {
                    // if not successful, bind errors to error variables
                    $scope.errorName = data.errors.name;
                    $scope.errorPassword = data.errors.password;
                    $scope.message = data.errors.message
                } else {
                    // if successful, go to welcome screen
                    $location.path('/');
                }
            }
        });
    };
})

app.controller("userController", function($scope, $http, $rootScope, $timeout, $location, Session, $routeParams){
    //console.log('userController here');

    function redirectToWelcome() {
        $rootScope.timeCount--;
        if($rootScope.timeCount > 0) {
            $rootScope.alertInfo = "You will be directed to Welcome / Login page in " +  $scope.timeCount + " seconds";
            $timeout(redirectToWelcome, 1000);
        } else {
            //console.log('Redirecting now ... ');
            $rootScope.alertInfo = "";
            $location.path("/");
        }
    }

    $scope.updatePassword = false;

    $scope.$watch('updatePassword', function ( data ) {
        console.log('watch updatePassword');
        console.log(data);
        if(!data) {
            console.log('clearing password');
            $scope.formData.password = '';
            $scope.formData.password2 = '';
            $scope.formData.currentpassword = '';
        }
    });

    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    $scope.formData = {};

    /*
     *  Modify these set of variables, depending on the scenario
     */

    $scope.showUser = true;
    $scope.currentpassword = true;

    if(!Session.data['configured']) {
        $scope.formData.name = 'admin';
        $scope.formData.displayname = 'Admin';

        $scope.register = false;
        $scope.setPassword = true;

        $scope.message = 'Provide password for admin';

        baseurlapi = 'user/firstrun/configure';
    } else {
        //Cant come here without the check of access role in check_login, so show the register page or change settings page depending on the route
        if($routeParams['type'] === 'register') {
            $scope.formData.name = '';
            $scope.formData.displayname = '';

            $scope.register = true;
            $scope.setPassword = false;

            baseurlapi = 'user/register/new'
        } else if($routeParams['type'] === 'update') {
            // User Settings scenario
            $scope.formData.name = Session.currentuser['username'];
            $scope.formData.displayname = Session.currentuser['displayname'];
            $scope.formData.admin = Session.currentuser['admin'];

            $scope.register = false;
            $scope.setPassword = false;

            /* Updating other user info, so no need of current password */
            $scope.currentPassword = Session.data['userinfo']['username'] == Session.currentuser['username'];

            baseurlapi = 'user/update';
        }
    }

    /*
     *  No need to change the below expressions as it caters for:
     *  Registration
     *  Change Password
     *  Set Password of admin in initial configuration
     *
     *  Does not cater (Might need extra boolean variable:
     *  Change of display name
     */

    $scope.setPassword = $scope.setPassword && (!$scope.register); // when register is true, it will always override setPassword! When false it need not override
    $scope.showUpdateSettings = !$scope.register && !$scope.setPassword;
    $scope.disableUser = !$scope.register;
    $scope.disableDisplayName = !($scope.showUpdateSettings || $scope.register)

    // process the form
    $scope.processForm = function() {
        $scope.errorName = "";
        $scope.errorCurrentPassword = "";
        $scope.errorPassword = "";
        $scope.errorPassword2 = "";
        $scope.alertMessage = "";
        if(($scope.updatePassword || $scope.register) && $scope.formData.password !== $scope.formData.password2) {
            $scope.errorPassword2 = "Passwords do not match. Please try again";
        } else {
                urlapi = baseurlapi;

            if($routeParams['type'] === 'update') {
                if($scope.updatePassword) {
                    urlapi = urlapi + '/all';
                } else {
                    urlapi = urlapi + '/displayname';
                }
            }

            console.log($scope.formData.password);

            $http({
                method : 'POST',
                url : urlapi,
                data : $scope.formData, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: function(obj) {
                    str = [];
                    for(p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
            })
            .success(function(data) {
                //console.log(data.success);
                if(data) {
                    //console.log('mine');
                    //console.log(data);
                    if (!data.success) {
                        // if not successful, bind errors to error variables
                        $scope.errorName = data.errors.name;
                        $scope.errorPassword = data.errors.password;
                        $scope.errorCurrentPassword = data.errors.currentpassword;
                        $scope.alertMessage = data.errors.message
                        $scope.alertError = true;
                    } else {
                        // if successful, bind success message to message
                        $scope.alertMessage = data.message;
                        $scope.alertError = false;

                        if($scope.register || $scope.currentPassword)
                            $scope.formData.admin = 'false';
                        $scope.formData.password = '';
                        $scope.formData.password2 = '';
                        $scope.formData.currentpassword = '';

                        Session.updateSession();

                        if(!Session.data['configured']) {
                            $rootScope.timeCount = 5;
                            $rootScope.alertInfo = "You will be directed to Welcome / Login page in " +  $scope.timeCount + " seconds"

                            $timeout(redirectToWelcome, 1000);
                        }
                    }
                }
            });
        }

    };
})