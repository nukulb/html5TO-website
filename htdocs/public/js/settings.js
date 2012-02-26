(function configuration() {
	if (!window.R) {
		if (window.console)
			console.warn('RaccoonJS is required.');
		return;
	}
	
	// Global Runtime Behaviour
	R.settings.devMode(false);
	
	// File Retrieval
	R.settings.delimiter('.'); // How we express the names of scripts (eg. contrib.utils.Timer uses '.' as the delimiter)
	R.settings.extension('.js'); // If set to '.min.js' we can load contrib.utils.Timer as /some_path_to_js/contrib/utils/Timer.min.js
	R.settings.defaultPath('/js/'); // Default is relative.  Non-relative example: '/path_to_js/ (all paths must end with a trailing slash)
	
	// Dependency Map -- optional
	R.settings.dependencyMap({
		contrib : {
			//path: '/example/path/to/library',
			scripts: {
				'contrib.events.Mouse': {
					//path: '/other_directory/to/specific/file',
					dependencies: ['contrib.events.EventDispatcher']
				},
				'contrib.apps.ScreenSize': {
					dependencies: ['contrib.utils.extensions.HTMLElement', 'contrib.utils.extensions.Document']
				},
				'contrib.ui.ScrollPane': {
					dependencies: ['contrib.events.Mouse', 'contrib.utils.extensions.Document', 'contrib.utils.extensions.DOMTweener', 'contrib.events.Touch']
				},
				'contrib.utils.ImageLoader': {
					dependencies: ['contrib.utils.Timer']
				},
				'contrib.utils.Animations': {
					dependencies: ['contrib.utils.Browser', 'contrib.events.EventDispatcher']
				},
				'contrib.utils.Timer': {
					dependencies: ['contrib.events.EventDispatcher']
				},
				'contrib.utils.extensions.DOMTweener': {
					dependencies: ['contrib.utils.Animations', 'contrib.utils.extensions.HTMLElement']
				}
			}
		}
	});
})();