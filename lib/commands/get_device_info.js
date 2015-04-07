var Device = require(__dirname+"/../device");
var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "GetdeviceInfo",
	usage: "sonos getDeviceInfo -i ipAddress",
	path: '/status/zp',
  ignoreBody: true,
  ignoreAction: true
});

command.responsePreprocessors = [
	function(response, callback){
		var device = new Device({"raw":response});
		callback(null, device);
	}
];


module.exports = command;