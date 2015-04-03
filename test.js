require("./lib/commands");
var Network = require("./lib/network");
var network = new Network();




var ipAddress = "10.1.10.32";
var testItem = 3;

if(testItem == 0){
	network.udp.discover({"timeout":5000}, function(error, devices){
		if(error){
			console.log(error);
		}else{
			console.log("Found devices: "+JSON.stringify(devices));
		}
		process.exit(error);
	});
}


if(testItem == 1){
	console.log("Sending request");
	getDeviceInfo.send(ipAddress, function(error, data){
		console.log("Request completed");
		if(error){
			console.log(error);
		}else{
			console.log(data);
		}
	});
}



if(testItem == 2){
	console.log("Pushing pause on sonos device")
	pause.send(ipAddress, function(error, response){
		if(error){
			console.log(error);
		}else{
			//console.log(response);
		}
	});

	setTimeout(function(){
		play.send(ipAddress, function(error, response){
			if(error){
				console.log(error);
			}else{
				//console.log(response);
			}
		});
	}, 3000);
}


if(testItem == 3){
	var data = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:GetPositionInfoResponse xmlns:u="urn:schemas-upnp-org:service:AVTransport:1"><Track>147</Track><TrackDuration>0:03:30</TrackDuration><TrackMetaData>&lt;DIDL-Lite xmlns:dc=&quot;http://purl.org/dc/elements/1.1/&quot; xmlns:upnp=&quot;urn:schemas-upnp-org:metadata-1-0/upnp/&quot; xmlns:r=&quot;urn:schemas-rinconnetworks-com:metadata-1-0/&quot; xmlns=&quot;urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/&quot;&gt;&lt;item id=&quot;-1&quot; parentID=&quot;-1&quot; restricted=&quot;true&quot;&gt;&lt;res protocolInfo=&quot;sonos.com-spotify:*:audio/x-spotify:*&quot; duration=&quot;0:03:30&quot;&gt;x-sonos-spotify:spotify%3atrack%3a52L1rJgxT0knQcwneI58Hu?sid=12&amp;amp;flags=32&amp;amp;sn=8&lt;/res&gt;&lt;r:streamContent&gt;&lt;/r:streamContent&gt;&lt;upnp:albumArtURI&gt;/getaa?s=1&amp;amp;u=x-sonos-spotify%3aspotify%253atrack%253a52L1rJgxT0knQcwneI58Hu%3fsid%3d12%26flags%3d32%26sn%3d8&lt;/upnp:albumArtURI&gt;&lt;dc:title&gt;Your Girlfriend Sucks&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;dc:creator&gt;Reel Big Fish&lt;/dc:creator&gt;&lt;upnp:album&gt;Candy Coated Fury&lt;/upnp:album&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;</TrackMetaData><TrackURI>x-sonos-spotify:spotify%3atrack%3a52L1rJgxT0knQcwneI58Hu?sid=12&amp;flags=32&amp;sn=8</TrackURI><RelTime>0:00:45</RelTime><AbsTime>NOT_IMPLEMENTED</AbsTime><RelCount>2147483647</RelCount><AbsCount>2147483647</AbsCount></u:GetPositionInfoResponse></s:Body></s:Envelope>';
	var Track = require('./lib/track');
	var track = new Track(data);
	console.log(''+track);
}
