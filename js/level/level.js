require("js/level/characters/enemy_data");
require("js/level/level_defaults");
require("js/level/maps/map");
require("js/level/characters/unit");
require("js/level/characters/enemy");
require("js/level/characters/player");
require("js/level/world");

var Level = {
	_location: undefined,

	unload: function()
	{
		ContentManager.unload("texture", "textures/world/tiles/default_inner.png");
		ContentManager.unload("texture", "textures/world/tiles/default_outer.png");

		if (this._location !== undefined)
		{
			var backgrounds = this.getLevelDefaults().backgrounds;

			for (var i = 0; i < backgrounds.length; ++i)
			{
				ContentManager.unload("texture",backgrounds[i]);
			}
		}
	},

	load: function()
	{
		ContentManager.load("texture", "textures/world/tiles/default_inner.png");
		ContentManager.load("texture", "textures/world/tiles/default_outer.png");

		var backgrounds = this.getLevelDefaults().backgrounds;

		for (var i = 0; i < backgrounds.length; ++i)
		{
			ContentManager.load("texture",backgrounds[i]);
		}
	},

	setLocation: function(location)
	{

		if (this._location !== undefined)
		{
			this.unload();
		}

		if (LevelDefaults[location] === undefined)
		{
			Log.error("Location '" + location + "' does not exist! Defaulting to west_haven");
			location = "west_haven";
		}
		else
		{
			Log.debug("Changed location to " + location);
		}

		this._location = location;
		this.load();
	},

	location: function()
	{
		return this._location;
	},

	getLevelDefaults: function()
	{
		return LevelDefaults[this._location];
	},

	getTile: function(type)
	{
		var retVal = {
			background: undefined,
			overlay: undefined,
			prop: undefined
		}
		switch (type)
		{
			case 0:
				retVal.background = this.getLevelDefaults().background;
				break;
			case 1:
				retVal.background = this.getLevelDefaults().outer;
				break;
			default:
				retVal.background = this.getLevelDefaults().tiles[type];
				retVal.overlay = this.getLevelDefaults().overlays[type];
				retVal.prop = this.getLevelDefaults().props[type];
				break;
		}

		return retVal;
	}
}

/**
* @class LevelState
* @brief The level gameplay state
* @author Daniël Konings
*/
var LevelState = LevelState ||
{
	name: "LevelState",
	_camera: undefined,
	_player: undefined,
	_world: undefined,

	initialise: function()
	{
		if (Level.location() == undefined)
		{
			Log.error("No location was set! Defaulting to west_haven");
			Level.setLocation("west_haven");
		}
		ContentManager.load("texture", "textures/characters/hero/hero.png");
		ContentManager.load("texture", "textures/characters/shadow.png");

		ContentManager.load("texture", "textures/weapons/junk/wooden_sword.png");

		this._camera = Camera.new("orthographic");
		this._camera.setTranslation(0,0,-100);

		this._world = new World();
		this._player = new Player(this._world);
	},

	update: function(dt)
	{
		if (this._world && this._player)
		{
			this._world.update(dt);
			this._player.update(dt);
		}
	},

	draw: function(dt)
	{
		this._world.draw(dt);
		Game.render(this._camera);
	},

	reload: function()
	{
		this._world.destroy();
		this._player.destroy();
		var currentTile = this._player.currentTile();
		this._world = null;
		this._player = null;
		this._world = new World();
		this._player = new Player(this._world,currentTile.x,currentTile.y);
	},

	player: function()
	{
		return this._player;
	},

	world: function()
	{
		return this._world;
	},

	camera: function()
	{
		return this._camera;
	},

	destroy: function()
	{
		ContentManager.unload("texture", "textures/characters/hero/hero.png");
		ContentManager.unload("texture", "textures/characters/shadow.png");
		ContentManager.unload("texture", "textures/weapons/junk/wooden_sword.png");

		Level.unload();
	}
}