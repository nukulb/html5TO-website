if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

contrib.utils.ImageLoader = function ImageLoader(url) {
	var __self__ = this;
	this.inheritFrom = contrib.events.EventDispatcher;
	this.inheritFrom();
	delete this.inheritFrom;
	
	var image = new Image();
	var timer = new contrib.utils.Timer(100);
	timer.addEventListener('timer', function() {
		if (image.width > 0 || image.height > 0) {
			timer.stop();
			__self__.dispatchEvent('load');
		}
	});
	this.load = function(newUrl) {
		if (newUrl) {
			url = newUrl;
		}
		image.src = url;
		if (timer) {
			timer.stop();
		}
		timer.start();
	};
	this.cancel = function() {
		if (timer) {
			timer.stop();
		}
	};
	this.fill = function(theWidth, theHeight) {
		bgRatio = image.width / image.height;
		maskRatio =  theWidth / theHeight;
		if (bgRatio > maskRatio) {
			return {'height': theHeight, 'width': Math.round(theHeight * bgRatio)};
		}
		return {'width': theWidth, 'height': Math.round(theWidth / bgRatio)};
	};
};