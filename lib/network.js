var HTTP = require(__dirname+"/network-http");
var UDP  = require(__dirname+"/network-udp");
module.exports = (function(){
	function Network(){
	}

	Network.prototype.http = new HTTP();
	Network.prototype.udp = new UDP();

	return Network;

})();