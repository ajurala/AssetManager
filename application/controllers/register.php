<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Login extends CI_Controller
{
    public function __construct() {
        parent::__construct();

        //Only Ajax Calls are allowed to populate the partials as only welcome page loads full page
        if(!$this->input->is_ajax_request()) {
            redirect('');
        }

        //Check if configured, if so then go to welcome page
        if(is_configured())
            redirect('');
    }
 
    // this is the Login page
    public function index() {
    }

    public function initialConfiguration() {

        /* If already configured then ignore this request */
        if(!is_configured()) {
            
        }
    }
}