,
 
 	getMeeupMembers: function (callback) {
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