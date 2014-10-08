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

	this.findFirstSlot = function(type,key)
	{
		for (var i = 0; i < this._slots.length; ++i)
		{
			var slot = this._slots[i];
			if (slot.free())
			{
				return slot;
			}
			else if (!slot.free() && slot.item().key() == key && slot.item().isStackable())
			{
				return slot;
			}
		}

		return undefined;
	}

	this.addItem = function(item)
	{
		var slot = this.findFirstSlot(item.slot(),item.key());
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
	this._quantity = 0;

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
		++this._quantity;
	}

	this.removeItem = function()
	{
		--this._quantity;

		if (this._quantity == 0)
		{
			this._item = undefined;
			this._free = true;
		}
	}

	this.quantity = function()
	{
		return this._quantity;
	}

	this.setType = function(type)
	{
		this._type = type;
	}
}