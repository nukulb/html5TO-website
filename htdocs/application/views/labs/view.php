<?php foreach($items as $item) { ?>
<article>
<h2><a href="<?php echo $item->id; ?>"><?php echo $item->title; ?></a></h2>

<p><?php echo $item->description; ?></p>
</article>
<?php } ?>