var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "Pause",
	usage: "sonos pause -i ipAddress",
	service: "AVTransport",
  variables: {
    InstanceID: 0,
    Speed: 1
  }
});

module.exports = command