var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "SetVolume",
	usage: "sonos setVolume -l [level] -i ipAddress",
	service: "RenderingControl",
	variables: {
		InstanceID: 0,
		Channel: "Master",
	}
});

command.send = function(options, callback){
	var volume = (options && options.level) ? options.level : 0;
	if(options.variables == null) { options.variables = {}; }
	options.variables.DesiredVolume = volume;
	Command.prototype.send.apply(this, [options, callback]);
}

module.exports = command;