<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Login extends CI_Controller
{
    public function __construct() {
        parent::__construct();

        //Check for acl access for login?
        //echo $this->uri->uri_string();
    }
 
    // this is the Login page
    public function index() {
    	$data['header']['configured'] = get_configured_status();

        $this->load->view('base', $data);
    }

    public function loginUser() {
        if(is_configured()) {

        }
    }

    public function get_login_info() {
        $data['configured'] = is_configured();
        $data['loggedin'] = is_logged_in();
        $data['userinfo'] = get_user_info();

        echo json_encode($data);
    }
}