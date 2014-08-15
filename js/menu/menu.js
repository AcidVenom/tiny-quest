var Menu = function()
{
	this._logoScale = 0;
	this._timer = -1;

	Log.debug("Started creating the menu");

	this._logo = Widget.new();
	this._background = Widget.new();
	
	this._clouds = [];

	this.initialise = function()
	{
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
			
			cloud.setTexture("textures/menu/cloud_" + String(i+1) + ".png");
			cloud.spawn();

			switch(i)
			{
				case 0:
					cloud.setScale(156,0,81);
					break;
				case 1:
					cloud.setScale(63,0,22);
					break;
				case 2:
					cloud.setScale(123,0,58);
					break;
			}

			cloud.setOffset(-0.5,0,-0.5);
			cloud.setTranslation(-200 + i*200,100+Math.random()*100,0);
		}

		this._background.setTexture("textures/menu/background.png");
		this._background.spawn();
		this._background.setScale(640,0,480);
		this._background.setOffset(-0.5,0,-0.5);

		Log.success("Created the menu");
	}

	this.update = function(dt)
	{
		if (this._timer < 1 && this._timer > 0)
		{
			this._logo.setAlpha(this._timer*2);
			this._logoScale = Math.easeOutElastic(this._timer,0,1,1);
			this._logo.setScale(372*this._logoScale,0,104*this._logoScale);
		}

		this._timer += dt*1.5;

		for (var i = 0; i < this._clouds.length; ++i)
		{
			var cloud = this._clouds[i];
			var translation = cloud.translation();

			cloud.setTranslation(translation.x+dt*30,translation.y,translation.z);

			if (translation.x > 400)
			{
				cloud.setTranslation(-400,100+Math.random()*100,translation.z);
			}
		}
	}

	this.initialise();
}