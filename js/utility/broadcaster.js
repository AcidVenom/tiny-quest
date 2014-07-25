/**
* @class Broadcaster
* @brief Broadcasts events over the game
* @author Daniël Konings
*/
var Broadcaster = {
	_events: [],
	_listeners: [],

	/// Registers a listener
	register: function(obj,func,evt)
	{
		if (this._events[evt] === undefined)
		{
			this._events[evt] = [];
			this._listeners[evt] = [];
		}

		this._events[evt].push(func);
		this._listeners[evt].push(obj);
	},

	/// Broadcasts an event
	broadcast: function(evt,params)
	{
		for (var i = 0; i < this._events[evt].length; ++i)
		{
			var func = this._events[evt][i];
			var obj = this._listeners[evt][i];

			obj.func = func;
			obj.func(params);
		}
	}
}