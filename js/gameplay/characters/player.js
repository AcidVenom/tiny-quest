require("js/gameplay/item_manager");

var Player = function(level,x,y)
{	
	this._camera = level.camera();
	this.__unit = new Unit(level,x,y,UnitTypes.Player,"player");
	
	extend(this,this.__unit);

	this._timer = 0;
	this._chunk = [];
	this._viewWidth = this._dungeon.definition().viewRange;
	this._viewHeight = this._dungeon.definition().viewRange;
	this._heart = undefined;
	this._plus = undefined;
	this._heartScale = 1;
	this._plusScale = 1;
	this._ranging = false;
	this._rangeSquares = [];
	this._rangeTo = {x: 1, y: 0}
	this._rangedIndex = {x: 0, y: 0}
	this._range = 0;
	this._foundTarget = false;
	this._camera.setTranslation(this.translation().x,this.translation().y,this._camera.translation().z);
	this._translateFrom = {x: this._camera.translation().x, y: this._camera.translation().y}
	this._coins = Character.coins;

	this._body = new GameObject(32,32);
	this._body.setOffset(0.5,0,0.5);
	this._body.setShader("shaders/unitshading.fx");
	this._body.setUniform("float", "Hit", 0);
	this._body.spawn();
	this._body.setAlpha(0);

	this._hair = new GameObject(32,32);
	this._hair.setOffset(0.5,0,0.5);
	this._hair.setShader("shaders/unitshading.fx");
	this._hair.setUniform("float", "Hit", 0);
	this._hair.spawn();
	this._hair.setAlpha(0);

	this._weapon = new GameObject(32,32);
	this._weapon.setOffset(0,0,0.5);
	this._weapon.setShader("shaders/unitshading.fx");
	this._weapon.setUniform("float", "Hit", 0);
	this._weapon.spawn();
	this._weapon.setAlpha(0);

	this._oldHit = 0;
	this._canHeal = true;
	this._inMenu = false;
	this._itemInventory = new ItemInventory(this,10);
	this._equipment = new Equipment(this);

	this.setBlend(Character.blend[0],Character.blend[1],Character.blend[2]);

	if (Character.hair != 0)
	{
		this._hair.setTexture("textures/characters/hero/hero_hair_" + String(Character.hair) + ".png");
	}

	this.addCoins = function(num)
	{
		this._coins += num;
		Character.coins = this._coins;
	}

	this.removeCoins = function(num)
	{
		this._coins -= num;
		Character.coins = this._coins;
	}

	this.coins = function()
	{
		return this._coins;
	}

	this.inventory = function()
	{
		return this._itemInventory;
	}

	this.equipment = function()
	{
		return this._equipment;
	}

	this.isEquipped = function(item)
	{
		return this._equipment.hasItem(item);
	}

	this.updateStats = function()
	{
		var stats = Character.calculateStats();
		this._attackDamage = stats.attackDamage;
		this._rangedDamage = stats.rangedDamage;
		this._magicDamage = stats.magicDamage;
		this._maxStamina = stats.stamina;
		this._maxHealth = this._definition.hp;
		this._maxMana = 10;
		this._defense = stats.defense;
	}

	this.updateView = function(w,h)
	{
		if (this._chunk !== undefined)
		{
			for (var i = 0; i < this._chunk.length; ++i)
			{
				this._chunk[i].hide();
			}
		}

		this._chunk = [];

		var chunk = this._dungeon.getChunk(this._indices.x-w/2,this._indices.y-h/2,w,h);

		for (var i = 0; i < chunk.length; ++i)
		{
			chunk[i].show();
		}

		this._chunk = chunk;
	}

	this.onHit = function(damage)
	{
		this._timer = 0;
		var trans = this._camera.translation();
		this._translateFrom = {x: trans.x, y: trans.y}

		this.sizeHeart(1.5);
	}

	this.sizeHeart = function(scale)
	{
		this._heart = this._level.hud().barAt(0).indicator();
		this._heartScale = scale;
	}

	this.sizePlus = function(scale)
	{
		this._plus = this._level.hud().barAt(1).indicator();
		this._plusScale = scale;
	}

	this.onArrived = function()
	{
		this.updateView(this._viewWidth,this._viewHeight);

		if (this._tile.hasDrops())
		{
			this._tile.pickUpDrops(this);
		}

		if (this._tile.rugItem() !== undefined && this._tile.rugItem().item !== undefined)
		{
			this._level.hud().showShop(this._tile.rugItem().item);
		}
		else
		{
			this._level.hud().hideShop();
		}

		Broadcaster.broadcast(Events.PlayerTurnEnded,{turn: TurnTypes.Enemy});
	}

	this.onAttacked = function(target)
	{
		if (target !== undefined)
		{
			Log.debug("Player attacked target " + target.worldName());
		}
		Broadcaster.broadcast(Events.PlayerTurnEnded,{turn: TurnTypes.Enemy});
	}

	this.onStaminaChanged = function(empty)
	{
		this.sizePlus(1.5);
		if (empty == true)
		{
			Broadcaster.broadcast(Events.PlayerTurnEnded,{turn: TurnTypes.Enemy});
		}
	}

	this.setInventory = function()
	{
		for (var i = 0; i < 10; ++i)
		{
			if (i < 5)
			{
				if (Character.equipped[i] !== undefined)
				{
					this._equipment.addItem(new Item(Character.equipped[i]));
				}
			}

			if (Character.inventory[i] !== undefined)
			{
				this._itemInventory.addItem(new Item(Character.inventory[i]));
			}
		}
	}

	this.onDeath = function()
	{
		var particleEmitter = new ParticleEmitter(ParticleDefinitions["on_death"]);
		particleEmitter.setPosition(this._tile.position().x,this._tile.position().y);
		particleEmitter.start();
		Broadcaster.broadcast(Events.PlayerDied,{});
	}

	this.onEquipmentChanged = function(params)
	{
		if (params.slot == ItemSlot.Body)
		{
			this._body.setTexture(params.texture);
		}
		if (params.slot == ItemSlot.Helmet)
		{
			this._hair.setTexture(params.texture);
		}
		if (params.slot == ItemSlot.MainHand)
		{
			this._weapon.setTexture(params.texture);
		}
	}

	this.resetInMenu = function()
	{
		this._inMenu = false;
	}

	this.update = function(dt)
	{
		this.updateMovement(dt);
		var time = this._state == UnitStates.Attacking ? this._attackTimer : 0;
		
		var scale = this.scale();
		var translation = this.translation();
		var multiplier = scale.x/Math.abs(scale.x);
		this._hair.setTranslation(translation.x,translation.y,translation.z+0.001);
		this._body.setTranslation(translation.x,translation.y,translation.z+0.0009);
		this._weapon.setTranslation(translation.x-(16*multiplier)+Math.sin(time)*(10*multiplier),translation.y+Math.sin(this._wobbleTimer)*2,translation.z+0.0015);

		this._hair.setScale(scale.x,scale.y,scale.z);
		this._body.setScale(scale.x,scale.y,scale.z);
		this._weapon.setScale(scale.x,scale.y,scale.z);

		if (this._equipment.getSlot(ItemSlot.Helmet).free() == false || Character.hair != 0)
		{
			if (Character.hair != 0 && this._equipment.getSlot(ItemSlot.Helmet).free() == true)
			{
				this._hair.setTexture("textures/characters/hero/hero_hair_" + String(Character.hair) + ".png");
			}
			this._hair.setAlpha(this.alpha());
		}
		else
		{
			this._hair.setAlpha(0);
		}

		if (this._equipment.getSlot(ItemSlot.Body).free() == false)
		{
			this._body.setAlpha(this.alpha());
		}
		else
		{
			this._body.setAlpha(0);
		}

		if (this._equipment.getSlot(ItemSlot.MainHand).free() == false)
		{
			this._weapon.setAlpha(this.alpha());
		}
		else
		{
			this._weapon.setAlpha(0);
		}

		var rotation = this.rotation();
		this._hair.setRotation(0,0,-rotation.z);
		this._body.setRotation(0,0,-rotation.z);
		
		this._weapon.setRotation(0,0,-rotation.z+Math.sin(this._wobbleTimer)*0.1+Math.sin(time)*2*multiplier);

		if (this._oldHit != this._hit)
		{
			this._hair.setUniform("float", "Hit", this._hit);
			this._body.setUniform("float", "Hit", this._hit);
			this._weapon.setUniform("float", "Hit", this._hit);
			this._oldHit = this._hit;
		}

		if (this._heart !== undefined)
		{
			if (this._heartScale > 1)
			{
				this._heartScale -= dt;
				var scale = 17*this._heartScale;
				this._heart.setScale(scale,scale,scale);
			}
			else
			{
				this._heartScale = 1;
				this._heart.setScale(17,17,17);
				this._heart = undefined;
			}
		}

		if (this._plus !== undefined)
		{
			if (this._plusScale > 1)
			{
				this._plusScale -= dt;
				var scale = 17*this._plusScale;
				this._plus.setScale(scale,scale,scale);
			}
			else
			{
				this._plusScale = 1;
				this._plus.setScale(17,17,17);
				this._plus = undefined;
			}
		}

		var translation = this._camera.translation();
		var distance = Math.distance(translation.x,translation.y,this.translation().x,this.translation().y);
		if (this._timer < 1 && this._level.shaking() == false)
		{
			var x = Math.lerp(this._translateFrom.x,this.translation().x,this._timer)
			var y = Math.lerp(this._translateFrom.y,this.translation().y,this._timer)

			this._camera.setTranslation(x,y,translation.z);
			this._timer += dt * distance / 90;
		}
		else
		{
			this._timer = 1;
		}

		if (Keyboard.isReleased("I") && this._state == UnitStates.Idle)
		{
			this._level.hud().toggleOverlay();
			this._inMenu = !this._inMenu;
		}

		if (this._inMenu == true)
		{
			return;
		}

		if (Keyboard.isReleased("Z") && this._tile.rugItem() !== undefined && this._tile.rugItem().item !== undefined)
		{
			var item = this._tile.rugItem().item;

			if (item.value() <= this._coins)
			{
				if (this._itemInventory.addItem(item) == true)
				{
					this._tile.removeRugItem();
					this._coins -= item.value();
					this._level.hud().hideShop();
				}
			}
		}
		
		if (this._level.turn() == TurnTypes.Player)
		{
			var jumpTo = undefined;

			if (Keyboard.isDown("S"))
			{
				if (this._ranging == false)
				{
					jumpTo = {x: this._indices.x, y: this._indices.y+1};
				}
				else
				{
					this._rangeTo = {x: 0, y: 1}
				}
			}
			if (Keyboard.isDown("W"))
			{
				if (this._ranging == false)
				{
					jumpTo = {x: this._indices.x, y: this._indices.y-1};
				}
				else
				{
					this._rangeTo = {x: 0, y: -1}
				}
			}
			if (Keyboard.isDown("A"))
			{
				if (this._ranging == false)
				{
					jumpTo = {x: this._indices.x-1, y: this._indices.y};
				}
				else
				{
					this._rangeTo = {x: -1, y: 0}
					this.setScale(-32,32,32);
				}
			}
			if (Keyboard.isDown("D"))
			{
				if (this._ranging == false)
				{
					jumpTo = {x: this._indices.x+1, y: this._indices.y};
				}
				else
				{
					this._rangeTo = {x: 1, y: 0}
					this.setScale(32,32,32);
				}
			}

			if (Keyboard.isDown("Space") && this._state == UnitStates.Idle)
			{
				this._ranging = true;
				this._range = 3;

				if (this._range == undefined)
				{
					this._ranging = false;
				}
			}

			if (this._ranging == true && this._rangeSquares.length == 0)
			{
				for (var i = 0; i < this._range; ++i)
				{
					var square = new GameObject(32,32);
					square.setBlend(140/255,198/255,1);

					square.spawn();
					square.setZ(1000);
					square.setAlpha(0.2);

					this._rangeSquares.push(square);
				}
			}
			else if (this._ranging == true)
			{
				var x = this._position.x;
				var y = this._position.y;
				this._foundTarget = false;

				for (var i = 0; i < this._range; ++i)
				{
					var square = this._rangeSquares[i];
					if (this._rangeTo.y == 0)
					{
						x = this._position.x+(32*this._rangeTo.x * (i+1));
					}
					else
					{
						y = this._position.y+(32*this._rangeTo.y * (i+1));
					}
					square.setPosition(x,y);

					var xx = Math.floor(x/32);
					var yy = Math.floor(y/32);

					var tile = this._dungeon.tileAt(xx,yy);

					if (tile !== undefined && tile !== DungeonTiles.Empty && tile.unit() !== undefined)
					{
						for (var j = i+1; j < this._range; ++j)
						{
							this._rangeSquares[j].setAlpha(0);
						}
						this._rangedIndex = {x: xx, y: yy}
						this._foundTarget = true;
						break;
					}
					else if (tile === undefined || tile === DungeonTiles.Empty || tile.type() == DungeonTiles.Wall)
					{
						for (var j = i; j < this._range; ++j)
						{
							this._rangeSquares[j].setAlpha(0);
						}
						break;
					}
					else
					{
						this._rangeSquares[i].setAlpha(0.2);
					}

					this._rangedIndex = {x: xx, y: yy}
				}
			}

			if (Keyboard.isReleased("Space") && this._ranging == true)
			{
				var x = this._rangedIndex.x;
				var y = this._rangedIndex.y;

				for (var i = 0; i < this._rangeSquares.length; ++i)
				{
					this._rangeSquares[i].destroy();
				}

				this._rangeSquares = [];
				this._ranging = false;

				if (this._foundTarget == true)
				{
					this.attackNode(x, y, this.getAttackType(AttackType.Ranged,undefined));
				}
			}

			if (jumpTo !== undefined && this._state == UnitStates.Idle)
			{
				var success = this.jumpTo(jumpTo.x,jumpTo.y);

				if (success == false)
				{
					var tile = this._dungeon.tileAt(jumpTo.x,jumpTo.y);
					if (tile.type() != DungeonTiles.Wall && tile.unit() != undefined && tile.unit().state() == UnitStates.Idle)
					{
						this.attackNode(jumpTo.x,jumpTo.y);
					}
				}
				else
				{
					this._timer = 0;
					var trans = this._camera.translation();
					this._translateFrom = {x: trans.x, y: trans.y}
				}
			}
		}
	}

	this.updateView(this._viewWidth,this._viewHeight);
	this.updateStats();
	this._stamina = this._maxStamina;
	this._overHead.setZ(140);

	this._bonusHandler.setUnit(this);

	Broadcaster.register(this,Events.EquipmentChanged,this.onEquipmentChanged);
	Broadcaster.register(this,Events.PlayerTurnEnded,this.resetInMenu);
	this.setInventory();
}