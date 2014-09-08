require("js/data_files/character_definitions");

var LoadedUnitTextures = {}

var Unit = function(x,y,name)
{
	this._dungeon = LevelState.level().dungeon();
	this._tile = undefined;
	this._name = name;
	this._position = {x: 0, y: 0}
	this._indices = {x: 0, y: 0}
	this._target = undefined;
	this._jumpTimer = 1;

	var unit = CharacterDefinitions[name];

	if (unit === undefined)
	{
		Log.error("Character with name " + name + " does not exist! Defaulting");
		unit = CharacterDefinitions["player"];
	}

	var texture = CharacterDefinitions[name].texture;

	if (LoadedUnitTextures[texture] === undefined)
	{
		LoadedUnitTextures[texture] = true;
		ContentManager.load("texture",texture);
	}
	
	this.__gameObject = new GameObject(32,32,texture);
	this.__gameObject.spawn();

	extend(this,this.__gameObject);

	this._setPosition = this.setPosition;
	this.setPosition = function(x,y)
	{
		if (this._tile !== undefined)
		{
			this._tile.removeUnit();
		}
		this._tile = this._dungeon.tileAt(x,y);
		this._tile.setUnit(this);

		this._position = this._tile.position();
		this._indices.x = x;
		this._indices.y = y;

		this._setPosition(this._position.x+16,this._position.y-10-16);
		this.setZ(y/100+0.001);
	}

	this.jumpTo = function(x,y)
	{
		var tile = this._dungeon.tileAt(x,y);
		if (this._target == undefined && tile !== DungeonTiles.Empty && tile.type() !== DungeonTiles.Wall)
		{
			this._jumpTimer = 0;
			this._target = tile;

			if (x < this._indices.x)
			{
				this.setScale(-32,32,32);
			}
			else
			{
				this.setScale(32,32,32);
			}
		}
	}

	this.initialise = function()
	{
		this.setOffset(0.5,0.5,0.5);
		if (name == "player")
		{
			this.setBlend(Character.blend[0],Character.blend[1],Character.blend[2]);
		}

		if (this._dungeon.tileAt(x,y) == DungeonTiles.Empty)
		{
			Log.error("Tried to place unit on an empty dungeon tile");
		}
		else
		{
			this.setPosition(x,y);
		}

		Log.success("Created a unit with name " + name);
	}

	this.name = function()
	{
		return this._name;
	}

	this.updateMovement = function(dt)
	{
		if (this._jumpTimer < 1)
		{
			this._jumpTimer += dt*5;
			var x = Math.lerp(this._position.x,this._target.position().x,this._jumpTimer);
			var y = Math.lerp(this._position.y,this._target.position().y,this._jumpTimer);

			this._setPosition(x+16,y-16-10-Math.sin(this._jumpTimer*Math.PI)*15);
			this.setZ(y/32/100+0.001)
		}
		else if (this._target !== undefined)
		{
			this.setPosition(this._target.indices().x,this._target.indices().y);
			this._target = undefined;
		}
	}

	this.initialise();
}