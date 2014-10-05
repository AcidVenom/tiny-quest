require("js/character_creation/character_creation_state");

var Menu = function()
{
	this._nightObjects = [];
	this._logoScale = 0;
	this._timer = -1;
	this._nightTimer = 0;

	this._transition = false;
	this._shouldQuit = false;

	Log.debug("Started creating the menu");

	this._logo = Widget.new();

	this._background = Widget.new();
	this._background.night = Widget.new();

	this._fade = Widget.new();
	
	this._clouds = [];
	this._destroyed = false;

	this.initialise = function()
	{
		this._fade.spawn();
		this._fade.setBlend(0,0,0.5);
		this._fade.setOffset(-0.5,0,-0.5);
		this._fade.setScale(640,0,480);
		this._fade.setAlpha(0);

		this._logo.setTexture("textures/menu/logo.png");
		this._logo.spawn();
		this._logo.setOffset(-0.5,0,-0.5);
		this._logo.setAnchorTop();
		this._logo.setTranslation(0,-100,0);
		this._logo.setScale(0,0,0);

		this._clouds = [];

		for (var i = 0; i < 3; ++i)
		{
			this._clouds.push(Widget.new());
			var cloud = this._clouds[this._clouds.length-1];
			
			cloud.night = Widget.new();
			cloud.night.setTexture("textures/menu/cloud_" + String(i+1) + "_night.png");
			cloud.night.spawn();

			cloud.setTexture("textures/menu/cloud_" + String(i+1) + ".png");
			cloud.spawn();

			switch(i)
			{
				case 0:
					cloud.setScale(156,0,81);
					cloud.night.setScale(156,0,81);
					break;
				case 1:
					cloud.setScale(63,0,22);
					cloud.night.setScale(63,0,22);
					break;
				case 2:
					cloud.setScale(123,0,58);
					cloud.night.setScale(123,0,58);
					break;
			}

			cloud.setOffset(-0.5,0,-0.5);
			cloud.night.setOffset(-0.5,0,-0.5);

			cloud.setTranslation(-200 + i*200,100+Math.random()*100,0);
			cloud.night.setTranslation(-200 + i*200,100+Math.random()*100,0);

			cloud.night.setAlpha(0);
			
			this._nightObjects.push(cloud.night);
		}

		this._background.night.setTexture("textures/menu/background_night.png");
		this._background.night.spawn();
		this._background.night.setScale(640,0,480);
		this._background.night.setOffset(-0.5,0,-0.5);
		this._background.night.setAlpha(0);

		this._nightObjects.push(this._background.night);

		this._background.setTexture("textures/menu/background.png");
		this._background.spawn();
		this._background.setScale(640,0,480);
		this._background.setOffset(-0.5,0,-0.5);

		Log.debug("Created the menu");
	}

	this.update = function(dt)
	{
		for (var i = 0; i < this._clouds.length; ++i)
		{
			var cloud = this._clouds[i];
			var translation = cloud.translation();

			cloud.setTranslation(translation.x+dt*30,translation.y,translation.z);

			if (translation.x > 400)
			{
				cloud.setTranslation(-400,100+Math.random()*100,translation.z);
			}

			translation = cloud.translation();

			cloud.night.setTranslation(translation.x,translation.y,translation.z);
		}

		if (!this._shouldQuit)
		{
			this._nightTimer += dt;

			for (var i = 0; i < this._nightObjects.length; ++i)
			{
				this._nightObjects[i].setAlpha(Math.abs(Math.sin(this._nightTimer/5)));
			}

			if (this._timer < 1 && this._timer > 0)
			{
				this._logo.setAlpha(this._timer*2);
				this._logoScale = Math.easeOutElastic(this._timer,0,1,1);
				this._logo.setScale(372*this._logoScale,0,104*this._logoScale);
			}

			this._timer += dt*1.5;

			if (Keyboard.isReleased("Enter") && this._timer > 1)
			{
				this._transition = true;
				this._shouldQuit = true;
				this._timer = 0;
			}
		}
		else
		{
			this._timer += dt;
			var lerp = Math.lerp(0,1,this._timer);

			if (lerp > 1)
			{
				lerp = 1;
			}

			if (this._transition)
			{
				this._logo.setAlpha(1-lerp*2);

				for (var i = 0; i < this._clouds.length; ++i)
				{
					var cloud = this._clouds[i];
					cloud.setAlpha(1-lerp*2);
					cloud.night.setAlpha(Math.abs(Math.sin(this._nightTimer/5))*(1-lerp*2));
				}

				if (this._timer > 0.5)
				{
					this._timer = 0;
					this._transition = false;
				}
			}
			else
			{
				this._fade.setAlpha(lerp);
				this._fade.setBlend(0,0,0.5*Math.lerp(1,0,this._timer));

				this._background.setScale(640*(1+lerp*3),0,480*(1+lerp*3));
				this._background.night.setScale(640*(1+lerp*3),0,480*(1+lerp*3));
			
				if (this._timer > 1)
				{
					this.destroy();
				}
			}	
		}
	}

	this.destroy = function()
	{
		StateManager.switchState(CharacterCreationState);
		Log.debug("Destroyed the menu");
	}

	this.initialise();
}