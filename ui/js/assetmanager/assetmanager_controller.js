function transformURIRequest(obj) {
    str = [];
    for(p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    result = str.join("&");

    console.log(result);
    return result;
}

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

function categoryModelController($scope, $rootScope, $modalInstance, $http, categorydetails, Session){
    $scope.categorydetails = categorydetails;
    $scope.assetsOtherInfo = categorydetails.assetsOtherInfo;

    $scope.ok = function () {
        $scope.riskError = "";
        $scope.knownCombinationError = "";
        // If such a combination already exists, then do not close
        foundcombination = false;
        subcategories = $scope.assetsOtherInfo.subcategories;
        for(i = 0; i < subcategories.length; ++i) {
            if($scope.categorydetails.entereddetails.subcategoryname == subcategories[i].subcategoryname) {
                subcategoryid = subcategories[i].subcategoryid;
                categoryid = subcategories[i].categoryid;
                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(categories[i].categoryid == categoryid
                        && $scope.categorydetails.entereddetails.categoryname == categories[i].categoryname) {
                        foundcombination = true;
                        break;
                    }
                }
            }

            if(foundcombination) {
                break;
            }
        }

        riskname = $scope.categorydetails.entereddetails.riskname;

        if(foundcombination || riskname == null) {
            if(foundcombination) {
                $scope.knownCombinationError = 'Asset type and Sub-Asset type combination already exists. Provide different combination';
            }

            if(riskname == null) {
                // No such risk info, select proper one
                $scope.riskError = 'No such risk category. Choose on in the list';
            }
        } else {
            // update the server with new sub/category info

            // Get the category id, if exists
            categoryid = "0"
            categories = $scope.assetsOtherInfo.categories;
            for(i = 0; i < categories.length; ++i) {
                if($scope.categorydetails.entereddetails.categoryname == categories[i].categoryname) {
                    categoryid = categories[i].categoryid;
                    break;
                }
            }
            subcategoryid = "0";

            riskid = "0";
            riskcategories = $scope.assetsOtherInfo.riskcategories;
            for(i = 0; i < riskcategories.length; ++i) {
                if(riskcategories[i].riskname == riskname) {
                    riskid = riskcategories[i].riskid;
                    break;
                }
            }

            //send it to server and close on success
            d = {};
            if(categoryid == "0") {
                category = {
                    'categoryname': $scope.categorydetails.entereddetails.categoryname,
                    'color': $scope.categorydetails.entereddetails.categorycolor
                }

                d.category = angular.toJson(category);
            }

            subcategory = {
                'categoryid': categoryid,
                'riskid': riskid,
                'subcategoryname': $scope.categorydetails.entereddetails.subcategoryname,
                'currentpriceperunit': $scope.categorydetails.entereddetails.currentpriceperunit,
                'unitform': $scope.categorydetails.entereddetails.unitform,
                'color': $scope.categorydetails.entereddetails.subcategorycolor,
            }

            d.subcategory = angular.toJson(subcategory);


            $http({
                method : 'POST',
                url : 'home/addcategorysubcategory',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully sent data to server for category");
                if(data) {
                    entereddetails = {
                        'categoryname': $scope.categorydetails.entereddetails.categoryname,
                        'subcategoryname': $scope.categorydetails.entereddetails.subcategoryname,
                        'subcategoryid': data.subcategorydetails.subcategoryid,
                    }

                    categorydetails = data.categorydetails;
                    subcategorydetails = data.subcategorydetails;

                    // Append the details to the Session
                    if(categorydetails != null) {
                        Session.assetsotherinfo.categories.push(categorydetails);
                    }
                    Session.assetsotherinfo.subcategories.push(subcategorydetails);

                    $modalInstance.close(entereddetails);

                    /* TODO - Might need to broadcast when update of category and subcategory is done */
                }
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.controller("assetsController", function($scope, $rootScope, $http, $filter, $modal, Session) {

    Session.assetsotherinfodefferred.promise
        .then(function(response){return Session.assetsinfodefferred.promise})
        .then(function(response){$scope.updateAssetsData()});

    $scope.$on('assetsupdated', function(event, from) {
        if(from != 'assetsController') {
            $scope.updateAssetsData();
        }
    });

    $scope.updateAssetsData = function() {
        $scope.assetsInfo = Session.assetsinfo;
        $scope.assetsOtherInfo = Session.assetsotherinfo;

        console.log($scope.assetsOtherInfo);

        $scope.data = $scope.assetsInfo.assets;
        $scope.chartdata = [];
        $scope.assetchartincludeall = true;

        // Add extra data to the assets information
        for (index = 0; index < $scope.data.length; ++index) {
            if($scope.data[index].extra == null) {
                $scope.data[index].extra = {};

                categoryid = 0;
                categoryname = '';
                subcategoryname = '';
                riskname = '';

                subcategories = $scope.assetsOtherInfo.subcategories;
                categoryid = 0;
                riskid = -1;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == $scope.data[index].subcategoryid) {
                        subcategoryname = subcategories[i].subcategoryname;
                        categoryid = subcategories[i].categoryid;
                        riskid = subcategories[i].riskid
                        break;
                    }
                }

                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(categories[i].categoryid == categoryid) {
                        categoryname = categories[i].categoryname;
                        break;
                    }
                }

                riskcategories = $scope.assetsOtherInfo.riskcategories;
                for(i = 0; i < riskcategories.length; ++i) {
                    if(riskcategories[i].riskid == riskid) {
                        riskname = riskcategories[i].riskname;
                        break;
                    }
                }

                $scope.data[index].extra.categoryid = categoryid;
                $scope.data[index].extra.categoryname = categoryname;
                $scope.data[index].extra.subcategoryname = subcategoryname;
                $scope.data[index].extra.riskname = riskname;
            }
        }

        $scope.selectedassets = function () {
            $scope.chartdata = $filter('filter')($scope.data, {extra: {chartinclude: true}});
        }

        $scope.selectallassets = function() {
            for (index = 0; index < $scope.data.length; ++index) {
                $scope.data[index].extra.chartinclude = $scope.assetchartincludeall
            }

            $scope.selectedassets()
        }

        $scope.nameFunction = function(){
            return function(d) {
                return d.assetname;
            };
        }

        $scope.ppuFunction = function(){
            return function(d){
                if(d.extra.dval == null) {
                    // Calculate the values now and save it for later use
                    // Note: set d.dval as null or recalculate it when d.ppu or d.units changes
                    //       or when category ppu changes
                    if(d.ppu != null) {
                        d.extra.dval = d.ppu;
                    } else {
                        d.extra.dval = 0; //Should get value from the subcategory
                    }

                    d.extra.dval = d.extra.dval * d.units;
                    d.extra.dval = d.extra.dval.toFixed(2);
                }
                return d.extra.dval
            };
        }

        $scope.getppu = $scope.ppuFunction()

        $scope.cppuFunction = function(){
            return function(d){
                if(d.extra.dcval == null) {
                    // Calculate the values now and save it for later use
                    // Note: set d.dcval as null or recalculate it when d.cppu or d.units changes
                    //       or when category cppu changes
                    if(d.cppu != null) {
                        d.extra.dcval = d.cppu;
                    } else {
                        d.extra.dcval = 0 //Should get value from the subcategory
                    }

                    d.extra.dcval = d.extra.dcval * d.units;
                    d.extra.dcval = d.extra.dcval.toFixed(2);
                }

                return d.extra.dcval
            };
        }

        $scope.getcppu = $scope.cppuFunction()

        $scope.colorFunction = function(){
            return function(dp, index){
                d = dp.data;

                if(d == null) {
                    d = dp;
                }

                if(d.extra.color == null) {
                    if(d.color == '' || d.color == null) {
                        // Get a random color and save it
                        d.extra.color = '#'+Math.floor(Math.random()*16777215).toString(16);
                    } else {
                        d.extra.color = d.color;
                    }
                }

                return d.extra.color;
            }
        }

        $scope.getcolor = $scope.colorFunction();

        $scope.getdefaultasset = function() {
            d = {
                    assetid: "0",
                    subcategoryid: "",
                    assetname: "",
                    assetdescription: "",
                    units: "",
                    ppu: "",
                    cppu: "",
                    unitform: "",
                    date: new Date().toISOString().slice(0, 10),
                    color: "",
                    extra: {
                        chartinclude: true,
                    },
                }

            return d;
        }


        $scope.addrow = function(index) {
            //console.log('got a call to add row');

            d = $scope.getdefaultasset();
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.newrow = true;
            if(index == -1) {
                $scope.data.push(d);
                index = $scope.data.length - 1;
            }
            else {
                $scope.data.splice(index, 0, d)
            }

            $scope.entereditmode(index);
        }

        $scope.removerow = function(index) {
            //console.log('got a call to remove row')
            assetid = $scope.data[index].assetid;
            $scope.data.splice(index, 1);

            $scope.selectedassets();

            //update database
            if(assetid != "0") {
                data = {
                    'assetid': assetid
                }
                $scope.removasset(data);
            }
        }

        $scope.removasset = function(d) {
            $http({
                method : 'POST',
                url : 'home/removeeasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully removed data from server");
                $rootScope.$broadcast('assetsupdated', 'assetsController');
            });
        }

        $scope.addupdateasset = function(d, index) {
            console.log(d);
            $http({
                method : 'POST',
                url : 'home/addupdateasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully sent data to server");
                if(data && d.assetid == "0") {
                    $scope.data[index].assetid = data.assetid;
                }
                $rootScope.$broadcast('assetsupdated', 'assetsController');
            });
        }

        $scope.entereditmode = function(index) {
            $scope.data[index].extra.editMode = true;

            d = angular.copy($scope.data[index]);
            //d.extra.copy = null;
            $scope.data[index].extra.copy = d
        }

        $scope.submitdefferredchanges = function(d, index) {
            if(typeof d.date != 'string' && !(d.date instanceof String)) {
                d.date = d.date.toISOString().slice(0, 10);
            }
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.color = null;
            d.extra.newrow = false;
            d.extra.editMode = false;

            $scope.data[index] = d;

            $scope.selectedassets();

            //Submit the changes to the backend for this row
            d = angular.copy($scope.data[index]);

            //Delete the extra information that is populated into the data
            delete d.extra;
            delete d.disabled;

            $scope.addupdateasset(d, index);
            console.log('submitting now');
        }

        $scope.submitchanges = function(index) {
            d = $scope.data[index].extra.copy;

            entereddetails = {
                'categoryname': d.extra.categoryname,
                'subcategoryname': d.extra.subcategoryname,
                'riskname': $scope.assetsOtherInfo.riskcategories[0].riskname,
            };

            if(d.extra.categoryname != $scope.data[index].extra.categoryname
                || d.extra.subcategoryname != $scope.data[index].extra.subcategoryname) {
                // Check if id exists, else create one

                categoryid = null;
                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(entereddetails.categoryname == categories[i].categoryname) {
                        categoryid = categories[i].categoryid;
                        break;
                    }
                }
                if(categoryid == null) {
                    $scope.opencategorymodel(null, entereddetails, d, index);
                } else {
                    // If id is available, check if provided subcategory exists for the category
                    // If yes then continue with the rest

                    subcategoryid = null;
                    subcategories = $scope.assetsOtherInfo.subcategories;
                    for(i = 0; i < subcategories.length; ++i) {
                        if(categoryid == subcategories[i].categoryid
                            && entereddetails.subcategoryname == subcategories[i].subcategoryname) {
                            subcategoryid = subcategories[i].subcategoryid;
                            break;
                        }
                    }

                    if(subcategoryid == null) {
                        $scope.opencategorymodel(null, entereddetails, d, index);
                    } else {
                        d.subcategoryid = subcategoryid;
                        $scope.submitdefferredchanges(d, index);
                    }
                }
            } else {
                $scope.submitdefferredchanges(d, index);
            }
        }

        $scope.cancelchanges = function(index) {
            if($scope.data[index].extra.newrow == true) {
                $scope.removerow(index);
            } else {
                delete $scope.data[index].extra.copy
                $scope.data[index].extra.editMode = false;

                $scope.selectedassets();
            }

            console.log('cancelling now');

        }

        $scope.datepickopen = function($event, index) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.data[index].extra.opened = true;
        };


        $scope.opencategorymodel = function (size, entereddetails, d, index) {

            modalInstance = $modal.open({
                    template: categoryhtml,
                    controller: categoryModelController,
                    size: size,
                    resolve: {
                        categorydetails: function () {
                            categoryInfo = {
                                'entereddetails': entereddetails,
                                'assetsOtherInfo': $scope.assetsOtherInfo,
                            };

                            return categoryInfo; // information to be passed to model
                    }
                }
            });

            modalInstance.result.then(function (saveddetails) {
                // Save the details
                d.subcategoryid = saveddetails.subcategoryid;
                d.extra.subcategoryname = saveddetails.subcategoryname;
                d.extra.categoryname = saveddetails.categoryname;

                $scope.submitdefferredchanges(d, index);
            }, function () {
                // cancelled, so nothing to do now
            });
        };


        /* All the function calls are here */

        /* Call the selectallassets */
        $scope.selectallassets();
    }
})

app.controller("categoriesController", function($scope, $rootScope, $http, $filter, $modal, Session) {

    Session.assetsotherinfodefferred.promise
        .then(function(response){return Session.assetsinfodefferred.promise})
        .then(function(response){$scope.updateAssetsData(true)});

    $scope.$on('assetsupdated', function(event, from) {
        // Even if subcategoriesController has sent it, update internal data again
        // TODO - Improve this later where, on submit, modify internal structure
        // if(from == "subcategoriesController") {
            $scope.updateAssetsData(false);
        //}
    });

    $scope.updateAssetsData = function(firstload) {
        $scope.assetsInfo = Session.assetsinfo;
        $scope.assetsOtherInfo = Session.assetsotherinfo;

        console.log($scope.assetsOtherInfo);

        $scope.assetsdata = $scope.assetsInfo.assets;
        $scope.chartdata = [];
        $scope.assetchartincludeall = true;
        $scope.data = $scope.assetsOtherInfo.subcategories;

        // Add extra data to the assets information
        for (index = 0; index < $scope.data.length; ++index) {
            if($scope.data[index].extra == null) {
                $scope.data[index].extra = {};
                $scope.data[index].extra.showassets = false;
                $scope.data[index].extra.chartinclude = true;
            }

            $scope.data[index].extra.dval = null;
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.assets = [];

        }

        // Add extra data to the assets information
        for (index = 0; index < $scope.assetsdata.length; ++index) {
            dataAdded = false;
            if($scope.assetsdata[index].extra == null) {
                $scope.assetsdata[index].extra = {};

                categoryid = 0;
                categoryname = '';
                subcategoryname = '';
                riskname = '';

                subcategories = $scope.assetsOtherInfo.subcategories;
                categoryid = 0;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == $scope.assetsdata[index].subcategoryid) {
                        subcategoryname = subcategories[i].subcategoryname;
                        categoryid = subcategories[i].categoryid;
                        riskid = subcategories[i].riskid

                        subcategories[i].extra.assets.push($scope.assetsdata[index]);
                        dataAdded = true;
                        break;
                    }
                }

                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(categories[i].categoryid == categoryid) {
                        categoryname = categories[i].categoryname;
                        break;
                    }
                }

                riskcategories = $scope.assetsOtherInfo.riskcategories;
                for(i = 0; i < riskcategories.length; ++i) {
                    if(riskcategories[i].riskid == riskid) {
                        riskname = riskcategories[i].riskname;
                        break;
                    }
                }

                $scope.data[index].extra.categoryid = categoryid;
                $scope.data[index].extra.categoryname = categoryname;
                $scope.data[index].extra.subcategoryname = subcategoryname;
                $scope.data[index].extra.riskname = riskname;
            }

            if(!dataAdded) {
                subcategories = $scope.data;
                subcategoryid = $scope.assetsdata[index].subcategoryid;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == subcategoryid) {
                        subcategories[i].extra.assets.push($scope.assetsdata[index]);
                        break;
                    }
                }
            }
        }

        $scope.nameFunction = function(){
            return function(d) {
                return d.subcategoryname;
            };
        }

        $scope.getppu = function(d, forchart){
            if(d.extra.dval == null) {
                // Calculate the values now and save it for later use
                // Note: set d.dval as null or recalculate it when d.ppu or d.units changes
                //       or when category ppu changes
                if(d.ppu != null) {
                    d.extra.dval = d.ppu;
                } else {
                    d.extra.dval = 0; //TODO - Should get value from the subcategory
                }

                d.extra.dval = d.extra.dval * d.units;
                d.extra.dval = d.extra.dval.toFixed(2);
            }

            /* If asset should not be included, then return 0 value */
            if(!forchart || d.extra.chartinclude) {
                return d.extra.dval
            } else {
                return 0;
            }
        }

        $scope.ppuFunction = function(){
            return function(d){
                return $scope.getppu(d, true);
            };
        }

        $scope.getcppu = function(d, forchart) {
            if(d.extra.dcval == null) {
                // Calculate the values now and save it for later use
                // Note: set d.dcval as null or recalculate it when d.cppu or d.units changes
                //       or when category cppu changes
                if(d.cppu != null) {
                    d.extra.dcval = d.cppu;
                } else {
                    d.extra.dcval = 0 //Should get value from the subcategory
                }

                d.extra.dcval = d.extra.dcval * d.units;
                d.extra.dcval = d.extra.dcval.toFixed(2);
            }

            if(!forchart || d.extra.chartinclude) {
                return d.extra.dcval
            } else {
                return 0;
            }
        }

        $scope.cppuFunction = function(){
            return function(d){
                return $scope.getcppu(d, true);
            };
        }

        $scope.sppuFunction = function(){
            return function(d){
                if(d.extra.dval == null) {
                    // Calculate the values now and save it for later use
                    d.extra.dval = 0;
                    for(index = 0; index < d.extra.assets.length; ++index) {
                        d.extra.dval += parseFloat($scope.getppu(d.extra.assets[index], true));
                    }
                }
                return d.extra.dval
            };
        }

        $scope.sgetppu = $scope.sppuFunction()

        $scope.scppuFunction = function(){
            return function(d){
                if(d.extra.dcval == null) {
                    // Calculate the values now and save it for later use
                    d.extra.dcval = 0;
                    for(index = 0; index < d.extra.assets.length; ++index) {
                        d.extra.dcval += parseFloat($scope.getcppu(d.extra.assets[index], true));
                    }
                }

                return d.extra.dcval
            };
        }

        $scope.sgetcppu = $scope.scppuFunction()

        $scope.colorFunction = function(){
            return function(dp, index){
                d = dp.data;

                if(d == null) {
                    d = dp;
                }

                if(d.extra.color == null) {
                    if(d.color == '' || d.color == null) {
                        // Get a random color and save it
                        d.extra.color = '#'+Math.floor(Math.random()*16777215).toString(16);
                    } else {
                        d.extra.color = d.color;
                    }
                }

                return d.extra.color;
            }
        }

        $scope.getcolor = $scope.colorFunction();

        $scope.getdefaultasset = function() {
            d = {
                    assetid: "0",
                    subcategoryid: "",
                    assetname: "",
                    assetdescription: "",
                    units: "",
                    ppu: "",
                    cppu: "",
                    unitform: "",
                    date: new Date().toISOString().slice(0, 10),
                    color: "",
                    extra: {
                        chartinclude: true,
                    },
                }

            return d;
        }

        $scope.selectedassets = function () {
            $scope.chartdata = $filter('filter')($scope.data, {extra: {chartinclude: true}});
        }

        $scope.selectedchildassets = function (index) {
            /* Recalculate the total values of subcategories */
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.dval = null;

            $scope.selectedassets();
        }

        $scope.selectallsubcategories = function(firstload) {
            for (index = 0; index < $scope.data.length; ++index) {
                $scope.data[index].extra.chartinclude = $scope.assetchartincludeall;

                if(firstload) {
                    assets = $scope.data[index].extra.assets;
                    $scope.data[index].extra.assetchartincludeall = $scope.assetchartincludeall;

                    for(i = 0; i < assets.length; ++i) {
                        assets[i].extra.chartinclude = $scope.assetchartincludeall
                    }
                }
            }

            $scope.selectedassets();
        }

        $scope.selectallassets = function(index) {
            assets = $scope.data[index].extra.assets;

            for(i = 0; i < assets.length; ++i) {
                assets[i].extra.chartinclude = $scope.data[index].extra.assetchartincludeall;
            }

            /* Recalculate the total values of subcategories */
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.dval = null;

            $scope.selectedassets();
        }


         $scope.datepickopen = function($event, parentindex, index) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.data[parentindex].extra.assets[index].extra.opened = true;
        };


        $scope.addrow = function(parentindex, index) {
            //console.log('got a call to add row');

            d = $scope.getdefaultasset();
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.newrow = true;
            if(index == -1) {
                $scope.data[parentindex].extra.assets.push(d);
                index = $scope.data[parentindex].extra.assets.length - 1;
            }
            else {
                $scope.data[parentindex].extra.assets.splice(index, 0, d)
            }

            $scope.entereditmode(parentindex, index);
        }

        $scope.removerow = function(parentindex, index) {
            //console.log('got a call to remove row')
            assetid = $scope.data[parentindex].extra.assets[index].assetid;
            var d = $scope.data[parentindex].extra.assets.splice(index, 1);

            //  Find the index of the object in assetsdata, if exists, delete from there too
            i = $scope.assetsdata.indexOf(d[0]);

            if(i >= 0) {
                $scope.assetsdata.splice(i, 1);
            }

            $scope.selectedchildassets(parentindex);

            //update database
            if(assetid != "0") {
                data = {
                    'assetid': assetid
                }
                $scope.removasset(data);
            }
        }

        $scope.removasset = function(d) {
            $http({
                method : 'POST',
                url : 'home/removeeasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully removed data from server");
                $rootScope.$broadcast('assetsupdated', 'subcategoriesController');
            });
        }

        $scope.addupdateasset = function(d, parentindex, index) {
            console.log(d);
            $http({
                method : 'POST',
                url : 'home/addupdateasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully sent data to server");
                if(data && d.assetid == "0") {
                    $scope.data[parentindex].extra.assets[index].assetid = data.assetid;
                    // new asset, push the asset to assetsInfo
                    $scope.assetsdata.push($scope.data[parentindex].extra.assets[index]);

                }

                $rootScope.$broadcast('assetsupdated', 'subcategoriesController');
            });
        }

        $scope.entereditmode = function(parentindex, index) {
            $scope.data[parentindex].extra.assets[index].extra.editMode = true;

            d = angular.copy($scope.data[parentindex].extra.assets[index]);
            //d.extra.copy = null;
            $scope.data[parentindex].extra.assets[index].extra.copy = d
        }

        $scope.submitdefferredchanges = function(d, parentindex, index) {
            if(typeof d.date != 'string' && !(d.date instanceof String)) {
                d.date = d.date.toISOString().slice(0, 10);
            }
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.color = null;
            d.extra.newrow = false;
            d.extra.editMode = false;

            // Copy all the key value pairs, such that the source is affected and not just the reference
            currentd = $scope.data[parentindex].extra.assets[index];
            for(k in d)
                currentd[k] = d[k];

            $scope.selectedassets();

            //Submit the changes to the backend for this row
            d = angular.copy($scope.data[parentindex].extra.assets[index]);

            //Delete the extra information that is populated into the data
            delete d.extra;
            delete d.disabled;

            $scope.addupdateasset(d, parentindex, index);
            console.log('submitting now');
        }

        $scope.submitchanges = function(parentindex, index) {
            d = $scope.data[parentindex].extra.assets[index].extra.copy;

            entereddetails = {
                'categoryname': d.extra.categoryname,
                'subcategoryname': d.extra.subcategoryname,
                'riskname': $scope.assetsOtherInfo.riskcategories[0].riskname,
            };

            if(d.extra.categoryname != $scope.data[index].extra.categoryname
                || d.extra.subcategoryname != $scope.data[index].extra.subcategoryname) {
                // Check if id exists, else create one

                categoryid = null;
                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(entereddetails.categoryname == categories[i].categoryname) {
                        categoryid = categories[i].categoryid;
                        break;
                    }
                }
                if(categoryid == null) {
                    $scope.opencategorymodel(null, entereddetails, d, parentindex, index);
                } else {
                    // If id is available, check if provided subcategory exists for the category
                    // If yes then continue with the rest

                    subcategoryid = null;
                    subcategories = $scope.assetsOtherInfo.subcategories;
                    for(i = 0; i < subcategories.length; ++i) {
                        if(categoryid == subcategories[i].categoryid
                            && entereddetails.subcategoryname == subcategories[i].subcategoryname) {
                            subcategoryid = subcategories[i].subcategoryid;
                            break;
                        }
                    }

                    if(subcategoryid == null) {
                        $scope.opencategorymodel(null, entereddetails, d, parentindex, index);
                    } else {
                        d.subcategoryid = subcategoryid;
                        $scope.submitdefferredchanges(d, parentindex, index);
                    }
                }
            } else {
                $scope.submitdefferredchanges(d, parentindex, index);
            }
        }

        $scope.cancelchanges = function(parentindex, index) {
            if($scope.data[parentindex].extra.assets[index].extra.newrow == true) {
                $scope.removerow(parentindex, index);
            } else {
                delete $scope.data[parentindex].extra.assets[index].extra.copy
                $scope.data[parentindex].extra.assets[index].extra.editMode = false;

                $scope.selectedchildassets();
            }

            console.log('cancelling now');

        }

        $scope.opencategorymodel = function (size, entereddetails, d, parentindex, index) {

            modalInstance = $modal.open({
                    template: categoryhtml,
                    controller: categoryModelController,
                    size: size,
                    resolve: {
                        categorydetails: function () {
                            categoryInfo = {
                                'entereddetails': entereddetails,
                                'assetsOtherInfo': $scope.assetsOtherInfo,
                            };

                            return categoryInfo; // information to be passed to model
                    }
                }
            });

            modalInstance.result.then(function (saveddetails) {
                // Save the details
                d.subcategoryid = saveddetails.subcategoryid;
                d.extra.subcategoryname = saveddetails.subcategoryname;
                d.extra.categoryname = saveddetails.categoryname;

                $scope.submitdefferredchanges(d, parentindex, index);
            }, function () {
                // cancelled, so nothing to do now
            });
        };


        /* All the function calls are here */

        if(firstload) {
            /* Call the selectallassets */
            $scope.selectallsubcategories(firstload);
        } else {
            $scope.selectedassets();
        }

    }
})

app.controller("subcategoriesController", function($scope, $rootScope, $http, $filter, $modal, Session) {

    Session.assetsotherinfodefferred.promise
        .then(function(response){return Session.assetsinfodefferred.promise})
        .then(function(response){$scope.updateAssetsData(true)});

    $scope.$on('assetsupdated', function(event, from) {
        // Even if subcategoriesController has sent it, update internal data again
        // TODO - Improve this later where, on submit, modify internal structure
        // if(from == "subcategoriesController") {
            $scope.updateAssetsData(false);
        //}
    });

    $scope.updateAssetsData = function(firstload) {
        $scope.assetsInfo = Session.assetsinfo;
        $scope.assetsOtherInfo = Session.assetsotherinfo;

        console.log($scope.assetsOtherInfo);

        $scope.assetsdata = $scope.assetsInfo.assets;
        $scope.chartdata = [];
        $scope.assetchartincludeall = true;
        $scope.data = $scope.assetsOtherInfo.subcategories;

        // Add extra data to the assets information
        for (index = 0; index < $scope.data.length; ++index) {
            if($scope.data[index].extra == null) {
                $scope.data[index].extra = {};
                $scope.data[index].extra.showassets = false;
                $scope.data[index].extra.chartinclude = true;
            }

            $scope.data[index].extra.dval = null;
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.assets = [];

        }

        // Add extra data to the assets information
        for (index = 0; index < $scope.assetsdata.length; ++index) {
            dataAdded = false;
            if($scope.assetsdata[index].extra == null) {
                $scope.assetsdata[index].extra = {};

                categoryid = 0;
                categoryname = '';
                subcategoryname = '';
                riskname = '';

                subcategories = $scope.assetsOtherInfo.subcategories;
                categoryid = 0;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == $scope.assetsdata[index].subcategoryid) {
                        subcategoryname = subcategories[i].subcategoryname;
                        categoryid = subcategories[i].categoryid;
                        riskid = subcategories[i].riskid

                        subcategories[i].extra.assets.push($scope.assetsdata[index]);
                        dataAdded = true;
                        break;
                    }
                }

                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(categories[i].categoryid == categoryid) {
                        categoryname = categories[i].categoryname;
                        break;
                    }
                }

                riskcategories = $scope.assetsOtherInfo.riskcategories;
                for(i = 0; i < riskcategories.length; ++i) {
                    if(riskcategories[i].riskid == riskid) {
                        riskname = riskcategories[i].riskname;
                        break;
                    }
                }

                $scope.data[index].extra.categoryid = categoryid;
                $scope.data[index].extra.categoryname = categoryname;
                $scope.data[index].extra.subcategoryname = subcategoryname;
                $scope.data[index].extra.riskname = riskname;
            }

            if(!dataAdded) {
                subcategories = $scope.data;
                subcategoryid = $scope.assetsdata[index].subcategoryid;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == subcategoryid) {
                        subcategories[i].extra.assets.push($scope.assetsdata[index]);
                        break;
                    }
                }
            }
        }

        $scope.nameFunction = function(){
            return function(d) {
                return d.subcategoryname;
            };
        }

        $scope.getppu = function(d, forchart){
            if(d.extra.dval == null) {
                // Calculate the values now and save it for later use
                // Note: set d.dval as null or recalculate it when d.ppu or d.units changes
                //       or when category ppu changes
                if(d.ppu != null) {
                    d.extra.dval = d.ppu;
                } else {
                    d.extra.dval = 0; //TODO - Should get value from the subcategory
                }

                d.extra.dval = d.extra.dval * d.units;
                d.extra.dval = d.extra.dval.toFixed(2);
            }

            /* If asset should not be included, then return 0 value */
            if(!forchart || d.extra.chartinclude) {
                return d.extra.dval
            } else {
                return 0;
            }
        }

        $scope.ppuFunction = function(){
            return function(d){
                return $scope.getppu(d, true);
            };
        }

        $scope.getcppu = function(d, forchart) {
            if(d.extra.dcval == null) {
                // Calculate the values now and save it for later use
                // Note: set d.dcval as null or recalculate it when d.cppu or d.units changes
                //       or when category cppu changes
                if(d.cppu != null) {
                    d.extra.dcval = d.cppu;
                } else {
                    d.extra.dcval = 0 //Should get value from the subcategory
                }

                d.extra.dcval = d.extra.dcval * d.units;
                d.extra.dcval = d.extra.dcval.toFixed(2);
            }

            if(!forchart || d.extra.chartinclude) {
                return d.extra.dcval
            } else {
                return 0;
            }
        }

        $scope.cppuFunction = function(){
            return function(d){
                return $scope.getcppu(d, true);
            };
        }

        $scope.sppuFunction = function(){
            return function(d){
                if(d.extra.dval == null) {
                    // Calculate the values now and save it for later use
                    d.extra.dval = 0;
                    for(index = 0; index < d.extra.assets.length; ++index) {
                        d.extra.dval += parseFloat($scope.getppu(d.extra.assets[index], true));
                    }
                }
                return d.extra.dval
            };
        }

        $scope.sgetppu = $scope.sppuFunction()

        $scope.scppuFunction = function(){
            return function(d){
                if(d.extra.dcval == null) {
                    // Calculate the values now and save it for later use
                    d.extra.dcval = 0;
                    for(index = 0; index < d.extra.assets.length; ++index) {
                        d.extra.dcval += parseFloat($scope.getcppu(d.extra.assets[index], true));
                    }
                }

                return d.extra.dcval
            };
        }

        $scope.sgetcppu = $scope.scppuFunction()

        $scope.colorFunction = function(){
            return function(dp, index){
                d = dp.data;

                if(d == null) {
                    d = dp;
                }

                if(d.extra.color == null) {
                    if(d.color == '' || d.color == null) {
                        // Get a random color and save it
                        d.extra.color = '#'+Math.floor(Math.random()*16777215).toString(16);
                    } else {
                        d.extra.color = d.color;
                    }
                }

                return d.extra.color;
            }
        }

        $scope.getcolor = $scope.colorFunction();

        $scope.getdefaultasset = function() {
            d = {
                    assetid: "0",
                    subcategoryid: "",
                    assetname: "",
                    assetdescription: "",
                    units: "",
                    ppu: "",
                    cppu: "",
                    unitform: "",
                    date: new Date().toISOString().slice(0, 10),
                    color: "",
                    extra: {
                        chartinclude: true,
                    },
                }

            return d;
        }

        $scope.selectedassets = function () {
            $scope.chartdata = $filter('filter')($scope.data, {extra: {chartinclude: true}});
        }

        $scope.selectedchildassets = function (index) {
            /* Recalculate the total values of subcategories */
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.dval = null;

            $scope.selectedassets();
        }

        $scope.selectallsubcategories = function(firstload) {
            for (index = 0; index < $scope.data.length; ++index) {
                $scope.data[index].extra.chartinclude = $scope.assetchartincludeall;

                if(firstload) {
                    assets = $scope.data[index].extra.assets;
                    $scope.data[index].extra.assetchartincludeall = $scope.assetchartincludeall;

                    for(i = 0; i < assets.length; ++i) {
                        assets[i].extra.chartinclude = $scope.assetchartincludeall
                    }
                }
            }

            $scope.selectedassets();
        }

        $scope.selectallassets = function(index) {
            assets = $scope.data[index].extra.assets;

            for(i = 0; i < assets.length; ++i) {
                assets[i].extra.chartinclude = $scope.data[index].extra.assetchartincludeall;
            }

            /* Recalculate the total values of subcategories */
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.dval = null;

            $scope.selectedassets();
        }


         $scope.datepickopen = function($event, parentindex, index) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.data[parentindex].extra.assets[index].extra.opened = true;
        };


        $scope.addrow = function(parentindex, index) {
            //console.log('got a call to add row');

            d = $scope.getdefaultasset();
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.newrow = true;
            if(index == -1) {
                $scope.data[parentindex].extra.assets.push(d);
                index = $scope.data[parentindex].extra.assets.length - 1;
            }
            else {
                $scope.data[parentindex].extra.assets.splice(index, 0, d)
            }

            $scope.entereditmode(parentindex, index);
        }

        $scope.removerow = function(parentindex, index) {
            //console.log('got a call to remove row')
            assetid = $scope.data[parentindex].extra.assets[index].assetid;
            var d = $scope.data[parentindex].extra.assets.splice(index, 1);

            //  Find the index of the object in assetsdata, if exists, delete from there too
            i = $scope.assetsdata.indexOf(d[0]);

            if(i >= 0) {
                $scope.assetsdata.splice(i, 1);
            }

            $scope.selectedchildassets(parentindex);

            //update database
            if(assetid != "0") {
                data = {
                    'assetid': assetid
                }
                $scope.removasset(data);
            }
        }

        $scope.removasset = function(d) {
            $http({
                method : 'POST',
                url : 'home/removeeasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully removed data from server");
                $rootScope.$broadcast('assetsupdated', 'subcategoriesController');
            });
        }

        $scope.addupdateasset = function(d, parentindex, index) {
            console.log(d);
            $http({
                method : 'POST',
                url : 'home/addupdateasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully sent data to server");
                if(data && d.assetid == "0") {
                    $scope.data[parentindex].extra.assets[index].assetid = data.assetid;
                    // new asset, push the asset to assetsInfo
                    $scope.assetsdata.push($scope.data[parentindex].extra.assets[index]);

                }

                $rootScope.$broadcast('assetsupdated', 'subcategoriesController');
            });
        }

        $scope.entereditmode = function(parentindex, index) {
            $scope.data[parentindex].extra.assets[index].extra.editMode = true;

            d = angular.copy($scope.data[parentindex].extra.assets[index]);
            //d.extra.copy = null;
            $scope.data[parentindex].extra.assets[index].extra.copy = d
        }

        $scope.submitdefferredchanges = function(d, parentindex, index) {
            if(typeof d.date != 'string' && !(d.date instanceof String)) {
                d.date = d.date.toISOString().slice(0, 10);
            }
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.color = null;
            d.extra.newrow = false;
            d.extra.editMode = false;

            // Copy all the key value pairs, such that the source is affected and not just the reference
            currentd = $scope.data[parentindex].extra.assets[index];
            for(k in d)
                currentd[k] = d[k];

            $scope.selectedassets();

            //Submit the changes to the backend for this row
            d = angular.copy($scope.data[parentindex].extra.assets[index]);

            //Delete the extra information that is populated into the data
            delete d.extra;
            delete d.disabled;

            $scope.addupdateasset(d, parentindex, index);
            console.log('submitting now');
        }

        $scope.submitchanges = function(parentindex, index) {
            d = $scope.data[parentindex].extra.assets[index].extra.copy;

            entereddetails = {
                'categoryname': d.extra.categoryname,
                'subcategoryname': d.extra.subcategoryname,
                'riskname': $scope.assetsOtherInfo.riskcategories[0].riskname,
            };

            if(d.extra.categoryname != $scope.data[index].extra.categoryname
                || d.extra.subcategoryname != $scope.data[index].extra.subcategoryname) {
                // Check if id exists, else create one

                categoryid = null;
                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(entereddetails.categoryname == categories[i].categoryname) {
                        categoryid = categories[i].categoryid;
                        break;
                    }
                }
                if(categoryid == null) {
                    $scope.opencategorymodel(null, entereddetails, d, parentindex, index);
                } else {
                    // If id is available, check if provided subcategory exists for the category
                    // If yes then continue with the rest

                    subcategoryid = null;
                    subcategories = $scope.assetsOtherInfo.subcategories;
                    for(i = 0; i < subcategories.length; ++i) {
                        if(categoryid == subcategories[i].categoryid
                            && entereddetails.subcategoryname == subcategories[i].subcategoryname) {
                            subcategoryid = subcategories[i].subcategoryid;
                            break;
                        }
                    }

                    if(subcategoryid == null) {
                        $scope.opencategorymodel(null, entereddetails, d, parentindex, index);
                    } else {
                        d.subcategoryid = subcategoryid;
                        $scope.submitdefferredchanges(d, parentindex, index);
                    }
                }
            } else {
                $scope.submitdefferredchanges(d, parentindex, index);
            }
        }

        $scope.cancelchanges = function(parentindex, index) {
            if($scope.data[parentindex].extra.assets[index].extra.newrow == true) {
                $scope.removerow(parentindex, index);
            } else {
                delete $scope.data[parentindex].extra.assets[index].extra.copy
                $scope.data[parentindex].extra.assets[index].extra.editMode = false;

                $scope.selectedchildassets();
            }

            console.log('cancelling now');

        }

        $scope.opencategorymodel = function (size, entereddetails, d, parentindex, index) {

            modalInstance = $modal.open({
                    template: categoryhtml,
                    controller: categoryModelController,
                    size: size,
                    resolve: {
                        categorydetails: function () {
                            categoryInfo = {
                                'entereddetails': entereddetails,
                                'assetsOtherInfo': $scope.assetsOtherInfo,
                            };

                            return categoryInfo; // information to be passed to model
                    }
                }
            });

            modalInstance.result.then(function (saveddetails) {
                // Save the details
                d.subcategoryid = saveddetails.subcategoryid;
                d.extra.subcategoryname = saveddetails.subcategoryname;
                d.extra.categoryname = saveddetails.categoryname;

                $scope.submitdefferredchanges(d, parentindex, index);
            }, function () {
                // cancelled, so nothing to do now
            });
        };


        /* All the function calls are here */

        if(firstload) {
            /* Call the selectallassets */
            $scope.selectallsubcategories(firstload);
        } else {
            $scope.selectedassets();
        }

    }
})

app.controller("riskbasedassetsController", function($scope, $rootScope, $http, $filter, $modal, Session) {

    Session.assetsotherinfodefferred.promise
        .then(function(response){return Session.assetsinfodefferred.promise})
        .then(function(response){$scope.updateAssetsData(true)});

    $scope.$on('assetsupdated', function(event, from) {
        // Even if riskbasedassetsController has sent it, update internal data again
        // TODO - Improve this later where, on submit, modify internal structure
        // if(from == "riskbasedassetsController") {
            $scope.updateAssetsData(false);
        //}
    });

    $scope.updateAssetsData = function(firstload) {
        $scope.assetsInfo = Session.assetsinfo;
        $scope.assetsOtherInfo = Session.assetsotherinfo;

        console.log($scope.assetsOtherInfo);

        $scope.assetsdata = $scope.assetsInfo.assets;
        $scope.chartdata = [];
        $scope.assetchartincludeall = true;
        $scope.data = $scope.assetsOtherInfo.riskcategories;

        // Add extra data to the assets information
        for (index = 0; index < $scope.data.length; ++index) {
            if($scope.data[index].extra == null) {
                $scope.data[index].extra = {};
                $scope.data[index].extra.showassets = false;
            }

            $scope.data[index].extra.dval = null;
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.assets = [];
        }

        // Add extra data to the assets information
        for (index = 0; index < $scope.assetsdata.length; ++index) {
            riskid = -1;
            if($scope.assetsdata[index].extra == null) {
                $scope.assetsdata[index].extra = {};

                categoryid = 0;
                categoryname = '';
                subcategoryname = '';
                riskname = '';

                subcategories = $scope.assetsOtherInfo.subcategories;
                categoryid = 0;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == $scope.assetsdata[index].subcategoryid) {
                        subcategoryname = subcategories[i].subcategoryname;
                        categoryid = subcategories[i].categoryid;
                        riskid = subcategories[i].riskid
                        break;
                    }
                }

                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(categories[i].categoryid == categoryid) {
                        categoryname = categories[i].categoryname;
                        break;
                    }
                }

                $scope.assetsdata[index].extra.categoryid = categoryid;
                $scope.assetsdata[index].extra.categoryname = categoryname;
                $scope.assetsdata[index].extra.subcategoryname = subcategoryname;
            }

            if(riskid == -1) {
                subcategories = $scope.assetsOtherInfo.subcategories;
                for(i = 0; i < subcategories.length; ++i) {
                    if(subcategories[i].subcategoryid == $scope.assetsdata[index].subcategoryid) {
                        riskid = subcategories[i].riskid
                        break;
                    }
                }
            }
            // We are saving risk details in data, reuse it
            riskcategories = $scope.data;
            for(i = 0; i < riskcategories.length; ++i) {
                if(riskcategories[i].riskid == riskid) {
                    riskname = riskcategories[i].riskname;
                    riskcategories[i].extra.assets.push($scope.assetsdata[index]);
                    break;
                }
            }

            $scope.assetsdata[index].extra.riskname = riskname;
        }

        $scope.nameFunction = function(){
            return function(d) {
                return d.riskname + " Risk";
            };
        }

        $scope.getppu = function(d, forchart){
            if(d.extra.dval == null) {
                // Calculate the values now and save it for later use
                // Note: set d.dval as null or recalculate it when d.ppu or d.units changes
                //       or when category ppu changes
                if(d.ppu != null) {
                    d.extra.dval = d.ppu;
                } else {
                    d.extra.dval = 0; //TODO - Should get value from the subcategory
                }

                d.extra.dval = d.extra.dval * d.units;
                d.extra.dval = d.extra.dval.toFixed(2);
            }

            /* If asset should not be included, then return 0 value */
            if(!forchart || d.extra.chartinclude) {
                return d.extra.dval
            } else {
                return 0;
            }
        }

        $scope.ppuFunction = function(){
            return function(d){
                return $scope.getppu(d, true);
            };
        }

        $scope.getcppu = function(d, forchart) {
            if(d.extra.dcval == null) {
                // Calculate the values now and save it for later use
                // Note: set d.dcval as null or recalculate it when d.cppu or d.units changes
                //       or when category cppu changes
                if(d.cppu != null) {
                    d.extra.dcval = d.cppu;
                } else {
                    d.extra.dcval = 0 //Should get value from the subcategory
                }

                d.extra.dcval = d.extra.dcval * d.units;
                d.extra.dcval = d.extra.dcval.toFixed(2);
            }

            if(!forchart || d.extra.chartinclude) {
                return d.extra.dcval
            } else {
                return 0;
            }
        }

        $scope.cppuFunction = function(){
            return function(d){
                return $scope.getcppu(d, true);
            };
        }

        $scope.rppuFunction = function(){
            return function(d){
                if(d.extra.dval == null) {
                    // Calculate the values now and save it for later use
                    d.extra.dval = 0;
                    for(index = 0; index < d.extra.assets.length; ++index) {
                        d.extra.dval += parseFloat($scope.getppu(d.extra.assets[index], true));
                    }
                }
                return d.extra.dval
            };
        }

        $scope.rgetppu = $scope.rppuFunction()

        $scope.rcppuFunction = function(){
            return function(d){
                if(d.extra.dcval == null) {
                    // Calculate the values now and save it for later use
                    d.extra.dcval = 0;
                    for(index = 0; index < d.extra.assets.length; ++index) {
                        d.extra.dcval += parseFloat($scope.getcppu(d.extra.assets[index], true));
                    }
                }

                return d.extra.dcval
            };
        }

        $scope.rgetcppu = $scope.rcppuFunction()

        $scope.colorFunction = function(){
            return function(dp, index){
                d = dp.data;

                if(d == null) {
                    d = dp;
                }

                if(d.extra.color == null) {
                    if(d.color == '' || d.color == null) {
                        // Get a random color and save it
                        d.extra.color = '#'+Math.floor(Math.random()*16777215).toString(16);
                    } else {
                        d.extra.color = d.color;
                    }
                }

                return d.extra.color;
            }
        }

        $scope.getcolor = $scope.colorFunction();

        $scope.getdefaultasset = function() {
            d = {
                    assetid: "0",
                    subcategoryid: "",
                    assetname: "",
                    assetdescription: "",
                    units: "",
                    ppu: "",
                    cppu: "",
                    unitform: "",
                    date: new Date().toISOString().slice(0, 10),
                    color: "",
                    extra: {
                        chartinclude: true,
                    },
                }

            return d;
        }

        $scope.selectedassets = function () {
            $scope.chartdata = $filter('filter')($scope.data, {extra: {chartinclude: true}});
        }

        $scope.selectedchildassets = function(index) {
            /* Recalculate the total values of risks */
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.dval = null;

            $scope.selectedassets();
        }

        $scope.selectallrisks = function(firstload) {
            for (index = 0; index < $scope.data.length; ++index) {
                $scope.data[index].extra.chartinclude = $scope.assetchartincludeall;
                
                if(firstload) {
                    assets = $scope.data[index].extra.assets;
                    $scope.data[index].extra.assetchartincludeall = $scope.assetchartincludeall;

                    for(i = 0; i < assets.length; ++i) {
                        assets[i].extra.chartinclude = $scope.assetchartincludeall
                    }
                }
            }

            $scope.selectedassets();
        }

        $scope.selectallassets = function(index) {
            assets = $scope.data[index].extra.assets;

            for(i = 0; i < assets.length; ++i) {
                assets[i].extra.chartinclude = $scope.data[index].extra.assetchartincludeall;
            }

            /* Recalculate the total values of risks */
            $scope.data[index].extra.dcval = null;
            $scope.data[index].extra.dval = null;

            $scope.selectedassets();
        }

         $scope.datepickopen = function($event, parentindex, index) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.data[parentindex].extra.assets[index].extra.opened = true;
        };


        $scope.addrow = function(parentindex, index) {
            //console.log('got a call to add row');

            d = $scope.getdefaultasset();
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.newrow = true;
            if(index == -1) {
                $scope.data[parentindex].extra.assets.push(d);
                index = $scope.data[parentindex].extra.assets.length - 1;
            }
            else {
                $scope.data[parentindex].extra.assets.splice(index, 0, d)
            }

            $scope.entereditmode(parentindex, index);
        }

        $scope.removerow = function(parentindex, index) {
            //console.log('got a call to remove row')
            assetid = $scope.data[parentindex].extra.assets[index].assetid;
            var d = $scope.data[parentindex].extra.assets.splice(index, 1);

            //  Find the index of the object in assetsdata, if exists, delete from there too
            i = $scope.assetsdata.indexOf(d[0]);

            if(i >= 0) {
                $scope.assetsdata.splice(i, 1);
            }

            $scope.selectedchildassets(parentindex);

            //update database
            if(assetid != "0") {
                data = {
                    'assetid': assetid
                }
                $scope.removasset(data);
            }
        }

        $scope.removasset = function(d) {
            $http({
                method : 'POST',
                url : 'home/removeeasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully removed data from server");
                $rootScope.$broadcast('assetsupdated', 'riskbasedassetsController');
            });
        }

        $scope.addupdateasset = function(d, parentindex, index) {
            console.log(d);
            $http({
                method : 'POST',
                url : 'home/addupdateasset',
                data : d, // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }, // set the headers so angular passing info as form data (not request payload)
                transformRequest: transformURIRequest,
            })
            .success(function(data) {
                console.log("successfully sent data to server");
                if(data && d.assetid == "0") {
                    $scope.data[parentindex].extra.assets[index].assetid = data.assetid;
                    // new asset, push the asset to assetsInfo
                    $scope.assetsdata.push($scope.data[parentindex].extra.assets[index]);
                }

                $rootScope.$broadcast('assetsupdated', 'riskbasedassetsController');
            });
        }

        $scope.entereditmode = function(parentindex, index) {
            $scope.data[parentindex].extra.assets[index].extra.editMode = true;

            d = angular.copy($scope.data[parentindex].extra.assets[index]);
            //d.extra.copy = null;
            $scope.data[parentindex].extra.assets[index].extra.copy = d
        }

        $scope.submitdefferredchanges = function(d, parentindex, index) {
            if(typeof d.date != 'string' && !(d.date instanceof String)) {
                d.date = d.date.toISOString().slice(0, 10);
            }
            d.extra.dval = null;
            d.extra.dcval = null;
            d.extra.color = null;
            d.extra.newrow = false;
            d.extra.editMode = false;

            // Copy all the key value pairs, such that the source is affected and not just the reference
            currentd = $scope.data[parentindex].extra.assets[index];
            for(k in d)
                currentd[k] = d[k];

            $scope.selectedassets();

            //Submit the changes to the backend for this row
            d = angular.copy($scope.data[parentindex].extra.assets[index]);

            //Delete the extra information that is populated into the data
            delete d.extra;
            delete d.disabled;

            $scope.addupdateasset(d, parentindex, index);
            console.log('submitting now');
        }

        $scope.submitchanges = function(parentindex, index) {
            d = $scope.data[parentindex].extra.assets[index].extra.copy;

            entereddetails = {
                'categoryname': d.extra.categoryname,
                'subcategoryname': d.extra.subcategoryname,
                'riskname': $scope.data[parentindex].riskname,
            };

            if(d.extra.categoryname != $scope.data[index].extra.categoryname
                || d.extra.subcategoryname != $scope.data[index].extra.subcategoryname) {
                // Check if id exists, else create one

                categoryid = null;
                categories = $scope.assetsOtherInfo.categories;
                for(i = 0; i < categories.length; ++i) {
                    if(entereddetails.categoryname == categories[i].categoryname) {
                        categoryid = categories[i].categoryid;
                        break;
                    }
                }
                if(categoryid == null) {
                    $scope.opencategorymodel(null, entereddetails, d, parentindex, index);
                } else {
                    // If id is available, check if provided subcategory exists for the category
                    // If yes then continue with the rest

                    subcategoryid = null;
                    subcategories = $scope.assetsOtherInfo.subcategories;
                    for(i = 0; i < subcategories.length; ++i) {
                        if(categoryid == subcategories[i].categoryid
                            && entereddetails.subcategoryname == subcategories[i].subcategoryname) {
                            subcategoryid = subcategories[i].subcategoryid;
                            break;
                        }
                    }

                    if(subcategoryid == null) {
                        $scope.opencategorymodel(null, entereddetails, d, parentindex, index);
                    } else {
                        d.subcategoryid = subcategoryid;
                        $scope.submitdefferredchanges(d, parentindex, index);
                    }
                }
            } else {
                $scope.submitdefferredchanges(d, parentindex, index);
            }
        }

        $scope.cancelchanges = function(parentindex, index) {
            if($scope.data[parentindex].extra.assets[index].extra.newrow == true) {
                $scope.removerow(parentindex, index);
            } else {
                delete $scope.data[parentindex].extra.assets[index].extra.copy
                $scope.data[parentindex].extra.assets[index].extra.editMode = false;

                $scope.selectedchildassets();
            }

            console.log('cancelling now');

        }

        $scope.opencategorymodel = function (size, entereddetails, d, parentindex, index) {

            modalInstance = $modal.open({
                    template: categoryhtml,
                    controller: categoryModelController,
                    size: size,
                    resolve: {
                        categorydetails: function () {
                            categoryInfo = {
                                'entereddetails': entereddetails,
                                'assetsOtherInfo': $scope.assetsOtherInfo,
                            };

                            return categoryInfo; // information to be passed to model
                    }
                }
            });

            modalInstance.result.then(function (saveddetails) {
                // Save the details
                d.subcategoryid = saveddetails.subcategoryid;
                d.extra.subcategoryname = saveddetails.subcategoryname;
                d.extra.categoryname = saveddetails.categoryname;

                $scope.submitdefferredchanges(d, parentindex, index);
            }, function () {
                // cancelled, so nothing to do now
            });
        };


        /* All the function calls are here */

        if(firstload) {
            /* Call the selectallassets */
            $scope.selectallrisks(firstload);
        } else {
            $scope.selectedassets();
        }
    }
})


app.controller("homeController", function($scope, Session){

    $scope.getAssetsData = function() {
        Session.getAssetsOtherInfo();
        Session.getAssetsInfo();

        Session.assetsotherinfodefferred.promise
        .then(function(response){return Session.assetsinfodefferred.promise})
        .then(function(response){$scope.updateNetAssetsData()});
    }

    $scope.$on('assetsupdated', function(event, from) {
            $scope.updateNetAssetsData();
    });

    $scope.updateNetAssetsData = function() {
        assetsdata = Session.assetsinfo.assets;

        cppuFunction = function(d){
            if(d.cppu != null) {
                dcval = d.cppu;
            } else {
                dcval = 0 //Should get value from the subcategory
            }

            dcval = dcval * d.units;

            return dcval;
        }

        netassets = 0;
        for(i = 0; i < assetsdata.length; ++i) {
            netassets += cppuFunction(assetsdata[i]);
        }

        $scope.netassets = netassets.toFixed(2);

    }

    $scope.tabselected = function() {
        for(i = 0; i < nv.graphs.length; ++i) {
            nv.graphs[i].update();
        }
    }

    //On initialization, call this up
    $scope.getAssetsData();

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
            transformRequest: transformURIRequest,
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