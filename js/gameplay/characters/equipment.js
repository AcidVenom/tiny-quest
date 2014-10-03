var Equipment = function()
{
	var itemInventory = new ItemInventory(5);
	extend(this,itemInventory);

	for (var i = 0; i < this._slots.length; ++i)
	{
		this._slots[i].setType(i);
	}

	this.onAdd = function(item)
	{
		item.apply();
	}
}