<?php
class User_model extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    private function addAdminAccess($userid) {
        // Get the access roles available
        $this->db->select('accessid');
        $query = $this->db->get('accessrole');

        foreach ($query->result() as $row)
        {
            $data = array(
                    'userid' => $userid,
                    'accessid' => $row->accessid
                );
            $this->db->insert('userroles', $data);
        }
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
            $this->addAdminAccess(0);

        }

        // Update configured state in db and session
        $this->db->update('assetmanager', array('configured' => 1));
        $this->session->set_userdata('configured', '1');

        return true;

    }

    public function updateUser($user, $password, $currentpassword, $displayname, &$message) {

        // Check if user is already present, if so update the password, else problem
        $this->db->select('id, username');
        $query = $this->db->get_where('users', array('username' => $user));
        $count = $query->num_rows();

        if($count === 1) {
            // User exists, check if it is the same person as logged in, or has the access role to update others
            $row = $query->row();
            $userinfo = get_user_info();
            $update = false;
            $username = $row->username;
            $userid = $row->id;

            if($userinfo['username'] === $username)
            {
                $update = true;
            } else {
                // Check for the access role, if invalid then set the $message
                // Only administrator can change user profile of administrator
                if($userid != 0 && access_allowed('otheruserupdate')){
                    $update = true;
                }

                if(!$update) {
                    $message = 'You do not have sufficient permission to update profile';
                    return false;
                }
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
                    $query = $this->db->get_where('users', array('username' => $user));
                    $count = $query->num_rows();

                    //Double sure before updating password
                    if($count === 1) {
                        $row = $query->row();
                        $storedhash = $row->userpassword;

                        /*
                         *  If $currentpassword is null, then some admin is forcing password change
                         *  and we are already checking for access role, so fine to change password
                         */

                        if($currentpassword ===NULL || $this->bcrypt->check_password($currentpassword, $storedhash)) {
                            $hashpass = $this->bcrypt->hash_password($password);
                            $this->db->update('users', array('userpassword' => $hashpass, 'displayname' => $displayname), array('username' => $user));

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

        return true;
    }

    public function registerUser($user, $password, $displayname, $access, &$message) {

        // Check if user is already present, if so return error
        $this->db->select('id, username');
        $query = $this->db->get_where('users', array('username' => $user));
        $count = $query->num_rows();

        // If no such user exists then register a new user

        if($count === 0) {

            /* Check for the access role, if invalid then set the $message- TODO */
            /*
             *  This should be handled at the constructer level it,
             *  where if the uri is not allowed, redirect the user
             */

            $hashpass = $this->bcrypt->hash_password($password);

            $this->db->select_max('id');
            $query = $this->db->get('users');
            $row = $query->row();
            $id = $row->id + 1;

            $data = array(
                'id'           => $id,
                'username'      => $user,
                'userpassword'  => $hashpass,
                'displayname'   => $displayname
            );

            $this->db->insert('users', $data);

            $this->db->select('id');
            $query = $this->db->get_where('users', array('username' => $user));
            $count = $query->num_rows();

            if($count === 1) {
                // If user is created as admin, then add all the roles
                $row = $query->row();
                $userid = $row->id;

                if($access) {
                    $this->addAdminAccess($userid);
                } else {
                    $data = array(
                            'userid' => $userid,
                            'accessid' => 1
                        );
                    $this->db->insert('userroles', $data);
                }
            } else {
                $message = 'User was not registered';
                return false;
            }

        } else {
            $message = 'User already exists';
            return false;
        }

        return true;
    }
}