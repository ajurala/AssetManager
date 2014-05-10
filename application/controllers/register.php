<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class Register extends CI_Controller
{
    public function __construct() {
        parent::__construct();

    }
 
    // this is the Login page
    public function index() {
        $data['header']['configured'] = get_configured_status();
        $this->load->view('base', $data);
    }

    public function initialConfiguration() {

        /* If already configured then ignore this request */
        if(!is_configured()) {
            $errors         = array();      // array to hold validation errors
            $data           = array();      // array to pass back data

            // validate the variables ======================================================
            if ($this->input->post('name') == false)
                $errors['name'] = 'Name is required';

            if ($this->input->post('password') == false)
                $errors['password'] = 'Password is required.';

            // return a response ===========================================================

            // response if there are errors
            if (!empty($errors)) {
                // if there are items in our errors array, return those errors
                $data['success'] = false;
                $data['errors']  = $errors;
            } else {
                // if there are no errors, return a message
                $data['success'] = true;
                $data['message'] = 'Successfully changed password!';
            }

            // return all our data to an AJAX call
            echo json_encode($data);
        }
    }
}