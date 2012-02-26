if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.events) {
	contrib.events = new Object();
}

(function () {
	var events = contrib.events;
	var serialNumber = 0;
	var STATUS_KOSHER = "kosher";
	var STATUS_CANCELLED = "taboo";
	
	events.preventDefaults = function(e) {
		if (e.preventDefault) e.preventDefault();
		if (e.stopPropagation) e.stopPropagation();
	};
	events.getWheelDelta = function(event) {
		var delta = 0;
		if (!event)
			event = window.event;
		if (event.wheelDelta)
			delta = event.wheelDelta / 120;
		else if (event.detail)
			delta = -event.detail / 3;
		return delta;
	};
	events.Listener = function (eventName, FN, maxRuns) {
		var home = this;
		var id = serialNumber++;
		var executions = 0;
		var status = STATUS_KOSHER;

		this.getID = function () {
			return id;
		};
		this.execute = function (e) {
			executions++;
			FN(e, home);
			if (maxRuns === executions) {
				home.cancel();
			}
		};
		this.getStatus = function () {
			return status;
		};
		this.getExecutions = function () {
			return executions();
		};
		this.getEventName = function () {
			return eventName;
		};
		this.setMaxRuns = function (val) {
			maxRuns = val;
		};
		this.cancel = function () {
			status = STATUS_CANCELLED;
		};
		if (!maxRuns) {
			maxRuns = -1;
		}
	};
	events.EventDispatcher = function () {
		var home = this;
		var events = {};

		this.queueListener = function (listener) {
			var eventName = listener.getEventName();
			if (!events[eventName])
				events[eventName] = {};
			events[eventName][listener.getID()] = listener;
		};
		this.addEventListener = function (eventName, FN) {
			var listener = new contrib.events.Listener(eventName, FN);
			home.queueListener(listener);
			return listener;
		};
		this.removeEventListenerByAttributes = function (eventName, id) {
			if (!events[eventName] || !events[eventName][id]) {
				console.warn('Removing an event that is non-existent.', eventName, id);
				return;
			}
			delete events[eventName][id];
		};
		this.removeEventListener = function (listener) {
			home.removeEventListenerByAttributes(listener.getEventName(), listener.getID());
		};
		this.dispatchEvent = function (eventName, eventObj) {
			if (!events[eventName])
				return false;
			if (!eventObj) {
				eventObj = {};
			}
			var counter = 0;
			for (var id in events[eventName]) {
				if (events[eventName][id].getStatus() == STATUS_CANCELLED) {
					delete events[eventName][id];
				} else {
					eventObj['listener'] = events[eventName][id];
					eventObj['listener'].execute(eventObj);
					counter++;
				}
			}
			if (!counter) {
				delete events[eventName];
				return false;
			}
			return true;
		};
		this.getSubscriptions = function () {
			var rtrnArray = new Array();
			for (var event in events) {
				rtrnArray[rtrnArray.length] = event;
			}
			return rtrnArray;
		};
		this.killListeners = function (eventName) {
			if (!events[eventName])
				return;
			delete events[eventName];
		};
		this.killAllListeners = function () {
			events = {};
		};
	};
})();