var http = require('http');

module.exports.post = function(options){
	var content = '';
	var req = http.request(options, function(response){
		response.on('data', function (chunk) {
			content += chunk;
		});

		response.on('end', function(){
			if(typeof options.callback === "function"){
				options.callback(null, content);	
			}else{
				console.log(content);
			}
		});
	});

	if(options.form){
		req.write(options.form);	
	}		

	req.on('error', function(error){
		if(typeof options.callback === "function"){
			console.log(error);
			options.callback(error, null);	
		}else{
			console.log(content);
		}
	})

	req.end();
}