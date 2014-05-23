<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends AssetManager
{
    public function __construct() {
        parent::__construct();
    }

    public function getnetassets() {
        $data = array();

        if(is_logged_in()) {
            $this->load->model("home_model");
            $data = $this->home_model->get_net_assets();
        }

        echo json_encode($data);
    }

    /*
     *  This will return the whole Schema
     *  Categories, subcategories, risks
     *  Their ids and names
     */
    public function getotherinfo() {
        $data = array();

        if(is_logged_in()) {
            $this->load->model("home_model");
            $data = $this->home_model->get_other_info();
        }

        echo json_encode($data);
    }

    public function addupdateasset() {
        $data = array();

        if(is_logged_in()) {
            $this->load->model("home_model");
            $indata = $this->input->post();
            $data = $this->home_model->add_update_asset($indata);
        }

        echo json_encode($data);
    }

    public function removeeasset() {
        if(is_logged_in()) {
            $this->load->model("home_model");
            $assetid = $this->input->post('assetid');
            $data = $this->home_model->remove_asset($assetid);
            //var_dump($indata);
        }
    }
}