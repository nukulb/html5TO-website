meetupApi = {
   
    key: "73a1413161e5d5f525618178644773",
	getMeetupEvents: function (callback) {
		
		var url = "https://api.meetup.com/2/events/?key=" + meetupApi.key + "&sign=true&status=past&group_id=1757714&page=20&callback=?";
	
		function parseResults (data) {
			
			var results = [];
			
			//Iterate through results and return simpler objects as an array
			if (data && data.results && data.results.length > 0)
			{
				for( var i in data.results) {
					
					var temp = {};
					
					temp.name = data.results[i].name;
					temp.time = data.results[i].time;
					temp.url = data.results[i].event_url;
					temp.description = data.results[i].description;
					results.push(temp);
				}
			}

			return results;
		}
	
		$.getJSON(url, function (data) {
			var results = parseResults(data);
			callback(results);
		});
		
	},
 
 	getMeetupMembers: function (callback) {
 		function parseMemberData(data)
		{
			var results = [];
			
			//Iterate through results and return simpler objects as an array
			if (data && data.results && data.results.length > 0)
			{
				for( var i in data.results) {
					var temp = {};
					
					temp.name = data.results[i].name;
					temp.photo_url = data.results[i].photo_url;
					temp.profile_url = data.results[i].profile_url;
					temp.bio = data.results[i].bio;
					
					results.push( temp );
				}
			}
			return results;
		}
		
		$.getJSON('https://api.meetup.com/2/profiles?key=' + meetupApi.key + '&sign=true&group_urlname=HTML5-Web-App-Developers&callback=?', function(data) {
		    var results = parseMemberData(data);
			callback(results);
		});
 	}
 	
};
