if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

contrib.utils.Browser = new (function Browser() {
	var __self__ = this;

	this.isIE = navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.indexOf('MSIE 9.0') == -1; // Exludes IE9
	this.isWebkit = !__self__.isIE && navigator.userAgent.indexOf('AppleWebKit') != -1;
	this.isFirefox = !__self__.isIE && !__self__.isWebkit && navigator.userAgent.indexOf('Firefox') != -1;
	this.isOpera = !__self__.isIE && !__self__.isWebkit && !__self__.isFirefox && navigator.userAgent.indexOf('Opera') != -1
	this.isIE9 = !__self__.isIE && !__self__.isWebkit && !__self__.isFirefox && !__self__.isOpera && navigator.userAgent.indexOf('MSIE 9.0') != -1;
	this.isIOS = __self__.isWebkit && (navigator.userAgent.indexOf('iPad') != -1 || navigator.userAgent.indexOf('iPhone') != -1);
	
	this.isAtleastFirefoxVersion = function (ver) {
		return __self__.isFirefox && Number(navigator.userAgent.split('Firefox/')[1].split('.')[0]) >= ver;
	};
	
	this.isBB = navigator.userAgent.indexOf('BlackBerry') != -1;
	
	var disabled = false;
	var touchStop = function(e) {
		e.preventDefault();
	};
	if (!document.body || !document.body.addEventListener) {
		this.disableTouchScroll = function() {
		};
		this.enableTouchScroll = function() {
		}; 
	} else {
		this.disableTouchScroll = function() {
			if (disabled) {
				return;
			}
			document.body.addEventListener('touchmove', touchStop, false);
			disabled = true;
		};
		this.enableTouchScroll = function() {
			if (disabled) {
				document.body.removeEventListener('touchmove', touchStop, false);
				disabled = false;
			}
		};
	}
})();