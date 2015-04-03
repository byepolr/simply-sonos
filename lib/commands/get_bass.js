require(__dirname+"/../objectUtils");
var Command = require(__dirname+'/command');
var command = new Command({
	name: "Get Bass",
	usage: "sonos getBass -i ipAddress",
	path: '/MediaRenderer/RenderingControl/Control',
	body: '<u:GetBass xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel></u:GetBass>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:RenderingControl:1#GetBass"'
}

command.responsePreprocessors = [
	function(response, callback){
		command.parseXMLString(response, function(error, result){
			callback(error, result.search('s:Envelope.s:Body.u:GetBassResponse.CurrentBass'));
		});
	}
];

module.exports = command