require("js/gameplay/dungeon_generator");

enumerator("TurnTypes",[
	"Player",
	"Enemy"
	]);

enumerator("Events",[
	"PlayerTurnEnded",
	"EnemyTurnEnded"
	]);

require("js/gameplay/characters/unit");
require("js/gameplay/characters/player");
require("js/gameplay/characters/enemy");

require("js/data_files/dungeons");
require("js/data_files/character_definitions");

require("js/ui/hud");


var Level = function()
{
	this._dungeon = undefined;
	this._player = undefined;
	this._currentTurn = TurnTypes.Player;
	this._units = [];
	this._hud = new HUD();

	this.turn = function()
	{
		return this._currentTurn;
	}

	this.setTurn = function(params)
	{
		this._currentTurn = params.turn;
	}

	this.player = function()
	{
		return this._player;
	}

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
					this._player = this._units[0];
					this._units.push(new Enemy(x+1,y+1,"mouse_brown"));
					this._units.push(new Enemy(x+4,y+4,"mouse_grey"));
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

	this.reload = function()
	{
		this._dungeon.destroy();
		Broadcaster.clear();
	}

	this.draw = function(dt)
	{
		
	}

	this.update = function(dt)
	{
		var playerTurn = true;
		for (var i = 0; i < this._units.length; ++i)
		{
			this._units[i].update(dt);

			if (this._units[i].name() != "player" && this._units[i].shouldMove() == true)
			{
				playerTurn = false;
			}
		}

		if (playerTurn == true)
		{
			this.setTurn({turn:TurnTypes.Player});
		}
	}

	Broadcaster.register(this,Events.PlayerTurnEnded,this.setTurn)
}