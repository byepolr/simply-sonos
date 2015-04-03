var Command = require(__dirname+'/command');
var command = new Command({
	name: "Mute",
	usage: "sonos mute -s [on/off] -i ipAddress",
	path: '/MediaServer/ContentDirectory/Control',
	'body-template': '<u:SetMute xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredMute>{mute}</DesiredMute></u:SetMute>',
	response: '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:SetMuteResponse xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"></u:SetMuteResponse></s:Body></s:Envelope>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:RenderingControl:1#SetMute"'
}

command.send = function(options, callback){
	var mute = (options && options.status && options.status.toLowerCase() === "on") ? "on" : "off";
	options['body-template-args'] = [{'expression': '{mute}', 'text':  mute}];
	Command.prototype.send.apply(this, [options, callback]);
}

module.exports = command;