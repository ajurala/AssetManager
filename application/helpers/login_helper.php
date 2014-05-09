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