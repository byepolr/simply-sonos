var EventEmitter = require("events").EventEmitter;
var dgram  = require('dgram');
var socket = dgram.createSocket('udp4');
var Device = require('./device');


module.exports = (function(){

	MULTICAST_ADDRESS = '239.255.255.250';
	MULTICAST_PORT = 1900;

	DEVICE_DISCOVERY_PORT =       1900; //(UPnP advertisements / device discovery)
	DEVICE_SEARCH_RESPONSE_PORT = 1901; //(UPnP m-search responses)
	DEVICE_GETTING_STARTED_PORT = 6969; //(Getting Started process) 

	function UDP(options){
		this.emitter = new EventEmitter();
		this.on = this.emitter.on;
		this.emit = this.emitter.emit;
	}


	UDP.prototype.discover = function(options, callback){
		var that = this;

		var timeout = (options.timeout > 0) ? options.timeout : 15*1000 //15 seconds
		foundDevices = [];

		socket.bind(DEVICE_SEARCH_RESPONSE_PORT, function() {
 
			socket.addMembership(MULTICAST_ADDRESS);

			 
			socket.on("message", function ( data, rinfo ) {

				if(rinfo && rinfo.address && rinfo.port && !foundDevices[rinfo.address]){

					getDeviceInfo.send({"ipAddress": rinfo.address}, function(error, device){
						if(error){
							//console.log("Error connecting to "+rinfo.address+". This is probably not a sonos device.");
						}else if(device.zoneName != null){
							foundDevices[rinfo.address] = device;
							that.emit("found-device", device);
							//console.log("Found device: "+rinfo.address+" ("+foundDevices[rinfo.address].zoneName+")");
						}
					});
				}
			});

			var msg = "M-SEARCH * HTTP/1.1\nHOST: 239.255.255.250:reservedSSDPport\nMAN: ssdp:discover\nMX: 1\nST: urn:schemas-upnp-org:device:ZonePlayer:1"
			socket.send(new Buffer(msg), 
					0, 
					msg.length, 
					MULTICAST_PORT, 
					MULTICAST_ADDRESS, 
					function (err) {
						if (err) { console.log(err); }
						console.log("Searching for Sonos devices...");
						setTimeout(function(){
							if(typeof callback === "function"){
								callback(null, foundDevices);
							}
						}, timeout);
					}
			);
		});
	}

	return UDP;
})();