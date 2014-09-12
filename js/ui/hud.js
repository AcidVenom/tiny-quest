require("js/ui/bar");

var HUD = function()
{
	this._barFrame = undefined;
	this._bars = [];

	this.initialise = function()
	{
		this._barFrame = Widget.new();
		this._barFrame.setScale(128,0,56);
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

	this.initialise();
}