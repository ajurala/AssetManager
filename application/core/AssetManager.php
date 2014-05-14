<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class AssetManager extends CI_Controller
{
    public function __construct() {
        parent::__construct();
        /* Check for access roles and then redirect if not allowed */

        if(!access_allowed(uri_string())) {
            redirect('');
        }
    }

    public function index() {
        $this->load->view('base');
    }
}