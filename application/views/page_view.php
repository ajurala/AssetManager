<?php
if (isset($header) && is_array($header)) {
  $this->load->view('common/header', $header);
} else {
  $this->load->view('common/header');
}
?>
 
<?php $this->load->view('common/menu'); ?>
 
<div class="container">
</div> <!-- /container -->
 
<?php
if (isset($footer) && is_array($footer)) {
  $this->load->view('common/footer', $footer);
} else {
  $this->load->view('common/footer');
}
?>