var RgbSlider = function(idx)
{
	this._height = 0;
	this._value = 0.8;

	switch(idx)
	{
		case 0:
			this._height = -44;
			break;
		case 1:
			this._height = -63;
			break;
		case 2:
			this._height = -82;
			break;
	}

	this._slider = Widget.new();
	this._mouseArea = undefined;
	this._held = false;

	this.initialise = function()
	{
		this._slider.setTexture("textures/character_creation/rgb_slider.png");
		this._slider.setScale(7,0,18);
		this._slider.spawn();
		this._slider.setTranslation(97,this._height,0);

		this._mouseArea = new MouseArea(87,this._height,10,18);

		var slider = this;

		this._mouseArea.on("pressed",function()
		{
			slider._held = true;
		});
	}

	this.value = function()
	{
		return this._value;
	}

	this.update = function(dt)
	{
		if (this._held == true)
		{
			if (!Mouse.isDown(0))
			{
				this._held = false;
			}
			else
			{
				var pos = Mouse.relativePosition();
				if (pos.x > 92)
				{
					pos.x = 92;
				}

				if (pos.x < -37)
				{
					pos.x = -37;
				}

				this._value = (pos.x + 37) / 129 * 0.8;

				this._slider.setTranslation(pos.x+5,this._height,0);
				this._mouseArea.setPosition(pos.x+5-10,this._height,0);
			}
		}
	}

	this.destroy = function()
	{
		this._slider.destroy();
		this._slider = null;
	}

	this.initialise();
}