if (!window.contrib) {
	contrib = new Object();
}

if (!contrib.ui) {
	contrib.ui = new Object();
}

contrib.ui.Template = function Template(markup, delim) {
	if (typeof markup == 'object') {
		markup = markup.innerHTML;
	}
	markup = unescape(markup);
	markup = markup.split(delim);
	var size = markup.length;
	
	this.get = function (properties) {
		var rry = markup;
		var length = size;
		var returnMarkup = '';
		for (var i = 0; i < size; i++) {
			if (i % 2 != 0) {
				returnMarkup += properties[rry[i]];
			} else {
				returnMarkup += rry[i];
			}
		}
		delete length;
		delete rry;
		return returnMarkup;
	};
};