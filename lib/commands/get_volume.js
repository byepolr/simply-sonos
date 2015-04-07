require(__dirname+"/../objectUtils");
var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "GetVolume",
	usage: "sonos getVolume -i ipAddress",
	service: "RenderingControl",
	variables: {
		InstanceID: 0,
		Channel: "Master"
	}
});


command.responsePreprocessors = [
	function(response, callback){
		command.parseXMLString(response, function(error, result){
			var level = result.search('s:Envelope.s:Body.u:GetVolumeResponse.CurrentVolume');
			callback(error, {"volume": level});
		});
	}
];

module.exports = command