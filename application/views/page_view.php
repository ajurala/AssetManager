<?php
if (isset($header) && is_array($header)) {
  $this->load->view('common/header', $header);
} else {
  $this->load->view('common/header');
}
?>
 
<?php $this->load->view('common/menu'); ?>
 
<div class="container">
 
  <h1>Bootstrap starter template</h1>
  <p>Use this document as a way to quick start any new project.<br> All you get is this message and a barebones HTML document.</p>
 
</div> <!-- /container -->
 
<?php
if (isset($footer) && is_array($footer)) {
  $this->load->view('common/footer', $footer);
} else {
  $this->load->view('common/footer');
}
?>