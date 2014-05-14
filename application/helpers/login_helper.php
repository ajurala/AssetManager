<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('is_logged_in'))
{
    function is_logged_in()
    {
        // Get current CodeIgniter instance
        $CI =& get_instance();
        $loggedin = $CI->session->userdata('loggedin');
        return $loggedin;
    }
}

if ( ! function_exists('get_user_info'))
{
    function get_user_info()
    {
        // Get current CodeIgniter instance
        $CI =& get_instance();

        $user_info['userid'] = $CI->session->userdata('userid');
        $user_info['username'] = $CI->session->userdata('username');
        $user_info['displayname'] = $CI->session->userdata('displayname');
        $user_info['accessroles'] = $CI->session->userdata('accessroles');
        $user_info['accessroleids'] = $CI->session->userdata('accessroleids');
        $user_info['admin'] = $CI->session->userdata('admin');
        return $user_info;
    }
}

if ( ! function_exists('is_configured'))
{
    function is_configured()
    {
        // Get current CodeIgniter instance
        $CI =& get_instance();
        $configured = get_configured_status();

        return ($configured !== "0");
    }
}

if ( ! function_exists('get_configured_status'))
{
    function get_configured_status()
    {
        // Get current CodeIgniter instance
        $CI =& get_instance();
        $configured = $CI->session->userdata('configured');
        if($configured === FALSE) {
            # Get the value from database and set it into the session for later use
            $CI->db->select('configured');
            $query = $CI->db->get('assetmanager');
            $row = $query->row();
            $configured = $row->configured;

            $CI->session->set_userdata('configured', $configured);
        }

        return $configured;
    }
}

if ( ! function_exists('access_allowed'))
{
    function access_allowed($permkey)
    {
        // Get current CodeIgniter instance
        $CI =& get_instance();

        // Get the uri perms first
        $permissions = get_permissions();

        //var_dump($permissions);

        /* If access to all , then return true, else check for access role */
        if(array_key_exists ( $permkey , $permissions )) {
            $permission = $permissions[$permkey];
        } else {
            return false;
        }

        if($permission == 999) {
            return true;
        }

        $accessroleids = $CI->session->userdata('accessroleids');

        if($accessroleids === FALSE) {
            return false;
        }

        /*echo "hmmm he is returning false??? ";
        echo $permission;
        echo "what could be the issue??? ";
        var_dump($accessroleids);*/

        return in_array($permission, $accessroleids);
    }
}

if ( ! function_exists('get_permissions'))
{
    function get_permissions()
    {
        $CI =& get_instance();
        $permissions = $CI->session->userdata('permissions');
        if($permissions === FALSE) {
            // Get from the database
            $query = $CI->db->get('permissions');
            $permissions = array();
            foreach ($query->result() as $row)
            {
                $permissions[$row->uri] = $row->accessrole;
            }

            // Get usernames
            $CI->db->select('username');
            $query = $CI->db->get('users');
            $users = array();

            foreach ($query->result() as $row)
            {
                $users[] = $row->username;
            }

            // Get special permissions
            $query = $CI->db->get('specialperm');
            $splperm = array();

            foreach ($query->result() as $row)
            {
                foreach ($users as $user) {
                    /* Admin is never shown as an user */
                    if($user !== 'admin') {
                        $permissions[$row->uri.$user] = $row->accessrole;
                    }
                }

                /* Show a collective view too */
                $permissions[$row->uri."all"] = $row->accessrole;
            }

            $CI->session->set_userdata('permissions', $permissions);
        }

        return $permissions;
    }
}