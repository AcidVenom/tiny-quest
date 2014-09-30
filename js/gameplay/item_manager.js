require("js/data_files/items");

enumerator("ItemType",[
	"Equip",
	"Use"]);

var Item = function(defintion)
{
	for (var key in definition)
	{
		this["_" + key] = definition[key];
	}

	this._type = ItemType.Use;

	if (this._equip !== undefined)
	{
		this._type = ItemType.Equip;
	}

	this.isStackable = function()
	{
		return this._stackable;
	}

	this.texture = function()
	{
		return this._texture;
	}

	this.apply = function(unit)
	{
		if (this._type == ItemType.Equip)
		{
			for (var key in this._equip.apply)
			{
				unit.applyEffect(key,this._equip.apply[key]);
			}
		}
		else
		{
			
		}
	}
}