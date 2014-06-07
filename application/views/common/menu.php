<div class="navbar navbar-inverse navbar-fixed-top" ng-controller="navbarController">
  <div class="navbar-inner">
    <div class="container">
      <button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Asset Manager</a>
      <div class="navbar-collapse" collapse="isCollapsed">
        <ul class="nav navbar-nav">
          <li class="active"><a href="<?php echo base_url(); ?>home">Home</a></li>
          <li class="dropdown" ng-show="loggedin">
            <a href class="dropdown-toggle ng-cloak">
              New
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li><a class="cursor" ng-click="">Category</a></li>
              <li><a class="cursor" ng-click="">Subcategory</a></li>
              <li><a class="cursor" ng-click="">Custom Group</a></li>
            </ul>
          </li>
        </ul>

        <ul class="nav navbar-nav navbar-right">
        <li class="dropdown" ng-show="loggedin">
          <a href class="dropdown-toggle ng-cloak">
            {{displayname}}
            <b class="caret"></b>
          </a>
          <ul class="dropdown-menu">
            <li><a href="<?php echo base_url(); ?>user">Profile</a></li>
            <li ng-show="admin"><a href="<?php echo base_url(); ?>user/register">Register user</a></li>
            <li ng-show="admin"><a href="<?php echo base_url(); ?>user/users" ng-click=getUsersInfo()>Users</a></li>
            <li class="divider"></li>
            <li><a href="" ng-click="logout()">Logout</a></li>
          </ul>
        </li>
        <li class="active" ng-hide="loggedin"><a href="<?php echo base_url(); ?>login">Login</a></li>
      </ul>
      </div><!--/.nav-collapse -->
    </div>
  </div>
</div>