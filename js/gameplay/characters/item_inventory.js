var ItemInventory = function(unit,slotSize)
{
	this._slots = [];

	for (var i = 0; i < slotSize; ++i)
	{
		this._slots.push(new InventorySlot());
	}

	this.getSlot = function(idx)
	{
		return this._slots[idx];
	}

	this.findFirstSlot = function(type)
	{
		for (var i = 0; i < this._slots.length; ++i)
		{
			var slot = this._slots[i];
			if (slot.free())
			{
				return slot;
			}
		}

		return undefined;
	}

	this.addItem = function(item)
	{
		var slot = this.findFirstSlot(item.slot());
		if (slot === undefined)
		{
			return false;
		}

		slot.addItem(item);
		this.onAdd(item);
		return true;
	}

	this.removeItem = function(slot)
	{
		this._slots[slot].removeItem();
	}

	this.removeItemByItem = function(item)
	{
		if (item === undefined)
		{
			return false;
		}

		for (var i = 0; i < this._slots.length; ++i)
		{
			if (this._slots[i].item() == item)
			{
				this._slots[i].removeItem();
				break;
			}
		}

		return true;
	}

	this.onAdd = function(item)
	{

	}
}

var InventorySlot = function()
{
	this._free = true;
	this._item = undefined;
	this._type = undefined;

	this.free = function()
	{
		return this._free;
	}

	this.type = function()
	{
		return this._type;
	}

	this.item = function()
	{
		return this._item;
	}

	this.addItem = function(item)
	{
		this._item = item;
		this._free = false;
	}

	this.removeItem = function()
	{
		this._item = undefined;
		this._free = true;
	}

	this.setType = function(type)
	{
		this._type = type;
	}
}