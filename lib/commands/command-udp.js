var udp = require(__dirname+"/../network/udp");
var EventEmitter = require("events").EventEmitter;


var DEVICE_DISCOVERY_PORT       = 1900; //(UPnP advertisements / device discovery)
var DEVICE_SEARCH_RESPONSE_PORT = 1901; //(UPnP m-search responses)
var DEVICE_GETTING_STARTED_PORT = 6969; //(Getting Started process) 


module.exports = (function(){
  function Command(options){
    this.message = (options.message) ? options.message : '';
    this.usage = (options.usage) ? options.usage : '';
    this.timeout = (options.timeout) ? options.timeout : 0;
  }

  Command.prototype.send = function(options){
    var emitter = new EventEmitter()
    var UDPOptions = {
      message: (options.message != null) ? options.message : this.message
    };

    var socket = udp.broadcast(UDPOptions);

    var foundDevices = [];
    socket.on("message", function(data, rinfo){
      emitter.emit("message", data,rinfo);
    });

    socket.on("error", function(error){
      emitter.emit("error", error);
      socket.close();
    });

    socket.on("close", function(){
      emitter.emit("done");
    });

    return emitter;
  }

  Command.prototype.toString = function(){
    return this.usage || JSON.stringify(this, null, 2);;
  }

  return Command;
})();