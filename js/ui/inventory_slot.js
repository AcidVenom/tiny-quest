var InventorySlotUI = function(parent)
{
	this._widget = undefined;
	this._item = undefined;

	if (parent !== undefined)
	{
		this._widget = Widget.new(parent);
	}
	else
	{
		this._widget = Widget.new();
	}

	this._widget.setScale(38,0,38);
	this._widget.setTexture("textures/ui/inventory_slot.png");
	this._widget.hidden = true;

	var item = Widget.new(this._widget);
	item.setTranslation(3,3,910);
	item.setScale(32,0,32);
	item.setAlpha(0);

	this._widget.item = item;

	this.destroy = function()
	{
		this._widget.destroy();
		this._widget.item.destroy();
	}

	this.show = function()
	{
		this._widget.hidden = false;
		this._widget.spawn();
		this._widget.item.setAlpha(1);
	}

	this.hide = function()
	{
		this._widget.hidden = true;
		this._widget.destroy();
		this._widget.item.setAlpha(0);
	}

	this.setItem = function(item)
	{
		this._item = item;

		this._widget.item.setTexture(this._item.texture());
		this._widget.item.spawn();
	}

	this.removeItem = function()
	{
		this._item = undefined;
		this._widget.item.destroy();
	}

	this.widget = function()
	{
		return this._widget;
	}

	this.setTranslation = function(x,y,z)
	{
		this._widget.setTranslation(x,y,z);
	}
}