var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "SetMute",
	usage: "sonos mute -s [on/off] -i ipAddress",
	service: "RenderingControl",
	variables: {
		InstanceID: 0,
		Channel: "Master"
	}
});


command.send = function(options, callback){
	var mute = (options && options.status && options.status.toLowerCase() === "on") ? 1 : 0;
	if(options.variables == null) options.variables = {};
	options.variables.DesiredMute = mute;
	Command.prototype.send.apply(this, [options, callback]);
}

module.exports = command;