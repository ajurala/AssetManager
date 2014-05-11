<?php
class User_model extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    // Update the admin password
    public function updateadmin($user, $password) {
        if($user !== 'admin') {
            return false;
        }

        $hash = $this->bcrypt->hash_password($password);
        // Check if admin is already present, if so update the password, else create one
        $this->db->select('username');
        $count = $this->db->count_all_results('users', array('username' => $user));

        if($count) {
            // Admin exists, update password
            $this->db->update('users', array('userpassword' => $hash), array('username' => $user)); 

        } else {
            // Set everything up now
            $data = array(
               'id' => 0 ,
               'username' => $user ,
               'userpassword' => $hash,
               'displayname' => 'Admin'
            );

            $this->db->insert('users', $data);
        }

        // Update configured state in db and session
        $this->db->update('assetmanager', array('configured' => 1));
        $this->session->set_userdata('configured', '1');

        return true;

    }

    public function updateUser($user, $displayname,$password) {
        
    }
}