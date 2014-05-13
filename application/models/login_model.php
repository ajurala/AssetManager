<?php
class Login_model extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    // Update the admin password
    public function login($user, $password) {
        if($user !== 'admin') {
            return false;
        }


        // Check if admin is already present, if so update the password, else create one
        $this->db->select('id, username, userpassword, displayname');
        $query = $this->db->get('users', array('username' => $user));
        $count = $query->num_rows();
        if($count === 1) {
            $row = $query->row();

            $hash = $row->userpassword;

            if($this->bcrypt->check_password($password, $hash)) {
                // Set session info once login is successful
                $this->session->set_userdata('loggedin', true);
                $this->session->set_userdata('userid', $row->id);
                $this->session->set_userdata('username', $row->username);
                $this->session->set_userdata('displayname', $row->displayname);

                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }
}
