var Command = require(__dirname+'/command-http');
var command = new Command({
	name: "RemoveAllTracksFromQueue",
	usage: "sonos clearQueue -i ipAddress",
  service: 'AVTransport',
  variables: {
    InstanceID: 0
  }
});

module.exports = command