<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends CI_Controller {

	function __construct() {
		parent::__construct();
	}

	public function index(){
		redirect();
	}

	public function login() {

		//$this->session->sess_destroy();

		if($this->input->post('email_address') && $this->input->post('password')) {

			$this->form_validation->set_rules('email_address', 'e-mail address', 'trim|required|min_length[1]|max_length[100]|xss_clean|valid_email');
			$this->form_validation->set_rules('password', 'password', 'trim|required|max_length[40]');

			if ($this->form_validation->run() == FALSE) {
				echo validation_errors();
			} else {

				if($this->users_model->validate_login($this->input->post('email_address'), $this->encrypt->sha1($this->input->post('password')))) {

					$user = $this->users_model->get_user_by_email($this->input->post('email_address'));

					$this->session->set_userdata('email_address', $this->input->post('email_address'));
					$this->session->set_userdata('id', $user->id);

					redirect('');

				} else {
					echo "The credentials you entered are incorrect.";
				}

			}

		} else {

			$email = $this->session->userdata('email_address');

			if(!empty($email)) {
					redirect('');
			} else {

				$this->load->view('users/login');

			}
		}

	}


	public function logout() {
		$this->session->sess_destroy();
		redirect('');
	}


	public function profile($user=null) {

		if($user != null) {
			if(is_numeric($user) && $this->users_model->user_exists($user)) {
				$info = $this->users_model->get_user($user);
				$id = $this->session->userdata('id');

				$user_info = $info;

				if($info && $info->id == $id) {

					if($_POST) {

						$user_info = $this->users_model->get_user($user);

						$this->form_validation->set_rules('email_address', 'e-mail address', 'trim|required|min_length[1]|max_length[100]|xss_clean|valid_email');
						
						$password = $this->input->post('password');
						$email = $this->session->userdata('email_address');
					
						$id = $this->users_model->get_user_by_email($email);
						$id = $id->id;
						
						if(!empty($password)) {
							$this->form_validation->set_rules('password', 'password', 'trim|required|max_length[40]|matches[repeat_password]');
							$this->form_validation->set_rules('repeat_password', 'repeat password', 'required');
						}

						if ($this->form_validation->run() == FALSE) {
							echo validation_errors();
						} else {
						
							$data = $this->input->post();
						
							if(!empty($password)) {
								$new_password = $this->encrypt->sha1($password);
								$data['password'] = $new_password;
							} else {
								unset($data['password']);
							}

							if($email != $this->input->post('email_address')) {
								$data['email_address'] = $this->input->post('email_address');
								$this->session->set_userdata('email_address', $data['email_address']);
							}
							
								unset($data['repeat_password']);
								
								$this->db->where('id', $id);
								$this->db->update('users', $data);
							
							$user_info = $this->users_model->get_user($user);
							$user_info->updated = true;
						}

					}

					$user_info->me = true;
					$this->load->view('users/profile', $user_info);

				} elseif($info) {
					$user_info->me = false;
					$this->load->view('users/profile', $user_info);
				} else {
					echo "No";
				}
			} else {
				echo "No";
			}
		} else {
			echo "Invalid user";
		}
	}


	public function register() {

		if($_POST) {

			$this->form_validation->set_rules('first_name', 'first_name', 'trim|required|min_length[1]|max_length[100]|xss_clean');
			$this->form_validation->set_rules('last_name', 'first_name', 'trim|required|min_length[1]|max_length[100]|xss_clean');
			$this->form_validation->set_rules('email_address', 'e-mail address', 'trim|required|valid_email|min_length[1]|max_length[100]|xss_clean|valid_email|callback_email_exists');

			if ($this->form_validation->run() == FALSE) {
				echo validation_errors();
			} else {

				$data = $this->input->post();

				$password = uniqid();
				$data['password'] = $this->encrypt->sha1($password);

				$data['created_date'] = date('Y-m-d H:i:s');
				$data['modified_date'] = date('Y-m-d H:i:s');
				$data['last_logged_in'] = date('Y-m-d H:i:s');

				if($this->db->insert('users', $data)) {

					$info['username'] = $data['email_address'];
					$info['password'] = $password;

					$email = $this->load->view('emails/registration', $info, true);

					$mail_config['useragent']	= 'htmltoronto.ca';
					$mail_config['protocol']	= 'sendmail';
					$mail_config['mailpath']	= '/usr/sbin/sendmail';
					$mail_config['charset']		= 'iso-8859-1';
					$mail_config['wordwrap']	= TRUE;
					$mail_config['mailtype']	= 'html';
					$this->email->initialize($mail_config);

					$this->email->from('blackhole@htmltoronto.ca', 'HTML Toronto');
					$this->email->to($data['email_address']);
					$this->email->set_newline("\r\n");
					$this->email->subject('HTML Toronto - Account Confirmation');
					$this->email->message($email);

					$this->email->send();
					
					echo "Check your email for account information.";

				} else {
					echo "There was an error.";
				}



			}

		} else {
			$this->load->view('users/register');
		}
	}


	public function reset_password($hash=null) {
		$data = false;
		if($_POST) {
			$email_address = $this->input->post('email_address');
			$info = $this->users_model->get_user_by_email($email_address);
			if(!empty($info)){
				$user_id = $info->id;
				if(!empty($user_id)){
					$password = uniqid();

					$user_info['password']	= $password;
					$db_info['password'] = $this->encrypt->sha1($password);

					$db_info['modified_date'] = date('Y-m-d H:i:s');

					$status = $this->db
									->where('id', $user_id)
									->update('users', $db_info);
					if($status) {
						$email = $this->load->view('emails/reset_password', $user_info, true);
						$mail_config['useragent']	= 'htmltoronto.ca';
						$mail_config['protocol']	= 'sendmail';
						$mail_config['mailpath']	= '/usr/sbin/sendmail';
						$mail_config['charset']		= 'iso-8859-1';
						$mail_config['wordwrap']	= TRUE;
						$mail_config['mailtype']	= 'html';
						$this->email->initialize($mail_config);
						$this->email->from('blackhole@hmltoronto.ca', 'HTML Toronto');
						$this->email->to($email_address);
						$this->email->subject('HTML Toronto - Password Reset');
						$this->email->message($email);
						$status = $this->email->send();
					}else{
						$data['error']	= "Error resetting password.";
					}
				}
			}else{
				$data['error']	= "Error resetting password.";
			}
		}
		$this->load->view('main_header');
		$this->load->view('page_header');
		$this->load->view('users/reset_password', $data);
		$this->load->view('home_footer');
	}


	public function email_exists($email) {
		if($this->users_model->email_exists($email)) {

			$this->form_validation->set_message('email_exists', 'Please choose another email.');
			return false;
		} else {
			return true;
		}

	}


}