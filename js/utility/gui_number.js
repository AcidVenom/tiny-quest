enumerator("NumberAlign", [
	"Left",
	"Right"]);

var GuiNumber = function(parent)
{
	this._numberString = "";
	this._guiElements = [];
	this._alpha = 1;
	this._align = NumberAlign.Left;
	this._translation = {x: 0, y: 0, z: 0}
	this._blend = {r: 1, g: 1, b: 1}

	if (parent !== undefined)
	{
		this._root = Widget.new(parent);
	}
	else
	{
		this._root = Widget.new();
	}

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

			guiElement.setBlend(this._blend.r,this._blend.g,this._blend.b);

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
			guiElement.spawn();
		}
		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].setAlpha(1*this._alpha);
		}

		if (this._guiElements.length > this._numberString.length)
		{
			var toRemove = this._guiElements.length - this._numberString.length;

			for (var i = this._guiElements.length-1; i > this._guiElements.length-1-toRemove; --i)
			{
				this._guiElements[i].setAlpha(0)
			}
		}

		this.setTranslation(this._translation.x,this._translation.y,this._translation.z);
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

	this.root = function()
	{
		return this._root;
	}

	this.setTranslation = function(x,y,z)
	{
		this._translation = {x: x, y: y, z: z};

		if (this._align == NumberAlign.Left)
		{
			this._root.setTranslation(x,y,z);
		}
		else
		{
			this._root.setTranslation(6+x-this._numberString.length*6,y,z);
		}

		for (var i = 0; i < this._guiElements.length; ++i)
		{
			var trans = this._guiElements[i].translation();

			this._guiElements[i].setTranslation(trans.x,trans.y,z);
		}
	}

	this.setBlend = function(r,g,b)
	{
		this._blend = {r: r, g: g, b: b}
		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].setBlend(r,g,b);
		}
	}

	this.setAlpha = function(a)
	{
		this._alpha = a;
		for (var i = 0; i < this._guiElements.length; ++i)
		{
			this._guiElements[i].setAlpha(a);
		}
	}

	this.setAlign = function(align)
	{
		this._align = align;
	}
}