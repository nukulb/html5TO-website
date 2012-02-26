            	<div id="login">
            		<a href="#">Login</a>  |  <a href="#">Register</a>
            	
            	</div>
            	<div class="clear"></div>
            	
            	<div id="lightbox">
            		<a href="#" id="previous"></a>
            		<a href="#" id="next"></a>
		        		<div class="Slider">
		            		<div>
		            			<p>Donec sed odio dui. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec id elit non mi porta gravida at eget metus. Donec id elit non mi porta gravida at eget metus. Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula ut id elit. Sed posuere consectetur est at lobortis.</p>
		            		</div>
		            		<div>
		            			<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue.</p>
		            		</div>
		            		<div>
		            			<p>Maecenas faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nulla vitae elit libero, a pharetra augue. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam quis risus eget urna mollis ornare vel eu leo. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
		            		</div>
		            		<div class="clear"></div>
		        		</div>
            	</div>
            	<div id="SliderNav">
            		
            	</div>
            	<div class="ColumnWrapper">
	            	<div class="col-1">
	            		<h2>Announcements</h2>
	            		<p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Curabitur blandit tempus porttitor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p><p>Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet fermentum.</p>
	            	</div>
	            	
	            	<div class="col-2">
	            		<h2>Events</h2>
	            		<p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Curabitur blandit tempus porttitor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p><p>Donec ullamcorper nulla non metus auctor fringilla. Cras mattis consectetur purus sit amet fermentum.</p><p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Curabitur blandit tempus porttitor. Maecenas faucibus mollis interdum. Maecenas faucibus mollis interdum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
	            	</div>
	            </div>
	            
	    <script type="text/javascript">
        <!--
        
        R.imports(
        'contrib.ui.SwipePane',
        function() {
        	var pane = document.getElementById('lightbox');
        	window.scroller = new contrib.ui.SwipePane(
        		pane.getElementsByTagName('div')[0],
        		'x',
        		'Page', {
        			top: 20,
					left: 20,
					bottom: 20,
					right: 20
        		}
        	);
        	
        	var nextBtn = document.getElementById('next');
        	var prevBtn = document.getElementById('previous');
        	var tagContainer = document.getElementById('SliderNav');
        	var count = scroller.getPageCount();
        	var tags = new Array();
        	var lastClicked;
        	
        	nextBtn.addEventListener('click', function(e) {
        		window.scroller.nextPage();
        		contrib.events.preventDefaults(e);
        	}, false);
        	prevBtn.addEventListener('click', function(e) {
        		window.scroller.previousPage();
        		contrib.events.preventDefaults(e);
        	}, false);
        	
        	scroller.addEventListener('move', function(e) {
        		if (e.page == 1) {
        			prevBtn.style.display = 'none';
        		} else {
        			prevBtn.style.display = 'block';
        		}
        		if (e.page == count) {
        			nextBtn.style.display = 'none';
        		} else {
        			nextBtn.style.display = 'block';
        		}
        		lastClicked.removeClass('Selected');
        		var button = tags[e.page - 1];
        		button.addClass('Selected');
        		lastClicked = button;
        	});
        	
        	
        	
        	var tagCreator = function(index) {
        		var tag = document.createElement('a');
        		tag.className = 'SliderBalls';
        		tag.innerHTML = '<span>Page ' + index + '</span>';
        		tag.onclick = function() {
        			lastClicked.removeClass('Selected');
        			lastClicked = this;
        			this.addClass('Selected');
        			scroller.gotoPage(index + 1);
        			return false;
        		};
        		tags[i] = tag;
        		tagContainer.appendChild(tag);
        	};
        	
        	for (var i = 0; i < count; i++) {
        		tagCreator(i);
        	}
        	
        	lastClicked = tags[0];
        	tags[0].addClass('Selected');
        	
        });
        
        //-->
        </script>
