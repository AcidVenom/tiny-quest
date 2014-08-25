Mouse.relativePosition = function(w,h)
{
	var pos = Mouse.position(Mouse.Screen);

	var x = (pos.x + 1) / 2;
	var y = (pos.y + 1) / 2;

	return {x: x*w, y: y*h}
}

var MouseEventManager = {
	_listeners: [],

	check: function()
	{
		for (var i = 0; i < this._listeners.length; ++i)
		{
			var listener = this._listeners[i];
			var metrics = listener.metrics();
			var pos = Mouse.relativePosition(RenderSettings.resolution().w,RenderSettings.resolution().h);
			
			if (pos.x >= metrics.x && pos.y >= metrics.y && pos.x <= metrics.x+metrics.w && pos.y <= metrics.y+metrics.h)
			{
				if (!listener.hovered())
				{
					listener.notify("enter");
				}

				if (Mouse.isPressed(0) || Mouse.isDoubleClicked(0))
				{
					listener.notify("pressed");
				}

				if (Mouse.isDown(0))
				{
					listener.notify("down");
				}

				if (Mouse.isReleased(0))
				{
					listener.notify("released");
				}
			}
			else
			{
				if (listener.hovered())
				{
					listener.notify("leave");
				}
			}
		}
	},

	register: function(area)
	{
		this._listeners.push(area)
	}
}

var MouseArea = function(x,y,w,h)
{
	this._x = x;
	this._y = y;
	this._w = w;
	this._h = h;
	this._hover = false;

	this._callbacks = {
		enter: [],
		leave: [],
		released: [],
		pressed: [],
		down: []
	}

	this.hovered = function()
	{
		return this._hover;
	}

	this.on = function(type,callback)
	{
		if (type !== "enter" && type !== "leave" && type !== "released" && type !== "pressed" && type !== "down")
		{
			Log.error("Callback '" + String(type) + "' for mouse area does not exist!");
			return;
		}

		this._callbacks[type].push(callback);
	}

	this.metrics = function()
	{
		return {x: this._x, y: this._y, w: this._w, h: this._h}
	}

	this.notify = function(type)
	{
		if (type === "enter")
		{
			this._hover = true;
		}

		if (type === "leave")
		{
			this._hover = false;
		}
		
		this.callback(type);
	}

	this.callback = function(type)
	{
		for (var i = 0; i < this._callbacks[type].length; ++i)
		{
			this._callbacks[type][i]();
		}
	}

	MouseEventManager.register(this);
}