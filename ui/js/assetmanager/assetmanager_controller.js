function checkStatus($q, $location, $http, Session) {
    return Session.defferred.promise.then(function(response){return check_login($q, $location, $http, Session)});
}

function check_login($q, $location, $http, Session) {
    var deferred = $q.defer();

    /* 
     *  If login details not present then, get the login details 
     *  and then check if need to move to login page or need to configure
     */
    data = Session.data;
    console.log(data);
    console.log(data['configured']);
    if(!data['configured']) {
        //Set the configured state in own session
        if($location.path() === '/user') {
            deferred.resolve();
        } else {
            deferred.reject();
            $location.path('/user');
        }
    } else {
        if($location.path() === '/login') {
            deferred.resolve();
        } else {
            if(data['loggedin']) {
                deferred.resolve();
            } else {
                deferred.reject();
                $location.path('/login');
            }
        }
    }
    
    return deferred.promise;
}

app.controller("welcomeController", function($scope, $location, $rootScope, $log){
    console.log('welcomeController here');

    //$location.path('login')
})

app.controller("loginController", function($scope){
    console.log('loginController here');
})

app.controller("userController", function($scope, $http, $rootScope, $timeout, $location, Session){
    console.log('userController here');

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
    
    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    $scope.formData = {};

    /*
     *  Modify these set of variables, depending on the scenario
     */
    
    $scope.showUser = true;
    
    if(!Session.data['configured']) {
        $scope.formData.name = 'admin';
        $scope.formData.displayname = 'Admin';
        
        $scope.register = false;
        $scope.setPassword = true;

        $scope.message = 'Provide password for admin';
    } else {
        //Cant come here without the check of access role in check_login, so show the register page or change settings page depending on the route
        
        $scope.formData.name = '';
        $scope.formData.displayname = '';

        $scope.register = true;
        $scope.setPassword = false;
        
        // User Settings scenario
        $scope.formData.name = Session.data['userinfo']['username'];
        $scope.formData.displayname = Session.data['userinfo']['displayname'];

        $scope.register = false;
        $scope.setPassword = false;
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
        $scope.errorPassword = "";
        $scope.errorPassword2 = "";
        $scope.alertMessage = "";
        if($scope.formData.password !== $scope.formData.password2) {
            $scope.errorPassword2 = "Passwords do not match. Please try again";
        } else {
            $http({
                method : 'POST',
                url : 'user/update',
                data : $.param($scope.formData), // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                //console.log(data.success);
                if(data) {
                    if (!data.success) {
                        // if not successful, bind errors to error variables
                        $scope.errorName = data.errors.name;
                        $scope.errorPassword = data.errors.password;
                        $scope.alertMessage = data.errors.message
                        $scope.alertError = true;
                    } else {
                        // if successful, bind success message to message
                        $scope.alertMessage = data.message;
                        $scope.alertError = false;
                        
                        if(!Session.data['configured']) {
                            $rootScope.timeCount = 10;
                            $rootScope.alertInfo = "You will be directed to Welcome / Login page in " +  $scope.timeCount + " seconds"
                            
                            $timeout(redirectToWelcome, 1000);
                            
                            Session.updateSession();
                        }
                    }
                }
            });
        }

    };
})