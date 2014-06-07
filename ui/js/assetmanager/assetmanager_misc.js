categoryhtml =
    '<div class="modal-header"> \
        <h3 class="modal-title">New Category and Sub-category Details</h3> \
    </div> \
    <div class="modal-body"> \
        <div class="form-group" ng-class="{ \'has-error\' : knownCombinationError }"> \
            <label class="text-right col-md-6">Asset Type Name:</label> \
            <input type="text" class="form-control category-control col-md-2" ng-model="categorydetails.entereddetails.categoryname" typeahead="category.categoryname for category in categorydetails.assetsOtherInfo.categories" placeholder="Asset type" /> \
            <input colorpicker type="text" class="form-control category-color-control cursor col-md-2" colorpicker-position="bottom" colorpicker-fixed-position="true" ng-model="categorydetails.entereddetails.categorycolor" ng-style="{\'color\': categorydetails.entereddetails.categorycolor, \'background-color\': categorydetails.entereddetails.categorycolor}"/> \
            <div class="clearfix visible-*"></div> \
            <span class="help-block text-center" ng-show="knownCombinationError">{{ knownCombinationError }}</span> \
        </div> \
        <div class="form-group" ng-class="{ \'has-error\' : knownCombinationError }"> \
            <label class="text-right col-md-6">Sub-Asset Type Name:</label> \
            <input type="text" class="form-control category-control col-md-2" ng-model="categorydetails.entereddetails.subcategoryname" typeahead="subcategory.subcategoryname for subcategory in categorydetails.assetsOtherInfo.subcategories" placeholder="Sub-Asset type" /> \
            <input colorpicker type="text" class="form-control category-color-control cursor col-md-2" colorpicker-position="top" colorpicker-fixed-position="true" ng-model="categorydetails.entereddetails.subcategorycolor"  ng-style="{\'color\': categorydetails.entereddetails.subcategorycolor, \'background-color\': categorydetails.entereddetails.subcategorycolor}"/> \
            <div class="clearfix visible-*"></div> \
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
    </div> \
    <div class="modal-footer"> \
        <button class="btn btn-primary" ng-click="ok()">OK</button> \
        <button class="btn btn-warning" ng-click="cancel()">Cancel</button> \
    </div>';


    grouphtml =
    '<div class="modal-header"> \
        <h3 class="modal-title">New Group Details</h3> \
    </div> \
    <div class="modal-body"> \
        <div class="form-group" ng-class="{ \'has-error\' : groupError }"> \
            <label class="text-right col-md-6">Group Name:</label> \
            <input type="text" class="form-control group-control" ng-model="groupdetails.groupname" typeahead="group.groupname for group in assetsOtherInfo.customgroups" placeholder="Group Name" /> \
            <span class="help-block text-center" ng-show="groupError">{{ groupError }}</span> \
        </div> \
        <div class="form-group"> \
            <label class="text-right col-md-6">Color:</label> \
            <input colorpicker type="text" class="form-control group-color-control cursor" colorpicker-position="bottom" colorpicker-fixed-position="true" ng-model="groupdetails.color"  ng-style="{\'color\': groupdetails.color, \'background-color\': groupdetails.color}"/> \
        </div> \
    </div> \
    <div class="modal-footer"> \
        <button class="btn btn-primary" ng-click="ok()">OK</button> \
        <button class="btn btn-warning" ng-click="cancel()">Cancel</button> \
    </div>';