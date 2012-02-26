R.require('contrib.ui.PageManager',
'contrib.ui.ScrollPane',
'contrib.ui.SwipePane',
function() {

	var PageManager = contrib.ui.PageManager = function PageManager(container) {
		this.inheritFrom = contrib.events.EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;
		
		/* Variables */
		var __self__ = this;
		
		
	};
	
	PageManager.PRE_LOAD = 'preload';
	PageManager.POST_LOAD = 'postload';
	PageManager.PRE_UNLOAD = 'preunload';
	PageManager.POST_UNLOAD = 'postunload';
	PageManager.CLEAR_COMPLETE = 'clearcomplete'
});