var Player = function(x,y)
{
	this._camera = LevelState.camera();
	this.__unit = new Unit(x,y,"player");
	
	extend(this,this.__unit);

	this._timer = 0;
	this._shakeTimer = 0;
	this._chunk = [];
	this._viewWidth = this._dungeon.definition().viewRange;
	this._viewHeight = this._dungeon.definition().viewRange;

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

	this.onArrived = function()
	{
		this.updateView(this._viewWidth,this._viewHeight);
		Broadcaster.broadcast(Events.PlayerTurnEnded,{turn: TurnTypes.Enemy});
	}

	this.update = function(dt)
	{
		this.updateMovement(dt);

		var shake = {x: 0, y: 0}
		if (Keyboard.isPressed("I"))
		{
			this._shakeTimer = 0;
		}

		if (this._shakeTimer < 1)
		{
			this._shakeTimer += dt*6;
			shake = Math.shake(2,this._shakeTimer);
		}

		var translation = this._camera.translation();
		var distance = Math.distance(translation.x,translation.y,this.translation().x,this.translation().y);
		if (distance > 0.05)
		{
			var x = Math.lerp(translation.x,this.translation().x,this._timer)
			var y = Math.lerp(translation.y,this.translation().y,this._timer)
			
			this._camera.setTranslation(x,y,translation.z);
			this._timer += dt * distance / 5000;
		}

		translation = this._camera.translation();
		this._camera.setTranslation(translation.x+shake.x,translation.y+shake.y,translation.z);

		if (LevelState.level().turn() == TurnTypes.Player)
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

			if (jumpTo !== undefined && this._target === undefined)
			{
				var success = this.jumpTo(jumpTo.x,jumpTo.y);

				if (success == false)
				{
					var tile = this._dungeon.tileAt(jumpTo.x,jumpTo.y);
					if (tile.type() != DungeonTiles.Wall && tile.unit() != undefined)
					{
						Log.fatal("Attacking target");
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
}