googlePlusApi = {
   
    apiKey: "AIzaSyA-lkxG1flYuikiPIe9Ucd9SboYXH3Wg1A",
	getLatestGooglePlusActivity: function (callback) {
		
		var url = "https://www.googleapis.com/plus/v1/people/117535376454408370589/activities/public?key=" + googlePlusApi.apiKey + "&callback=?";
	
		function parseResults (activityFeed) {
			
			var results = [];
			
			//Iterate through results and return simpler objects as an array
			if (activityFeed && activityFeed.items)
			{
				for( var i in activityFeed.items) {
					
					var temp = {};
					
					temp.title = activityFeed.items[i].title;
					temp.url = activityFeed.items[i].url;
					temp.pub_date = activityFeed.items[i].published;
					results.push(temp);
				}
			}

			return results;
		}
	
		$.getJSON(url, function (data) {
			var results = parseResults(data);
			callback(results);
		});
		
	}
 
};
