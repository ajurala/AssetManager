<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User extends AssetManager
{
    private $pass = array(
                'formdata' => 'password',
                'name'=> 'Password',
                'rules'=> 'required|xss_clean',
            );

    private $currentpassword = array(
                'formdata' => 'currentpassword',
                'name'=> 'Current password',
                'rules'=> 'required|xss_clean',
            );

    private $username = array(
                'formdata' => 'name',
                'name'=> 'Name',
                'rules'=> 'trim|required|alpha_dash|xss_clean',
                );

    private $displayname = array(
                    'formdata' => 'displayname',
                    'name'=> 'Display name',
                    'rules'=> 'required|xss_clean',
                   );

    public function __construct() {
        parent::__construct();

    }

    private function senddata($data, $errors, $successmessage) {
        // response if there are errors
        if (!empty($errors)) {
            // if there are items in our errors array, return those errors
            $data['success'] = false;
            $data['errors']  = $errors;
        } else {
            // if there are no errors, return a message
            $data['success'] = true;
            $data['message'] = $successmessage;
        }

        // return all our data to an AJAX call
        echo json_encode($data);
    }

    public function register($request='') {
        if($request === "new") {
            if(is_configured() && is_logged_in()) {
                $errors         = array();      // array to hold validation errors
                $data           = array();      // array to pass back data
                $displayname    = "";

                $this->form_validation->set_rules($this->pass['formdata'], $this->pass['name'], $this->pass['rules']);
                $this->form_validation->set_rules($this->username['formdata'], $this->username['name'], $this->username['rules']);
                $this->form_validation->set_rules($this->displayname['formdata'], $this->displayname['name'], $this->displayname['rules']);

                if($this->form_validation->run() === false){
                    $errors[$this->pass['formdata']] = form_error($this->pass['formdata'], ' ', ' ');
                    $errors[$this->username['formdata']] = form_error($this->username['formdata'], ' ', ' ');
                    $errors[$this->displayname['formdata']] = form_error($this->displayname['formdata'], ' ', ' ');
                }else{
                     $this->load->model("user_model");
                     $user = $this->input->post($this->username['formdata']);
                     $password = $this->input->post($this->pass['formdata']);
                     $displayname = $this->input->post($this->displayname['formdata']);
                     $access = $this->input->post('admin') === "true";
                     $message = "";

                     $update = $this->user_model->registerUser($user, $password, $displayname, $access, $message);
                     if($update === false){
                        $errors['message'] = $message;
                     }
                }
                $this->senddata($data, $errors, "User ".$displayname." was successfully added");
            }
        } else {
            $this->load->view('base');
        }
    }

    public function update($request='') {
        if($request === "all") {
            if(is_configured() && is_logged_in()) {
                $errors         = array();      // array to hold validation errors
                $data           = array();      // array to pass back data

                $this->form_validation->set_rules($this->pass['formdata'], $this->pass['name'], $this->pass['rules']);
                $this->form_validation->set_rules($this->currentpassword['formdata'], $this->currentpassword['name'], $this->currentpassword['rules']);
                $this->form_validation->set_rules($this->username['formdata'], $this->username['name'], $this->username['rules']);
                $this->form_validation->set_rules($this->displayname['formdata'], $this->displayname['name'], $this->displayname['rules']);

                if($this->form_validation->run() === false){
                    $errors[$this->pass['formdata']] = form_error($this->pass['formdata'], ' ', ' ');
                    $errors[$this->currentpassword['formdata']] = form_error($this->currentpassword['formdata'], ' ', ' ');
                    $errors[$this->username['formdata']] = form_error($this->username['formdata'], ' ', ' ');
                    $errors[$this->displayname['formdata']] = form_error($this->displayname['formdata'], ' ', ' ');
                }else{
                     $this->load->model("user_model");
                     $user = $this->input->post($this->username['formdata']);
                     $password = $this->input->post($this->pass['formdata']);
                     $currentpassword = $this->input->post($this->currentpassword['formdata']);
                     $displayname = $this->input->post($this->displayname['formdata']);
                     $message = "";

                     $update = $this->user_model->updateUser($user, $password, $currentpassword, $displayname, $message);
                     if($update === false){
                        $errors['message'] = $message;
                     }
                }
                $this->senddata($data, $errors, "Updated profile successfully");
            }
        } else if($request === "displayname") {
            if(is_configured() && is_logged_in()) {
                $errors         = array();      // array to hold validation errors
                $data           = array();      // array to pass back data

                $this->form_validation->set_rules($this->username['formdata'], $this->username['name'], $this->username['rules']);
                $this->form_validation->set_rules($this->displayname['formdata'], $this->displayname['name'], $this->displayname['rules']);

                if($this->form_validation->run() === false){
                    $errors[$this->username['formdata']] = form_error($this->username['formdata'], ' ', ' ');
                    $errors[$this->displayname['formdata']] = form_error($this->displayname['formdata'], ' ', ' ');
                }else{
                     $this->load->model("user_model");
                     $user = $this->input->post($this->username['formdata']);
                     $displayname = $this->input->post($this->displayname['formdata']);
                     $message = "";

                     $update = $this->user_model->updateUser($user, NULL, NULL, $displayname, $message);
                     if($update === false){
                        $errors['message'] = $message;
                     }
                }
                $this->senddata($data, $errors, "Update profile successfully");
            }
        } else {
            $this->load->view('base');
        }
    }

    public function firstrun($request='') {
        if($request === "configure") {
            /* If already configured then ignore this request */
            if(!is_configured()) {
                $errors         = array();      // array to hold validation errors
                $data           = array();      // array to pass back data

                $this->form_validation->set_rules($this->pass['formdata'], $this->pass['name'], $this->pass['rules']);
                $this->form_validation->set_rules($this->username['formdata'], $this->username['name'], $this->username['rules']);
                if($this->form_validation->run() === false){
                    $errors[$this->pass['formdata']] = form_error($this->pass['formdata'], ' ', ' ');
                    $errors[$this->username['formdata']] = form_error($this->username['formdata'], ' ', ' ');
                }else{
                     $this->load->model("user_model");
                     $user = $this->input->post($this->username['formdata']);
                     $password = $this->input->post($this->username['formdata']);
                     $updateadmin = $this->user_model->updateadmin($user, $password);
                     if($updateadmin === false){
                        $errors['message'] = "Could not update admin password. Try again.";
                     }
                }

                $this->senddata($data, $errors, 'Successfully changed password!');
            }
        } else {
            $this->load->view('base');
        }
    }
}