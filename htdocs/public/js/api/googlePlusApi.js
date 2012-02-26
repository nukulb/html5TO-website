R.require('htmltoronto.GooglePlusApi',
'contrib.events.EventDispatcher',
function() {}
	
	htmltoronto.GooglePlusApi = new (function() {
	   	this.inheritFrom = contrib.events.EventDispatcher;
	   	this.inheritFrom();
	   	delete this.inheritFrom;
	   	
	   	var __self__ = this;
	   	var googlePlusApi = __self__;
	   	
	    this.apiKey = "AIzaSyA-lkxG1flYuikiPIe9Ucd9SboYXH3Wg1A";
	    
	    this.receive = function(data) {
	    	var results = new Array();
				
			//Iterate through results and return simpler objects as an array
			if (activityFeed && activityFeed.items) {
				for( var i in activityFeed.items) {
					
					var temp = {};
					
					temp.title = activityFeed.items[i].title;
					temp.url = activityFeed.items[i].url;
					temp.pub_date = activityFeed.items[i].published;
					results.push(temp);
				}
			}
			
			__self__.dispatchEvent('load', { data: results });
			return results;
	    };
	    
		this.getLatestGooglePlusActivity = function () {
			var url = "https://www.googleapis.com/plus/v1/people/117535376454408370589/activities/public?key=" + googlePlusApi.apiKey + "&callback=htmltoronto.GooglePlusApi.receive&rand=" + Math.random();
			
			R.include(url);
		};
	 
	})();
	
});
