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
		var my = 0;
		var mx = 0;
		var speed = 300*dt;

		if (Keyboard.isDown("W"))
			my = 1;
		if (Keyboard.isDown("S"))
			my = -1;
		if (Keyboard.isDown("A"))
			mx = -1;
		if (Keyboard.isDown("D"))
			mx = 1;

		this._camera.translateBy(mx*speed,my*speed,0);
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