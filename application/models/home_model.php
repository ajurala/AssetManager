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

        $key = 'customgroups';
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

    public function add_update_asset($indata)
    {
        $data = array();
        if($indata['assetid'] == "0") {
            // insert into the table
            $indata['userid'] = $this->session->userdata('currentuserid');
            $this->db->insert('assets', $indata);
            $assetid = $this->db->insert_id();
            $data['assetid'] = $assetid;
        } else {
            // update the table
            $this->db->update('assets', $indata, array('assetid' => $indata['assetid']));
        }

        return $data;

    }

    public function remove_asset($assetid) {
        $this->db->delete('assets', array('assetid' => $assetid));
    }

    public function add_category_subcategory($categorydetails, $subcategorydetails) {
        $data = array();
        if($categorydetails !== FALSE) {
            // insert the category details
            $this->db->insert('categories', $categorydetails);
            $catid = $this->db->insert_id();
            $categorydetails['categoryid'] = $catid;
            $subcategorydetails['categoryid'] = $catid;

            $data['categorydetails'] = $categorydetails;
        }

        $this->db->insert('subcategories', $subcategorydetails);
        $subcatid = $this->db->insert_id();
        $subcategorydetails['subcategoryid'] = $subcatid;
        $data['subcategorydetails'] = $subcategorydetails;

        return $data;
    }

    public function add_customgroup($details) {
        $this->db->insert('customgroups', $details);
        $groupid = $this->db->insert_id();
        $details['groupid'] = $groupid;

        return $details;
    }
}