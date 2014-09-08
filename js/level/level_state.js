require("js/level/level");

var LevelState = LevelState || {
	name: "Level",
	_camera: null,
	_level: undefined,

	initialise: function()
	{
		this._camera = Camera.new("orthographic");
		this._level = new Level();

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
		this._level = new Level();
		this._level.generateDungeon("debug_dungeon");
	},

	destroy: function()
	{

	}
}