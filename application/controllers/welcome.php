<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {
	public function index()
	{
        // If not logged in then go for login view
        $this->load->view('welcome');

        //Pass the logged in information if logged in, else send not logged in
        if(is_logged_in()) {
            
        } else {

        }
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */