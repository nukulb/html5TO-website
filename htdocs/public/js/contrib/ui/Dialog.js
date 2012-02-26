R.require('contrib.ui.Dialog',
'contrib.events.EventDispatcher',
'contrib.extensions.DOMTweener',
'contrib.extensions.Document', function() {
	contrib.ui.Dialog = function Dialog(dialog, overlay) {
		var events = contrib.events;
		
		this.inheritFrom = events.EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;

		var __self__ = this;
		var mover;

		this.getDialog = function () {
			return dialog;
		};

		var moveMe = function () {
			var coord = document.getCenter({ 'width': dialog.offsetWidth, 'height': dialog.offsetHeight }, true);
			dialog.tween('top', { 'to': coord.posY, 'unit': 'px' });
			dialog.tween('left', { 'to': coord.posX, 'unit': 'px' });
		};

		this.open = function () {
			if (dialog.getStyleValue('opacity') > 0) {
				__self__.addEventListener('close', function (e) {
					__self__.removeEventListener(e.listener);
					__self__.open();
				});
				__self__.close();
				return;
			}
			
			dialog.style.display = 'block';
			var coord = document.getCenter({ 'width': dialog.offsetWidth, 'height': dialog.offsetHeight }, true);
			dialog.style.left = coord.posX + 'px';
			dialog.style.top = coord.posY + 'px';
			overlay.style.display = 'block';
			
			if (overlay) {
				overlay.tween('opacity', { 'to': 100 });
				overlay.onclick = function(e) {
					__self__.close();
					events.preventDefaults(e);
					return false;
				};
			}
			dialog.tween('opacity', { 'to': 100, 'oncomplete': function() {
				__self__.dispatchEvent('open', {});
			}});
			
			if (window.attachEvent) {
				window.attachEvent('onresize', moveMe);
			} else if (window.addEventListener) {
				window.addEventListener('resize', moveMe, false);
			}
		};

		this.close = function () {
			if (overlay) {
				overlay.tween('opacity', { 'to': 0, 'oncomplete': function() {
					overlay.style.display = 'none';
				}});
				overlay.onclick = null;
			}
			dialog.tween('opacity', { 'to': 0, 'oncomplete': function() {
				dialog.style.display = 'none';
				__self__.dispatchEvent('close', {});
			}});
			if (window.detachEvent) {
				window.detachEvent('onresize', moveMe);
			} else {
				window.removeEventListener('resize', moveMe, false);
			}
		};
	};
});