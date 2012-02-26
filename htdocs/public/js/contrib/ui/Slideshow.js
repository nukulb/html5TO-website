R.require('contrib.ui.Slideshow',
'contrib.utils.extensions.Document',
'contrib.utils.extensions.DOMTweener',
function() {
	// TODO: document insertion!!  Also, rethink the sliding to be some percentage of slide
	// so we can do some fun swipes :)
	var Slideshow = contrib.ui.Slideshow = function Slideshow(container, slides, links) {
		var __self__ = this;
		
		var timer = false;
		var currentSlide = 0;
		var totalSlides = slides.length;
		var mouseXY = 0;
		
		var events = contrib.events;
		
		(function() {
			for (var i = 0; i < totalSlides; i++) {
				slides[i].style.position = 'absolute';
				slides[i].style.left = container.offsetWidth + 'px';
				//slides[i].setStyle('opacity', 0);
			}
			if (container.parentNode.getStyle('opacity') == 0) {
				container.parentNode.tween('opacity', { 'to': 100 });
			}
			var totalLinks = links.length;
			for (i = 0; i < totalLinks; i++) {
				links[i].slideshow_index = i + 1;
				links[i].onclick = function(e) {
					__self__.gotoSlide(this.slideshow_index);
					events.preventDefaults(e);
					return false;
				};
			}
		})();
		
		// this should be plug-and-play modular.
		var animate = function(to, from) {
			if (from > -1) {
				//slides[from].tween('opacity', { 'to': 0 });
				slides[from].tween('left', { 'to': -slides[from].offsetWidth, 'unit': 'px', 'oncomplete': function() {
					if (from != currentSlide - 1) {
						slides[from].style.left = container.offsetWidth + 'px';
					}
				} });
				links[from].className = '';
			}
			links[to].className = 'active';
			//slides[to].tween('opacity', { 'to': 100 });
			slides[to].style.left = container.offsetWidth + 'px';
			slides[to].tween('left', { 'to': 0, 'unit': 'px' });
			container.tween('width', { 'to': slides[to].width, 'unit': 'px' });
			container.tween('height', { 'to': slides[to].height, 'unit': 'px' });
		};
		
		this.gotoSlide = function(slideNum) {
			if (slideNum < 1 || slideNum > totalSlides) {
				return;
			}
			animate(slideNum - 1, currentSlide - 1);
			currentSlide = slideNum;
		};
		
		this.nextSlide = function() {
			if (isInside()) {
				return;
			}
			__self__.gotoSlide(currentSlide < totalSlides ? currentSlide + 1 : 1);
		};
		
		this.prevSlide = function() {
			if (isInside()) {
				return;
			}
			__self__.gotoSlide(currentSlide == 1 ? totalSlides : currentSlide - 1);
		};
		
		this.start = function() {
			if (timer) {
				return;
			}
			timer = setInterval(__self__.nextSlide, 6000);
		};
		
		this.pause = function() {
			if (!timer) {
				return;
			}
			clearInterval(timer);
			timer = false;
		};
		
		var isInside = function(e) {
			var containerXY = container.getXY();
			mouseXY = e ? document.getMouseXY(e) : mouseXY;
			var offsetX = mouseXY.posX - containerXY.posX;
			var offsetY = mouseXY.posY - containerXY.posY;
			return timer && offsetX > 0 && offsetY > 0 && offsetX < container.offsetWidth && offsetY < container.offsetHeight;
		};
		
		var mousemove = function(e) {
			if (isInside(e)) {
				__self__.pause();
			} else if (!timer) {
				__self__.start();
			}
		};
		
		document.addEventListener('mousemove', mousemove, false);
		
		this.nextSlide();
		this.start();
	};
	/* This is a static function which parses the page by the specified attributes.  It ONLY searches divs */
	Slideshow.slideSelector = function(searchArea, containerClassName, maskClassName, controlsClassName) {
		var slideshows = searchArea.search('div', 'className', containerClassName);
		var numOfShows = slideshows.length;
		for (var i = 0; i < numOfShows; i++) {
			var container = slideshows[i];
			var mask = container.search('div', 'className', maskClassName)[0];
			var controls = container.search('div', 'className', controlsClassName)[0].getElementsByTagName('a');
			slideshows[i] = new Slideshow(mask, mask.getElementsByTagName('img'), controls);
		}
		return slideshows;
	};
});