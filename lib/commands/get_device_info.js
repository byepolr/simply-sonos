var Device = require(__dirname+"/../device");
var Command = require(__dirname+'/command');
var command = new Command({
	name: "Get device info",
	usage: "sonos getDeviceInfo -i ipAddress",
	path: '/status/zp'
});

command.responsePreprocessors = [
	function(response, callback){
		var device = new Device({"raw":response});
		callback(null, device);
	}
];


module.exports = command;