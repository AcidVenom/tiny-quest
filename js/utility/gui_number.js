var GuiNumber = function()
{
	this._numberString = "0";
	this._guiElements = [];
	this._root = Widget.new();

	this.setValue = function(number)
	{
		this._numberString = String(number);

		for (var i = 0; i < this._numberString.length; ++i)
		{
			var guiElement = undefined;
			if (i > this._guiElements.length-1)
			{
				guiElement = Widget.new(this._root);

				guiElement.setTranslation(i*6,0,0);
				guiElement.setScale(5,0,7);
				guiElement.setTexture("textures/misc/number_strip.png");
				guiElement.setShader("shaders/number.fx");
				guiElement.spawn();

				this._guiElements.push(guiElement);
			}
			else
			{
				guiElement = this._guiElements[i];
			}

			var val = 0;

			switch (this._numberString.charAt(i))
			{
				case "1":
					val = 0.1;
					break;
				case "2":
					val = 0.2;
					break;
				case "3":
					val = 0.3;
					break;
				case "4":
					val = 0.4;
					break;
				case "5":
					val = 0.5;
					break;
				case "6":
					val = 0.6;
					break;
				case "7":
					val = 0.7;
					break;
				case "8":
					val = 0.8;
					break;
				case "9":
					val = 0.9;
					break;
			}

			guiElement.setUniform("float","StripCoordinate",val);
		}

		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].setAlpha(1);
		}

		if (this._guiElements.length > this._numberString.length)
		{
			var toRemove = this._guiElements.length - this._numberString.length;

			for (var i = this._guiElements.length-1; i > this._guiElements.length-1-toRemove; --i)
			{
				this._guiElements[i].setAlpha(0);
			}
		}
	}

	this.destroy = function()
	{
		this._root.destroy();
		this._root = null;

		for (var i = 0; i < this._guiElements.length; ++i)
		{
			var guiElement = this._guiElements[i];
			guiElement.destroy();
			guiElement = null;
		}

		this._guiElements = [];
	}

	this.setTranslation = function(x,y,z)
	{
		this._root.setTranslation(x,y,z);
	}

	this.setBlend = function(r,g,b)
	{
		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].setBlend(r,g,b);
		}
	}
}