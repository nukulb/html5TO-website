meetupApi = {
   
    key: "73a1413161e5d5f525618178644773",
 
    getMeetupEvents: function (callback) {
		alert("hi");
		/*
		var url = "https://api.meetup.com/2/events/?key=" + meetupApi.key + "&sign=true&status=past&group_id=1757714&page=20";
	
		function parseResults (data) {
			
			var results = [];
			
			if (data && data.results && data.results.length > 0)
			{
				foreach( var i in data) {
					
					var temp = {};
					
					temp.name = data[i].name;
					temp.time = data[i].time;
					temp.url = data[i].event_url;
					temp.description = data[i].description;
					
					results.push(temp);
				}
			}
			
			return results;
			
		}
	
		$.get(url, 
			'json',
			success:  function(data, textStatus, jqXHR) {
				
				var parsedResults = parseResults(data);
				callback(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert("There was an error:" + errorThrown );
			});
			*/
	}
};
