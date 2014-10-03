require("js/ui/bar");

var HUD = function(player)
{
	this._barFrame = undefined;
	this._overlay = undefined;
	this._bars = [];
	this._player = player;
	this._overlayVisible = false;
	this._inventorySlots = [];
	this._inventory = undefined;

	this.initialise = function()
	{
		this._barFrame = Widget.new();
		this._barFrame.setScale(303,0,84);
		this._barFrame.setTexture("textures/ui/frames.png");
		this._barFrame.setAnchorLeft();
		this._barFrame.setAnchorTop();
		this._barFrame.setTranslation(20,-20,0);
		this._barFrame.spawn();

		this._overlay = Widget.new();
		this._overlay.setScale(640,0,480);
		this._overlay.setAlpha(0);
		this._overlay.setOffset(-0.5,-0.5,-0.5);
		this._overlay.setTranslation(0,0,800);
		this._overlay.setBlend(0,0,0);
		this._overlay.spawn();

		this._inventory = Widget.new();
		this._inventory.setScale(366,0,150);
		this._inventory.setTexture("textures/ui/inventory_ui.png");

		for (var i = 0; i < 10; ++i)
		{
			var slot = Widget.new(this._inventory);
			slot.setScale(38,0,38);
			slot.setTexture("textures/ui/inventory_slot.png");
			slot.setAlpha(0);
			slot.spawn();

			var mouseArea = new MouseArea(-300+7+i*40,69,38,38,slot);

			mouseArea.on("enter",function(callee)
			{
				if (callee.alpha() > 0)
				{
					callee.setTexture("textures/ui/inventory_slot_selected.png");
				}
			});

			mouseArea.on("leave",function(callee)
			{
				callee.setTexture("textures/ui/inventory_slot.png");
			});

			if (i <= 4)
			{
				slot.setTranslation(7+i*40,80,900);
			}
			else
			{
				slot.setTranslation(7+(i-5)*40,40,900);
				mouseArea.setPosition(-300+7+(i-5)*40,29);
			}

			slot.mouseArea = mouseArea;

			var item = Widget.new(slot);

			item.setScale(32,0,32);
			item.setBlend(1,0,0);
			item.setAlpha(0);
			item.spawn();

			item.setTranslation(3,3,910);

			slot.item = item;

			this._inventorySlots.push(slot);
		}

		this._inventory.setAnchorLeft();
		this._inventory.setTranslation(20,100,890);
		this._inventory.spawn();
		this._inventory.setAlpha(0);

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

		for (var i = 0; i < 10; ++i)
		{
			var inventory = this._player.inventory();
			var slot = inventory.getSlot(i);

			if (!slot.free())
			{
				this._inventorySlots[i].item.setAlpha(this._inventory.alpha());
			}
			else
			{
				this._inventorySlots[i].item.setAlpha(0);
			}
		}
	}

	this.destroy = function()
	{
		this._barFrame.destroy();

		for (var i = 0; i < this._bars.length; ++i)
		{
			this._bars[i].destroy();
		}
	}

	this.toggleOverlay = function()
	{
		this._overlayVisible = !this._overlayVisible;
		if (this._overlayVisible == true)
		{
			this._overlay.setAlpha(0.7)
			for (var i = 0; i < this._inventorySlots.length; ++i)
			{
				this._inventorySlots[i].setAlpha(1);
			}
			this._inventory.setAlpha(1);
		}
		else
		{
			this._overlay.setAlpha(0);
			for (var i = 0; i < this._inventorySlots.length; ++i)
			{
				this._inventorySlots[i].setAlpha(0);
			}
			this._inventory.setAlpha(0);
		}
	}

	this.initialise();
}