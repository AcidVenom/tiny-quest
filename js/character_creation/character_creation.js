var CharacterCreation = function()
{
	this._background = Widget.new();
	this._fade = Widget.new();
	this._hero = Widget.new();
	this._selectedClass = Widget.new();
	this._selection = Widget.new();
	this._sliders = [];

	this._selectionAreas = [];

	this._fadeTimer = 0;
	this._timer = 0;

	Log.debug("Started creating the character creation menu");

	this.initialise = function()
	{
		for (var i = 0; i < 5; ++i)
		{
			var mouseArea = new MouseArea(-132,-45-19*i,72,19);
			var characterCreation = this;

			var hover = undefined;

			var leave = function()
			{
				characterCreation._selection.setAlpha(0);
			}

			switch (i)
			{
				case 0:
					hover = function()
					{
						characterCreation._selection.setTranslation(-132,-45,0);
					}
					break;
				case 1:
					hover = function()
					{
						characterCreation._selection.setTranslation(-132,-64,0);
					}
					break;
				case 2:
					hover = function()
					{
						characterCreation._selection.setTranslation(-132,-83,0);
					}
					break;
				case 3:
					hover = function()
					{
						characterCreation._selection.setTranslation(-132,-102,0);
					}
					break;
				case 4:
					hover = function()
					{
						characterCreation._selection.setTranslation(-132,-121,0);
					}
					break;
			}

			mouseArea.on("enter",hover);
			mouseArea.on("enter",function()
			{
				characterCreation._selection.setAlpha(1);
			})

			mouseArea.on("leave",leave);

			this._selectionAreas.push(mouseArea);
		}

		this._fade.spawn();
		this._fade.setBlend(0,0,0);
		this._fade.setOffset(-0.5,0,-0.5);
		this._fade.setScale(640,0,480);
		this._fade.setAlpha(1);

		this._hero.spawn();
		this._hero.setTexture("textures/characters/hero/hero.png");
		this._hero.setScale(32,0,32);
		this._hero.setOffset(-0.5,0,-0.5);

		for (var i = 0; i < 3; ++i)
		{
			var slider = Widget.new();
			slider.setTexture("textures/character_creation/rgb_slider.png");
			slider.setScale(7,0,18);
			slider.spawn();
			slider.setTranslation(97,-44-i*19,0);

			this._sliders.push(slider);
		}

		this._selectedClass.spawn();
		this._selectedClass.setScale(21,0,20);
		this._selectedClass.setTexture("textures/character_creation/selected_class.png");
		this._selectedClass.setTranslation(-129,-43,0);

		this._selection.spawn();
		this._selection.setScale(72,0,16);
		this._selection.setTexture("textures/character_creation/selection.png");
		this._selection.setOffset(-1,0,0);
		this._selection.setTranslation(-132,-45,0);

		this._background.spawn();
		this._background.setTexture("textures/character_creation/background.png");
		this._background.setOffset(-0.5,0,-0.5);
		this._background.setScale(640,0,480);

		Log.success("Succesfully created the character creation menu");
	}

	this.update = function(dt)
	{
		if (this._fadeTimer < 1)
		{
			this._fadeTimer += dt;
			this._fade.setAlpha(Math.lerp(1,0,this._fadeTimer));
		}

		if (this._timer < Math.PI)
		{
			this._timer += dt*4;
		}
		else
		{
			this._timer = 0;
		}

		this._hero.setTranslation(0,55+Math.sin(this._timer)*5,0);
	}

	this.initialise();
}