<h2><?php echo $item->title; ?></h2>

<?php if($item->type_key == 'code') { ?>
<p><?php echo $item->description; ?></p>
<p>You can download this code sample from <a href="<?php echo base_url().'/resources/'.$item->resource_hash.'.zip'; ?>">here</a>.</p>
<?php } else { ?>
<p><?php echo $item->description; ?></p>
<p><?php echo $item->content; ?></p>
<?php } ?>