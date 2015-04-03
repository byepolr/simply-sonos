var Command = require(__dirname+'/command');
var command = new Command({
	name: "Play",
	usage: "sonos play -i ipAddress",
	path: '/MediaRenderer/AVTransport/Control',
	body: '<u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><Speed>1</Speed></u:Play>',
	response: '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:PlayResponse xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"></u:PlayResponse></s:Body></s:Envelope>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:AVTransport:1#Play"'
}

module.exports = command;