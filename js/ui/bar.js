enumerator("UIBarType",[
	"HP",
	"Stamina",
	"Mana"]);

var UIBar = function(x,y,type)
{
	this._x = x;
	this._y = y;
	this._root = undefined;
	this._indicator = undefined;
	this._bar = undefined;
	this._number = undefined;
	this._type = type;

	this.setMinMax = function(min,max)
	{
		this._number.setValue(String(min) + "/" + String(max));
		this._bar.setScale(min/max*122,0,10);
	}

	this.initialise = function()
	{
		this._root = Widget.new();
		this._root.setTranslation(this._x,this._y,80);

		this._indicator = Widget.new(this._root);
		this._indicator.setScale(17,0,17);
		this._indicator.setOffset(0.5,0.5,0.5);
		this._indicator.setTranslation(10,10,80);

		this._bar = Widget.new(this._root);
		this._bar.setScale(122,0,10);
		this._bar.spawn();
		this._bar.setTranslation(9,-1,75);

		this._number = new GuiNumber(this._root);
		this._number.setValue("100/100");
		this._number.setTranslation(50,0,78);

		switch(this._type)
		{
			case UIBarType.HP:
				this._indicator.setTexture("textures/ui/hp_icon.png");
				this._bar.setTexture("textures/ui/hp_bar.png");
				break;
			case UIBarType.Stamina:
				this._indicator.setTexture("textures/ui/stamina_icon.png");
				this._bar.setTexture("textures/ui/stamina_bar.png");
				break;
			case UIBarType.Mana:
				this._indicator.setTexture("textures/ui/mana_icon.png");
				this._bar.setTexture("textures/ui/mana_bar.png");
				break;
		}

		this._indicator.spawn();
	}

	this.indicator = function()
	{
		return this._indicator;
	}

	this.initialise();
}