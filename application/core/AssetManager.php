<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class AssetManager extends CI_Controller
{
    public function __construct() {
        parent::__construct();

        //Check for the login details before anything
        if(!is_logged_in())
            redirect('');

        //Only Ajax Calls are allowed to populate the partials as only welcome page loads full page
        if(!$this->input->is_ajax_request()) {
            redirect('');
        }
    }
}