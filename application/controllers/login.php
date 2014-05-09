<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Login extends CI_Controller
{
    public function __construct() {
        parent::__construct();
    }
 
    // this is the Login page
    public function index() {
    	//$data['header']['title'] = 'login';
        $this->load->view('login');
    }
}