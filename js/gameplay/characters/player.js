var Player = function(x,y)
{
	this._camera = LevelState.camera();
	this.__unit = new Unit(x,y,"player");
	this._timer = 0;
	extend(this,this.__unit);

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
}