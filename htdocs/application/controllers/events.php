<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Events extends CI_Controller {

	public function __construct(){
		parent::__construct();
	}
	
	public function index(){
		$data = array();
		$cal_prefs = array (
           'show_next_prev'  => TRUE,
           'next_prev_url'   => base_url('events/page') . '/'
         );
		$this->load->library('calendar', $cal_prefs);
		$this->load->view('main_header');
		$this->load->view('page_header');
		$this->load->view('events/main', $data);
		$this->load->view('home_footer');
	}

}