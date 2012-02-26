if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.utils) {
	contrib.utils = new Object();
}

contrib.utils.Navigator = new (function Navigator() {
	var __self__ = this;
	var timer = false;
	var lastUrl = '';
	
	this.rules = new Array();
	var urlData = null;
	var history = {};
	var forceHash = false;
	var findSteps = false;
	
	var getUrlData = function() {
		var data = urlData;
		urlData = null;
		return data;
	};
	
	this.useHash = function(bool) {
		forceHash = bool;
	};
	
	this.useSteps = function(bool) {
		findSteps = bool;
	};
	
	this.getPage = function(url) {
		if (history[url]) {
			return history[url];
		}
		return null;
	};
	
	this.setUrl = function(newUrl, name, data) {
		if (!timer) {
			lastUrl = newUrl;
		}
		urlData = {
			'name': name,
			'data': data,
			'url': newUrl
		};
		if (!forceHash && window.history && window.history.pushState) {
			window.history.pushState(data, name, newUrl);
		} else {
			window.location.href = '#' + newUrl;
		}
	};
	
	var getHash = __self__.getHash = function() {
		var hash = window.location.hash ? window.location.hash.substr(1) : '';
		if (!forceHash && window.history && window.history.pushState) {
			return hash;
		}
		if (hash) {
			var otherHashIndex = hash.lastIndexOf('#');
			if (hash.indexOf('/') == 0 && otherHashIndex > -1) {
				return hash.substr(otherHashIndex + 1);
			}
		}
		return hash;
	};
	
	var getUrl = __self__.getUrl = function(excludeDomain) {
		var prefix = excludeDomain ? '' : window.location.protocol + '//' + window.location.host;
		if (!forceHash && window.history && window.history.pushState) {
			return prefix + window.location.pathname;
		}
	    var hash = window.location.hash;
	    if (hash && hash.indexOf('/') == 1) {
	        return prefix + hash.substr(1);
	    }
	    return prefix + window.location.pathname;
	};
	
	this.parseTags = function() {
		var tags = document.getElementsByTagName('a');
		var size = tags.length;
		for (var i = 0; i < size; i++) {
			var anchor = tags[i];
			if (anchor['rel'] == 'pushState' && !anchor.onclick) {
				anchor.onclick = function() {
					__self__.setUrl(this.href, this.title);
					return false;
				};
			}
		}
	};
	
	var buildPage = function(newUrl, pageObj, data, levels, steps) {
		if (pageObj.execute) {
			var page = history[newUrl] = {};
			page.execute = pageObj.execute;
			if (pageObj.reverse) {
				page.reverse = pageObj.reverse;
				if (pageObj.autoReverse) {
					page.autoReverse = true;
				}
			}
			pageObj.execute(data, levels, steps);
		} else if (pageObj.class) {
			history[newUrl] = new pageObj.class(data, levels, steps);
			history[newUrl].execute();
		}
	};
	
	var dispatchUrl = function(newUrl) {
		if (newUrl.length > 1 && newUrl[newUrl.length - 1] == '/') {
			newUrl = newUrl.substr(0, newUrl.length - 1);
		}
		var size = __self__.rules.length;
		for (var i = 0; i < size; i++) {
			var pageObj = __self__.rules[i];
			if ((typeof pageObj.rule == 'string' && (new RegExp(pageObj.rule, 'i')).test(newUrl)) ||
					(pageObj.rule.test && pageObj.rule.test(newUrl))) {
				var data = getUrlData() || {
					'name': '',
					'data': null,
					'url': newUrl
				};
				var levels = newUrl.split('/').slice(1);
				var steps = findSteps ? __self__.getPathSteps(newUrl) : null;
				
				if (history[lastUrl] && history[lastUrl].autoReverse) {
					history[lastUrl].reverse();
				}
				
				if (findSteps) {
					var rry = steps.reverse;
					var length = rry.length;
					for (var i = 0; i < length; i++) {
						var url = rry[i];
						var page = history[url];
						if (page) {
							if (page.reverse) {
								page.reverse();
							}
							delete history[url];
						}
					}
					rry = steps.execute;
					length = rry.length;
					for (var j = 0; j < length; j++) {
						var url = rry[i];
						var page = history[url];
						if (page) {
							page.execute();
						}
						delete history[url];
					}
				}
				
				buildPage(newUrl, pageObj, data, levels, steps);
				break;
			}
		}
		// Should we call some onchange event?
	};
	
	var getLevelUp = function(path) {
		return new String(path.substr(0, path.lastIndexOf('/')));
	};
	
	var buildSteps = function(path, offset) {
		if (path.length == 1) {
			return new Array();
		}
		path = path.split('/');
		var size = path.length;
		if (size < 2) {
			return new Array();
		}
		var steps = new Array();
		for (var i = 2; i <= size; i++) {
			steps[steps.length] = offset + '/' + path.slice(1, i).join('/');
		}
		return steps;
	};
	
	this.getPathSteps = function(targetUrl) {
		var path = new String(lastUrl);
		var backSteps = new Array();
		if (targetUrl.indexOf(path) != 0) {
			backSteps = [path.toString()];
			path = getLevelUp(path);
			while (path != '' && (targetUrl.indexOf(path) != 0 || targetUrl.split(path)[1][0] != '/')) {
				backSteps[backSteps.length] = path.toString();
				path = getLevelUp(path);
			}
		}
		if (path.length > 0) {
			return { 'reverse': backSteps, 'pivot': path.toString(), 'execute': buildSteps(targetUrl.split(path)[1], path) };
		}
		return { 'reverse': backSteps, 'pivot': '/', 'execute': buildSteps(targetUrl, '') };
	};
	
	var check = function() {
		var newUrl = getUrl(true);
		if (newUrl == lastUrl) {
			return;
		}
		dispatchUrl(newUrl);
		lastUrl = newUrl;
	};
	
	this.start = function() {
		if (timer) {
			return;
		}
		timer = setInterval(check, 500);
	};
	
	this.stop = function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};
})();