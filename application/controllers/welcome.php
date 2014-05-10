<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {
	public function index()
	{

        //Pass the logged in information if logged in, else send not logged in
        $data['header']['configured'] = get_configured_status();

        if(is_logged_in()) {
            
        } else {
            //Set the header as 401 to indicate that user not logged in
        }

        $this->load->view('base', $data);
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */