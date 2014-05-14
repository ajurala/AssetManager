<?php
class Login_model extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    // Update the admin password
    public function login($user, $password) {
        // Check if user is already present, if so allow login
        $this->db->select('id, username, userpassword, displayname');
        $query = $this->db->get_where('users', array('username' => $user));
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

                $this->db->select('accessid');
                $query = $this->db->get_where('userroles', array('userid' => $row->id));

                $count = $query->num_rows();

                $accessroleids = array();
                $accessroles = array();
                foreach ($query->result() as $row)
                {
                    $accessroleids[] = $row->accessid;

                    //get the access name
                    $this->db->select('accessname');
                    $query = $this->db->get_where('accessrole', array('accessid' => $row->accessid));
                    $accessroles[] = $query->row()->accessname;
                }

                $this->session->set_userdata('accessroles', $accessroles);
                $this->session->set_userdata('accessroleids', $accessroleids);

                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }
}
