require(__dirname+"/objectUtils");
var http = require('http');
var parseXMLString = require('xml2js').parseString;

module.exports = (function(){
	function Device(options){
		this.zoneName        = (options.zone_name)        ? options.zone_name        : null;
		this.zoneIcon        = (options.zone_icon)        ? options.zone_icon        : null;
		this.uid             = (options.uid)              ? options.uid              : null;
		this.serialNumber    = (options.serial_number)    ? options.serial_number    : null;
		this.softwareVersion = (options.software_version) ? options.software_version : null;
		this.hardwareVersion = (options.hardware_version) ? options.hardware_version : null;
		this.macAddress      = (options.mac_address)      ? options.mac_address      : null;
		this.ipAddress       = (options.ipAddress)        ? options.ipAddress        : null;
		if(options.raw != null){
			parseRawData.call(this, options.raw);
		}
	}
	
	Device.prototype.toString = function(){
			return stringifyObject(this)
	}

	return Device;
})();


function stringifyObject(obj){
	var str = '';
	for(var key in obj){
		if(typeof obj[key] === "string"){
			str += key+": "+obj[key]+"\n";
		}
	}
	return str;
}

function parseRawData(data){
		var that = this;
		//This npm moduele is synchronis. The other does not understand that you 
		//do not need a callback. This why I'm parsing the data this way without needing
		//a callback for the creation of this object;
		parseXMLString(data, function(error, result){
			if(!error){
				var deviceInfo = result.search("ZPSupportInfo.ZPInfo");

				if(deviceInfo != null){
    				that.zoneName        = deviceInfo.search("ZoneName");
    				that.zoneIcon        = deviceInfo.search("ZoneIcon");
    				that.uid             = deviceInfo.search("LocalUID");
    				that.serialNumber    = deviceInfo.search("SerialNumber");
    				that.softwareVersion = deviceInfo.search("SoftwareVersion");
    				that.hardwareVersion = deviceInfo.search("HardwareVersion");
    				that.macAddress      = deviceInfo.search("MACAddress");
    				that.ipAddress       = deviceInfo.search("IPAddress");
				}
			}
		});
	}