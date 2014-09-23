require("js/menu/menu");

var MenuState = function()
{
	this.name = "Menu"
	this._menu = undefined
	this._camera = undefined;

	this.initialise = function()
	{
		ContentManager.load("texture","textures/menu/background.png");
		ContentManager.load("texture","textures/menu/background_night.png");

		ContentManager.load("texture","textures/menu/logo.png");

		ContentManager.load("texture","textures/menu/cloud_1.png");
		ContentManager.load("texture","textures/menu/cloud_2.png");
		ContentManager.load("texture","textures/menu/cloud_3.png");

		ContentManager.load("texture","textures/menu/cloud_1_night.png");
		ContentManager.load("texture","textures/menu/cloud_2_night.png");
		ContentManager.load("texture","textures/menu/cloud_3_night.png");
		
		this._camera = Camera.new("orthographic")
		this._menu = new Menu();
	}

	this.update = function(dt)
	{
		this._menu.update(dt);
	}

	this.draw = function(dt)
	{
		Game.render(this._camera);
	}

	this.reload = function()
	{
		this._menu = new Menu();
	}

	this.destroy = function()
	{
		ContentManager.unload("texture","textures/menu/background.png");
		ContentManager.unload("texture","textures/menu/background_night.png");
		
		ContentManager.unload("texture","textures/menu/logo.png");

		ContentManager.unload("texture","textures/menu/cloud_1.png");
		ContentManager.unload("texture","textures/menu/cloud_2.png");
		ContentManager.unload("texture","textures/menu/cloud_3.png");

		ContentManager.unload("texture","textures/menu/cloud_1_night.png");
		ContentManager.unload("texture","textures/menu/cloud_2_night.png");
		ContentManager.unload("texture","textures/menu/cloud_3_night.png");
	}
}