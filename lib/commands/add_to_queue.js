var Command = require(__dirname+'/command');
var command = new Command({
	name: "Add to Queue",
	usage: "sonos addToQueue -u [uri] -i ipAddress",
	path: '/MediaRenderer/AVTransport/Control',
	'body-template': '<u:AddURIToQueue xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><InstanceID>0</InstanceID><EnqueuedURI>{uri}</EnqueuedURI><EnqueuedURIMetaData></EnqueuedURIMetaData><DesiredFirstTrackNumberEnqueued>0</DesiredFirstTrackNumberEnqueued><EnqueueAsNext>1</EnqueueAsNext></u:AddURIToQueue>'
});

command.headers = {
  'Content-Type': 'text/xml',
  'SOAPACTION': '"urn:schemas-upnp-org:service:AVTransport:1#AddURIToQueue"'
}

command.send = function(options, callback){
	var uri = (options && options.uri) ? options.uri : '';
	options['body-template-args'] = [{'expression': '{uri}', 'text':  uri}];
	
	Command.prototype.send.apply(this, [options, callback]);
}

module.exports = command