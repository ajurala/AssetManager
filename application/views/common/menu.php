<div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Asset Manager</a>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li class="active"><a href="<?php echo base_url(); ?>home">Home</a></li>
        </ul>
        
        <ul class="nav navbar-nav navbar-right" ng-controller="navbarController">
        <li class="dropdown" ng-show="loggedin">
          <a href="" class="dropdown-toggle" data-toggle="dropdown">
            {{username}}
            <b class="caret"></b>
          </a>
          <ul class="dropdown-menu">
            <li><a href="<?php echo base_url(); ?>user" >Profile</a></li>
            <li><a href="" ng-click="logout()">Logout</a></li>
          </ul>
        </li>
        <li class="active" ng-hide="loggedin"><a href="<?php echo base_url(); ?>login">Login</a></li>
      </ul>
      </div><!--/.nav-collapse --> 
    </div>
  </div>
</div>