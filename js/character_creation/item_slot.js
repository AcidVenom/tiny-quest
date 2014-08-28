var ItemSlot = function(slot)
{
	this._slot = slot;
	this._widget = Widget.new();
	this._widget.setScale(20,0,20);
	this._widget.setTranslation(-30+slot*28,-132,0);
	this._numberWidget = undefined;

	if (this._slot == 4)
	{
		this._numberWidget = new GuiNumber();
		this._numberWidget.setValue(0);

		this._numberWidget.setTranslation(140,-90,0);
		this._numberWidget.setBlend(1,1,0);
	}

	this._widget.spawn();

	this.slot = function()
	{
		return this._slot;
	}

	this.setQuantity = function(value)
	{
		this._numberWidget.setValue(value);
	}

	this.clear = function()
	{
		this._widget.setAlpha(0);
		if (this._numberWidget !== undefined)
		{
			this._numberWidget.setAlpha(0);
		}
	}

	this.changeTexture = function(texture)
	{
		this._widget.setTexture(texture);
		this._widget.setAlpha(1);
		
		if (this._numberWidget !== undefined)
		{
			this._numberWidget.setAlpha(1);
		}
	}

	this.destroy = function()
	{
		this._widget.destroy();
		this._widget = null;

		if (this._numberWidget !== undefined)
		{
			this._numberWidget.destroy();
			this._numberWidget = null;
		}
	}

	this._widget.setAlpha(0);
}