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
					
					temp.id = data.results[i].id;
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

	getMeetupComments: function (callback) {
		
		var url = "https://api.meetup.com/comments?key=" + meetupApi.key + "&sign=true&group_id=1757714&page=20&callback=?";
	
		function parseResults (data) {
			
			var results = [];
			
			//Iterate through results and return simpler objects as an array
			if (data && data.results && data.results.length > 0)
			{
				for( var i in data.results) {
					
					var temp = {};
					
					temp.name = data.results[i].name;
					temp.photo_url = data.results[i].photo_url;
					temp.link = data.results[i].link;
					temp.city = data.results[i].city;
					temp.comment = data.results[i].comment;
					
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
 	},
 	
	getMeetupEventRsvps: function (event_id, callback) {

		var url = "https://api.meetup.com/2/rsvps/?key=" + meetupApi.key + "&event_id=" +  event_id + "&rsvp=yes&order=name&callback=?";
	
		function parseResults (data) {
			
			var results = [];
			
			//Iterate through results and return simpler objects as an array
			if (data && data.results && data.results.length > 0)
			{
				for( var i in data.results) {
					
					var temp = {};
					
					temp.rsvp_id = data.results[i].rsvp_id;
					temp.comments = data.results[i].comments;
					temp.member_id = data.results[i].member.member_id;			
					temp.member_name = data.results[i].member.name;
					if (data.results[i].member_photo) {
            temp.member_photo_thumb_link = data.results[i].member_photo.thumb_link;
          }
          temp.member_profile = "http://www.meetup.com/HTML5-Web-App-Developers/members/" +  temp.member_id    +  "/";        			
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
