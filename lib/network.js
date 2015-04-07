module.exports = (function(){
	function Network(){
	}

	Network.prototype.http = require(__dirname+"/network/http");
	Network.prototype.udp = require(__dirname+"/network/udp");

	return Network;

})();