<?php

class Users_model extends CI_Model {

	function check_session() {
	
		$CI =& get_instance();
		$email = $CI->session->userdata('email_address');
				
		if(!empty($email)) {
			return true;
		} else {
			return false;
		}
	}

	function get_user_by_email($email) {
		$query = $this->db->get_where('users', array('email_address'=>$email));		

		if($query->num_rows() == 1) {
			return $query->row();
		} else {
			return false;
		}		
	}

	function get_user($id) {
		$query = $this->db->get_where('users', array('id'=>$id));		

		if($query->num_rows() == 1) {
			return $query->row();
		} else {
			return false;
		}	
	}
	
	function user_exists($id) {
		$query = $this->db->get_where('users', array('id'=>$id));		

		if($query->num_rows() == 1) {
			return true;
		} else {
			return false;
		}

	}	

	function email_exists($email) {
		$query = $this->db->get_where('users', array('email_address'=>$email));	

		if($query->num_rows() == 1) {
			return true;
		} else {
			return false;
		}
	} 

	function validate_login($email, $password) {
	
		$query = $this->db->get_where('users', array('email_address'=>$email, 'password'=>$password, 'status'=>1));
		
		if($query->num_rows() == 1) {
			return true;
		} else {
			return false;
		}
	
	}

}