var fs = require('fs');

var global;
(function(){
	global = this;
})();


var files = fs.readdirSync(__dirname+'/commands')
global.commandsAsString = '';
if(files instanceof Array){
	files.forEach(function(file){
		if(["command.js"].indexOf(file) == -1){
			var command = file;
			command = command.replace(/\.\w*$/, '');
			command = command.replace(/_/g, ' ');
			command = command.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			command = command.replace(/\s/g, '');
			command = command.charAt(0).toLowerCase()+command.slice(1);
			global[command] = require(__dirname+"/commands/"+file);
			global.commandsAsString += global[command]+"\n";
		}
	});
}
