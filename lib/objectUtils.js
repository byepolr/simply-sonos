Object.defineProperty(Object.prototype, 'search', {
	enumerable: false,
	configurable: true,
  	writable: true,
  	value: function(path){
		function findItemOrNull(object, path){
			if(object == null || path == null){ console.loog("END OF LINE: "+path); return object; }

			var items = path.match(/([^\.]+)\.*/);
			if(items == null || items.length < 2){ return object; }

			var key = items[1];

			var newPath = path.replace(key, '');
				newPath = (newPath && newPath[0] === '.') ? newPath.substr(1) : newPath;

			if((object && object[key] != null) && newPath != null){
				object = (object[key] instanceof Array) ? object[key][0] : object[key];
				return findItemOrNull(object, newPath);
			}
			return null;
		}
		return findItemOrNull(this, path);
	}
});



 