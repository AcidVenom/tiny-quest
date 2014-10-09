var Drop = function(x,y,item,quantity)
{
	this._item = new Item(item);
	this._quantity = quantity;

	this._object = new GameObject(32,32,this._item.texture());
	this._object.setPosition(x,y);
	this._object.spawn();

	this.item = function()
	{
		return this._item;
	}

	this.quantity = function()
	{
		return this._quantity;
	}

	this.reduceQuantity = function(quant)
	{
		this._quantity -= quant;
	}

	this.show = function()
	{
		this._object.spawn();
	}

	this.hide = function()
	{
		this._object.destroy();
	}

	this.setZ = function(z)
	{
		this._object.setZ(z)
	}
}

var Tile = function(x,y,type,grid,textures)
{
	this._type = type;
	this._tile = undefined;
	this._position = {x: x*32, y: y*32}
	this._indices = {x: x, y: y}
	this._unit = undefined;
	this._visible = false;
	this._drops = [];
	this._lootOverlay = undefined;
	this._bestItem = -1;

	this.destroy = function()
	{
		this._tile.destroy();
	}

	this.hide = function()
	{
		if (this._visible == true)
		{
			this._tile.destroy();

			if (this._unit !== undefined)
			{
				this._unit.destroy();
			}

			this._lootOverlay.destroy();

			for (var i = 0; i < this._drops.length; ++i)
			{
				this._drops[i].hide();
			}

			this._visible = false;
		}
	}

	this.show = function()
	{
		if (this._visible == false)
		{
			this._tile.spawn();

			if (this._unit !== undefined)
			{
				this._unit.spawn();
			}

			if(this.hasDrops() == true)
			{
				this._lootOverlay.spawn();

				for (var i = 0; i < this._drops.length; ++i)
				{
					this._drops[i].show();
				}
			}

			this._visible = true;
		}
	}

	this.visible = function()
	{
		return this._visible;
	}

	this.position = function()
	{
		return this._position;
	}

	this.indices = function()
	{
		return this._indices;
	}

	this.addDrops = function(dropTable)
	{
		if (dropTable.length == 0)
			return;

		var dropsToObjects = [];
		var rarest, rarity, drop, dropObj = undefined;
		for (var i = 0; i < dropTable.length; ++i)
		{
			drop = dropTable[i];
			dropObj = new Drop(this._position.x,this._position.y,drop.item,drop.quantity);
			dropObj.setZ(this._tile.z()+0.00001*(i+1));
			dropsToObjects.push(dropObj);

			rarity = dropObj.item().rarity();
			if (rarest === undefined)
			{
				rarest = rarity
			}
			else if (rarity > rarest)
			{
				rarest = rarity;
			}
		}
		this._drops = dropsToObjects;
		var col = this.rarityToColour(rarest);

		this._lootOverlay.setBlend(col.r,col.g,col.b);
		this._lootOverlay.spawn();
		this._lootOverlay.setZ(this._tile.z()+0.000005)
	}

	this.rarityToColour = function(rarity)
	{
		switch(rarity)
		{
			case ItemRarity.Common:
				return {r: 1, g: 1, b: 1}
			case ItemRarity.Uncommon:
				return {r: 0, g: 1, b: 0}
			case ItemRarity.Rare:
				return {r: 0.5, g: 0, b: 1}
			case ItemRarity.Artifact:
				return {r: 1, g: 1, b: 0}
			case ItemRarity.Legendary:
				return {r: 1, g: 0.5, b: 0}
			default:
				return {r: 0, g: 0, b: 0}
		}
	}

	this.hasDrops = function()
	{
		return this._drops.length > 0;
	}

	this.pickUpDrops = function(player)
	{
		var inventory = player.inventory();
		for (var i = this._drops.length-1; i >= 0; --i)
		{
			var result = true;
			var reduceBy = 0;
			for (var j = 0; j < this._drops[i].quantity(); ++j)
			{
				if(this._drops[i].item().key() == "coins")
				{
					player.addCoins(1);
				}
				else if (inventory.findFirstSlot() === undefined)
				{
					Log.debug("Inventory full");
					result = false;
				}
				else
				{
					inventory.addItem(this._drops[i].item());
					++reduceBy;
				}
			}

			if (result == true)
			{
				this._drops[i].hide();
				this._drops.splice(i,1);
			}
			else
			{
				this._drops[i].reduceQuantity(reduceBy);
			}
		}

		if (this._drops.length == 0)
		{
			this._lootOverlay.destroy();
		}
	}	

	this.setUnit = function(unit)
	{
		this._unit = unit;

		if (this._unit.type() == UnitTypes.Player)
		{
			this._tile.setBlend(0,1,0);
		}
		else
		{
			this._tile.setBlend(1,0,0);
		}
	}

	this.removeUnit = function()
	{
		this._unit = undefined;
		this._tile.setBlend(1,1,1);
	}

	this.type = function()
	{
		return this._type;
	}

	this.isImpassable = function()
	{
		return this._unit !== undefined || this._type == DungeonTiles.Wall;
	}

	this.unit = function()
	{
		return this._unit;
	}
	
	if (type == DungeonTiles.Wall)
	{
		this._tile = new GameObject(32,48);
	}
	else
	{
		this._tile = new GameObject(32,32);
	}
	
	this._tile.setPosition(x*32,y*32);
	this._tile.setZ(y/100);

	var wallTextures = undefined;
	var wallSpecial = {texture: undefined, mod: undefined};
	var floorTextures = undefined;
	var roomTextures = undefined;

	if (textures !== undefined)
	{
		wallTextures = textures.wall === undefined ? [["textures/dungeons/default_dungeon/default_wall.png",1]] : textures.wall;
		roomTextures = textures.room === undefined ? [["textures/dungeons/default_dungeon/default_room.png",1]] : textures.room;
		floorTextures = textures.floor === undefined ? [["textures/dungeons/default_dungeon/default_floor.png",1]] : textures.floor;

		if (textures.wall_special !== undefined)
		{
			wallSpecial.textures = textures.wall_special.tiles;
			wallSpecial.mod = textures.wall_special.modulo;
		}
	}
	else
	{
		wallTextures = [["textures/dungeons/default_dungeon/default_wall.png",1]];
		roomTextures = [["textures/dungeons/default_dungeon/default_room.png",1]];
		floorTextures = [["textures/dungeons/default_dungeon/default_floor.png",1]];
	}
	switch (type)
	{
		case DungeonTiles.Room:
			var texture = WeightedCollection.retrieve(roomTextures);
			this._tile.setTexture(texture);
			break;
		case DungeonTiles.Floor:
			var texture = WeightedCollection.retrieve(floorTextures);
			this._tile.setTexture(texture);
			break;
		case DungeonTiles.Wall:
			var texture = WeightedCollection.retrieve(wallTextures);
			this._tile.setTexture(texture);

			if (wallSpecial.textures !== undefined && wallSpecial.mod !== undefined)
			{
				if (x % wallSpecial.mod == 0 && grid[x][y+1] != DungeonTiles.Empty)
				{
					texture = WeightedCollection.retrieve(wallSpecial.textures);
					this._tile.setTexture(texture);
				}
			}
			break;
	}

	this._lootOverlay = new GameObject(32,32,"textures/items/loot_overlay.png");
	this._lootOverlay.setPosition(this._position.x,this._position.y);
	this._lootOverlay.setZ(this._indices.y/100+0.0005);
}