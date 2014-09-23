require("js/character_creation/rgb_slider");

require("js/data_files/character");
require("js/data_files/classes");

var CharacterCreation = function()
{
	this._okButton = Widget.new();
	this._background = Widget.new();
	this._fade = Widget.new();
	this._hero = Widget.new();
	this._selectedClass = Widget.new();
	this._selection = Widget.new();
	this._shouldQuit = false;

	this._toolTip = Widget.new();
	this._tipArea = undefined;

	this._sliders = [];

	this._selectionAreas = [];
	this._class = "warrior";

	this._fadeTimer = 0;
	this._timer = 0;

	this._rgbNumbers = [];
	this._statNumbers = [];

	this._destroyed = false;

	this._hairSlots = [];

	Log.debug("Started creating the character creation menu");

	this.initialise = function()
	{
		var characterCreation = this;

		this._fade.spawn();
		this._fade.setBlend(0,0,0);
		this._fade.setOffset(-0.5,0,-0.5);
		this._fade.setScale(640,0,480);
		this._fade.setAlpha(1);
		this._fade.setTranslation(0,0,1000);

		this._toolTip.spawn();
		this._toolTip.setTexture("textures/character_creation/tooltip.png");
		this._toolTip.setScale(320,0,387);
		this._toolTip.setOffset(-0.5,0,-0.5);
		this._toolTip.setTranslation(10,-6,101);
		this._toolTip.setAlpha(0);

		this._okButton.spawn();
		this._okButton.setTexture("textures/character_creation/ok_button.png");
		this._okButton.setScale(36,0,16);
		this._okButton.setTranslation(160,-175,0);

		this._okButton.mouseArea = new MouseArea(124,-175,36,16);
		
		var okButton = this._okButton;
		this._okButton.mouseArea.on("enter",function()
		{
			okButton.setTexture("textures/character_creation/ok_button_hover.png");
		});

		this._okButton.mouseArea.on("leave",function()
		{
			okButton.setTexture("textures/character_creation/ok_button.png");
		});


		this._okButton.mouseArea.on("released",function()
		{
			characterCreation._shouldQuit = true;
		});

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
			number.setTranslation(162,7-i*19,100);

			this._rgbNumbers.push(number);
		}

		for (var i = 0; i < 5; ++i)
		{
			var mouseArea = new MouseArea(-132,-45-19*i,72,19);

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
				Character.class = characterCreation._class;

				characterCreation.changeStats();
			});

			this._selectionAreas.push(mouseArea);
		}

		this._hero.spawn();
		this._hero.setTexture("textures/characters/hero/hero.png");
		this._hero.setScale(32,0,32);
		this._hero.setOffset(-0.5,0,-0.5);

		var hair = Widget.new();
		hair.setScale(32,0,32);
		hair.setAlpha(0);
		hair.setOffset(-0.5,0,-0.5);
		hair.spawn();

		this._hero.hair = hair;

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
		this._background.setTranslation(0,0,-10);

		for (var i = 1; i <= 5; ++i)
		{
			var hair = Widget.new();
			hair.setTranslation(-19+(i-1)*37,-130,5);
			hair.setScale(32,0,32);
			hair.setTexture("textures/characters/hero/hero_hair_" + String(i) + ".png");
			hair.spawn();

			var selection = Widget.new();
			selection.setTranslation(-17+(i-1)*37,-130,10);
			selection.setScale(36,0,36);
			selection.setTexture("textures/character_creation/selection_hair.png");
			selection.spawn();
			selection.setAlpha(0);

			var selected = Widget.new();
			selected.setTranslation(-17+(i-1)*37,-130,10);
			selected.setScale(36,0,36);
			selected.setTexture("textures/character_creation/selected_hair.png");
			selected.spawn();
			selected.setAlpha(0);

			hair.selected = selected;
			hair.selection = selection;
			hair.idx = i;

			var mouseArea = new MouseArea(-36-19+(i-1)*37, -130, 36, 36, hair);

			hair.mouseArea = mouseArea;

			mouseArea.on("enter", function(self)
			{
				self.selection.setAlpha(1);
			});

			mouseArea.on("leave", function(self)
			{
				self.selection.setAlpha(0);
			});

			var characterCreation = this;
			mouseArea.on("released", function(self)
			{
				var change = true;
				if (self.selected.alpha() == 1)
				{
					characterCreation.changeHair(0);
					self.selected.setAlpha(0);
					change = false;
				}
				characterCreation.clearHairSelection();

				if (change == true)
				{
					characterCreation.changeHair(self.idx);
					self.selected.setAlpha(1);
				}
			});

			this._hairSlots.push(hair);
		}

		this.changeStats();

		Log.success("Succesfully created the character creation menu");
	}

	this.changeHair = function(idx)
	{
		this._hero.hair.setAlpha(1);
		switch(idx)
		{
			case 0:
				this._hero.hair.setAlpha(0);
				break;
			default:
				this._hero.hair.setTexture("textures/characters/hero/hero_hair_" + String(idx) + ".png");
				break;
		}
	}

	this.clearHairSelection = function()
	{
		for (var i = 0; i < this._hairSlots.length; ++i)
		{
			this._hairSlots[i].selected.setAlpha(0);
		}
	}

	this.changeStats = function()
	{
		var stats = Classes[Character.class].stats;
		this._statNumbers[0].setValue(stats.attackDamage);
		this._statNumbers[1].setValue(stats.magicDamage);
		this._statNumbers[2].setValue(stats.rangedDamage);
		this._statNumbers[3].setValue(stats.defense);
		this._statNumbers[4].setValue(stats.stamina);
	}

	this.update = function(dt)
	{
		if (this._shouldQuit == false)
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

			this._hero.setTranslation(0,55+Math.sin(this._timer)*5,10);
			this._hero.hair.setTranslation(0,55+Math.sin(this._timer)*5,11);

			for (var i = 0; i < this._sliders.length; ++i)
			{
				this._sliders[i].update(dt);
				this._rgbNumbers[i].setValue(Math.floor((this._sliders[i].value()*255/0.8)));
			}

			this._hero.setBlend(0.2+this._sliders[0].value(),0.2+this._sliders[1].value(),0.2+this._sliders[2].value());
			var blend = this._hero.blend();

			Character.blend[0] = blend.r;
			Character.blend[1] = blend.g;
			Character.blend[2] = blend.b;
		}
		else if (this._destroyed == false)
		{
			if (this._fadeTimer > 0)
			{
				this._fadeTimer -= dt;
				if (this._fadeTimer < 0)
				{
					this._fadeTimer = 0;
				}
				this._fade.setAlpha(Math.lerp(1,0,this._fadeTimer));
			}
			else
			{
				this._destroyed = true;
				StateManager.switchState(LevelState);
			}
		}
	}

	this.initialise();
}