if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

contrib.utils.Animations = new (function Animations() {
	var __self__ = this;
	
	var events = contrib.events;
	var utils = contrib.utils;
	
	this.DEFAULT_INTERVAL = utils.Browser.isIE ? 40 : 20; // 20 ms for each interval, 40 ms for < IE 9
	this.DEFAULT_SPEED = 200; // 200 units per SECOND
	
	this.splines = {
		'linear': [0, 0, 1, 1],
		'ease': [0.25, 0.1, 0.25, 1],
		'ease-in': [0.42, 0, 1, 1],
		'ease-out': [0, 0, 0.58, 1],
		'ease-in-out': [0.42, 0.0, 0.58, 1.0],
		'ease-out-in': [0.0, 0.42, 1.0, 0.58]
	};
	
	this.cubicBezier = function(startVal, endVal, timeProgress, timeDuration, cubics) {
		var cubicBezierAtTime = function (t, p1x, p1y, p2x, p2y, duration) {
			var ax = 0, bx = 0, cx = 0, ay = 0, by = 0, cy = 0;
			var sampleCurveX = function(t) { return ((ax * t + bx) * t + cx) * t; };
			var sampleCurveY = function(t) { return ((ay * t + by) * t + cy) * t; };
			var sampleCurveDerivativeX = function(t) { return (3.0 * ax * t + 2.0 * bx) * t + cx; };
			var solveEpsilon = function(duration) {
				return 1.0 / (200.0 * duration);
			};
			var solve = function(x, epsilon) {
				return sampleCurveY(solveCurveX(x, epsilon));
			};
			var solveCurveX = function(x, epsilon) {
				var t0, t1, t2, x2, d2, i;
				var fabs = function(n) {
					if (n >= 0)
						return n;
					else
						return 0 - n;
				};
				for (t2 = x, i = 0; i < 8; i++) {
					x2 = sampleCurveX(t2) - x;
					if (fabs(x2) < epsilon)
						return t2;
					d2 = sampleCurveDerivativeX(t2);
					if (fabs(d2) < 1e-6)
						break;
					t2 = t2 - x2 / d2;
				}
				t0 = 0.0; t1 = 1.0; t2 = x;
				if (t2 < t0)
					return t0;
				if (t2 > t1)
					return t1;
				while (t0 < t1) {
					x2 = sampleCurveX(t2);
					if (fabs(x2 - x) < epsilon)
						return t2;
					if (x > x2)
						t0 = t2;
					else
						t1 = t2;
					t2 = (t1 - t0) * 0.5 + t0;
				}
				return t2;
			};
			cx = 3.0 * p1x;
			bx = 3.0 * (p2x - p1x) - cx;
			ax = 1.0 - cx - bx;
			cy = 3.0 * p1y;
			by = 3.0 * (p2y - p1y) - cy;
			ay = 1.0 - cy - by;
			return solve(t, solveEpsilon(duration));
		};
		
		return Math.round((endVal - startVal) *
							cubicBezierAtTime(timeProgress / timeDuration, cubics[0], cubics[1], cubics[2], cubics[3], 1) +
							startVal);
	};
	/* Move to 'Animations' folder?  There we can store Cubic Bezier and Workers if we can use them :) */
	this.Tweener = function Tweener(options) {
		var __home__ = this;
		this.inheritFrom = events.EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;
		
		var timer = false;
		this.startTime = 0;
		
		this.init = function(options) {
			var __this__ = __home__;
			__this__.from = options.from;
			__this__.to = options.to;
			__this__.current = options.from;
			__this__.progress = 0;
			__this__.duration = options.duration ?
								Math.max(0.01, options.duration) :
								Math.abs(options.to - options.from) / (__self__.DEFAULT_SPEED * (options.speed ? options.speed : 1));
			__this__.interval = options.interval ? options.interval : __self__.DEFAULT_INTERVAL;
			__this__.timingFunction = options.timingFunction ? options.timingFunction : 'ease';
			if (options.oniterate) {
				__this__.oniterate = options.oniterate;
			}
			if (options.oncomplete) {
				__this__.oncomplete = options.oncomplete;
			}
			// Skip the animation and render the final result
			if (options.ignore) {
				__this__.ignore = options.ignore;
			}
		};
		
		this.iterate = function() {
			var __this__ = __home__;
			__this__.progress = ((new Date()).getTime() - __this__.startTime) / 1000;
			
			__this__.current = __self__.cubicBezier(__this__.from, __this__.to,
												__this__.progress, __this__.duration, __self__.splines[__this__.timingFunction]);
			if (__this__.oniterate) {
				__this__.oniterate();
			}
			__this__.dispatchEvent('iterate');
			__this__ = null;
		};
		var listener = function() {
			var __this__ = __home__;
			__this__.iterate();
			if (__this__.progress >= __this__.duration || (__this__.current >= __this__.to - 2 && __this__.current <= __this__.to + 2)) {
				__this__.complete();
			}
			__this__ = null;
		};
		this.complete = function() {
			var __this__ = __home__;
			__this__.progress = __this__.duration;
			__this__.current = __this__.to;
			
			if (__this__.oniterate) {
				__this__.oniterate();
			}
			__this__.dispatchEvent('iterate');
			
			__this__.pause();
			
			__this__.dispatchEvent('complete');
			if (__this__.oncomplete) {
				__this__.oncomplete();
			}
			__this__ = null;
		};
		this.animate = function() {
			var __this__ = __home__;
			if (__this__.ignore) {
				__this__.progress = __this__.duration;
				__this__.current = __this__.to;
			}
			if (!timer) {
				__this__.startTime = (new Date()).getTime();
				timer = setInterval(listener, __this__.interval);
			}
		};
		this.pause = function() {
			if (timer) {
				clearInterval(timer);
				timer = false;
				__home__.startTime = 0;
			}
		};
		
		this.init(options);
		options = null;
	};
	
	this.dispose = function() {
		delete __self__;
		delete events;
		delete utils;
	};
})();