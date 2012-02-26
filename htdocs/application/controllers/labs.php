<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Labs extends CI_Controller {

	function __construct() {
		parent::__construct();

		if(!$this->users_model->check_session()) {
			redirect('users/login');
		}
	}

	function details($id=false) {
		
		if(is_numeric($id)) {
		
		$this->db->where('id', $id);
		$data['item'] = $this->db->get('labs')->row();
		$this->load->view('labs/detail', $data);
		
		} else {
			echo "Invalid labs ID.";
		}
	}

	function index() {
		
		$this->db->order_by('id', 'desc');
		$data['items'] = $this->db->get('labs')->result();

		$this->load->view('labs/view', $data);

		$offset = $this->uri->segment(3);

		if(is_numeric($offset)) {
		}

		//$config['base_url'] = base_url().'/labs/page/';
		//$config['total_rows'] = $this->db->count_all('labs');
		//$config['per_page'] = 1;

		//$this->pagination->initialize($config);

		//echo $this->pagination->create_links();

	}

	function articles() {

		$this->db->order_by('id', 'desc');
		$this->db->where('type_key', 'article');
		
		$data['items'] = $this->db->get('labs')->result();
		
		$this->load->view('labs/articles', $data);

	}

	function snippets() {

		$this->db->order_by('id', 'desc');
		$this->db->where('type_key', 'code');
		
		$data['items'] = $this->db->get('labs')->result();
		
		$this->load->view('labs/snippets', $data);

	}

	function add() {

		if($_POST) {

			$this->form_validation->set_rules('title', 'title', 'trim|required|min_length[1]|max_length[255]|xss_clean');
			$this->form_validation->set_rules('description', 'description', 'trim|required');

			if($this->input->post('type_key') == "article") {
				$this->form_validation->set_rules('content', 'content', 'trim|min_length[1]|required');			
			}

			if ($this->form_validation->run() == FALSE) {
				echo validation_errors();
			} else {

				$user = $this->users_model->get_user_by_email($this->session->userdata('email_address'));

				$data = $this->input->post();
				$data['created_date'] = date('Y-m-d H:i:s');
				$data['user_id'] = $user->id;

				if($data['type_key'] == "code") {

				$hash = md5(uniqid());

				$config['upload_path'] = './resources/';
				$config['allowed_types'] = '*';
				$config['file_name'] = $hash.'.zip';
				$config['max_size']	= 0;

				$this->load->library('upload', $config);
				$uploaded_file = $this->upload->do_upload('userfile');
				
				$result = $this->upload->data();

				if($result['file_ext'] == '.zip') {
							
				$data['resource_hash'] = $hash;

				unset($data['content']);
				unset($data['upload_file']);
				
				} else {
					echo "There was a problem inserting.<br><br>";
					die();
				}
					
				} else {
					unset($data['upload_file']);
				}

				if($this->db->insert('labs', $data)) {
					echo "New tutorial was inserted successfully.<br><br>";
					$this->load->view('labs/add');
				} else {
					echo "There was a problem inserting.<br><br>";

				}
			}

		} else {
			$this->load->view('labs/add');
		}

	}


}