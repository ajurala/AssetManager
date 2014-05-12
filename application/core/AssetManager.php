<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class AssetManager extends CI_Controller
{
    public function __construct() {
        parent::__construct();
        /*if(!$this->input->is_ajax_request()) {
            $this->load->view('base');
        }*/
    }

    public function index() {
        $this->load->view('base');
    }
}