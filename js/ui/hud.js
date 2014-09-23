require("js/ui/bar");

var HUD = function(player)
{
	this._barFrame = undefined;
	this._bars = [];
	this._player = player;

	this.initialise = function()
	{
		this._barFrame = Widget.new();
		this._barFrame.setScale(303,0,56);
		this._barFrame.setTexture("textures/ui/frames.png");
		this._barFrame.setAnchorLeft();
		this._barFrame.setAnchorTop();
		this._barFrame.setTranslation(20,-20,0);
		this._barFrame.spawn();

		for (var i = 0; i < 3; ++i)
		{
			this._bars.push(new UIBar(-242,272+i*-20,i));
		}
	}

	this.barAt = function(idx)
	{
		return this._bars[idx];
	}

	this.update = function(dt)
	{
		this._bars[0].setMinMax(this._player.health(),this._player.maxHealth());
		this._bars[1].setMinMax(this._player.stamina(),this._player.maxStamina());
		this._bars[2].setMinMax(this._player.mana(),this._player.maxMana());
	}

	this.destroy = function()
	{
		this._barFrame.destroy();

		for (var i = 0; i < this._bars.length; ++i)
		{
			this._bars[i].destroy();
		}
	}

	this.initialise();
}