require("js/level/level");

var LevelState = LevelState || {
	name: "Level",
	_camera: null,
	_level: undefined,

	initialise: function()
	{
		ContentManager.load("texture", "textures/ui/frames.png");
		ContentManager.load("texture", "textures/ui/hp_bar.png");
		ContentManager.load("texture", "textures/ui/hp_icon.png");
		ContentManager.load("texture", "textures/ui/stamina_bar.png");
		ContentManager.load("texture", "textures/ui/stamina_icon.png");
		ContentManager.load("texture", "textures/ui/mana_icon.png");
		ContentManager.load("texture", "textures/ui/mana_bar.png");

		this._camera = Camera.new("orthographic");
		this._level = new Level(this._camera);

		this._level.generateDungeon("debug_dungeon");
	},

	update: function(dt)
	{
		this._level.update(dt);
	},

	level: function()
	{
		return this._level;
	},

	camera: function()
	{
		return this._camera;
	},

	draw: function(dt)
	{
		this._level.draw(dt);
		Game.render(this._camera);
	},

	reload: function()
	{
		this._level.reload();
		this._level = new Level(this._camera);
		this._level.generateDungeon("debug_dungeon");
	},

	destroy: function()
	{
		this._dungeon.destroy();
	}
}