<?php
if (isset($header) && is_array($header)) {
  $this->load->view('common/header', $header);
} else {
  $this->load->view('common/header');
}
?>
 
<?php $this->load->view('common/menu'); ?>
 
<div class="container">
<div class="alert alert-success text-center ng-cloak" ng-show="alertInfo">
    <div>
      <!-- <a class="close" data-dismiss="alert">×</a>  -->
      {{alertInfo}}
    </div>
</div> 
<div ng-view>
</div>

</div> <!-- /container -->
 
<?php
if (isset($footer) && is_array($footer)) {
  $this->load->view('common/footer', $footer);
} else {
  $this->load->view('common/footer');
}
?>