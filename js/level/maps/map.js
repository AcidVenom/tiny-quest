var Map = {
	get: function(name)
	{
		if (this[name] === undefined)
		{
			Log.debug(require("js/level/maps/" + name),true);
		}

		if (this[name] === undefined)
		{
			Log.fatal("Map with name " + name + " does not exist!");
		}
		return this[name];
	}
}