require("js/gameplay/dungeon_generator");

enumerator("TurnTypes",[
	"Player",
	"Enemy"
	]);

enumerator("Events",[
	"PlayerTurnEnded",
	"EnemyTurnEnded",
	"PlayerDied",
	"EnemyAttacked",
	"Regenerate",
	"EquipmentChanged"
	]);

require("js/gameplay/characters/unit");
require("js/gameplay/characters/player");
require("js/gameplay/characters/enemy");

require("js/data_files/dungeons");
require("js/data_files/character_definitions");

require("js/ui/hud");

require("js/particles/particle_definitions");

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
	this._falloff = {x: 0, y: 0}
	this._deathTimer = 2;
	this._stopped = false;
	this._shopKeeper = undefined;
	this._shopKeeperY = undefined;
	this._timer = 0;

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
		this._falloff = {x: 0, y: 0}
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

		dungeonDefinition.key = name;
		this._dungeon.setDefinition(dungeonDefinition);
		this._dungeon.generate();

		var indices = this._dungeon.getPlayerTile();
		this._player = new Player(this,indices.x,indices.y);
		this._units.push(this._player);

		this._shopKeeper = undefined;
		if(dungeonDefinition.shopKeeper > Math.random())
		{
			Log.info("Started searching for a shopkeeper location");
			this._shopKeeper = this._dungeon.placeShopKeeper(indices.x,indices.y,40);

			this._shopKeeperY = this._shopKeeper.position().y;
		}
		else
		{
			Log.info("No shopkeeper will be placed for this dungeon");
		}

		this._hud = new HUD(this._player);
		this._hud.fadeIn();

		for (var x = 0; x < this._dungeon.grid().length; ++x)
		{
			for (var y = 0; y < this._dungeon.grid()[x].length; ++y)
			{
				var random = Math.random()

				if (random < 0.05)
				{
					var randTable = ["mouse_brown","mouse_grey","slime_blue","slime_green"]
					if (this._dungeon.tileAt(x,y) != DungeonTiles.Empty && this._dungeon.tileAt(x,y).type() != DungeonTiles.Wall)
					{
						this._units.push(new Enemy(this,x,y,randTable[Math.floor(Math.random()*randTable.length)]));
					}
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

	this.shaking = function()
	{
		return this._shakeTimer < 0.99;
	}

	this.onAttacked = function()
	{
		this._alreadyAttacked = true;
	}

	this.alreadyAttacked = function()
	{
		return this._alreadyAttacked;
	}

	this.update = function(dt)
	{
		this._timer += dt;

		if (this._timer > Math.PI*2)
		{
			this._timer = 0;
		}

		if (this._shopKeeper !== undefined)
		{
			var pos = this._shopKeeper.position();
			this._shopKeeper.setPosition(pos.x,this._shopKeeperY - Math.abs(Math.sin(this._timer*4))*3);
		}
		if (this._stopped == true)
		{
			return;
		}
		if (this._deathTimer < 1)
		{
			this._deathTimer += dt/2;
		}
		else if (this._deathTimer != 2)
		{
			Broadcaster.broadcast(Events.Regenerate,{key: this._dungeon.definition().key});
			this._stopped = true;
		}
		var playerTurn = true;
		this._alreadyAttacked = false;

		for (var i = 0; i < this._units.length; ++i)
		{
			if (this._units[i].type() != UnitTypes.Player && this._units[i].shouldMove() == true)
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
			this._camera.setTranslation(this._player.translation().x,this._player.translation().y,this._camera.translation().z);
			this._shakeTimer += dt/this._shakeDuration;
			shake = Math.shake(this._shakeMagnitude,this._shakeTimer);
		}

		this._hud.update(dt);

		translation = this._camera.translation();
		this._camera.setTranslation(translation.x+shake.x,translation.y+shake.y,translation.z);

		if (Keyboard.isPressed("Escape"))
		{
			StateManager.switchState(CharacterCreationState);
		}
	}

	this.onPlayerDied = function()
	{
		this._hud.fadeOut();
		this._deathTimer = 0;
	}

	Broadcaster.register(this,Events.PlayerTurnEnded,this.setTurn);
	Broadcaster.register(this,Events.PlayerDied,this.onPlayerDied);
	Broadcaster.register(this,Events.EnemyAttacked,this.onAttacked);
}