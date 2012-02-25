/* When building this out, there will be some sort of base class that will come of this. */
R.require('contrib.views.Flex',
'contrib.utils.Browser', 'contrib.utils.Navigator',
function() {
	contrib.views.Flex = function Flex() {
		
		this.reveal = function() {
		};
		
		// We need thress states: init, load, unload
		// These can be functions or can point to a file?
		// It could be cool to somehow implement these states within a file
		// we could possibly create page classes that inherit a page object...
		// and these page objects would implement methods, have a namespace, etc...
		// and then we have our views which accept page objects.  We can optimize
		// for some views to pre-load their objects and others not so much.
		// could be fun, yeah?  We can even pass in function directly?  Might be nice.
		
	};
});