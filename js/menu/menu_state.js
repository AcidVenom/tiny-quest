require("js/menu/menu");

var MenuState = MenuState || {
	name: "Menu",
	_menu: undefined,
	_camera: Camera.new("orthographic"),

	initialise: function()
	{
		ContentManager.load("texture","textures/menu/background.png");
		ContentManager.load("texture","textures/menu/logo.png");

		ContentManager.load("texture","textures/menu/cloud_1.png");
		ContentManager.load("texture","textures/menu/cloud_2.png");
		ContentManager.load("texture","textures/menu/cloud_3.png");
		
		this._menu = new Menu();
	},

	update: function(dt)
	{
		this._menu.update(dt);
	},

	draw: function(dt)
	{
		Game.render(this._camera);
	},

	reload: function()
	{
		this._menu = new Menu();
	},

	destroy: function()
	{
		ContentManager.unload("texture","textures/menu/background.png");
		ContentManager.unload("texture","textures/menu/logo.png");
	}
}