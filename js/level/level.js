require("js/gameplay/dungeon_generator");
require("js/gameplay/characters/unit");
require("js/gameplay/characters/player");

require("js/data_files/dungeons");
require("js/data_files/character_definitions");

var Level = function()
{
	this._dungeon = undefined;
	this._units = [];

	this.generateDungeon = function(name)
	{
		Log.info("Started generating dungeon with name '" + name + "'");
		var dungeonDefinition = Dungeons[name];

		if (dungeonDefinition === undefined)
		{
			Log.error("Cannot generate dungeon with name '" + name + "' because it does not exist in the dungeon database");
			return
		}

		this._dungeon = new DungeonGenerator(
			dungeonDefinition.width,
			dungeonDefinition.height,
			32,32,
			dungeonDefinition.noRooms,
			dungeonDefinition.minRoomWidth,
			dungeonDefinition.minRoomHeight,
			dungeonDefinition.maxRoomWidth,
			dungeonDefinition.maxRoomHeight);

		this._dungeon.setDefinition(dungeonDefinition);
		this._dungeon.generate();

		var found = false;

		for (var x = 0; x < dungeonDefinition.width; ++x)
		{
			if (found == true)
			{
				break;
			}
			for (var y = 0; y < dungeonDefinition.height; ++y)
			{
				if (this._dungeon.tileAt(x,y).type !== undefined && this._dungeon.tileAt(x,y).type() == DungeonTiles.Room)
				{
					this._units.push(new Player(x,y));
					found = true;
					break;
				}
			}
		}
	}

	this.dungeon = function()
	{
		return this._dungeon;
	}

	this.draw = function(dt)
	{
		
	}

	this.update = function(dt)
	{
		for (var i = 0; i < this._units.length; ++i)
		{
			this._units[i].update(dt);
		}
	}
}