require(__dirname+"/../objectUtils");
var Command = require(__dirname+'/command');
var command = new Command({
	name: "Get Volume",
	usage: "sonos getVolume -i ipAddress",
	path: '/MediaRenderer/RenderingControl/Control',
	body: '<u:GetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetVolume>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:RenderingControl:1#GetVolume"'
}

command.responsePreprocessors = [
	function(response, callback){
		command.parseXMLString(response, function(error, result){
			var level = result.search('s:Envelope.s:Body.u:GetVolumeResponse.CurrentVolume');
			callback(error, {"volume": level});
		});
	}
];

module.exports = command