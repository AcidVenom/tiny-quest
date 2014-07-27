enumerator("UnitType",[
	"Player",
	"Enemy",
	"Friendly"])

enumerator("UnitState",[
	"Idle",
	"Jumping",
	"Attacking",
	"Damaging",
	"Damaged"
]);

/**
* @class Unit
* @brief The base class for all units on the map
* @author Daniël Konings
*/
var Unit = function(world, type, texture)
{
	this.__gameObject = new GameObject(32, 32, texture);
	extend(this,this.__gameObject);
	this.setShader("shaders/unit_shading.fx");
	this.setUniform("float","Hit",0);
	this.spawn();
	this._type = type;

	this.setName("Unit");

	/// Returns the type of this unit
	this.type = function()
	{
		return this._type;
	}

	this.setOffset(0.5, 0.5, 0.5);

	this._position = {x: 0, y: 0};
	this._start = {x: 0, y: 0};
	this._target = {x: 0, y: 0};
	this._moveToTile = {x: 0, y: 0};

	this._speed = {x: 0, y: 0};
	this._maxSpeed = 350;
	this._xScale = 32;

	this.setZ(2);

	this._jump = 0;
	this._jumpHeight = 32;

	this._world = world;

	this._state = UnitState.Idle;
	this._timer = 0;
	this._wobble = 0;
	this._randomWobble = Math.floor(Math.random()*2);

	this._shadow = new GameObject(32, 32, "textures/characters/shadow.png");
	this._shadow.setName("Shadow");
	this._shadow.setZ(1);
	this._shadow.spawn();

	this._shadow.setOffset(0.5, 0.5, 0.5);
	this._attackDirection = 0;

	/// Returns the state of this unit
	this.state = function()
	{
		return this._state;
	}

	/// Returns the position of the unit
	this.position = function()
	{
		return this._position;
	}

	/// Sets the tile of the unit
	this.setTile = function(x, y)
	{
		this._position.x = x * this._world.cellSize() - RenderSettings.resolution().w / 2 + this._world.cellSize() / 2;
		this._position.y = y * -this._world.cellSize() + RenderSettings.resolution().h / 2 - this._world.cellSize() / 2;

		this._world.getCell(x,y).setUnit(this);
		this._world.setCellType(x,y,CellType.Unit);
	}

	/// Returns the current indices of the tile the unit is on
	this.currentTile = function()
	{
		var x = (this._position.x + RenderSettings.resolution().w / 2 - this._world.cellSize() / 2) / this._world.cellSize();
		var y = -(this._position.y - RenderSettings.resolution().h / 2 + this._world.cellSize() / 2) / this._world.cellSize();
		return {x: x, y: y};
	}

	/// Checks if two given tile indices are a neighbouring tile of the current unit tile
	this.isNeighbourTile = function(x, y)
	{
		var currentTile = this.currentTile();
		var xx = currentTile.x;
		var yy = currentTile.y;

		if (Math.abs(x - xx) == 1)
		{
			if (Math.abs(y - yy) == 0)
			{
				return true;
			}
		}

		if (Math.abs(y - yy) == 1)
		{
			if (Math.abs(x - xx) == 0)
			{
				return true;
			}
		}

		return false;
	}

	/// Jump animation to a node
	this.jumpTo = function(x, y)
	{
		var currentTile = this.currentTile();
		this._world.setCellType(currentTile.x,currentTile.y,CellType.Empty);
		this._world.getCell(currentTile.x,currentTile.y).setUnit(undefined);

		this._timer = 0;
		this._state = UnitState.Jumping;

		var worldPos = this._world.worldFromGrid(x, y);

		this._start.x = this._position.x;
		this._start.y = this._position.y;

		this._target.x = worldPos.x;
		this._target.y = worldPos.y;

		this._moveToTile.x = x;
		this._moveToTile.y = y;
	}

	/// Attacks a given node
	this.attackNode = function(x, y)
	{
		if (this.isNeighbourTile(x, y) && this._world.cellType(x,y) == CellType.Unit)
		{
			var currentTile = this.currentTile();
			this._start = this._world.worldFromGrid(currentTile.x,currentTile.y);

			if (x < currentTile.x)
			{
				this._attackDirection = Math.PI;
				this._xScale = -32;
			}

			if (x > currentTile.x)
			{
				this._attackDirection = 0;
				this._xScale = 32;
			}

			if (x == currentTile.x)
			{
				if (y > currentTile.y)
				{
					this._attackDirection = -Math.PI/2;
				}

				if (y < currentTile.y)
				{
					this._attackDirection = Math.PI/2;
				}
			}

			this._target.x = x;
			this._target.y = y;
			this._state = UnitState.Attacking;
			this._timer = 0;
		}
	}

	/// Override this function to implement move end behaviour
	this.onMoved = function()
	{

	}

	/// Override this function to implement attack end behaviour
	this.onAttacked = function()
	{

	}

	/// Moves the unit
	this.moveTo = function(x,y)
	{
		if (x < this._world.chunkWidth()-1 || x > this._world.width()-this._world.chunkWidth()-1 || y < this._world.chunkHeight() || y > this._world.height()-this._world.chunkHeight())
		{
			return false;
		}

		if (this.isNeighbourTile(x, y) && !this._world.isImpassable(x, y) && this._world.cellType(x, y) != CellType.Unit)
		{
			this._world.getCell(x,y).setType(CellType.Unit);
			this.jumpTo(x, y);
			return true;
		}

		return false;
	}

	/// Damages a unit
	this.damage = function(dmg)
	{
		Log.fatal("Ow! I received " + dmg + " damage..");
		this._state = UnitState.Damaged;
		this._timer = 0;

		this._start.x = this._position.x;
		this._start.y = this._position.y;

		this.setUniform("float","Hit",1);
	}

	/// Updates the position of a unit
	this.updatePosition = function(dt)
	{
		var scale = this.scale();
		this.setScale(this._xScale,32,32);

		if (this._state == UnitState.Idle)
		{
			this._timer += dt;
			this._wobble = Math.abs(Math.sin(this._timer*4+this._randomWobble))*3;
		}

		this.setPosition(this._position.x, this._position.y + this._jump - 2 + this._wobble);

		if (this._state != UnitState.Attacking)
		{
			var currentTile = this.currentTile();
			this.setZ(currentTile.y+0.1);
		}

		var translation = this.translation();
		this._shadow.setPosition(translation.x, translation.y - this._jump);
		this._shadow.setScale(Math.sin(this._jump/30) * this._world.cellSize(), 0, Math.sin(this._jump/30) * this._world.cellSize());
	
		if (this._state == UnitState.Jumping)
		{
			this._timer += dt*4;
			if (this._timer > 1)
			{
				this._timer = 1;
			}
			this._position = Math.lerp(this._start.x, this._start.y, this._target.x, this._target.y, this._timer);

			this._xScale = this._target.x < this._start.x ? -32 : 32;

			this._jump = Math.sin(this._timer*3)*this._jumpHeight;
			if (this._timer >= 1)
			{
				this.setTile(this._moveToTile.x, this._moveToTile.y);
				this._state = UnitState.Idle;
				this._timer = 0;
				this.onMoved();
			}
		}

		if (this._state == UnitState.Attacking || this._state == UnitState.Damaging)
		{
			this._timer += dt*15;

			this._position.x = this._start.x + Math.cos(this._attackDirection)*Math.abs(Math.sin(this._timer)*32);
			this._position.y = this._start.y + Math.sin(this._attackDirection)*Math.abs(Math.sin(this._timer)*32);
			this.setZ(98);

			if (this._timer > Math.PI/2 && this._state == UnitState.Attacking)
			{
				this._state = UnitState.Damaging;
				this._world.getCell(this._target.x,this._target.y).unit().damage(Math.floor(Math.random()*10)+1);
			}

			if (this._timer > Math.PI)
			{
				this._state = UnitState.Idle;
				this._position.x = this._start.x;
				this._position.y = this._start.y;
				this._xScale = 32;
				this.onAttacked();
			}
		}

		if (this._state == UnitState.Damaged)
		{
			this.setZ(99);
			if (this._timer < Math.PI)
			{
				this._timer += dt*20;
			}
			else
			{
				this._state = UnitState.Idle;
				this._timer = 0;
				this.setUniform("float","Hit",0);
			}

			this._position.y = this._start.y + Math.sin(this._timer)*this._world.cellSize()/2;
		}
	}

	this.destroy = function()
	{
		this._shadow.delete();
		this._shadow = null;
		this.__gameObject.delete();
		this.__gameObject = null;
	}
}