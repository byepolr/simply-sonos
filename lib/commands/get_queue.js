require(__dirname+"/../objectUtils");
var Track = require(__dirname+"/../track.js");
var Command = require(__dirname+'/command');
var command = new Command({
	name: "Get Queue",
	usage: "sonos getQueue -i ipAddress",
	path: '/MediaServer/ContentDirectory/Control',
	body: '<u:Browse xmlns:u="urn:schemas-upnp-org:service:ContentDirectory:1"><ObjectID>Q:0</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>dc:title,res,dc:creator,upnp:artist,upnp:album,upnp:albumArtURI</Filter><StartingIndex>{0}</StartingIndex><RequestedCount>{1}</RequestedCount><SortCriteria></SortCriteria></u:Browse>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"'
}

command.responsePreprocessors = [
	function(response, callback){
		var inQueue = {};
		var error = null;
		command.parseXMLString(response, function(err, response){
			error = (err) ? err : error;
			var results = response.search('s:Envelope.s:Body.u:BrowseResponse');
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