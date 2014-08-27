var ItemManager = ItemManager || {
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