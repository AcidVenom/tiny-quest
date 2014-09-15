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


var Level = function(camera)
{
	this._dungeon = undefined;
	this._player = undefined;
	this._currentTurn = TurnTypes.Player;
	this._units = [];
	this._hud = undefined;
	this._camera = camera;
	this._shakeDuration = 0;
	this._shakeMagnitude = 0;

	this.camera = function()
	{
		return this._camera;
	}

	this.hud = function()
	{
		return this._hud;
	}
	
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

	this.shakeCamera = function(magnitude,duration)
	{
		this._shakeTimer = 0;
		this._shakeDuration = duration;
		this._shakeMagnitude = magnitude;
	}

	this.generateDungeon = function(name)
	{
		CharacterDefinitions.updatePlayerStats();
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
					this._units.push(new Player(this,x,y));
					this._player = this._units[0];
					this._hud = new HUD(this._player);
					this._units.push(new Enemy(this,x+1,y+1,"mouse_brown"));
					this._units.push(new Enemy(this,x+4,y+4,"mouse_grey"));
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
	}

	this.draw = function(dt)
	{
		
	}

	this.update = function(dt)
	{
		var playerTurn = true;
		for (var i = 0; i < this._units.length; ++i)
		{
			if (this._units[i].name() != "player" && this._units[i].shouldMove() == true)
			{
				playerTurn = false;
			}
			this._units[i].update(dt);

			if (this._units[i].removed())
			{
				this._units.splice(i,1);
				--i;
			}
		}

		if (playerTurn == true)
		{
			this.setTurn({turn:TurnTypes.Player});
		}

		var shake = {x: 0, y: 0}
		if (this._shakeTimer < 1)
		{
			this._shakeTimer += dt/this._shakeDuration;
			shake = Math.shake(this._shakeMagnitude,this._shakeTimer);
		}

		this._hud.update(dt);

		translation = this._camera.translation();
		this._camera.setTranslation(translation.x+shake.x,translation.y+shake.y,translation.z);
	}

	Broadcaster.register(this,Events.PlayerTurnEnded,this.setTurn)
}