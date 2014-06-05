categoryhtml =
    '<div class="modal-header"> \
        <h3 class="modal-title">New Category and Sub-category Details</h3> \
    </div> \
    <div class="modal-body"> \
        <div class="form-group" ng-class="{ \'has-error\' : knownCombinationError }"> \
            <label class="text-right col-md-6">Asset Type Name:</label> \
            <span><input type="text" class="form-control category-control" ng-model="categorydetails.entereddetails.categoryname" typeahead="category.categoryname for category in categorydetails.assetsOtherInfo.categories" placeholder="Asset type" /></span> \
            <span><input colorpicker type="text" class="form-control category-color-control" colorpicker-position="bottom" colorpicker-fixed-position="true" ng-model="categorydetails.entereddetails.categorycolor" ng-style="{\'color\': categorydetails.entereddetails.categorycolor, \'background-color\': categorydetails.entereddetails.categorycolor}" size="5"/></span> \
            <span class="help-block text-center" ng-show="knownCombinationError">{{ knownCombinationError }}</span> \
        </div> \
        <div class="form-group" ng-class="{ \'has-error\' : knownCombinationError }"> \
            <label class="text-right col-md-6">Sub-Asset Type Name:</label> \
            <input type="text" class="form-control category-control" ng-model="categorydetails.entereddetails.subcategoryname" typeahead="subcategory.subcategoryname for subcategory in categorydetails.assetsOtherInfo.subcategories" placeholder="Sub-Asset type" /> \
            <span class="help-block text-center" ng-show="knownCombinationError">{{ knownCombinationError }}</span> \
        </div> \
        <div class="form-group" ng-class="{ \'has-error\' : riskError }"> \
            <label class="text-right col-md-6">Risk:</label> \
            <input type="text" class="form-control category-control" ng-model="categorydetails.entereddetails.riskname" typeahead="risk.riskname for risk in categorydetails.assetsOtherInfo.riskcategories" typeahead-editable="false" placeholder="Risk Type" /> \
            <span class="help-block text-center" ng-show="riskError">{{ riskError }}</span> \
        </div> \
        <div class="form-group"> \
            <label class="text-right col-md-6">Current Price Per Unit: </label> \
            <input type="text" class="form-control category-control" ng-model="categorydetails.entereddetails.currentpriceperunit" /> \
        </div> \
        <div class="form-group"> \
            <label class="text-right col-md-6">Units: </label> \
            <input type="text" class="form-control category-control" ng-model="categorydetails.entereddetails.unitform" placeholder="units (ex. gms)" /> \
        </div> \
        <div class="form-group"> \
            <label class="text-right col-md-6">Sub-Asset Type Color: </label> \
            <input colorpicker type="text" class="form-control category-control" colorpicker-position="top" colorpicker-fixed-position="true" ng-model="categorydetails.entereddetails.subcategorycolor" /> \
        </div> \
    </div> \
    <div class="modal-footer"> \
        <button class="btn btn-primary" ng-click="ok()">OK</button> \
        <button class="btn btn-warning" ng-click="cancel()">Cancel</button> \
    </div>';