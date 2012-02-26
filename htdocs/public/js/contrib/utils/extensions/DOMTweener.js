if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

if (!contrib.utils.extensions) {
	contrib.utils.extensions = new Object();
}

contrib.utils.extensions.DOMTweemer = new (function DOMTweener() {
	var setup;
	var iterate;
	var complete;
	
	// Review possible memory leak here.
	var defineProperties = function(el, property) {
		obj = el.tweens[property];
		obj.__defineGetter__('progress', function() {
			obj.progress = (obj.startTime - (new Date()).getTime()) / 1000;
			return obj.progress;
		});
		obj.__defineGetter__('current', function() {
			if (obj.unit) {
				return el.getStyleValue(property, obj.unit);
			} else {
				return Number(el.getStyle(property));
			}
		});
		
		obj.animate = function() {
			// Do nothing
		};
		
		obj.pause = function(skipRender) {
			obj.startTime = 0;
			if (!skipRender) {
				delete el.tweens[property];
				setup(el, property);
			}
		};
	};
	
	var utils = contrib.utils;
	
	if (utils.Browser.isWebkit) {
		var compileTransition = function(obj) {
			var transition = '';
			var counter = false;
			var allTweens = obj.tweens;
			for (var prop in allTweens) {
			
				transition += counter ? ', ' : '';
				transition += prop;
				transition += ' ';
				transition += allTweens[prop].duration;
				transition += 's ';
				transition += allTweens[prop].timingFunction;
				transition += ' 0';
				
				obj.setStyle(prop, allTweens[prop].to + allTweens[prop].unit);
				counter = true;
			}
			obj.style.transition = obj.style.WebkitTransition = transition;
		};
	
		setup = function (obj, property) {
			obj.tweens[property].startTime = (new Date()).getTime();
			compileTransition(obj);
		};
		
		complete = function (obj, property) {
			compileTransition(obj);
		};

		iterate = function () {
		};
	} else {
		setup = complete = function () {
		};

		iterate = function (obj, property) {
			var tweenObj = obj.tweens[property];
			obj.setStyle(property, tweenObj.current + tweenObj.unit);
		};
	}

	/* 
	property - The name of the attribute you wish to animate
	options -
	to - the target
	unit - (required only if unit is required for CSS property)
	duration/speed - (optional) - duration is in SECONDS, and speed a decimal percent (1 = 100%, 2 = 200%, 0.5, = 50%, etc..)
	timingFunction - (optional) - any cubic bezier splining name (linear, ease (default), ease-in, etc..)
	*/
	HTMLElement.prototype.tween = function (property, options) {
		var __obj__ = this;

		if (!this.tweens) {
			this.tweens = new Object();
		}
		
		var tweenObj = this.tweens[property];

		// ** if tween exists, should I not just ask for current?
		options.from = tweenObj ? tweenObj.current : this.getStyleValue(property, options.unit);
		
		if (!options.from && options.from != 0) {
			if (this[property]) {
				options.from = this[property];
			} else {
				options.from = 0;
			}
		}
		
		if (!tweenObj) {
			tweenObj = this.tweens[property] = new utils.Animations.Tweener(options);

			tweenObj.unit = options.unit ? options.unit : '';
			
			setup(__obj__, property);
			
			if (tweenObj.from == tweenObj.to) {
				delete __obj__.tweens[property];
				tweenObj = null;
				complete(__obj__, property);
				return null;
			}

			if (utils.Browser.isWebkit) {
				//defineProperties(__obj__, property);
				__obj__.addEventListener('webkitTransitionEnd', function anon() {
					__obj__.removeEventListener('webkitTransitionEnd', anon, false);
					delete __obj__.tweens[property];
					tweenObj.complete();
					tweenObj = null;
					complete(__obj__, property);
				}, false);
			} else {
				var listenerOne = tweenObj.addEventListener('iterate', function () {
					var tweenObj = __obj__.tweens[property];
					if (tweenObj.from <= tweenObj.to) {
						if (tweenObj.current < tweenObj.from) {
							tweenObj.current = Math.min(tweenObj.to, tweenObj.from - tweenObj.current);
						}
					} else if (tweenObj.current > tweenObj.from) {
						tweenObj.current = Math.max(tweenObj.to, tweenObj.current - tweenObj.from);
					}
					iterate(__obj__, property);
				});
				
				var listenerTwo = tweenObj.addEventListener('complete', function () {
					tweenObj.removeEventListener(listenerOne);
					tweenObj.removeEventListener(listenerTwo);
					delete __obj__.tweens[property];
					delete listenerOne;
					delete listenerTwo;
					tweenObj = null;
					complete(__obj__, property);
				});
				tweenObj.animate();
			}
			return tweenObj;
		}
		
		tweenObj.pause(true);
		
		tweenObj.init(options);
		tweenObj.unit = options.unit ? options.unit : '';
		
		if (utils.Browser.isWebkit && options.duration == tweenObj.duration &&
			options.timingFunction == tweenObj.timingFunction &&
			options.unit == tweenObj.unit) {
			__obj__.setStyle(property, options.to + options.unit);
		} else {
			setup(__obj__, property);
		}
		tweenObj.animate();
		
		return tweenObj;
	};

	this.dispose = function () {
		delete HTMLElement.prototype.tween;
		delete setup;
		delete iterate;
		delete complete;
	};
})();