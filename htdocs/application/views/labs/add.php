<script src="http://js.nicedit.com/nicEdit-latest.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript">

bkLib.onDomLoaded(function(){
  var myInstance = new nicEditor().panelInstance('description');
});


</script>

<form method="POST" enctype="multipart/form-data">
Title:
<br>
<input type="text" name="title">
<br>
Description:
<br>
<textarea id="description" name="description" rows="10" cols="40"></textarea>
<br>
Submission Type:
<br>
<select name="type_key" onChange="if(this.value == 'code') { $('#sample-code').show(); $('#tutorial-content').hide(); } " autocomplete="off">
<option value="article">Article</option>
<option value="code">Sample Code</option>
</select>
<br>
<br>
<div id="tutorial-content">
Tutorial Content:
<br>
<textarea id="content" rows="20" cols="40" name="content"></textarea>
</div>
<div id="sample-code" style="display: none;">
File: <input name="userfile" type="file" />
</div>
<br>
<input value="Submit" type="submit" />
</form>