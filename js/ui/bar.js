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

	this.initialise = function()
	{
		this._root = Widget.new();
		this._root.setTranslation(this._x,this._y,80);

		this._indicator = Widget.new(this._root);
		this._indicator.setScale(17,0,17);

		this._indicator.setTranslation(0,0,80);

		switch(this._type)
		{
			case UIBarType.HP:
				this._indicator.setTexture("textures/ui/hp_icon.png");
				break;
			case UIBarType.Stamina:
				this._indicator.setTexture("textures/ui/stamina_icon.png");
				break;
			case UIBarType.Mana:
				this._indicator.setTexture("textures/ui/mana_icon.png");
				break;
		}

		this._number = new GuiNumber(this._root);
		this._number.setValue("100/100");
		this._number.setTranslation(50,0,80);

		this._indicator.spawn();
	}

	this.initialise();
}