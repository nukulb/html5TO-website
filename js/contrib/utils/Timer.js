if (!window.contrib) {
	contib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

contrib.utils.Timer = function Timer(ms) {
	var __self__ = this;
	this.inheritFrom = contrib.events.EventDispatcher;
	this.inheritFrom();
	delete this.inheritFrom;
	
	var timer = false;
	var timeLapse = 0;
	var timerDispatch = function() {
		__self__.dispatchEvent('timer', { progress: (new Date()).getTime() - timeLapse });
	};
	this.start = function() {
		timeLapse = (new Date()).getTime();
		if (!timer) {
			timer = setInterval(timerDispatch, ms);
		}
	};
	this.stop = function() {
		if (!timer) {
			return;
		}
		clearInterval(timer);
		timer = false;
		timeLapse = 0;
	};
};