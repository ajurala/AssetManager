<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {
	public function index()
	{
        $this->load->view('welcome');

        //Pass the logged in information if logged in, else send not logged in
        if(!is_configured()){

        }
        else if(is_logged_in()) {
            
        } else {
            //Set the header as 412 to indicate that user not logged in
        }
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */