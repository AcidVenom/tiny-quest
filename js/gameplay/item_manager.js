var ItemManager = ItemManager || {
	loadTextures: function()
	{
		for (var name in Items)
		{
			ContentManager.load("texture",this.getItemTexture(name));
		}
	},

	unloadTextures: function()
	{
		for (var name in Items)
		{
			ContentManager.unload("texture",this.getItemTexture(name));
		}
	},

	getItem: function(itemName)
	{
		var item = Items[itemName];
		if (item === undefined)
		{
			Log.error("Item with name '" + itemName +"' does not exist");
			return undefined;
		}

		return item;
	},

	getItemTexture: function(itemName)
	{
		var item = Items[itemName];
		if (item === undefined)
		{
			Log.error("Item with name '" + itemName +"' does not exist");
			return "<error>";
		}
		return "textures/items/" + this.getItemClassName(item.class) + "/" + itemName + ".png";
	},

	getItemClassName: function(itemClass)
	{
		switch (itemClass)
		{
			case ItemClass.Common: return "common"; break;
			case ItemClass.Uncommon: return "uncommon"; break;
			case ItemClass.Rare: return "rare"; break;
			case ItemClass.Artifact: return "artifact"; break;
			case ItemClass.Legendary: return "legendary"; break;
		}
	}
}