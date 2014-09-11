var GuiNumber = function()
{
	this._numberString = "";
	this._guiElements = [];
	this._root = Widget.new();

	this.setValue = function(number)
	{
		if (typeof(number) === "string")
		{
			this._numberString = number;
		}
		else
		{
			this._numberString = String(number);
		}

		for (var i = 0; i < this._numberString.length; ++i)
		{
			var guiElement = undefined;
			if (i > this._guiElements.length-1)
			{
				guiElement = Widget.new(this._root);

				guiElement.setTranslation(i*6,0,100);
				guiElement.setScale(5,0,7);
				guiElement.setTexture("textures/misc/number_strip.png");
				guiElement.setShader("shaders/number.fx");
				guiElement.setName("DebugNumberTest_" + String(i));

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
					val = 1/11;
					break;
				case "2":
					val = 2/11;
					break;
				case "3":
					val = 3/11;
					break;
				case "4":
					val = 4/11;
					break;
				case "5":
					val = 5/11;
					break;
				case "6":
					val = 6/11;
					break;
				case "7":
					val = 7/11;
					break;
				case "8":
					val = 8/11;
					break;
				case "9":
					val = 9/11;
					break;
				case "/":
					val = 10/11;
					break;
			}
			
			guiElement.setUniform("float","StripCoordinate",val);
		}
		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].spawn();
		}

		if (this._guiElements.length > this._numberString.length)
		{
			var toRemove = this._guiElements.length - this._numberString.length;

			for (var i = this._guiElements.length-1; i > this._guiElements.length-1-toRemove; --i)
			{
				this._guiElements[i].destroy();
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

	this.setAlpha = function(a)
	{
		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].setAlpha(a);
		}
	}
}