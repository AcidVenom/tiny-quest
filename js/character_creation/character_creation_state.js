require("js/character_creation/character_creation");

var CharacterCreationState = function()
{
	this.name = "Character Creation"

	this._characterCreation = undefined
	this._camera = undefined

	this.initialise = function()
	{
		this._camera = Camera.new("orthographic");

		ContentManager.load("texture","textures/characters/hero/hero.png");
		for (var i = 1; i <= 5; ++i)
		{
			ContentManager.load("texture","textures/characters/hero/hero_hair_" + String(i) + ".png");
		}
		ContentManager.load("texture","textures/character_creation/background.png");
		ContentManager.load("texture","textures/character_creation/rgb_slider.png");
		ContentManager.load("texture","textures/character_creation/selected_class.png");
		ContentManager.load("texture","textures/character_creation/selection.png");
		ContentManager.load("texture","textures/character_creation/selection_hair.png");
		ContentManager.load("texture","textures/character_creation/selected_hair.png");
		ContentManager.load("texture","textures/character_creation/tooltip.png");
		ContentManager.load("texture","textures/character_creation/ok_button.png");
		ContentManager.load("texture","textures/character_creation/ok_button_hover.png");

		this._characterCreation = new CharacterCreation();
	}

	this.update = function(dt)
	{
		this._characterCreation.update(dt);

		if (Keyboard.isPressed("Escape"))
		{
			StateManager.switchState(MenuState);
		}
	}

	this.draw = function(dt)
	{
		Game.render(this._camera);
	}

	this.destroy = function()
	{
		ContentManager.unload("texture","textures/characters/hero/hero.png");
		for (var i = 1; i <= 5; ++i)
		{
			ContentManager.unload("texture","textures/characters/hero/hero_hair_" + String(i) + ".png");
		}
		ContentManager.unload("texture","textures/character_creation/background.png");
		ContentManager.unload("texture","textures/character_creation/rgb_slider.png");
		ContentManager.unload("texture","textures/character_creation/selected_class.png");
		ContentManager.unload("texture","textures/character_creation/selection.png");
		ContentManager.unload("texture","textures/character_creation/selection_hair.png");
		ContentManager.unload("texture","textures/character_creation/selected_hair.png");
		ContentManager.unload("texture","textures/character_creation/tooltip.png");
		ContentManager.unload("texture","textures/character_creation/ok_button.png");
		ContentManager.unload("texture","textures/character_creation/ok_button_hover.png");
	}

	this.reload = function()
	{
		this._characterCreation = new CharacterCreation();
	}
}