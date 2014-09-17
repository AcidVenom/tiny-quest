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
	this._heartScale = 1;
	this._ranging = false;
	this._rangeSquares = [];
	this._rangeTo = {x: 1, y: 0}
	this._rangedIndex = {x: 0, y: 0}
	this._range = 0;
	this._equipped = Character.items.equipped;
	this._foundTarget = false;

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

	this.getProjectile = function()
	{
		for (var name in Items)
		{
			if (Items[name] == this._equipped.mainHand)
			{
				return "textures/items/projectiles/" + name + "_projectile.png";
			}
		}
	}

	this.onHit = function()
	{
		this._heart = this._level.hud().barAt(0).indicator();
		this._heartScale = 1.5;
	}

	this.onArrived = function()
	{
		this.updateView(this._viewWidth,this._viewHeight);

		if (this._tile.hasDrops())
		{
			this._tile.pickUpDrops();
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

	this.update = function(dt)
	{
		this.updateMovement(dt);

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
			}
		}

		var translation = this._camera.translation();
		var distance = Math.distance(translation.x,translation.y,this.translation().x,this.translation().y);
		if (distance > 0.05)
		{
			var x = Math.lerp(translation.x,this.translation().x,this._timer)
			var y = Math.lerp(translation.y,this.translation().y,this._timer)
			
			this._camera.setTranslation(x,y,translation.z);
			this._timer += dt * distance / 1000;
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
				this._range = Character.items.equipped["mainHand"].range;

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
				}
			}
		}
	}

	this.updateView(this._viewWidth,this._viewHeight);
	this._overHead.setZ(140);
}