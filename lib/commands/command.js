var async = require('async')
var parseXMLString = require('xml2js').parseString;
var Network = require(__dirname+'/../network');
	network = new Network();

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
			"path":     options.path      || this.path,
			"method":   options.method    || this.method,
			"callback": options.callback  || callback
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


		var body = this.body;
		var templateArgs = options['body-template-args'] || this['body-template-args'];
		if(this['body-template'] && templateArgs != null){
			body = this.formatTemplate(this['body-template'], templateArgs);
		}

		if(this.headers) { httpOptions.headers = this.headers; }
		if(body){
			httpOptions.form = this.formatSoapTemplateBody(body);
			httpOptions.headers['Content-Length'] = httpOptions.form.length;
		}

		network.http.post(httpOptions);
	}

	Command.prototype.toString = function(){
		return this.usage;
	}

	Command.prototype.formatSoapTemplateBody = function(body) {
		var template = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>{body}</s:Body></s:Envelope>'
	  	return template.replace('{body}', body);
	}

	Command.prototype.formatTemplate = function(template, replaceItems) {
		if(replaceItems instanceof Array){
			replaceItems.forEach(function(replaceItem){
				if(replaceItem.expression != null, replaceItem.text != null){
					template = template.replace(replaceItem.expression, replaceItem.text);	
				}
			});
		}

	  	return template;
	}

	Command.prototype.parseXMLString = parseXMLString;


	Command.prototype.toString = function(){
		return this.usage || JSON.stringify(this, null, 2);;
	}

	return Command;
})();