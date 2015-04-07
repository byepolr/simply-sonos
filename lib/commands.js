var fs = require('fs');

var Commands = (function(){
	function Commands(){
		var that = this;
		var files = fs.readdirSync(__dirname+'/commands');
		if(files instanceof Array){
			files.forEach(function(file){
				if(["command.js", "command-udp.js", "command-http.js"].indexOf(file) == -1){
					var command = file;
					command = command.replace(/\.\w*$/, '');
					command = command.replace(/_/g, ' ');
					command = command.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
					command = command.replace(/\s/g, '');
					command = command.charAt(0).toLowerCase()+command.slice(1);
					that.constructor.prototype[command] = require(__dirname+"/commands/"+file);
				}
			});
		}
	}

	Commands.prototype.toString = function(){
		var str = '';
		for(key in this){
			if(key !== "toString"){
				str += this[key]+'\n';
			}
		}
		return str;
	}

	return Commands;
})();


module.exports = new Commands();