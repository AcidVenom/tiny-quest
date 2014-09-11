var Player = function(x,y)
{
	this._camera = LevelState.camera();
	this.__unit = new Unit(x,y,"player");
	
	extend(this,this.__unit);

	this._timer = 0;
	this._chunk = undefined;
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
	}

	this.update = function(dt)
	{
		this.updateMovement(dt);

		var translation = this._camera.translation();
		var distance = Math.distance(translation.x,translation.y,this.translation().x,this.translation().y);
		if (distance > 0.1)
		{
			var x = Math.lerp(translation.x,this.translation().x,this._timer)
			var y = Math.lerp(translation.y,this.translation().y,this._timer)
			
			this._camera.setTranslation(x,y,translation.z);
			this._timer += dt * distance / 10000;
		}
		else
		{
			this._timer = 0;
		}

		if (Keyboard.isDown("S"))
		{
			this.jumpTo(this._indices.x,this._indices.y+1);
		}
		if (Keyboard.isDown("W"))
		{
			this.jumpTo(this._indices.x,this._indices.y-1);
		}
		if (Keyboard.isDown("A"))
		{
			this.jumpTo(this._indices.x-1,this._indices.y);
		}
		if (Keyboard.isDown("D"))
		{
			this.jumpTo(this._indices.x+1,this._indices.y);
		}
	}

	this.updateView(this._viewWidth,this._viewHeight);
}