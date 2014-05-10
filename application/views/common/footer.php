    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->

    <!-- This should not be used as moving to angular js. But there are few cases where it is simpler to user jquery
         like converting form data properly from angular format to form data format using .params() -->
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    
    <?php if (isset($scripts)) { ?>
    <?php foreach ($scripts as $filename => $folder): ?>
        <script type="text/javascript" src="<?php echo base_url() . 'ui/js/' . $folder . '/' . $filename; ?>"></script>
    <?php endforeach; ?>
    <?php } ?>

    <!-- Bootstrap js, replace it with angular-ui-bootstrap js -->
    <script type="text/javascript" src="<?php echo base_url(); ?>ui/js/bootstrap/bootstrap.js"></script>

    <!-- Angularjs related scripts -->
    <script type="text/javascript" src="<?php echo base_url(); ?>ui/js/angular/angular.js"></script>
    <script type="text/javascript" src="<?php echo base_url(); ?>ui/js/angular/angular-route.js"></script>
    <script type="text/javascript" src="<?php echo base_url(); ?>ui/js/assetmanager/assetmanager_app.js"></script>
    <script type="text/javascript" src="<?php echo base_url(); ?>ui/js/assetmanager/assetmanager_controller.js"></script>
    
  </body>
</html>