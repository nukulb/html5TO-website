R.require('contrib.events.Touch',
'contrib.events.EventDispatcher',
function() {
	
	var Touch = contrib.events.Touch = function Touch(element) {
		this.inheritFrom = contrib.events.EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;
		
		var __self__ = this;
		var enabled = false;
		var started = false;
		var moving = false;
		var touchType;
		var moveCount = 0;
		var lastPos;
		
		var getPos = function(touches) {
			var size = touches.length;
			if (size > 0) {
				var rry = new Array();
				for (var i = 0; i < size; i++) {
					rry[i] = { x: touches[i].pageX, y: touches[i].pageY };
				}
				return rry;
			}
			return [{ x: touches.pageX, y: touches.pageX }];
		};
		
		var touchStart = function(e) {
			e.preventDefault();
			if (started) {
				return;
			}
			started = true;
			lastPos = getPos(e.touches);
			element.addEventListener('touchmove', touchMove);
			__self__.dispatchEvent(Touch.TOUCH_START, { touchEvent: e, coord: lastPos });
		};
		
		var processEvent = function(e, coord) {
			e.preventDefault();
			var translation = true;
			if (touchType == Touch.TOUCH_X) {
				__self__.dispatchEvent(Touch.TOUCH_X, { touchEvent: e, delta: coord[0].x - lastPos[0].x });
			} else if (touchType == Touch.TOUCH_Y) {
				__self__.dispatchEvent(Touch.TOUCH_Y, { touchEvent: e, delta: coord[0].y - lastPos[0].y });
			} else if (touchType == Touch.TOUCH_XY) {
				__self__.dispatchEvent(Touch.TOUCH_XY, { touchEvent: e, delta: { x: coord[0].x - lastPos[0].x, y: coord[0].y - lastPos[0].y } });
			} else {
				translation = false;
			}
			if (translation) {
				__self__.dispatchEvent(Touch.TOUCH_ALL, { touchEvent: e, delta: { x: coord[0].x - lastPos[0].x, y: coord[0].y - lastPos[0].y } });
				return;
			}
			/*
			
				TODO: Implement gestures here.  Thus far, we wish to do scale and rotate.
				In the future, we might do multiple-finger swipes and whatever else.
				It could be cool to make gestures plugin-able.
			
			*/
		};
		
		var touchMove = function(e) {
			e.preventDefault();
			var newPos = getPos(e.touches);
			if (!moving) {
				moving = true;
				// We have two types of gestures: translation and gesture
				
				// Gesture:
				/*
					Here we will see if we're doing something special such
					as a pinch, doubletap, rotate, scale, zoom, etc.  If it
					is not a gesture, we have a translation.
				*/
				
				// Translation:
				// We only care about the first touch in this instance
				var deltaX = newPos[0].x - lastPos[0].x;
				var deltaY = newPos[0].y - lastPos[0].y;
				
				if (deltaX == 0) {
					touchType = Touch.TOUCH_Y;
				} else {
					var slope = Math.round(Math.abs(deltaY) / Math.abs(deltaX) * 10);
					if (slope < 4) {
						touchType = Touch.TOUCH_X;
					} else if (slope > 4) {
						touchType = Touch.TOUCH_Y;
					} else {
						touchType = Touch.TOUCH_XY;
					}
				}
			}
			var modulo = moveCount++ % e.touches.length;
			if (modulo != 0) {
				return;
			}
			processEvent(e, newPos);
			lastPos = newPos;
		};
		
		var touchEnd = function(e) {
			e.preventDefault();
			if (!e.touches || !e.touches.length) {
				element.removeEventListener('touchmove', touchMove);
				started = false;
				moving = false;
				moveCount = 0;
				__self__.dispatchEvent(Touch.TOUCH_END, { touchEvent: e, coord: lastPos });
			}
		};
		
		this.dispose = function() {
			if (enabled) {
				enabled = false;
				element.removeEventListener('touchstart', touchStart);
				if (moving) {
					element.removeEventListener('touchmove', touchMove);
					moving = false;
				}
				element.removeEventListener('touchend', touchEnd);
			}
		};
		
		this.enable = function() {
			if (enabled) {
				return;
			}
			enabled = true;
			element.addEventListener('touchstart', touchStart);
			element.addEventListener('touchend', touchEnd);
		};
		
		this.enable();
	};
	
	// Some static garabage collection that works with Raccoon.
	Touch.instances = new Array();
	Touch.dispose = function() {
		while(Touch.instances.length) {
			Touch.instances.shift().dispose();
		}
	};
	
	// Events
	Touch.TOUCH_X = 'touchx';
	Touch.TOUCH_Y = 'touchy';
	Touch.TOUCH_XY = 'touchxy';
	Touch.TOUCH_ALL = 'touchall';
	Touch.TOUCH_START = 'touchstart';
	Touch.TOUCH_END = 'touchend';
	
	/** TODO: Implement
	Touch.TOUCH_ROTATE = 'touchrotate';
	Touch.TOUCH_SCALE = 'touchscale';
	**/
});