R.require('htmltoronto.TwitterApi',
'contrib.events.EventDispatcher',
function() {
	
	htmltoronto.TwitterApi = new (function() {
		this.inheritFrom = contrib.events.EventDispatcher;
	   	this.inheritFrom();
	   	delete this.inheritFrom;
		
		var __self__ = this;
		
		this.receive = function(data) {
			var results = new Array();
	
	        //Iterate through results and return simpler objects as an array
			if (data && data.length > 0) {
                   for( var i in data) {

                       var temp = {};

                       temp.text = data[i].text;
                       temp.created_at = data[i].created_at;
                       temp.retweeted = data[i].retweeted;
                       results.push(temp);
                   }
        	}

			__self__.dispatchEvent('load', { data: results });
            return results;
		};
		
		
		this.getUserTimeLine = function () {
			var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=html5_toronto&count=10&trim_user=1&callback=htmltoronto.TwitterApi.receive&rand=' + Math.random();	
			
			R.include(url);
	    };	
	})();
	
});
