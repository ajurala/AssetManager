<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home_model extends CI_Model{
    public function __construct(){
        parent::__construct();
    }

    public function get_net_assets() {
        $data = array();

        // Get the assets for the current user set
        $userid = $this->session->userdata('currentuserid');

        if($userid !== FALSE) {
            $key = 'assets';
            $where = array(
                    'userid' => $userid
                );
            $ignorefields[] = 'userid';
            $this->add_table_info($data, $key, $where, $ignorefields);
        }

        return $data;
    }

    public function get_other_info() {
        $data = array();

        $key = 'categories';
        $this->add_table_info($data, $key);

        $key = 'subcategories';
        $this->add_table_info($data, $key);

        $key = 'riskcategories';
        $this->add_table_info($data, $key);

        return $data;
    }

    private function add_table_info(&$data, $key, $where=array(), $ignorefields=array())
    {
        $fields = array_diff($this->db->list_fields($key), $ignorefields);

        $query = $this->db->get_where($key, $where);
        $data[$key] = array();
        
        foreach ($query->result_array() as $row) {
            $info = array();
            foreach ($fields as $field) {
                $info[$field] = $row[$field];
            }

            $data[$key][] = $info;
        }
    }
}