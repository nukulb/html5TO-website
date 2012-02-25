R.require('contrib.ui.SwipePane',
'contrib.events.Touch',
'contrib.utils.extensions.DOMTweener',
function() {
	// How can this code base be shared with a new type of slideshow that can be
	// swiped... it might just have to be a copy and paste
	
	// See, the key difference is that elements are not currently in the DOM,
	// but are added DYNAMICALLY.  Might be awesome if we did the same?  Only
	// adding the content to the DOM when necessary.  Could be COOL!
	contrib.ui.SwipePane = function SwipePane(container, axis, pageClassName, offsetObj) {
		this.inheritFrom = contrib.events.EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;
		
		var __self__ = this;
		var SCROLL_SPEED = 0.2;
		var LEFT_OVER = 5;
		var FORWARD_RATIO = 0.15;
		var BACKWARD_RATIO = 0.85;
	
		var mask = container.parentNode;
		var clearNode;
		
		var pages = new Array();
		var currentPage = 0;
		var cache = new Object();
		var disabled = false;
		var touchHelper = new contrib.events.Touch(container);
		var listener = null;
		
		var scrolling = false;
		
		var start = this.restart = function() {
			if (!axis || axis == 'x') {
				axis = {
					'dimension': 'offsetWidth',
					'pos': 'posX',
					'style': 'width',
					'offset': 'margin-left',
					'touchEvent': contrib.events.Touch.TOUCH_X
				};
			} else {
				axis = {
					'dimension': 'offsetHeight',
					'pos': 'posY',
					'style': 'height',
					'offset': 'margin-top',
					'touchEvent': contrib.events.Touch.TOUCH_Y
				};
			}
			
			if (!offsetObj) {
				offsetObj = {};
			}
			
			offsetObj = {
				top: offsetObj.top || 0,
				right: offsetObj.right || 0,
				bottom: offsetObj.bottom || 0,
				left: offsetObj.left || 0,
			};
			
			container.normalize();
			
			var nodes = container.childNodes;
			var size = nodes.length;
			var hasClear = false;
			
			for (var i = 0; i < size; i++) {
				if (nodes[i].nodeType == Node.ELEMENT_NODE) {
					var el = nodes[i];
					if (el.getStyle('clear') == 'both') {
						hasClear = el;
					} else {
						if (hasClear) {
							hasClear = false;
						}
						prepareNode(el);
						pages[pages.length] = el;
					}
				}
			}
			
			if (hasClear) {
				clearNode = hasClear;
			} else {
				clearNode = document.createElement('div');
				clearNode.style.clear = 'both';
				clearNode.style.height = '0';
				clearNode.style.visibility = 'hidden';
				container.appendChild(clearNode);
			}
			
			__self__.calibrate();
		};
		
		var prepareNode = function(node) {
			node.addClass(pageClassName);
			var styles = {
				float: 'left',
				display: 'block'
			};
			if (axis.style == 'width') {
				styles['width'] = (cache.maskWidth - offsetObj.left - offsetObj.right) + 'px';
			} else {
				styles['height'] = (cache.maskHeight - offsetObj.top - offsetObj.bottom) + 'px';
			}
			node.applyStyle(styles);
		};
		
		this.calibrate = function(shortCalib) {
			if (scrolling) {
				return;
			}
			if (shortCalib === true) {
				if (!cache.maskSize) {
					cache.maskSize = mask[axis.dimension];
				}
				cache.contentSize = cache.maskSize * pages.length;
				container.style[axis.style] = cache.contentSize + 'px';
				return;
			}
			
			cache.maskSize = mask[axis.dimension];
			cache.contentSize = cache.maskSize * pages.length;
			container.style[axis.style] = cache.contentSize + 'px';
			
			cache.maskPos = mask.getXY()[axis.pos];
			cache.contentPos = container.getXY()[axis.pos] - cache.maskPos;
			
			if (axis.style == 'width') {
				cache.maskWidth = cache.maskSize;
				cache.maskHeight = mask.offsetHeight;
				container.style.height = cache.maskHeight + 'px';
			} else {
				cache.maskHeight = cache.maskSize;
				cache.maskWidth = mask.offsetWidth;
				container.style.width = cache.maskWidth + 'px';
			}
			
			for (var i = 0; i < pages.length; i++) {
				prepareNode(pages[i]);
			}
		};
		
		var appendPage = function(markup) {
			var newChild = document.createElement('div');
			newChild.innerHTML = markup;
			prepareNode(newChild);
			container.insertBefore(newChild, clearNode);
			pages[pages.length] = newChild;
		};
		
		var unappendPage = function(index) {
			var child = pages.splice(index, 1)[0];
			child.parentNode.removeChild(child);
			child = null;
			delete child;
		};
		
		this.addPage = function() {
			var size = arguments.length;
			for (var i = 0; i < size; i++) {
				appendPage(arguments[i]);
			}
			
			__self__.calibrate(true);
			return pages.length;
		};
		
		var evaluateNextPageIndex = function(pos) {
			pos = typeof pos == 'number' ? pos : cache.contentPos;
			if (pos > 0 || pos < -cache.contentSize + cache.maskSize) {
				moveToCurrentPage();
				return;
			}
			
			var increment = cache.maskSize;
 			var remainder = Math.abs(pos) % increment;
			
			var isForward = cache.lastContentPos > pos;
			if (remainder > 0) {
				if (isForward && remainder >= increment * FORWARD_RATIO) {
					__self__.nextPage();
				} else if (!isForward && remainder <= increment * BACKWARD_RATIO) {
					__self__.previousPage();
				} else {
					moveToCurrentPage();
				}
			}
		};
		
		var dispatchEvent = function(pos) {
			__self__.dispatchEvent('move', { page: currentPage + 1, position: pos, percent: Math.round(pos / cache.contentSize * 100) });
		};
		
		var moveToCurrentPage = function() {
			var target = cache.contentPos = -cache.maskSize * currentPage;
			container.tween(axis.offset, { to: target, unit: 'px', duration: SCROLL_SPEED });
			dispatchEvent(target);
		};
		
		this.removePage = function(pageNum) {
			if (!pageNum && pageNum != 0) {
				pageNum = pages.length;
			}
			unappendPage(pageNum - 1);
			
			__self__.calibrate(true);
			return pages.length;
		};
		
		this.clearPages = function() {
			var size = pages.length;
			for (var i = 0; i < size; i++) {
				unappendPage(i);
			}
			
			__self__.calibrate(true);
			return 0;
		};
		
		this.nextPage = function() {
			if (++currentPage >= pages.length) {
				currentPage = pages.length - 1;
				if (scrolling) {
					moveToCurrentPage();
				}
				return;
			}
			moveToCurrentPage();
		};
		
		this.previousPage = function() {
			if (--currentPage < 0) {
				currentPage = 0;
				if (scrolling) {
					moveToCurrentPage();
				}
				return;
			}
			moveToCurrentPage();
		};
		
		this.gotoPage = function(page) {
			page -= 1;
			if (page > -1 && page < pages.length) {
				currentPage = page;
				moveToCurrentPage();
			}
		};
		
		this.getPageCount = function() {
			return pages.length;
		};
		
		var touchDown = function(e) {
			scrolling = true;
			cache.lastContentPos = cache.contentPos;
		};
		
		var touchUp = function(e) {
			touchMove(false);
			scrolling = false;
		};
		
		var touchMove = function(e) {
			if (e) {
				var delta = e.delta;
				
				var target = cache.contentPos + (delta ? delta : 0);
				if (target <= cache.lastContentPos - cache.maskSize + LEFT_OVER || target >= cache.lastContentPos + cache.maskSize - LEFT_OVER) {
					return;
				}
				cache.contentPos = target;
				container.style[axis.offset] = target + 'px';
				
				dispatchEvent(target);
			} else {
				evaluateNextPageIndex();
			}
		};
		
		this.setupListeners = function() {
			container.addEventListener('touchstart', touchDown, false);
			container.addEventListener('touchend', touchUp, false);
			touchHelper.enable();
			if (!listener) {
				listener = touchHelper.addEventListener(axis.touchEvent, touchMove);
			}
			
			if (window.addEventListener) {
				window.addEventListener('load', __self__.calibrate, false);
				window.addEventListener('resize', __self__.calibrate, false);
			} else if (window.attachEvent) {
				window.attachEvent('onload', __self__.calibrate);
				window.attachEvent('onresize', __self__.calibrate);
			}
		};
		
		
		this.removeListeners = function() {
			container.removeEventListener('touchstart', touchDown, false);
			container.removeEventListener('touchend', touchUp, false);
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
			}
		};
		
		start();
		
		this.setupListeners();
	};
	
});