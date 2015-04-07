var commands = require(__dirname+"/../lib/commands");
console.log("Discovering devices...");

var listener = commands.discover.send({}, function(error, devices){
  console.log("\n\nList all devices:");
  for(key in devices){
    console.log("key: "+devices[key]);
  }
  process.exit(error);
});

listener.on('found-device', function(device){
  console.log("Found Device: "+device);
})