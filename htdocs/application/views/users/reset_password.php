           	<div id="login">
            		<a href="#">Login</a>  |  <a href="#">Register</a>

            	</div>
            	<div class="clear"></div>

            	<div id="lightbox">
					<h3>Password Reset</h3>
					<p>To reset your password please enter your email address below.</p>
					<?php if(!empty($error)){ ?><p class="error"><?php echo $error; ?></p><?php } ?>
					<form method="POST">
						E-mail Address: <input name="email_address" type="text">
						<input type="submit" value="Submit">
					</form>
            	</div>