if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.apps) {
	contrib.apps = new Object();
}

contrib.apps.ScreenSize = new (function ScreenSize() {
	var __self__ = this;
	var el = document.createElement('div');
	el.className = 'ScreenSize_App';
	
	el.applyStyle({
		position:'fixed',
		top: '0px',
		right: '0px',
		'background-color': '#AEAEAE',
		opacity: '0.7',
		padding: '10px',
		color: '#FFFFFF',
		'font-size': '11px',
		'z-index': '101'
	});
	
	this.writeStats = function(stats) {
		var output = '';
		for (var stat in stats) {
			output += stat;
			output += ': ';
			output += stats[stat];
			output += '<br />';
		}
		el.innerHTML = output;
	};
	
	this.showScreenSize = function() {
		var dimensions = document.getViewport();
		__self__.writeStats({ 'Screen': dimensions.width + 'px' + ', ' + dimensions.height + 'px' });
	};
	this.showScreenSize();
	
	this.getContainer = function() {
		return el;
	};
	
	if (window.addEventListener) {
		window.addEventListener('resize', __self__.showScreenSize, false);
	} else if (window.attachEvent) {
		window.attachEvent('onresize', __self__.showScreenSize);
	}
	document.body.appendChild(el);
	
	this.dispose = function() {
		if (window.removeEventListener) {
			window.removeEventListener('resize', __self__.showScreenSize, false);
		} else if (window.detachEvent) {
			window.detachEvent('onresize', __self__.showScreenSize);
		}
	};
})();