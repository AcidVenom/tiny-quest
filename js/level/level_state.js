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
		ContentManager.load("texture", "textures/ui/inventory_slot.png");
		ContentManager.load("texture", "textures/ui/inventory_slot_selected.png");
		ContentManager.load("texture", "textures/ui/inventory_ui.png");

		ContentManager.load("texture", "textures/pfx/out_of_stamina.png");
		ContentManager.load("texture", "textures/pfx/on_hit.png");
		ContentManager.load("texture", "textures/pfx/on_death.png");
		ContentManager.load("texture", "textures/pfx/on_heal.png");
		ContentManager.load("texture", "textures/pfx/smoke_puff.png");
		
		ContentManager.load("texture", "textures/items/loot_overlay.png");

		ContentManager.load("texture", "textures/characters/shop_keeper.png");
		ContentManager.load("texture", "textures/dungeons/shop_rug.png");

		ItemManager.loadAllTextures();

		this._camera = Camera.new("orthographic");
		this._level = new Level(this._camera);

		this._level.generateDungeon("castle");
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
		Game.clearRenderer();
		LoadedUnitTextures = {}
		UnitIDs = {}
		this._level.reload();
		var key = this._level.dungeon().definition().key
		this._level = new Level(this._camera);
		this._level.generateDungeon(key);
		Broadcaster.register(this,Events.Regenerate,this.regenerate);
	}

	this.regenerate = function(params)
	{
		Game.clearRenderer();
		this._level = new Level(this._camera);
		this._level.generateDungeon(params.key);
	}

	this.destroy = function()
	{
		LoadedUnitTextures = {}
		UnitIDs = {}
		this._level.dungeon().unload();

		ContentManager.unload("texture", "textures/ui/frames.png");
		ContentManager.unload("texture", "textures/ui/hp_bar.png");
		ContentManager.unload("texture", "textures/ui/hp_icon.png");
		ContentManager.unload("texture", "textures/ui/stamina_bar.png");
		ContentManager.unload("texture", "textures/ui/stamina_icon.png");
		ContentManager.unload("texture", "textures/ui/mana_icon.png");
		ContentManager.unload("texture", "textures/ui/mana_bar.png");
		ContentManager.unload("texture", "textures/ui/overhead_frame.png");
		ContentManager.unload("texture", "textures/ui/overhead_bar.png");
		ContentManager.unload("texture", "textures/ui/inventory_slot.png");
		ContentManager.unload("texture", "textures/ui/inventory_slot_selected.png");
		ContentManager.unload("texture", "textures/ui/inventory_ui.png");
		
		ContentManager.unload("texture", "textures/pfx/out_of_stamina.png");
		ContentManager.unload("texture", "textures/pfx/on_hit.png");
		ContentManager.unload("texture", "textures/pfx/on_death.png");
		ContentManager.unload("texture", "textures/pfx/on_heal.png");
		
		ContentManager.unload("texture", "textures/items/loot_overlay.png");

		ItemManager.unloadAllTextures();
	}

	Broadcaster.register(this,Events.Regenerate,this.regenerate);
}