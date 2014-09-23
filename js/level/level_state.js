require("js/level/level");

var LevelState = function()
{
	this.name = "Level",
	this._camera = undefined,
	this._level = undefined,

	this.initialise = function()
	{
		ContentManager.load("texture", "textures/ui/frames.png");
		ContentManager.load("texture", "textures/ui/hp_bar.png");
		ContentManager.load("texture", "textures/ui/hp_icon.png");
		ContentManager.load("texture", "textures/ui/stamina_bar.png");
		ContentManager.load("texture", "textures/ui/stamina_icon.png");
		ContentManager.load("texture", "textures/ui/mana_icon.png");
		ContentManager.load("texture", "textures/ui/mana_bar.png");
		ContentManager.load("texture", "textures/ui/overhead_frame.png");
		ContentManager.load("texture", "textures/ui/overhead_bar.png");
		
		ContentManager.load("texture", "textures/items/loot_overlay.png");

		this._camera = Camera.new("orthographic");
		this._level = new Level(this._camera);

		this._level.generateDungeon("debug_dungeon");
	}

	this.update = function(dt)
	{
		this._level.update(dt);
	}

	this.level = function()
	{
		return this._level;
	}

	this.camera = function()
	{
		return this._camera;
	}

	this.draw = function(dt)
	{
		Game.render(this._camera);
	}

	this.reload = function()
	{
		LoadedUnitTextures = {}
		UnitIDs = {}
		this._level.destroy();
		this._level.reload();
		this._level = new Level(this._camera);
		this._level.generateDungeon("debug_dungeon");
	}

	this.destroy = function()
	{
		LoadedUnitTextures = {}
		UnitIDs = {}
		this._level.destroy();
		this._level.dungeon().unload();
	}
}