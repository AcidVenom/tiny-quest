require("js/data_files/items");
require("js/gameplay/characters/item_inventory");
require("js/gameplay/characters/equipment");

enumerator("ItemType",[
	"Equip",
	"Use"]);

var ItemManager = {
	_loaded: {},
	loadAllTextures: function()
	{
		for (var key in Items)
		{
			var texture = Items[key].texture
			if (this._loaded[texture] === undefined)
			{
				ContentManager.load("texture",texture);
			}
			this._loaded[texture] = true;
		}
	},

	unloadAllTextures: function()
	{
		for (var key in Items)
		{
			var texture = Items[key].texture
			if (this._loaded[texture] === true)
			{
				ContentManager.unload("texture",texture);
			}
			this._loaded[texture] = undefined;
		}
	}
}

var Item = function(definition)
{
	var def = Items[definition];
	for (var key in def)
	{
		this["_" + key] = def[key];
	}

	this._type = ItemType.Use;

	if (this._equip !== undefined)
	{
		this._type = ItemType.Equip;
		this._slot = this._equip.slot;
	}

	this.isStackable = function()
	{
		return this._stackable;
	}

	this.texture = function()
	{
		return this._texture;
	}

	this.slot = function()
	{
		return this._slot
	}

	this.apply = function(unit)
	{
		if (this._type == ItemType.Equip)
		{
			for (var key in this._equip.apply)
			{
				var value = this._equip.apply[key];
				var item = this;
				unit.bonusHandler().addBonus(key,value[0],BonusTypes[value[1]],
					function(u)
					{
						if (u.isEquipped(item))
						{
							return true;
						}
						return false
					});
			}
		}
		else
		{
			Log.fatal("Apply of use items not implemented yet");
		}
	}
}