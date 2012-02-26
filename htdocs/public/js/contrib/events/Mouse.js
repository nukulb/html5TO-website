var DocumentDispatch = new contrib.events.EventDispatcher();

var mouseSerial = 0;
var target = null;

var convertEvent = function (e) {
	if (!e) {
		e = window.event;
		if (e.srcElement) {
			e.target = e.srcElement;
		}
	}
	return e;
};

var onmousedown = function (e) {
	e = convertEvent(e);
	if (!e.target || (e.target.mouse_noTouch && e.type == 'touchstart')) {
		return;
	}
	var bool = DocumentDispatch.dispatchEvent(e.target.mouse_serial + 'onmousedown', e);
	if (bool) {
		target = e.target;
		document.body.focus();
		document.onselectstart = function () {
			return false;
		};
		e.target.ondragstart = function () {
			return false;
		};
		return false;
	}
};

var onmouseup = function (e) {
	document.onselectstart = null;
	if (target != null) {
		target.ondragstart = null;
		e = convertEvent(e);
		e['realTarget'] = target;
		DocumentDispatch.dispatchEvent(target.mouse_serial + 'onmouseup', e);
		target = null;
	}
};

if (document.addEventListener) {
	document.addEventListener('mousedown', onmousedown, false);
	document.addEventListener('mouseup', onmouseup, false);
	
	document.addEventListener('touchstart', onmousedown, false);
	document.addEventListener('touchend', onmouseup, false);
} else if (document.attachEvent) {
	document.attachEvent('onmousedown', onmousedown);
	document.attachEvent('onmouseup', onmouseup);
} else {
	document.onmousedown = onmousedown;
	document.onmouseup = onmouseup;
}

contrib.events.Mouse = function Mouse(obj, noTouch) {
	noTouch = noTouch == undefined || noTouch == null ? false : noTouch;
	
	var home = this;

	var up;
	var down;

	obj.mouse_serial = mouseSerial++;
	obj.mouse_noTouch = noTouch;

	this.addMouseDown = function (FN) {
		down = DocumentDispatch.addEventListener(obj['mouse_serial'] + 'onmousedown', FN);
	};

	this.addMouseUp = function (FN) {
		up = DocumentDispatch.addEventListener(obj['mouse_serial'] + 'onmouseup', FN);
	};
	
	this.addMouseMove = function (FN) {
		if (!document.addEventListener && document.captureEvents) {
			document.captureEvents(Event.MOUSEMOVE);
		}
		document.onmousemove = function (e) {
			e = convertEvent(e);
			FN(e);
			if (e.preventDefault)
				e.preventDefault();
		};
		if (document.addEventListener) {
			document.addEventListener('touchmove', document.onmousemove, false);
		}
	};

	this.removeMouseUp = function () {
		if (up) {
			DocumentDispatch.removeEventListener(up);
		}
	};

	this.removeMouseDown = function () {
		if (down) {
			DocumentDispatch.removeEventListener(down);
		}
	};

	this.removeMouseMove = function () {
		if (document.removeEventListener) {
			document.removeEventListener('touchmove', document.onmousemove, false);
		}
		document.onmousemove = null;
	};
};

contrib.events.Mouse.dispose = function() {
	DocumentDispatch.killAllListeners();
	delete DocumentDispatch;
	delete mouseSerial;
	delete target;
	delete convertEvent;
	if (document.removeEventListener) {
		document.removeEventListener('mousedown', onmousedown, false);
		document.removeEventListener('mouseup', onmouseup, false);
		
		document.removeEventListener('touchstart', onmousedown, false);
		document.removeEventListener('touchend', onmouseup, false);
		document.removeEventListener('touchmove', document.onmousemove, false);
	} else if (document.detachEvent) {
		document.detachEvent('onmousedown', onmousedown, false);
		document.detachEvent('onmouseup', onmouseup, false);
	} else {
		document.onmousedown = document.onmouseup = null;
	}
	document.onmousemove = null;
	delete onmousedown;
	delete onmouseup;
};