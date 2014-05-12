<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class User extends AssetManager
{
    public function __construct() {
        parent::__construct();

    }

    public function register() {
        if(is_configured()) {
            
        }
    }
    
    public function update() {
        if(is_configured() && $this->input->is_ajax_request()) {
            
        }
    }
    public function firstrun() {

        /* If already configured then ignore this request */
        if(!is_configured() && $this->input->is_ajax_request()) {
            $errors         = array();      // array to hold validation errors
            $data           = array();      // array to pass back data

            $this->form_validation->set_rules('password', 'Password', 'trim|required|xss_clean');
            $this->form_validation->set_rules('name', 'Name', 'trim|required|xss_clean');
            if($this->form_validation->run() == false){
                $errors['password'] = form_error('password', ' ', ' ');
                $errors['name'] = form_error('name', ' ', ' ');
            }else{
                 $this->load->model("user_model");
                 $user = $this->input->post("name");
                 $password = $this->input->post("password");
                 $updateadmin = $this->user_model->updateadmin($user, $password);
                 if($updateadmin === false){
                    $errors['message'] = "Could not update admin password. Try again.";
                 }
            }

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