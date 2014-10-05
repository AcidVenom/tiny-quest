var Equipment = function(unit)
{
	this._unit = unit;
	var itemInventory = new ItemInventory(unit,5);
	extend(this,itemInventory);

	for (var i = 0; i < this._slots.length; ++i)
	{
		this._slots[i].setType(i);
	}

	this.findFirstSlot = function(type)
	{
		for (var i = 0; i < this._slots.length; ++i)
		{
			var slot = this._slots[i];
			if (slot.free() && slot.type() == type)
			{
				return slot;
			}
		}
	}

	this.hasItem = function(item)
	{
		for (var i = 0; i < this._slots.length; ++i)
		{
			if (this._slots[i].item() == item)
			{
				return true;
			}
		}

		return false;
	}
}