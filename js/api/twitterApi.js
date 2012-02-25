twitterApi = {
   getUserTimeLine: function (callback) {
		
       var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=html5_toronto&count=10&trim_user=1&callback=?';	

       function parseResults (data) {

           var results = [];

           //Iterate through results and return simpler objects as an array
           if (data  && data.length > 0)
               {
                   for( var i in data) {

                       var temp = {};

                       temp.text = data[i].text;
                       temp.created_at = data[i].created_at;
                       temp.retweeted = data[i].retweeted;
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
}
