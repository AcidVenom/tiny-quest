require("js/gameplay/dungeon_generator");
require("js/data_files/dungeons");

var Level = function()
{
	this._dungeon = undefined;

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
	}

	this.draw = function(dt)
	{
		//this._dungeon.drawConnections(dt);
	}
}