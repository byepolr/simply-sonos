require(__dirname+"/../objectUtils");
var async = require('async')
var parseXMLString = require('xml2js').parseString;
var http = require(__dirname+'/../network/http');

var services = {
	AVTransport: "/MediaRenderer/AVTransport/Control",
	RenderingControl: "/MediaRenderer/RenderingControl/Control",
	ContentDirectory: "/MediaServer/ContentDirectory/Control"
}

module.exports = (function(){
	function Command(options){
		this.port = 1400;
		this.method = 'POST';
		if(options){
			for(var key in options){
				this[key] = options[key];
			}
		}
	}

	Command.prototype.send = function(options, callback){
		var that = this;

		var httpOptions = {
			"host":     options.ipAddress || this.ipAddress,
			"port":     options.port      || this.port,
			"path":     options.path      || services[this.service] || this.path,
			"method":   options.method    || this.method,
			"callback": options.callback  || callback
		}

		for(var key in options.variables){
			this.variables[key] = options.variables[key];
		}

		var response;
		var preCallbacks = [];
		if(that.responsePreprocessors && that.responsePreprocessors instanceof Array){
			preCallbacks.push(function(data, callback){
				var preprcessors = [ function(next){ next(null, data); } ].concat(that.responsePreprocessors);
				async.waterfall(preprcessors, function(error, res){
					if(error) { res = null; }
					response = res;
					callback(error);
				});
			});
		}

		if(this.responseHandlers && this.responseHandlers instanceof Array){
			preCallbacks.push(function(response, callback){
				//console.log("responseHandlers...");
				callback();
			});
		}

		httpOptions["callback"] = function(error, resp){
			response = resp;
			if(error){
				callback(error, null);
			}else{
				async.eachLimit(preCallbacks, 1, function(func, nextFunc){
					func.apply(this, [response, nextFunc]);
				},function(error){
					if(error){
						response = null; 
					}else if(typeof that.response === "string"){
						response = response.replace(that.response, '');
					}
					callback(error, response);
				});	
			}
		}

		var action = (this.ignoreAction) ? null : '"urn:schemas-upnp-org:service:' + this.service + ':1#' + this.name + '"';
		var body = (this.ignoreBody) ? null : buildEnvelope(this.service, this.name, this.variables);

		if(!(this.ignoreBody && this.ignoreAction)){
	  	httpOptions.headers = {};
			if(this.headers){
				httpOptions.headers = this.headers;
			}
		}

		if(httpOptions.headers){
			httpOptions.headers['Content-Type'] = 'text/xml';
			httpOptions.headers['SOAPACTION']   = action
		}

		if(httpOptions.headers && body){
			httpOptions.form = body;
			httpOptions.headers['Content-Length'] = httpOptions.form.length;
		}

		//console.log("\n\n"+JSON.stringify(httpOptions, null, 2)+"\n\n")

		http.post(httpOptions);
	}

	Command.prototype.parseXMLString = parseXMLString;


	Command.prototype.toString = function(){
		return this.usage || JSON.stringify(this, null, 2);;
	}

	return Command;
})();


function buildEnvelope(service, action, variables){
  var pre = '<u:' + action + ' xmlns:u="urn:schemas-upnp-org:service:' + service + ':1">';
  var post = '</u:' + action + '>';
  var mid = ''
  for(var key in variables){
  	mid += '<' + key + '>' + variables[key] + '</' + key + '>';
  }

  return [
  	'<?xml version="1.0" encoding="utf-8"?>',
		'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
		'<s:Body>' + pre+mid+post + '</s:Body>',
		'</s:Envelope>'].join('');
};
