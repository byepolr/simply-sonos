var Command = require(__dirname+'/command');
var command = new Command({
	name: "Clear Queue",
	usage: "sonos clearQueue -i ipAddress",
	path: '/MediaRenderer/AVTransport/Control',
	body: '<u:RemoveAllTracksFromQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID></u:RemoveAllTracksFromQueue>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:AVTransport:1#RemoveAllTracksFromQueue"'
}

module.exports = command