<?php if(isset($updated) && $updated == true) { echo "Updated<br>"; } ?>
<h3><?php echo $first_name; ?> <?php echo $last_name; ?> </h3>

<img src="http://www.gravatar.com/avatar/<?php echo md5($email_address); ?>">
<br>
<br>
<form method="POST">
First Name: <input name="first_name" type="text" value="<?php echo $first_name; ?>">
<br>
Last Name: <input name="last_name" type="text" value="<?php echo $last_name; ?>">
<br>
Email Address: <input name="email_address" type="text" value="<?php echo $email_address; ?>">
<br>
Password: <input name="password" type="password">
<br>
Repeat password: <input name="repeat_password" type="password">
<br>
<input type="submit" value="Modify Profile">
</form>