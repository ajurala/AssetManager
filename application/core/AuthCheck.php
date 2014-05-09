<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class AuthCheck extends CI_Controller
{
    public function __construct() {
        parent::__construct();
        //Check for the login details before anything
        redirect('');
    }
}