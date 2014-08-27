require("js/character_creation/rgb_slider");

var CharacterCreation = function()
{
	this._background = Widget.new();
	this._fade = Widget.new();
	this._hero = Widget.new();
	this._selectedClass = Widget.new();
	this._selection = Widget.new();

	this._toolTip = Widget.new();
	this._tipArea = undefined;

	this._sliders = [];

	this._selectionAreas = [];
	this._class = "warrior";

	this._fadeTimer = 0;
	this._timer = 0;

	this._rgbNumbers = [];
	this._statNumbers = [];

	Log.debug("Started creating the character creation menu");

	this.initialise = function()
	{
		this._toolTip.spawn();
		this._toolTip.setTexture("textures/character_creation/tooltip.png");
		this._toolTip.setScale(320,0,387);
		this._toolTip.setOffset(-0.5,0,-0.5);
		this._toolTip.setTranslation(10,-6,0);
		this._toolTip.setAlpha(0);

		for (var i = 0; i < 5; ++i)
		{
			var number = new GuiNumber();
			number.setValue(0);
			number.setTranslation(34,241-i*17,0);

			switch(i)
			{
				case 0:
					number.setBlend(1,180/255,0);
					break;
				case 1:
					number.setBlend(0,126/255,1);
					break;
				case 2:
					number.setBlend(92/255,158/255,33/255);
					break;
				case 3:
					number.setBlend(222/255,1,0);
					break;
				case 4:
					number.setBlend(1,0,0);
					break;
			}
			this._statNumbers.push(number);
		}

		for (var i = 0; i < 3; ++i)
		{
			var number = new GuiNumber();
			number.setValue(255);
			number.setTranslation(162,7-i*19,0);

			this._rgbNumbers.push(number);
		}

		for (var i = 0; i < 5; ++i)
		{
			var mouseArea = new MouseArea(-132,-45-19*i,72,19);
			var characterCreation = this;

			var hover = undefined;
			var release = undefined;

			switch (i)
			{
				case 0:
					hover = function(){ characterCreation._selection.setTranslation(-132,-45,0); }
					release = function()
					{ 
						characterCreation._selectedClass.setTranslation(-129,-43,0);
						characterCreation._class = "warrior";
					}
					break;
				case 1:
					hover = function(){ characterCreation._selection.setTranslation(-132,-64,0); }
					release = function()
					{ 
						characterCreation._selectedClass.setTranslation(-129,-62,0); 
						characterCreation._class = "thief";
					}
					break;
				case 2:
					hover = function(){ characterCreation._selection.setTranslation(-132,-83,0); }
					release = function()
					{ 
						characterCreation._selectedClass.setTranslation(-129,-81,0); 
						characterCreation._class = "wizard";
					}
					break;
				case 3:
					hover = function(){ characterCreation._selection.setTranslation(-132,-102,0); }
					release = function()
					{ 
						characterCreation._selectedClass.setTranslation(-129,-100,0);
						characterCreation._class = "newborn"; 
					}
					break;
				case 4:
					hover = function(){ characterCreation._selection.setTranslation(-132,-121,0); }
					release = function()
					{ 
						characterCreation._selectedClass.setTranslation(-129,-119,0); 
						characterCreation._class = "hardcore";
					}
					break;
			}

			mouseArea.on("enter",hover);
			mouseArea.on("enter",function()
			{
				characterCreation._selection.setAlpha(1);
			})

			mouseArea.on("leave",function()
			{
				characterCreation._selection.setAlpha(0);
			});

			mouseArea.on("released",release);
			mouseArea.on("released",function()
			{
				Log.info("New selected class is: " + characterCreation._class);
			})

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

		var characterCreation = this;
		this._tipArea = new MouseArea(42,209,12,11);

		this._tipArea.on("enter",function()
		{
			characterCreation._toolTip.setAlpha(1);
		});

		this._tipArea.on("leave",function()
		{
			characterCreation._toolTip.setAlpha(0);
		});


		for (var i = 0; i < 3; ++i)
		{
			this._sliders.push(new RgbSlider(i));
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

		for (var i = 0; i < this._sliders.length; ++i)
		{
			this._sliders[i].update(dt);
			this._rgbNumbers[i].setValue(Math.floor((this._sliders[i].value()*255/0.8)));
		}

		this._hero.setBlend(0.2+this._sliders[0].value(),0.2+this._sliders[1].value(),0.2+this._sliders[2].value());
	}

	this.initialise();
}