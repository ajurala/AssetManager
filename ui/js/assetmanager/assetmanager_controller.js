function check_configured($q, $location, $http) {
    var deferred = $q.defer(); 

    /* 
     *  If login details not present then, get the login details 
     *  and then check if need to move to login page or need to configure
     */

    $http({
        method : 'POST',
        url : 'login/get_login_info',
    })
    .success(function(data) {
        if(!data['configured']) {
            //Set the configured state in own session

            deferred.reject();
            $location.path('/user')
        } else {

        }
    })
    .error(function(data) {
        //Set the configured state as true and allow whatever to happen ... happen
        deferred.resolve(true);
    });
    return deferred.promise;
}

app.controller("welcomeController", function($scope, $location, $rootScope, $log){
    console.log('welcomeController here');

    //$location.path('login')
})

app.controller("loginController", function($scope){
    console.log('loginController here');
})

app.controller("userController", function($scope, $http){
    console.log('registerController here');

    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    $scope.formData = {};

    /*
     *  Modify these set of variables, depending on the scenario
     */

    $scope.formData.name = 'admin';
    $scope.formData.displayname = 'Admin';

    $scope.showUser = true;
    $scope.register = false;
    $scope.setPassword = true;

    $scope.message = 'Provide password for admin';

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
                console.log(data.success);
                
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
                }
            });
        }

    };
})