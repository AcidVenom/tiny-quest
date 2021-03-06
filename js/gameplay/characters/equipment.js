var Equipment = function(unit)
{
	this._unit = unit;
	var itemInventory = new ItemInventory(unit,5);
	extend(this,itemInventory);

	for (var i = 0; i < this._slots.length; ++i)
	{
		this._slots[i].setType(i);
	}

	this.findFirstSlot = function(type, key)
	{
		for (var i = 0; i < this._slots.length; ++i)
		{
			var slot = this._slots[i];
			if (slot.free() && slot.type() == type)
			{
				return slot;
			}
			else if (!slot.free() && slot.item().key() == key && slot.item().isStackable() && slot.type() == type)
			{
				
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

	this.onAdd = function(item)
	{
		Broadcaster.broadcast(Events.EquipmentChanged,{slot: item.slot(), texture: item.texture()});
	}
}