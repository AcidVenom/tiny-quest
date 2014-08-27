var ItemSlot = function(slot)
{
	this._slot = slot;
	this._widget = Widget.new();
	this._widget.setScale(20,0,20);
	this._widget.spawn();
	this._widget.setTranslation(-30+slot*28,-132,0);
}