/**
* @class Enemy : Unit
* @brief An enemy
* @author Daniël Konings
*/
var Enemy = function(world,cellX,cellY,key)
{
	ContentManager.load("texture", EnemyData[key].texture);
	extend(this, new Unit(world,UnitType.Player,EnemyData[key].texture));

	this.setName("Enemy");

	/// Updates the enemy object
	this.update = function(dt)
	{	
		this.updatePosition(dt);
	}

	this.doTurn = function()
	{
		if (this._state == UnitState.Idle)
		{
			var index = this.currentTile();
			var target = StateManager.getState().player().currentTile();
			var result = false;

			if (index.x < target.x)
			{
				result = this.moveTo(index.x+1,index.y);
			}
			else if (index.x > target.x)
			{
				result = this.moveTo(index.x-1,index.y);
			}

			if (result == false && Math.abs(target.y-index.y) > 1)
			{
				if (index.y < target.y)
				{
					result = this.moveTo(index.x,index.y+1);
				}
				else if(index.y > target.y)
				{
					result = this.moveTo(index.x,index.y-1);
				}
			}
		}
	}

	if (cellX !== undefined && cellY !== undefined)
	{
		this.setTile(cellX, cellY);
	}
}

// Overrides the toString method of the enemy class
Enemy.prototype.toString = function()
{
	return "Enemy";
}