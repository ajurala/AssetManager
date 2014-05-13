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

            // Get the access roles available
            $this->db->select('accessid');
            $query = $this->db->get('accessrole');

            foreach ($query->result() as $row)
            {
                $data = array(
                        'userid' => 0,
                        'accessid' => $row->accessid
                    );
                $this->db->insert('userroles', $data);
            }
        }

        // Update configured state in db and session
        $this->db->update('assetmanager', array('configured' => 1));
        $this->session->set_userdata('configured', '1');

        return true;

    }

    public function updateUser($user, $password, $currentpassword, $displayname, &$message) {

        // Check if user is already present, if so update the password, else problem
        $this->db->select('username');
        $query = $this->db->get('users', array('username' => $user));
        $count = $query->num_rows();

        if($count === 1) {
            // User exists, check if it is the same person as logged in, or has the access role to update others
            $row = $query->row();
            $userinfo = get_user_info();
            $update = false;
            $username = $row->username;

            if($userinfo['username'] === $username)
            {
                $update = true;
            } else {
                // Check for the access role, if invalid then set the $message

                $message = 'You do not have sufficient permission to update profile';
                return false
            }

            if($update) {
                // Update the displayname/password
                if($password === NULL) {
                    // Update displayname
                    $this->db->update('users', array('displayname' => $displayname), array('username' => $user));
                    if($userinfo['username'] === $username)
                    {
                        $this->session->set_userdata('displayname', $displayname);
                    }
                } else {
                    // Check if current password is right

                    $this->db->select('userpassword');
                    $query = $this->db->get('users', array('username' => $user));
                    $count = $query->num_rows();

                    //Double sure before updating password
                    if($count === 1) {
                        $row = $query->row();
                        $storedhash = $row->userpassword;

                        if($this->bcrypt->check_password($currentpassword, $hash)) {
                            $hashpass = $this->bcrypt->hash_password($password);
                            $this->db->update('users', array('userpassword' => $hash, 'displayname' => $displayname), array('username' => $user));

                            if($userinfo['username'] === $username)
                            {
                                $this->session->set_userdata('displayname', $displayname);
                            }
                        } else {
                            $message = 'Invalid current password';
                        return false;
                        }
                    } else {
                        $message = 'No such user to update profile';
                        return false;
                    }
                }
            }

        } else {
            // Invalid user
            $message = 'No such user to update profile';
            return false;
        }

        // Update configured state in db and session
        $this->db->update('assetmanager', array('configured' => 1));
        $this->session->set_userdata('configured', '1');

        return true;
    }
}