if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.ui) {
	contrib.ui = new Object();
}

contrib.ui.ScrollPane = function(container, axis, scrollBarObj) {
	var __self__ = this;
	var events = contrib.events;
	
	this.inheritFrom = events.EventDispatcher;
	this.inheritFrom();
	delete this.inheritFrom;
	
	/* These should be editable within some options parameter */
	var MIN_KNOB_WIDTH = 40;
	var SCROLL_SPEED = 0.2;
	
	var mask = container.parentNode;
	var cache = new Object();
	var disabled = false;
	var touchHelper = new events.Touch(container);
	var listener = null;
	
	var lastMousePos = 0;
	var lastStamp = 0;
	var lastDelta = 0;
	var speed = 1;
	
	var scrolling = false;
	
	var start = this.restart = function() {
		if (!axis || axis == 'x') {
			axis = {
				'dimension': 'offsetWidth',
				'pos': 'posX',
				'style': 'width',
				'offset': 'left',
				'touchEvent': events.Touch.TOUCH_X
			};
		} else {
			axis = {
				'dimension': 'offsetHeight',
				'pos': 'posY',
				'style': 'height',
				'offset': 'top',
				'touchEvent': events.Touch.TOUCH_Y
			};
		}
		
		__self__.calibrate();
	};
	
	this.disable = function() {
		disabled = true;
	};
	
	this.enable = function() {
		disabled = false;
	};
	
	this.calibrate = function() {
		if (scrolling) {
			return;
		}
		cache.maskSize = mask[axis.dimension];
		cache.maskPos = mask.getXY()[axis.pos];
		cache.contentSize = container[axis.dimension];
		cache.contentPos = container.getXY()[axis.pos] - cache.maskPos;
		var perc = cache.maskSize / cache.contentSize;		if (perc >= 1)			container.tween(axis.offset, { 'to': 0, 'unit': 'px', 'duration': SCROLL_SPEED });
		if (scrollBarObj) {
			var perc = cache.maskSize / cache.contentSize;
			if (perc >= 1) {
				// We have less content than mask room, so we need to hide the scrollbar :)
				cache.barSize = cache.knobSize = cache.knobPos = cache.barPos = false;
				scrollBarObj.knob.tween(axis.style, { 'to': scrollBarObj.bar.offsetWidth, 'unit': 'px', 'duration': SCROLL_SPEED });
				scrollBarObj.knob.tween(axis.offset, { 'to': 0, 'unit': 'px', 'duration': SCROLL_SPEED });
				scrollBarObj.bar.style.display = 'none';
			} else {
				scrollBarObj.bar.style.display = null;
				cache.barSize = scrollBarObj.bar[axis.dimension];
				if (scrollBarObj.allowResizing !== false) {
					cache.knobSize = Math.round(Math.max(MIN_KNOB_WIDTH, cache.barSize * perc));
				} else {
					cache.knobSize = scrollBarObj.knob.getStyleValue('width', 'px');
				}
				scrollBarObj.knob.tween(axis.style, { 'to': cache.knobSize, 'unit': 'px', 'duration': SCROLL_SPEED });
				cache.knobPos = scrollBarObj.knob.getXY()[axis.pos];
				cache.barPos = scrollBarObj.bar.getXY()[axis.pos];
				// Here, we check if the knob still fits in the bar...
				var diff = cache.knobPos + cache.knobSize - cache.barSize;
				if (diff > 0) {
					cache.knobPos -= diff;
					scrollBarObj.knob.tween(axis.offset, { 'to': cache.knobPos, 'unit': 'px', 'duration': SCROLL_SPEED });
				}
			}
		}
	};
	
	var getElPosition = function(el) {
		return el.getXY()[axis.pos] - cache.maskPos;
	};
	
	var checkCalibration = function() {
		if (cache.contentSize = container[axis.dimension] || cache.maskPos != mask.getXY()[axis.pos] || cache.maskSize != mask[axis.dimension]) {
			__self__.calibrate();
		}
	};
	
	var check = function(snap) {
		if (scrolling) {
			return;
		}
		var increment = cache.maskSize;
		var diff = increment - cache.contentSize;
		var currentPos = cache.contentPos;
		if (diff > 0 || currentPos > 0) {
			if (snap) {
				cache.contentPos = 0;
				container.style[axis.offset] = '0px';
			} else {
				__self__.scrollTo(0);
			}
		} else if (currentPos < diff) {
			if (snap) {
				cache.contentPos = Math.round(diff);
				container.style[axis.offset] = diff + 'px';
			} else {
				__self__.scrollTo(-diff);
			}
		}
	};
	
	this.scrollBy = function (val) {
		if (disabled) {
			return;
		}
		val = val || 0;
		var diff = cache.maskSize - cache.contentSize;
		if (cache.contentPos > 0 || cache.contentPos < diff) {
			val *= 0.75;
		}
		// Do the same with the other function
		var min = 10 - cache.contentSize;
		var max = cache.maskSize - 10;
		var contentPos = cache.contentPos = Math.max(min, Math.min(max, Math.round(cache.contentPos - val)));
		/*var maxOffset = cache.maskSize * 0.4;
		if (contentPos > maxOffset) {
			contentPos = cache.contentPos = maxOffset;
		} else if (contentPos < diff - maxOffset) {
			contentPos = cache.contentPos = diff - maxOffset;
		}*/
		if (scrolling) {
			container.style[axis.offset] = contentPos + 'px';
			__self__.dispatchEvent('scroll', { 'percent': contentPos / diff });
			__self__.dispatchEvent('completeScroll', { 'percent': contentPos / diff });
		} else {
			container.tween(axis.offset, { 'to': contentPos, 'unit': 'px', 'duration': SCROLL_SPEED, 'timingFunction': 'ease-out',
				'oncomplete': function() {
					check();
					__self__.dispatchEvent('completeScroll', { 'percent': contentPos / diff });
				}
			});
			__self__.dispatchEvent('scroll', { 'percent': contentPos / diff });
		}
	};

	this.scrollTo = function (val) {
		if (disabled) {
			return;
		}
		val *= -1;
		var min = 10 - cache.contentSize;
		var max = cache.maskSize - 10;
		var contentPos = cache.contentPos = Math.max(min, Math.min(max, Math.round(val)));
		var diff = cache.maskSize - cache.contentSize;
		container.tween(axis.offset, { 'to': contentPos, 'unit': 'px', 'duration': SCROLL_SPEED, 'timingFunction': 'ease-out',
			'oncomplete': function() {
				check();
				__self__.dispatchEvent('completeScroll', { 'percent': cache.contentPos / diff });
			}
		});
		__self__.dispatchEvent('scroll', { 'percent': cache.contentPos / diff });
	};
	
	this.scrollToEl = function(el) {
		var coord = getElPosition(el);
		if (coord) {
			__self__.scrollBy(coord);
		}
	};

	this.scrollToPercent = function (perc) {
		if (disabled) {
			return;
		}
		__self__.scrollTo(perc / 100 * (cache.contentSize - cache.maskSize));
	};
	
	var mouseMove = function(e) {
		if (disabled) {
			return;
		}
		
		if (e) {
			var newPos = document.getMouseXY(e.touchEvent)[axis.pos];
			var newStamp = (new Date()).getTime();
			
			var delta = lastDelta = e.delta ? -(e.delta) : 0;
			__self__.scrollBy(delta);
			speed = (newPos - lastMousePos) / (newStamp - lastStamp);
			
			lastMousePos = newPos;
			lastStamp = newStamp;
		} else {
			__self__.scrollBy(((Math.abs(speed) + 1) * 2 * lastDelta) - lastDelta);
		//} else {
			//check();
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
		//events.preventDefaults(e);
	};
	
	/*var mouseDown = function(e) {
		if (disabled) {
			return;
		}
		events.preventDefaults(e);
		scrolling = true;
		lastMousePos = document.getMouseXY(e)[axis.pos];
		lastStamp = (new Date()).getTime();
		events.preventDefaults(e);
	};*/
	
	var touchDown = function(e) {
		if (disabled) {
			return;
		}
		scrolling = true;
		lastMousePos = document.getMouseXY(e)[axis.pos];
		lastStamp = (new Date()).getTime();
		// perhaps, if we have swipe-only mode, we ignore this move event
		//container.addEventListener('touchmove', mouseMove, false);
		//events.preventDefaults(e);
	};
	
	/*var mouseUp = function(e) {
		scrolling = false;
		mouseMove(false);
	};*/
	
	var touchUp = function(e) {
		scrolling = false;
		// Then, if we have swipe-only, we need not to remove this event listener
		// and we should pass e to mouseMove...
		//container.removeEventListener('touchmove', mouseMove, false);
		mouseMove(false);
		lastDelta = 0;
		speed = 1;
	};
	
	var scrollWheel = function(e) {
		/*if (e.srcElement && e.srcElement != container) {
			return;
		}*/
		scrolling = true;
		__self__.scrollBy(-events.getWheelDelta(e) * 10);
		scrolling = false;
		check(true);
		events.preventDefaults(e);
		return false;
	};
	
	if (scrollBarObj) {
		if (scrollBarObj.alwaysVisible === false) {
			// revisit this code laterr
			/*var mouseover = false;
			var requested = false;
			
			var fadeIn = function() {
				requested = true;
				scrollBarObj.bar.tween('opacity', { 'to': 100, 'speed': 1,
					'oncomplete': function() {
						requested = false;
					}
				});
			};
			
			var fadeOut = function() {
				setTimeout(function() {
					if (!requested) {
						scrollBarObj.bar.tween('opacity', { 'to': 0, 'speed': 1 });
					}
				}, 1000);
			};
			
			__self__.addEventListener('scroll', fadeIn);
			__self__.addEventListener('completeScroll', function() {
				if (!mouseover) {
					fadeOut();
				}
			});
			events.addHandler(mask, 'onmouseover', function() {
				mouseover = true;
				fadeIn();
			});
			events.addHandler(mask, 'onmouseout', function() {
				mouseover = false;
				scrollBarObj.bar.tween('opacity', { 'to': 0, 'speed': 1 });
			});*/
		}
		/* Most of this should be moved to a draggable class */
		if (scrollBarObj) {
			var knob = scrollBarObj.knob;
			var button = new events.Mouse(knob);
			var track = new events.Mouse(scrollBarObj.bar);
			
			var keepUp = function(e) {
				var diff = cache.barSize - cache.knobSize;
				cache.knobPos = e.percent * diff;
				if (e.percent >= 1) {
					knob.style[axis.style] = Math.max(0, cache.barSize - cache.knobPos) + 'px';
					knob.style[axis.offset] = cache.knobPos + 'px';
				} else if (e.percent <= 0) {
					knob.style[axis.style] = (cache.knobSize + cache.knobPos) + 'px';
					knob.style[axis.offset] = '0px';
					cache.knobPos = 0;
				} else {
					knob.tween(axis.offset, {'to': cache.knobPos, 'unit': 'px', 'duration': SCROLL_SPEED,
								'timingFunction': 'ease-out'});
					knob.tween(axis.style, {'to': cache.knobSize, 'unit': 'px', 'duration': SCROLL_SPEED,
								'timingFunction': 'ease-out'});
				}
			};
			
			var scrolllistener = __self__.addEventListener('scroll', keepUp);
			var difference = 0;
			var trackMouse = function (e) {
				scrolling = true;
				var newPos = document.getMouseXY(e)[axis.pos];
				var change = newPos - difference;
				difference = newPos;
				delete newPos;
				cache.knobPos += change;
				delete change;
				var diff = cache.barSize - cache.knobSize;
				cache.knobPos = cache.knobPos >= diff ? diff : (cache.knobPos < 0 ? 0 : cache.knobPos);
				__self__.scrollToPercent(cache.knobPos / diff * 100);
				delete diff;
				knob.style[axis.offset] = cache.knobPos + 'px';
			};
	
			var mouseDown = function (e) {
				scrolling = true;
				difference = document.getMouseXY(e)[axis.pos];
				if (scrolllistener) {
					__self__.removeEventListener(scrolllistener);
					scrolllistener = null;
				}
				button.addMouseMove(trackMouse);
			};
	
			var mouseUp = function () {
				scrolling = false;
				button.removeMouseMove();
				if (scrolllistener) {
					__self__.removeEventListener(scrolllistener);
					scrolllistener = null;
				}
				scrolllistener = __self__.addEventListener('scroll', keepUp);
			};
	
			button.addMouseDown(mouseDown);
			button.addMouseUp(mouseUp);
	
			track.addMouseDown(function(e) {
				var diff = cache.barSize - cache.knobSize;
				__self__.scrollToPercent(Math.min(diff, Math.max(0, document.getMouseXY(e)[axis.pos] - cache.barPos - (cache.knobSize / 2))) / diff * 100);
			});
		}
	}
	
	this.setupListeners = function() {
		// TODO: Review mouse wheel code TODO!!
		container.addEventListener('touchstart', touchDown, false);
		container.addEventListener('touchend', touchUp, false);
		container.addEventListener('mousewheel', scrollWheel, false);
		container.addEventListener('DOMMouseScroll', scrollWheel, false);
		touchHelper.enable();
		if (!listener) {
			listener = touchHelper.addEventListener(axis.touchEvent, mouseMove);
		}
		
		if (window.addEventListener) {
			window.addEventListener('load', __self__.calibrate, false);
			window.addEventListener('resize', __self__.calibrate, false);
		} else if (window.attachEvent) {
			window.attachEvent('onload', __self__.calibrate);
			window.attachEvent('onresize', __self__.calibrate);
			window.onmousewheel = document.onmousewheel = scrollWheel;
		}
	};
	
	this.releaseListeners = function() {
		container.removeEventListener('touchstart', touchDown, false);
		container.removeEventListener('touchend', touchUp, false);
		container.removeEventListener('mousewheel', scrollWheel, false);
		container.addEventListener('DOMMouseScroll', scrollWheel, false);
		touchHelper.dispose();
		if (listener) {
			touchHelper.removeEventListener(listener);
			listener = null;
		}
		
		if (window.removeEventListener) {
			window.removeEventListener('load', __self__.calibrate, false);
			window.removeEventListener('resize', __self__.calibrate, false);
		} else if (window.detachEvent) {
			window.detachEvent('onload', __self__.calibrate);
			window.detachEvent('onresize', __self__.calibrate);
			window.onmousewheel = document.onmousewheel = null;
		}
	};
	
	start();
	this.setupListeners();
};