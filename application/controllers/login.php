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
        $errors         = array();      // array to hold validation errors
        $data           = array();      // array to pass back data
        if(is_configured()) {
            $this->form_validation->set_rules('password', 'Password', 'required|xss_clean');
            $this->form_validation->set_rules('name', 'Name', 'trim|required|xss_clean');
            if($this->form_validation->run() == false){
                $errors['password'] = form_error('password', ' ', ' ');
                $errors['name'] = form_error('name', ' ', ' ');
            }else{
                 $this->load->model("login_model");
                 $user = $this->input->post("name");
                 $password = $this->input->post("password");
                 $login = $this->login_model->login($user, $password);
                 if($login === false){
                    // Destroy the session, as something bad could be done here ... :-)
                    $this->session->sess_destroy();
                    $errors['message'] = "Could not login. Invalid username / password combination";
                 }
            }
        } else {
            $errors['message'] = "Could not login. Try again.";
        }
        
        // response if there are errors
        if (!empty($errors)) {
            // if there are items in our errors array, return those errors
            $data['success'] = false;
            $data['errors']  = $errors;
        } else {
            // if there are no errors, return a message
            $data['success'] = true;
            $data['message'] = 'Successfully logged in!';
        }

        // return all our data to an AJAX call
        echo json_encode($data);
    }

    public function get_login_info() {
        $data['configured'] = is_configured();
        $data['loggedin'] = is_logged_in();
        $data['userinfo'] = get_user_info();

        echo json_encode($data);
    }
}