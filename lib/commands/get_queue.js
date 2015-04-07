require(__dirname+"/../objectUtils");
var Track = require(__dirname+"/../track.js");
var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "Browse",
	usage: "sonos getQueue -i ipAddress",
	service: 'ContentDirectory',
	variables: {
		ObjectID: 'Q:0',
		BrowseFlag: 'BrowseDirectChildren',
		Filter: 'dc:title,res,dc:creator,upnp:artist,upnp:album,upnp:albumArtURI',
		StartingIndex: '{0}',
		RequestedCount: '{1}',
		SortCriteria: ''
	}
});

command.responsePreprocessors = [
	function(response, callback){
		var inQueue = {};
		var error = null;
		command.parseXMLString(response, function(err, response){
			console.log(JSON.stringify(response.search('s:Envelope.s:Body'), null, 2));
			error = (err) ? err : error;
			var results = response.search('s:Envelope.s:Body.u:'+this.name+'Response');
			inQueue.count = results.search("NumberReturned");
			inQueue.total = results.search("TotalMatches");
			inQueue.updateID = results.search("UpdateID");
			inQueue.tracks = [];

			trackResults = results.search("Result");
			command.parseXMLString(trackResults, function(error, trackResults){
				trackResults = trackResults.search("DIDL-Lite");
				var tracks = (trackResults && trackResults.item instanceof Array) ? trackResults.item : [];
				if(tracks instanceof Array){
					tracks.forEach(function(track){
						inQueue.tracks.push(new Track({"json":track}));
					});

					function compare(a,b) {
					  if (a.details.track < b.details.track)
					     return -1;
					  if (a.details.track > b.details.track)
					    return 1;
					  return 0;
					}
					//inQueue.tracks.sort(compare);
				}
				callback(error, inQueue);
			});
		});
	}
];

module.exports = command