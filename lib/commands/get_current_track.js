var Track = require(__dirname+"/../track");
var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "GetPositionInfo",
	usage: "sonos getCurrentTrack -i ipAddress",
	service: "AVTransport",
	variables: {
		InstanceID: 0,
		Channel: "Master"
	}
});


command.responsePreprocessors = [
	function(response, callback){
		var track = new Track({"raw":response});
		callback(null, track);
	}
];

module.exports = command