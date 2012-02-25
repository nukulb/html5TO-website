if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

if (!contrib.utils.extensions) {
	contrib.utils.extensions = new Object();
}

/*
TODO:
getElementsByClassName (for IE 8 and below)

some querying with xpath/native calls would be nice... might make great for another extension!
*/

(function __elements__() {
	var init = function init(isIE) {
		contrib.utils.extensions.HTMLElement = new (function Elements() {
			HTMLElement.prototype.addClass = function(className) {
				if (this.className.length == 0) {
					this.className = className;
					return;
				}
			
				var classes = this.className.split(' ');
				var size = classes.length;
				
				for (var i = 0; i < size; i++) {
					if (className == classes[i]) {
						return;
					}
				}
				
				this.className += ' ' + className;
			};
			
			HTMLElement.prototype.removeClass = function(className) {
				var classes = this.className.split(' ');
				
				if (classes.length == 0) {
					return;
				}
				
				for (var i = 0; i < classes.length; i++) {
					if (className == classes[i]) {
						classes.splice(i, 1);
						i--;
					}
				}
				
				this.className = classes.join(' ');
			};
			
			HTMLElement.prototype.getStyle = function getStyle(style) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					return document.defaultView.getComputedStyle(this, false).getPropertyValue(style);
				} else if (this.currentStyle) {
					return this.currentStyle[style.replace(/\-(\w)/g, function (strMatch, p1) {
						return p1.toUpperCase();
					})];
				}
			};

			/* Opacity is a range fro 0 - 100 (as opposed to 0.0 - 1.0) */
			var getOpacity;
			var setOpacity;

			if (isIE === true) { // I don't want no object overriding this.
				getOpacity = function (obj) {
					obj = obj.getStyle('filter');
					if (!obj || obj.toLowerCase() == 'none') {
						return 100;
					} else {
						var value = obj.toLowerCase().split('alpha(opacity=')[1].split(')')[0]; // Setting value to separate value helps IE do this for some weird reason...
						return Number(value);
					}
				};

				setOpacity = function (obj, val) {
					if (val < 100) {
						obj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + val + ')';
					} else {
						obj.style.filter = 'none';
					}
				};
			} else {
				/* Opacity is a range from 0 to 100 (as opposed to 0.0 - 1.0) */
				getOpacity = function (obj) {
					return Number(obj.getStyle('opacity')) * 100;
				};

				setOpacity = function (obj, val) {
					obj.style.opacity = val / 100;
				};
			}
			isIE = null;
			delete isIE;

			HTMLElement.prototype.getStyleValue = function (style, unit) {
				if (style == 'opacity') {
					return getOpacity(this);
				}
				style = this.getStyle(style);
				if (unit) {
					style = style.split(unit)[0];
				}
				return Number(style);
			};

			HTMLElement.prototype.setStyle = function (styleName, val) {
				if (styleName == 'opacity') {
					setOpacity(this, val);
					return;
				}
				var splitted = styleName.split('-');
				var size = splitted.length;
				if (size > 1) {
					styleName = splitted[0];
					for (var i = 1; i < size; i++) {
						styleName += splitted[i].substr(0, 1).toUpperCase();
						styleName += splitted[i].substr(1);
					}
				}
				this.style[styleName] = val;
			};

			/* This can be a compiled string or a key-pair object */
			HTMLElement.prototype.applyStyle = function (styleSheet) {
				var applyString = '';
				if (typeof styleSheet == 'string') {
					applyString = styleSheet;
				} else {
					for (var style in styleSheet) {
						applyString += style;
						applyString += ':';
						applyString += styleSheet[style];
						applyString += '; ';
					} // Nice!
				}
				if (typeof this.style.cssText != 'undefined') {
					this.style.cssText = applyString;
				} else {
					this.setAttribute('style', applyString);
				}
			};

			HTMLElement.prototype.query = function search(tagName, attr, query) {
				tagName = this.getElementsByTagName(tagName);
				var obj = new Array();
				for (var i in tagName) {
					if ((tagName[i][attr] && tagName[i][attr] == query) ||
						(tagName[i].getAttribute && tagName[i].getAttribute(attr) == query)) {
						obj.push(tagName[i]);
					}
				}
				return obj;
			};
			
			if (!HTMLElement.prototype.getElementsByClassName) {
				HTMLElement.prototype.getElementsByClassName = function() {
					// We want to implement this... we also want to use things
					// like xpath and Array.filter if possible :)
				};
			}

			HTMLElement.prototype.getXY = function getXY() {
				var curX = 0;
				var curY = 0;
				var obj = this;
				if (obj.offsetParent) {
					do {
						curX += obj.offsetLeft;
						curY += obj.offsetTop;
					}
					while (obj = obj.offsetParent);
					return { 'posX': curX, 'posY': curY };
				}
				return { 'posX': -1, 'posY': -1 };
			};

			// container is either an HTMElement or a position/coordinate object
			HTMLElement.prototype.inView = function inView(container) {
				// using the position and bounds of the container, we check if this element is within those bounds
				if (!container.posX) {
					var pos = container.getXY();
					pos.width = container.offsetWidth;
					pos.height = container.offsetHeight;
					container = pos;
				}
				var elXY = this.getXY();
				var XY = { 'posX': elXY.posX - container.posX, 'posY': elXY.posY - container.posY };
				delete elXY;
				return XY.posX < container.width && XY.posX > -this.offsetWidth && XY.posY < container.height && XY.posY > -this.offsetHeight;
			};
			
			if (!HTMLElement.prototype.addEventListener) {
				HTMLElement.prototype.addEventListener = function(evnt, fn) {
					this.attachEvent('on' + evnt, fn);
				};
				
				HTMLElement.prototype.removeEventListener = function(evnt, fn) {
					this.detachEvent('on' + evnt, fn);
				};
			}
		})();
	};

	if (!window.HTMLElement) {
		if (navigator.appName == 'Microsoft Internet Explorer' && (new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})")).exec(navigator.userAgent) && parseFloat(RegExp.$1) < 8) {
			R.require('contrib.utils.extensions.HTMLElement',
			'contrib.utils.extensions.IEHTMLElement',
			function() {
				if (window.EPE) {
					EPE.__R1 = document.documentElement.childNodes[1].onload;
					document.documentElement.childNodes[1].onload = EPE.init;
				} else {
					window.location.replace(window.location.href); // Hack
				}
				init(true);
			});
		} else if (window.Element) {
			window.HTMLElement = window.Element;
			R.registerNamespace('contrib.utils.extensions.HTMLElement');
			init(true);
		} else {
			// Otherwise, we do nothing.  Unsupported and probably never will be.
			console.error('Unsupported JavaScript Environment.  We require HTMLElement or Element for this extension.');
		}
	} else {
		R.registerNamespace('contrib.utils.extensions.HTMLElement');
		init();
	}
})();