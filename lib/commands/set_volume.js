var Command = require(__dirname+'/command');
var command = new Command({
	name: "Set Volume",
	usage: "sonos setVolume -l [level] -i ipAddress",
	path: '/MediaRenderer/RenderingControl/Control',
	'body-template': '<u:SetVolume xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"><InstanceID>0</InstanceID><Channel>Master</Channel><DesiredVolume>{volume}</DesiredVolume></u:SetVolume>',
	response: '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:SetVolumeResponse xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1"></u:SetVolumeResponse></s:Body></s:Envelope>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"'
}

command.send = function(options, callback){
	var volume = (options && options.level) ? options.level : 0;
	options['body-template-args'] = [{'expression': '{volume}', 'text':  volume}];
	
	Command.prototype.send.apply(this, [options, callback]);
}

module.exports = command;