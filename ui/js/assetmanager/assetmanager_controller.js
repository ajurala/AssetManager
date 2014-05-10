// create angular controller and pass in $scope and $http
function formController($scope, $http) {

    // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
    $scope.formData = {};

    // process the form
    $scope.processForm = function() {
        $http({
            method : 'POST',
            url : 'login/loginUser',
            data : $.param($scope.formData), // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            console.log(data);
            
            if (!data.success) {
                // if not successful, bind errors to error variables
                $scope.errorName = data.errors.name;
                $scope.errorPassword = data.errors.password;
            } else {
                // if successful, bind success message to message
                $scope.message = data.message;
            }
        });

    };
}

function MainCtrl($scope, $rootScope) {
    //should be defined
    $scope.inputdata = {configured: "0", test: "woah"};
}

app.controller("welcomeController", function($scope, $location, $rootScope, $log){
    console.log('welcomeController here');

    //$location.path('login')
})

app.controller("loginController", function($scope){
    console.log('loginController here');
})

app.controller("registerController", function($scope, $http){
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
    $scope.setPassword = true

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

    $scope.setPassword = $scope.setPassword & (!$scope.register); // when register is true, it will always override setPassword! When false it need not override
    $scope.disableUser = !$scope.register;
    $scope.showCurrentPassword = !$scope.register && !$scope.setPassword;
    
    // process the form
    $scope.processForm = function() {
        $scope.errorPassword2 = "";
        if($scope.formData.password !== $scope.formData.password2) {
            $scope.errorPassword2 = "Passwords do not match. Please try again";
        } else {
            $http({
                method : 'POST',
                url : 'register/initialConfiguration',
                data : $.param($scope.formData), // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
            })
            .success(function(data) {
                console.log(data.success);
                
                if (!data.success) {
                    // if not successful, bind errors to error variables
                    $scope.errorName = data.errors.name;
                    $scope.errorPassword = data.errors.password;
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.message;
                }
            });
        }

    };
})