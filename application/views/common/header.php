<!DOCTYPE html>
<html lang="en" ng-app="AssetManager">
  <head>
    <meta charset="utf-8">
    <?php if(isset($header) && isset($header['title'])): ?>
        <title><?php echo $header['title']; ?> | Asset Manager</title>
    <?php else: ?>
        <title>Asset Manager</title>
    <?php endif; ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
 
    <!-- Le styles -->
    <link href="<?php echo base_url(); ?>ui/css/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>ui/css/style.css" rel="stylesheet">
    <link href="<?php echo base_url(); ?>ui/images/favicon.ico" rel="shortcut icon"/>
 
    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.1/html5shiv.js"></script>
    <![endif]-->

    <base href="<?php echo base_url() ?>" /> 
  </head>
 
  <body ng-controller="MainCtrl" init-data="inputdata.configured=
        <?php if(isset($header) && isset($header['configured'])): ?> 
            <?php echo $header['configured']; ?>
        <?php else: ?>
            0
        <?php endif; ?> 
    ; inputdata.test='as';" >