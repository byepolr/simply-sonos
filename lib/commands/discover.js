var getDeviceInfo = require(__dirname+"/get_device_info");
var UDPCommand = require(__dirname+"/command-udp");
var command = new UDPCommand({
  message: "M-SEARCH * HTTP/1.1\nHOST: 239.255.255.250:reservedSSDPport\nMAN: ssdp:discover\nMX: 1\nST: urn:schemas-upnp-org:device:ZonePlayer:1",
  name: "Get Bass",
  usage: "sonos discover",
  timeout: 5*1000
});


command.send = function(options, callback){
  console.log("Searching for devices...");
  emitter = UDPCommand.prototype.send.call(this, options);

  var foundDevices = {};
  emitter.on("message", function(data, rinfo){
    if(rinfo && rinfo.address && rinfo.port && !foundDevices[rinfo.address]){
      getDeviceInfo.send({"ipAddress": rinfo.address}, function(error, device){
        if(!error && device.zoneName != null){
          foundDevices[rinfo.address] = device;
          emitter.emit("found-device", device);
          //console.log("Found device: "+rinfo.address+" ("+foundDevices[rinfo.address].zoneName+")");
        }
      });
    }
  });

  var timeout = options.timeout || this.timeout;
  if(timeout){
    setTimeout(function(){
      if(typeof callback === "function"){
        callback(null, foundDevices)
        emitter.emit("close");
      }
    }, timeout);  
  }
  

  return emitter;
}

module.exports = command;