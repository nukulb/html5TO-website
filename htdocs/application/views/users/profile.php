<?php
	
	if($me == true) {
		$this->load->view('users/profile_edit');
	} else {
		$this->load->view('users/profile_view');
	}

?>