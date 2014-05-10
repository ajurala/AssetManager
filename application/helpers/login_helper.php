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

if ( ! function_exists('is_configured'))
{
    function is_configured()
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

        return ($configured !== "0");
    }
}