(function Helpers() {
	if (!Array.prototype.removeAt) {
		Array.prototype.removeAt = function removeAt(index) {
			if (index > -1 && index < this.length) {
				this.splice(index, 1);
			}
		};
	}
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function indexOf(val) {
			var size = this.length;
			for (var i = 0; i < size; i++) {
				if (this[i] == val) {
					return i;
				}
			}
			return -1;
		};
	}
	if (!Array.prototype.remove) {
		Array.prototype.remove = function remove(obj) {
			this.removeAt(this.indexOf(obj));
		};
	}
	if (!Array.prototype.unshift) {
		Array.prototype.unshift = function() {
			var size = arguments.length;
			for (var i = size; i > 0; i++) {
				arguments[i] = arguments[i - 1];
			}
			arguments[0] = 0;
			this.splice.apply(this, args);
			return this.length;
		};
	}
})();

(function Raccoon() {
	var R = new Object();
	if (!window.Raccoon) {
		Raccoon = R;
	}
	if (!window.R) {
		window.R = R;
	}
	
	R.MAIN_THREAD = '__main__';
	var defaultPath = '';
	var fileMatches = {};
	var namespaces = new Array();
	var async = true;
	var extension = '.js';
	var delimiter = '.';
	var config = {};
	
	var settings = R.settings = new (function Settings(R, fileMatches, namespaces, config) {
		var __self__ = this;
		var version = '1.6';
		var devMode = true;
		
		var debug;
		var assert;
		var trace;
		
		this.version = function() {
			return version;
		};
		this.async = function(bool) {
			if (!bool && bool != false)
				return async;
			async = bool || window.importScripts
			return bool;
		};
		this.devMode = function(setToDev) {
			if (!setToDev && setToDev !== false)
				return devMode;
			devMode = setToDev;
			if (!setToDev) {
				debug = console.debug;
				trace = console.trace;
				assert = console.assert;
				console.debug = console.trace = console.assert = function() {};
			} else if (debug && assert && trace) {
				console.debug = debug;
				console.trace = trace;
				console.assert = assert;
			}
			return setToDev;
		};
		this.extension = function(setExt) {
			if (!setExt)
				return extension;
			extension = setExt;
			return setExt;
		};
		this.delimiter = function(setDelim) {
			if (!setDelim)
				return delimiter;
			delimiter = setDelim;
			return setDelim;
		};
		this.defaultPath = this.setDefaultPath = function(path) {
			if (!path) {
				return defaultPath;
			}
			defaultPath = path;
		};
		this.addPath = function(name, uri) {
			fileMatches[name] = uri;
		};
		this.removePath = function(name) {
			delete fileMatches[name];
		};
		this.setPaths = function() {
			var numOfRules = arguments.length;
			for (var i = 0; i < numOfRules; i++) {
				if (arguments[i].length == 2) {
					__self__.addPath(arguments[i][0], arguments[i][1]);
				}
			}
		};
		this.addNamespace = function(package, directory) {
			namespaces[namespaces.length] = { 'rule': new RegExp('^' + package), 'path': directory, 'levels': package.split(delimiter).length };
			namespaces.sort(function(a, b) {
				return b.levels - a.levels;
			});
		};
		this.dependencyMap = function(map) {
			for (var libraryName in map) {
				var file = config[libraryName] = map[libraryName];
				if (file.path) {
					__self__.addNamespace(libraryName, file.path);
				}
				var scripts = file.scripts;
				for (var name in scripts) {
					if (scripts[name].path) {
						__self__.addPath(name, scripts[name].path);
					}
				}
			}
		};
	})(R, fileMatches, namespaces, config);
	
	var console = R.Console = null;
	R.initConsole = function(settings) {
		console = R.Console = new (function Console(settings) {
			var __self__ = this;
			var cache = {};
			var savedData = [];
			var defaultCount = 0;
			var counts = {};
			var dates = {};
			var profiles = 0;
			var activeProfiles = new Array();
			
			this.notify = function (arguments, methodName) {
				if (!settings.devMode() && (methodName == 'debug' || methodName == 'assert' || methodName == 'trace')) {
					return null;
				}
				savedData[savedData.length] = cache = {
					type: methodName,
					data: arguments
				};
				if (__self__.onnotify) {
					__self__.onnotify(__self__.pop());
				}
				var toSay = '';
				var index = 0;
				while (cache.data[index]) {
					toSay += ' ';
					toSay += cache.data[index];
					index++;
				}
				return cache;
			};
			var notify = __self__.notify;
			this.log = function () {
				notify(arguments, 'log');
			};
			this.debug = function () {
				notify(arguments, 'debug');
			};
			this.info = function () {
				notify(arguments, 'info');
			};
			this.warn = function () {
				notify(arguments, 'warn');
			};
			this.error = function () {
				notify(arguments, 'error');
			};
			this.assert = function () {
				var newObj = {};
				for (var i in arguments) {
					if (i != 0) {
						newObj[i] = arguments[i];
					} else {
						newObj[0] = arguments[0] ? 'Pass:' : 'Fail:';
					}
				}
				notify(newObj, 'assert');
			};
			this.count = function (title) {
				if (!title) {
					notify([++defaultCount], 'count');
					return;
				}
				if (!counts[title]) {
					counts[title] = 0;
				}
				notify([title, ++counts[title]], 'count');
			};
			this.dir = function (obj) {
				if (typeof obj === 'object') {
					notify([obj], 'dir');
					return;
				}
				throw 'Requires an iterable object';
			};
			this.dirxml = function (node) {
				if (node.constructor.name.indexOf('HTML') != -1) {
					notify([node], 'dirxml');
					return;
				}
				throw 'Requires a node object';
			};
			this.group = function () {
				notify(arguments, 'group');
			};
			this.groupCollapsed = function () {
				notify(arguments, 'groupCollapsed');
			};
			this.groupEnd = function () {
				notify([], 'groupEnd');
			};
			this.time = function (title) {
				if (!title) {
					throw 'Name required to create timer';
					return;
				}
				dates[title] = (new Date()).getTime();
				notify([title], 'time');
			};
			this.timeEnd = function (title) {
				if (!title || !dates[title]) {
					throw 'Name required to identify and end a timer';
					return;
				}
				notify([title, timeEnd], 'timeEnd');
				delete dates[title];
			};
			this.profile = function (optName) {
				if (!optName) {
					optName = 'Profile' + (++profiles);
				}
				activeProfiles.push(optName);
				__self__.time(optName);
			};
			this.profileEnd = function () {
				if (activeProfile.length) {
					__self__.timeEnd(activeProfiles.pop());
					return;
				}
				throw 'A profile must be started before we can stop one';
			};
			this.trace = function () {
				var callstack = [];
				var isCallstackPopulated = false;
				try {
					throw 'tracing'
				} catch (e) {
					if (e.stack) {
						var lines = e.stack.split('\n');
						for (var i = 0, len = lines.length; i < len; i++) {
							if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
								callstack.push(lines[i]);
							}
						}
						callstack.shift();
						isCallstackPopulated = true;
					} else if (window.opera && e.message) {
						var lines = e.message.split('\n');
						for (var i = 0, len = lines.length; i < len; i++) {
							if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
								var entry = lines[i];
								if (lines[i + 1]) {
									entry += ' at ' + lines[i + 1];
									i++;
								}
								callstack.push(entry);
							}
						}
						callstack.shift();
						isCallstackPopulated = true;
					}
				}
				if (!isCallstackPopulated) {
					var currentFunction = arguments.callee.caller;
					while (currentFunction) {
						var fn = currentFunction.toString();
						var fname = fn.substring(fn.indexOf('function') + 8, fn.indexOf('')) || 'anonymous';
						callstack.push(fname);
						currentFunction = currentFunction.caller;
					}
				}
				notify(callstack, 'trace');
			};
			
			this.clear = function () {
				cache = {};
				savedData = [];
			};
			this.dump = function () {
				return savedData;
			};
			this.pop = function () {
				var rtrn = cache;
				cache = {};
				return rtrn;
			};
			this.onnotify = null;
		})(settings);
		try {
			window.console = console;
		} catch(e) {
			console.warn('Unable to set global \'console\' variable -- ', e);
		}
	};
	
	if (!window.console) {
		R.initConsole(settings);
		window.onerror = function (msg, url, linenumber) {
			R.Console.error(url ? url : settings.scripts.threadName, linenumber ? '@ ' + linenumber + ': ' : ': ', msg);
			return true;
		};
	} else {
		console = R.Console = window.console;
		if (!console.debug) {
			console.debug = console.log;
		}
	}
	
	console.info('RaccoonJS v' + settings.version());
	console.info('Settings and Console are setting and consoling');
	console.info('API is waking up');
	
	(function ScriptLoader(R, settings, console, paths, namespaces, config, thread) {
		var copyObject = function(obj) {
			var copy = new Object();
			for (var prop in obj) {
				copy[prop] = obj[prop];
			}
			return copy;
		};
		var library = {};
		R.getLibrary = function() {
			return copyObject(library);
		};
		var threads = new Array();
		R.getThreads = function() {
			return copyObject(threads);
		};
		var packages = {};
		R.getPackages = function() {
			return copyObject(packages);
		};
		var convertToPath = function(name) {
			return name.replace(new RegExp('\\' + delimiter, 'g'), '/') + extension;
		};
		var convertToUrl = function (name) {
			if (paths[name]) {
				return paths[name];
			}
			var size = namespaces.length;
			for (var i = 0; i < size; i++) {
				var space = namespaces[i];
				if (space.rule.test(name)) {
					return space.path + convertToPath(name);
				}
			}
			return defaultPath + convertToPath(name);
		};
		var isName = function(str) {
			return str.indexOf('/') == -1;
		};
		var getScriptNode = function(url) {
			if (isName(url)) {
				url = convertToUrl(url);
			}
			if (library[url]) {
				return library[url];
			}
			return false;
		};
		var analyzeImport = function(newScript) {
			if (newScript.ready) {
				var allReady = true;
				var dependentSize = newScript.dependents.length;
				for (var i = 0; i < dependentSize; i++) {
					if (!newScript.dependents[i].ready) {
						allReady = false;
						break;
					}
				}
				if (!allReady) newScript.onready();
			} else if (!newScript.dependencies.length) {
				newScript.onready();
			} else {
				var ready = true;
				for (var i = 0; i < newScript.dependencies.length; i++) {
					if (!newScript.dependencies[i].ready) {
						ready = false;
						break;
					}
				}
				if (ready) newScript.onready();
			}
		};
		var syncImport = function(script) {
			importScripts(script.url);
			script.onload();
			return script;
		};
		var asyncImport = function(script) {
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.async = true;
			newScript.src = script.url;
			newScript.onload = function () {
				if (script.onload()) {
					console.debug('"onload":', script.name, 'has downloaded and parsed');
					newScript.parentNode.removeChild(newScript);
				}
			};
			newScript.onreadystatechange = function () {
				if ((this.readyState == 'complete' || this.readyState == 'loaded') && script.onload()) {
					console.debug('"onreadystatechange":', script.name, 'has downloaded and parsed');
					newScript.parentNode.removeChild(newScript);
				}
			};
			var topScript = document.getElementsByTagName('script')[0];
			topScript.parentNode.insertBefore(newScript, topScript);
			topScript = null;
			return script;
		};
		var includeRequirement = function(newScript) {
			R.include(newScript, function() {
				analyzeImport(newScript);
			});
		};
		var ScriptNode = function ScriptNode(url, name) {
			var __self__ = this;
			if (url != thread) {
				if (name) {
					this.object = R.registerNamespace(name);
				}
				library[url] = this;
			}
			this.requested = false;
			this.loaded = false;
			this.ready = false;
			this.url = url;
			this.name = name;
			this.dependents = new Array();
			this.dependencies = new Array();
			var dependentCache = {};
			var dependencyCache = {};
			
			this.addDependent = function (dependent) {
				if (typeof dependent == 'string') {
					dependent = library[dependent];
				}
				if (dependentCache[dependent.url]) {
					return;
				}
				__self__.dependents[__self__.dependents.length] = dependentCache[dependent.url] = dependent;
			};
			this.addDependency = function (dependency) {
				if (typeof dependency == 'string') {
					dependency = library[dependency];
				}
				if (dependencyCache[dependency.url] || dependencyCache[dependency.url]) {
					return;
				}
				__self__.dependencies[__self__.dependencies.length] = dependencyCache[dependency.url] = dependency;
			};
			this.removeDependent = function(dependent) {
				if (typeof dependent == 'string') {
					dependent = library[dependent];
				}
				if (dependentCache[dependent.url]) {
					__self__.dependents.remove(dependent);
					delete dependentCache[dependent.url];
				}
			};
			this.removeDependency = function(dependency) {
				if (typeof dependency == 'string') {
					dependency = library[dependency];
				}
				if (dependencyCache[dependency.url]) {
					__self__.dependencies.remove(dependency);
					delete dependencyCache[dependency.url];
				}
			};
			this.callbacks = new Array();
			this.onload = function () {
				if (__self__.loaded) {
					return false;
				}
				__self__.loaded = true;
				console.info(__self__.name, 'is included', __self__.ready ? 'and telling its dependents to download' : __self__.dependencies.length ? 'and requesting its dependencies' : 'and will tell its dependents it is included');
				var callbacks = __self__.callbacks;
				var size = callbacks.length;
				for (var i = 0; i < size; i++) {
					callbacks[i]({ 'scriptName': name, 'url': url });
				}
				__self__.callbacks = new Array();
				return true;
			};
			this.waitingScripts = new Array();
			this.onready = function () {
				if (__self__.ready && !__self__.loaded) {
					return;
				}
				var dependencies = __self__.dependencies;
				var size = dependencies.length;
				for (var i = 0; i < size; i++) {
					if (!dependencies[i].ready || !dependencies[i].loaded)
						return;
				}
				var waitingScripts = __self__.waitingScripts;
				while (waitingScripts.length > 0) {
					var scriptMe = waitingScripts.shift();
					if (scriptMe)
						scriptMe();
				}
				__self__.ready = true;
				if (!__self__.loaded) {
					return;
				}
				if (url == thread) {
					var index = threads.indexOf(__self__);
					if (index == -1) {
						throw 'Top level thread is not accessible';
						return;
					}
					console.info('Thread #' + (index + 1), 'ate', '[' + __self__.dependencies.join(', ') + ']', 'and enjoyed it :)');
					//threads.removeAt(index);
					return;
				}
				var dependents = __self__.dependents;
				size = dependents.length;
				for (var i = 0; i < size; i++) {
					if (dependents[i].ready) {
						continue;
					}
					var sibs = dependents[i].dependencies;
					var executeDependent = true;
					var length = sibs.length;
					for (var j = 0; j < length; j++) {
						if (url != sibs[j].url && !sibs[j].ready) {
							executeDependent = false;
							break;
						}
					}
					if (executeDependent) {
						if (__self__.loaded) {
							console.debug(__self__.name, 'is telling', dependents[i].name, 'to do its thing');
							dependents[i].onready();
						} else {
							console.debug(__self__.name, 'must finish downloading before telling', dependents[i].name, 'to do its thing');
							__self__.callbacks[__self__.callbacks.length] = dependents[i].onready;
						}
					}
				}
			};
			this.unloadScript;
			this.unload = function (dependentScript) {
				console.info(dependentScript, 'no longer requires', __self__.name);
				dependentScript.removeDependency(__self__);
				var dependents = __self__.dependents;
				if (dependentScript != thread) {
					var tempScript = library[dependenScript];
					__self__.removeDependent(dependentScript);
					dependentScript = tempScript;
				} else if (dependentScript == thread && dependents.length == 1)
					dependentScript = dependents.shift();
					dependentCache = {};
				if (__self__.name && dependents.length == 0) {
					console.info(__self__.name, 'is not required by anyone else so it will be removed');
					var package = __self__.name.split(delimiter);
					for (var i = 0; i < package.length; i++) {
						var reference = window;
						var pkgLvl = packages;
						var deleteIndex = package.length - i - 1;
						for (var j = 0; j < deleteIndex; j++) {
							reference = reference[package[j]];
							pkgLvl = pkgLvl[package[j]];
						}
						var toDelete = package[deleteIndex];
						var empty = true;
						if (i > 0) {
							empty = !pkgLvl[toDelete].count || pkgLvl[toDelete].count < 2;
						}
						if (empty) {
							if (reference[toDelete].dispose && typeof reference[toDelete].dispose == 'function') {
								reference[toDelete].dispose();
							}
							if (__self__.unloadScript) {
								__self__.unloadScript();
							}
							delete pkgLvl[toDelete];
							delete reference[toDelete];
						} else {
							pkgLvl[toDelete].count -= 1;
						}
					}
					delete library[url];
					var dependencies = __self__.dependencies;
					while (dependencies.length > 0) {
						dependencies.unload(__self__);
					}
				} else {
					console.info(__self__.name, 'won\'t be removed as other libraries still require it');
				}
			};
			this.toString = function() {
				return __self__.name || __self__.url;
			};
		};
		R.createNamespace = function(namespace) {
			var spaces = R.getNamespace(namespace);
			if (spaces) {
				return spaces;
			}
			spaces = namespace.split(delimiter);
			var size = spaces.length;
			namespace = window;
			var pkgLvl = packages;
			for (var i = 0; i < size; i++) {
				var node = spaces[i];
				if (!namespace[node]) {
					namespace[node] = new Object();
				}
				namespace = namespace[node];
			}
			return namespace;
		};
		R.registerNamespace = function(namespace) {
			var spaces = R.getNamespace(namespace);
			if (spaces) {
				return spaces;
			}
			spaces = namespace.split(delimiter);
			var size = spaces.length;
			namespace = window;
			var pkgLvl = packages;
			for (var i = 0; i < size; i++) {
				var node = spaces[i];
				if (!namespace[node]) {
					namespace[node] = new Object();
				}
				if (!pkgLvl[node]) {
					pkgLvl[node] = {
						'count': 1
					};
				} else {
					pkgLvl[node].count += 1;
				}
				namespace = namespace[node];
				pkgLvl = pkgLvl[node];
			}
			return namespace;
		};
		R.getNamespace = function(namespace) {
			var spaces = library[convertToUrl(namespace)];
			if (spaces) {
				return spaces.object;
			}
			return null;
		};
		/*
			TODO: We need a parameter or something that DOES NOT use callback
			for Raccoon's requirement behaviour as it's slightly separate from
			callback... works for now though with function wrappers.
		 */
		R.include = function(name, callback) {
			if (!callback) {
				callback = function() { };
			}
			var url;
			var script;
			if (typeof name == 'string') {
				url = name;
				if (isName(name)) {
					url = convertToUrl(name);
				} else {
					name = false;
				}
				if (library[url] && library[url].requested) {
					var script = library[url];
					if (script.loaded) {
						callback({ 'scriptName': name, 'url': url });
					} else {
						script.callbacks[0] = callback; // TODO: .callbacks[0] to .require? Only for requirements
					}
					return script;
				}
				script = new ScriptNode(url, name);
			} else {
				script = name;
				url = script.url;
				name = script.name;
				if (script.requested) {
					if (script.loaded) {
						callback({ 'scriptName': name, 'url': url });
					} else {
						script.callbacks[0] = callback; // TODO: .callbacks[0] to .require? Only for requirements
					}
					return script;
				}
			}
			console.info('Including', script.name);
			script.requested = true;
			script.callbacks[script.callbacks.length] = callback;
			if (settings.async()) {
				return asyncImport(script);
			} else {
				return syncImport(script);
			}
		};
		var nodeSetup = function(listeningScript, requiredUrl) {
			console.debug(requiredUrl, 'is finding its way in the world');
			var requiredName = false;
			if (isName(requiredUrl)) {
				requiredName = requiredUrl;
				requiredUrl = convertToUrl(requiredUrl);
			}
			
			var newScript = library[requiredUrl] ? library[requiredUrl] : new ScriptNode(requiredUrl, requiredName);
			listeningScript.addDependency(newScript);
			newScript.addDependent(listeningScript);
			
			var space = requiredName.split(delimiter)[0];
			if (config[space] && config[space].scripts[requiredName] && config[space].scripts[requiredName].dependencies && config[space].scripts[requiredName].dependencies.length > 0) {
				R.require.apply(R.require, [newScript.name].concat(config[space].scripts[requiredName].dependencies, [function() {
					includeRequirement(newScript);
				}]));
				// garbage collection to avoid memory leaks
				space = null;
				delete space;
				requiredName = null;
				delete requiredName;
				requiredUrl = null;
				delete requiredUrl;
				listeningScript = null;
				delete listeningScript;
			} else {
				includeRequirement(newScript);
			}
		};
		var requireScripts = function(hasName, args) {
			var listeningScript;
			var url = hasName ? args[0] : thread;
			var name = false;
			if (url != thread && isName(url)) {
				name = url;
				url = convertToUrl(name);
			} else {
				name = url + '[' + threads.length + ']';
			}
			if (library[url]) {
				listeningScript = library[url];
			} else {
				listeningScript = threads[threads.length] = new ScriptNode(url, name);
				listeningScript.requested = true;
			}
			var size = args.length - 1;
			if (typeof args[size - 1] == 'function') {
				size -= 1;
				listeningScript.waitingScripts[listeningScript.waitingScripts.length] = args[size + 1];
				listeningScript.unloadScript = args[size];
			} else {
				listeningScript.waitingScripts[listeningScript.waitingScripts.length] = args[size];
			}
			listeningScript.ready = false;
			for (var i = hasName ? 1 : 0; i < size; i++) {
				nodeSetup(listeningScript, args[i]);
			}
		};
		R.imports = function() {
			requireScripts(false, arguments);
		};
		R.require = function() {
			requireScripts(true, arguments);
		};
		R.remove = function(toRemove, sourceName) {
			var toRemove = getScriptNode(toRemove);
			if (toRemove) {
				toRemove.unload(sourceName && sourceName != thread ? getScriptNode(sourceName) : thread);
			}
		};
		console.info('ScriptLoader is scripting');
	})(R, settings, console, fileMatches, namespaces, config, R.MAIN_THREAD);
	console.info('RaccoonJS is alive!');
	console.info('***');
})();