var dgram  = require('dgram');
var socket = dgram.createSocket('udp4');


module.exports.broadcast = function(options, callback){
	var MULTICAST_ADDRESS           = options.multicase_address    || '239.255.255.250';
	var MULTICAST_PORT              = options.muticast_port        || 1900;
	var DEVICE_SEARCH_RESPONSE_PORT = options.search_response_port || 1901;


	socket.bind(DEVICE_SEARCH_RESPONSE_PORT, function() {

		socket.addMembership(MULTICAST_ADDRESS);
		
		var msg = (options.message) ? options.message : '';
		socket.send(new Buffer(msg), 
				0, 
				msg.length, 
				MULTICAST_PORT, 
				MULTICAST_ADDRESS, 
				function (error) {
					if(error){
						emiiter.emit("error", err);	
					}
				}
		);
	});
	return socket;
}