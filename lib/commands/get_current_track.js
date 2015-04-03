var Track = require(__dirname+"/../track");
var Command = require(__dirname+'/command');
var command = new Command({
	name: "Get Current Track",
	usage: "sonos getCurrentTrack -i ipAddress",
	path: '/MediaRenderer/AVTransport/Control',
	body: '<u:GetPositionInfo xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetPositionInfo>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:AVTransport:1#GetPositionInfo"'
}

command.responsePreprocessors = [
	function(response, callback){
		var track = new Track({"raw":response});
		callback(null, track);
	}
];

module.exports = command