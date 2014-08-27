require("js/character_creation/character_creation");

var CharacterCreationState = {
	name: "Character Creation",

	_characterCreation: undefined,
	_camera: Camera.new("orthographic"),

	initialise: function()
	{
		ContentManager.load("texture","textures/characters/hero/hero.png");
		ContentManager.load("texture","textures/character_creation/background.png");
		ContentManager.load("texture","textures/character_creation/rgb_slider.png");
		ContentManager.load("texture","textures/character_creation/selected_class.png");
		ContentManager.load("texture","textures/character_creation/selection.png");
		ContentManager.load("texture","textures/character_creation/tooltip.png");

		this._characterCreation = new CharacterCreation();
	},

	update: function(dt)
	{
		this._characterCreation.update(dt);
	},

	draw: function(dt)
	{
		Game.render(this._camera);
	},

	destroy: function()
	{
		this._characterCreation = null;
		this._camera = null;

		ContentManager.unload("texture","textures/characters/hero/hero.png");
		ContentManager.unload("texture","textures/character_creation/background.png");
		ContentManager.unload("texture","textures/character_creation/rgb_slider.png");
		ContentManager.unload("texture","textures/character_creation/selected_class.png");
		ContentManager.unload("texture","textures/character_creation/selection.png");
		ContentManager.unload("texture","textures/character_creation/tooltip.png");
	},

	reload: function()
	{
		MouseEventManager.clear();
		this._characterCreation = new CharacterCreation();
	}
}