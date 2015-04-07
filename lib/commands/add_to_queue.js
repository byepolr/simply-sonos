var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "AddURIToQueue",
	usage: "sonos addToQueue -u [uri] -i ipAddress",
	service: 'AVTransport',
	variables: {
		InstanceID: 0,
		Channel: "Master",
		EnqueuedURIMetaData: '',
		DesiredFirstTrackNumberEnqueued: 0,
		EnqueueAsNext: 1
	}
});


command.send = function(options, callback){
	if(!options.variables){ options.variables = {}; }
	options.variables.EnqueuedURI = (options && options.uri) ? options.uri : '';
	Command.prototype.send.apply(this, [options, callback]);
}

module.exports = command