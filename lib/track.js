require(__dirname+"/objectUtils");
var parseXMLString = require('xml2js').parseString;

module.exports = (function(){
	function Track(options){
		if(options.raw != null){
			parseRawData.call(this, options.raw);
		}
		if(options.json != null){
			parseJSONData.call(this, options.json);
		}
	}

	Object.defineProperty(Track, "toString", {
		enumerable: false,
		configurable: true,
	  	writable: true,
		value: stringifyObject(this.details)
	});

	return Track
})();



function stringifyObject(obj){
	var str = '';
	for(var key in obj){
		if(typeof obj[key] === "string"){
			str += key+": "+obj[key]+"\n";
		}else if(typeof obj[key] === "object"){
			str += stringifyObject(obj[key]);
		}
	}
	return str;
}


function parseJSONData(metaData){
	this.details = { metaData: {} };
	if(metaData){
		this["details"].metaData.title = metaData.search("dc:title");
		this["details"].metaData.class = metaData.search("upnp:class");
		this["details"].metaData.artist = metaData.search("dc:creator");
		this["details"].metaData.album = metaData.search("upnp:album");
		this["details"].metaData.albumArt = metaData.search("upnp:albumArtURI");
		this["details"].metaData.streamContent = metaData.search("r:streamContent");
		this["details"].metaData.streamURI = metaData.search("res._");
	}
}


function parseRawData(data){
	var that = this;
	//This npm moduele is synchronis. The other does not understand that you 
	//do not need a callback. This why I'm parsing the data this way without needing
	//a callback for the creation of this object;
	parseXMLString(data, function(error, result){
		if(!error){
			that.details = {};
			//that.test = "Current Track: "+JSON.stringify(result, null, 2);
			var trackData = result.search("s:Envelope.s:Body.u:GetPositionInfoResponse");
			if(trackData){
				that["details"].track = trackData.search("Track");
				that["details"].duration = trackData.search("TrackDuration");
				that["details"].relTime  = trackData.search("RelTime");
				that["details"].relCount = trackData.search("RelCount");
				that["details"].absCount = trackData.search("AbsCount");
			}


			that["details"].metaData = {};
			parseXMLString(trackData.search("TrackMetaData"), function(error, result){
				if(result){
					var metaData = result.search("DIDL-Lite.item");
					that["details"].metaData.title = metaData.search("dc:title");
					that["details"].metaData.class = metaData.search("upnp:class");
					that["details"].metaData.artist = metaData.search("dc:creator");
					that["details"].metaData.album = metaData.search("upnp:album");
					that["details"].metaData.albumArt = metaData.search("upnp:albumArtURI");
					that["details"].metaData.streamContent = metaData.search("r:streamContent");
					that["details"].metaData.streamURI = metaData.search("res._");
				}
			});
		}
	});
}