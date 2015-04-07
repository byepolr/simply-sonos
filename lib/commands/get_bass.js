var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "GetBass",
	usage: "sonos getBass -i ipAddress",
	service: 'RenderingControl',
	variables: {
		InstanceID: 0,
		Channel: "Master"
	}
});

command.responsePreprocessors = [
	function(response, callback){
		command.parseXMLString(response, function(error, resp){
			response = resp.search('s:Envelope.s:Body.u:'+command.name+'Response');
			delete response['$'];
			callback(null, {CurrentBass: response["CurrentBass"][0]});
		});
	}
];

module.exports = command