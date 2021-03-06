require("js/ui/bar");
require("js/ui/inventory_slot");

enumerator("Fade", [
	"In",
	"Out"]);

var HUD = function(player)
{
	this._barFrame = undefined;
	this._overlay = undefined;
	this._bars = [];
	this._player = player;
	this._overlayVisible = false;
	this._inventorySlots = [];
	this._inventory = undefined;
	this._fade = undefined;
	this._shouldFade = false;
	this._fadeTimer = 0;
	this._coinText = undefined;
	this._shop = undefined;
	this._shopItem = undefined;
	this._shopText = undefined;
	this._shopIndicator = undefined;

	this._equipmentSlots = [];

	this.player = function()
	{
		return this._player;
	}

	this.fadeIn = function()
	{
		this._shouldFade = Fade.In;
		this._fadeTimer = 0;
	}

	this.fadeOut = function()
	{
		this._shouldFade = Fade.Out;
		this._fadeTimer = 0;
	}

	this.initialise = function()
	{
		this._barFrame = Widget.new();
		this._barFrame.setScale(303,0,84);
		this._barFrame.setTexture("textures/ui/frames.png");
		this._barFrame.setAnchorLeft();
		this._barFrame.setAnchorTop();
		this._barFrame.setTranslation(20,-20,0);
		this._barFrame.spawn();

		this._shop = Widget.new();
		this._shop.setScale(68,0,60);
		this._shop.setTranslation(-20,-20,700);
		this._shop.setAnchorRight();
		this._shop.setAnchorTop();
		this._shop.spawn();
		this._shop.setTexture("textures/ui/shop_interface.png");
		this._shop.setAlpha(0);

		this._shopItem = Widget.new(this._shop);
		this._shopItem.setScale(32,0,32);
		this._shopItem.setTranslation(27,25,710);
		this._shopItem.setAlpha(0);
		this._shopItem.spawn();

		this._shopText = new GuiNumber(this._shop);
		this._shopText.setValue(1000);
		this._shopText.setTranslation(23,6,710);
		this._shopText.setAlpha(0);

		this._shopValue = new GuiNumber(this._shop);
		this._shopValue.setAlign(NumberAlign.Center);
		this._shopValue.setValue(1000);
		this._shopValue.setTranslation(42,64,710);
		this._shopValue.setAlpha(0);

		this._shopIndicator = Widget.new(this._shop);
		this._shopIndicator.setTranslation(35,-20,710);
		this._shopIndicator.setScale(15,0,14);
		this._shopIndicator.spawn();
		this._shopIndicator.setAlpha(0);

		this._overlay = Widget.new();
		this._overlay.setScale(640,0,480);
		this._overlay.setAlpha(0);
		this._overlay.setOffset(-0.5,-0.5,-0.5);
		this._overlay.setTranslation(0,0,800);
		this._overlay.setBlend(0,0,0);
		this._overlay.spawn();

		this._fade = Widget.new();
		this._fade.setScale(640,0,480);
		this._fade.setOffset(-0.5,-0.5,-0.5);
		this._fade.setTranslation(0,0,999);
		this._fade.setBlend(0,0,0);
		this._fade.spawn();

		this._inventory = Widget.new();
		this._inventory.setScale(366,0,150);
		this._inventory.setTexture("textures/ui/inventory_ui.png");

		this._coinText = new GuiNumber(this._inventory);
		this._coinText.setValue(0);
		this._coinText.root().setAnchorBottom();
		this._coinText.setTranslation(97,28,1000);
		this._coinText.setBlend(1,1,1);
		this._coinText.setAlpha(0);

		for (var i = 0; i < 10; ++i)
		{
			var slot = new InventorySlotUI(this._inventory);
			slot.widget().idx = i;
			var mouseArea = new MouseArea(-300+7+i*40,69,38,38,slot.widget());

			mouseArea.on("down", function(callee)
			{
				if (callee.hidden == false)
				{
					callee.setAlpha(0.7);
				}
			});

			var hud = this;
			mouseArea.on("released", function(callee)
			{
				if (callee.hidden == false)
				{
					callee.setAlpha(1);
					var item = hud.player().inventory().getSlot(callee.idx).item();
					if (item !== undefined)
					{
						item.apply(hud.player());

						if (item.type() == ItemType.Equip)
						{
							if(hud.player().equipment().addItem(item) == true)
							{
								hud.player().inventory().removeItemByItem(item);
							}
							else
							{
								var secondItem = hud.player().equipment().getSlot(item.slot()).item();
								hud.player().inventory().removeItemByItem(item);
								hud.player().equipment().removeItem(item.slot());
								hud.player().inventory().addItem(secondItem);
								hud.player().equipment().addItem(item);
							}
						}
						else
						{
							hud.player().inventory().removeItemByItem(item);
						}
					}
				}
			});

			mouseArea.on("enter", function(callee)
			{
				if (callee.hidden == false)
				{
					callee.setTexture("textures/ui/inventory_slot_selected.png");
				}
			});

			mouseArea.on("leave", function(callee)
			{
				callee.setTexture("textures/ui/inventory_slot.png");
				callee.setAlpha(1);
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
			this._inventorySlots.push(slot);
		}

		for (var i = 0; i < 5; ++i)
		{
			var slot = new InventorySlotUI(this._inventory);
			slot.widget().idx = i;
			var mouseArea = new MouseArea(-65+i*40,69,38,38,slot.widget());

			mouseArea.on("down", function(callee)
			{
				if (callee.hidden == false)
				{
					callee.setAlpha(0.7);
				}
			});

			var hud = this;
			mouseArea.on("released", function(callee)
			{
				if (callee.hidden == false)
				{
					callee.setAlpha(1);
					var item = hud.player().equipment().getSlot(callee.idx).item();

					if (item !== undefined)
					{
						if (hud.player().inventory().addItem(item) == true)
						{
							hud.player().equipment().removeItem(item.slot());
						}
						else
						{
							Log.debug("No inventory space");
						}
					}
				}
			});

			mouseArea.on("enter",function(callee)
			{
				if (callee.hidden == false)
				{
					callee.setTexture("textures/ui/inventory_slot_selected.png");
				}
			});

			mouseArea.on("leave",function(callee)
			{
				callee.setTexture("textures/ui/inventory_slot.png");
				callee.setAlpha(1);
			});

			if (i <= 2)
			{
				slot.setTranslation(235+i*40,80,900);
			}
			else
			{
				slot.setTranslation(215+(i-2)*40,40,900);
				mouseArea.setPosition(-85+(i-2)*40,29);
			}

			slot.mouseArea = mouseArea;
			this._equipmentSlots.push(slot);
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
		if (this._shouldFade !== false && this._fadeTimer < 1)
		{
			this._fadeTimer += dt/2;
			var a = this._shouldFade == Fade.In ? Math.lerp(1,0,this._fadeTimer) : Math.lerp(0,1,this._fadeTimer);
			this._fade.setAlpha(a);
		}
		else
		{
			var a = this._shouldFade == Fade.In ? 0 : 1;
			this._fade.setAlpha(a);
		}

		this._bars[0].setMinMax(this._player.health(),this._player.maxHealth());
		this._bars[1].setMinMax(this._player.stamina(),this._player.maxStamina());
		this._bars[2].setMinMax(this._player.mana(),this._player.maxMana());

		this._coinText.setValue(this._player.coins());
		
		for (var i = 0; i < 10; ++i)
		{
			var inventory = this._player.inventory();
			var slot = inventory.getSlot(i);
			var inventSlot = this._inventorySlots[i];

			if (!slot.free())
			{
				inventSlot.setItem(slot.item());
				if (slot.item().isStackable())
				{
					inventSlot.setStackVisible(true);
					inventSlot.setQuantity(slot.quantity());

					if (this._overlayVisible == true)
					{
						inventSlot.widget().stack.setAlpha(1);
					}
				}
				else
				{
					inventSlot.setStackVisible(false);
				}
			}
			else
			{
				inventSlot.removeItem();
				inventSlot.setStackVisible(false);
			}
		}

		for (var i = 0; i < 5; ++i)
		{
			var equipment = this._player.equipment();
			var slot = equipment.getSlot(i);

			if (!slot.free())
			{
				this._equipmentSlots[i].setItem(slot.item());
			}
			else
			{
				this._equipmentSlots[i].removeItem();
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

		this._overlay.destroy();

		this._inventory.destroy();

		for (var i = 0; i < this._inventorySlots.length; ++i)
		{
			this._inventorySlots[i].destroy();
		}

		for (var i = 0; i < this._equipmentSlots.length; ++i)
		{
			this._equipmentSlots[i].destroy();
		}
	}

	this.showShop = function(item)
	{
		this._shop.setAlpha(1);
		this._shopItem.setAlpha(1);
		this._shopText.setAlpha(1);
		this._shopIndicator.setAlpha(1);
		this._shopValue.setAlpha(1);

		this._shopItem.setTexture(item.texture());
		this._shopText.setValue(this._player.coins());
		this._shopValue.setValue(item.value());

		var check = item.value() <= this._player.coins();
		var col = check == true ? [0.5,1,0.5] : [1,0.5,0.5]

		this._shopText.setBlend(col[0],col[1],col[2]);
		this._shopIndicator.setTexture(check ? "textures/ui/shop_able.png" : "textures/ui/shop_unable.png");
	}

	this.hideShop = function()
	{
		this._shop.setAlpha(0);
		this._shopItem.setAlpha(0);
		this._shopText.setAlpha(0);
		this._shopIndicator.setAlpha(0);
		this._shopValue.setAlpha(0);
	}

	this.toggleOverlay = function()
	{
		this._overlayVisible = !this._overlayVisible;
		if (this._overlayVisible == true)
		{
			this._overlay.setAlpha(0.7)
			for (var i = 0; i < this._inventorySlots.length; ++i)
			{
				this._inventorySlots[i].show();

				if (i < 5)
				{
					this._equipmentSlots[i].show();
				}
			}
			this._coinText.setAlpha(1);
			this._inventory.setAlpha(1);
		}
		else
		{
			this._overlay.setAlpha(0);
			for (var i = 0; i < this._inventorySlots.length; ++i)
			{
				this._inventorySlots[i].hide();

				if (i < 5)
				{
					this._equipmentSlots[i].hide();
				}
			}
			this._coinText.setAlpha(0);
			this._inventory.setAlpha(0);
		}
	}

	this.onTurnEnd = function()
	{
		if (this._overlayVisible == true)
		{
			this.toggleOverlay();
		}
	}

	this.initialise();
	Broadcaster.register(this,Events.PlayerTurnEnded,this.onTurnEnd);
}