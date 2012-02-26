if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

if (!contrib.utils.extensions) {
	contrib.utils.extensions = new Object();
}

contrib.utils.extensions.Document = new (function() {
	document.getMouseXY = function(e) {
		var posX = 0;
		var posY = 0;
	
		if (!e) {
			e = window.event;
		}
		if (e.pageX || e.pageY) {
			posX = e.pageX;
			posY = e.pageY;
		} else if (e.clientX || e.clientY) {
			posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		} else if (e.targetTouches) {
			if (e.targetTouches.length > 0) {
				posX = e.targetTouches[0].pageX;
				posY = e.targetTouches[0].pageY;
			} else {
				posX = e.targetTouches.pageX;
				posY = e.targetTouches.pageY;
			}
		} else if (e.touches) {
			if (e.touches.length > 0) {
				posX = e.touches[0].pageX;
				posY = e.touches[0].pageY;
			} else {
				posX = e.touches.pageX;
				posY = e.touches.pageY;
			}
		}
		return { 'posX': posX, 'posY': posY };
	};

	document.getViewport = function () {
		var width = 0;
		var height = 0;
	
		// IE
		if (!window.innerWidth) {
			if (document.documentElement.clientWidth) {
				// strict
				width = document.documentElement.clientWidth;
				height = document.documentElement.clientHeight;
			} else {
				// quirks
				width = document.body.clientWidth;
				height = document.body.clientHeight;
			}
		} else {
			// W3C standard
			width = window.innerWidth;
			height = window.innerHeight;
		}
		return { 'width': width, 'height': height }; // we could add more, eh?
	};

	document.getPageOffset = function () {
		var offsetX = 0;
		var offsetY = 0;
	
		// IE
		if (!window.pageYOffset) {
			if (document.documentElement.scrollTop) {
				// Strict
				offsetX = document.documentElement.scrollLeft;
				offsetY = document.documentElement.scrollTop;
			} else {
				// Quirks
				offsetX = document.body.scrollLeft;
				offsetY = document.body.scrollTop;
			}
		} else {
			// W3C
			offsetX = window.pageXOffset;
			offsetY = window.pageYOffset;
		}
		return {'posX':offsetX, 'posY':offsetY};
	};

	document.getCenter = function (dimensions, ignoreOffset) {
		if (!dimensions) {
			dimensions = { 'width': 0, 'height': 0 };
		}
		var offset = ignoreOffset ? { 'posY': 0, 'posX': 0 } : document.getPageOffset();
		var size = document.getViewport();
		return { 'posX': (size.width / 2 - dimensions.width / 2) + offset.posX, 'posY': (size.height / 2 - dimensions.height / 2) + offset.posY };
	};
	
	this.dispose = function() {
		document.getCenter = document.getPageOffset = document.getViewport = document.getMouseXY = null;
		try {
			delete document['getCenter'];
			delete document['getPageOffset'];
			delete document['getViewport'];
			delete document['getMouseXY'];
		} catch(e) {
			// :(
		}
	};
})();