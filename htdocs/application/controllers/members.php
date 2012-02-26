<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Members extends CI_Controller {

	public function index()
	{
		if($this->users_model->check_session()) {
			echo "Click <a href='index.php/labs/add'>here</a> to add a new tutorial.";
		} else {
			$this->load->view('main_header');
			$this->load->view('home_header');
			$this->load->view('page_header');
			$this->load->view('members', array('name'=>'John'));
			$this->load->view('home_footer');
		}
	}
	
	public function details($id = false)
	{
		if (!$id) {
			redirect();
		}
		echo $id;
	}

}