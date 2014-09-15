var Player = function(level,x,y)
{	
	this._camera = level.camera();
	this.__unit = new Unit(level,x,y,"player");
	
	extend(this,this.__unit);

	this._timer = 0;
	this._chunk = [];
	this._viewWidth = this._dungeon.definition().viewRange;
	this._viewHeight = this._dungeon.definition().viewRange;
	this._heart = undefined;
	this._heartScale = 1;

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

	this.onHit = function()
	{
		this._heart = this._level.hud().barAt(0).indicator();
		this._heartScale = 1.5;
	}

	this.onArrived = function()
	{
		this.updateView(this._viewWidth,this._viewHeight);
		Broadcaster.broadcast(Events.PlayerTurnEnded,{turn: TurnTypes.Enemy});
	}

	this.onAttacked = function(target)
	{
		Log.fatal("Player attacked target " + target.worldName());
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
				jumpTo = {x: this._indices.x, y: this._indices.y+1};
			}
			if (Keyboard.isDown("W"))
			{
				jumpTo = {x: this._indices.x, y: this._indices.y-1};
			}
			if (Keyboard.isDown("A"))
			{
				jumpTo = {x: this._indices.x-1, y: this._indices.y};
			}
			if (Keyboard.isDown("D"))
			{
				jumpTo = {x: this._indices.x+1, y: this._indices.y};
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