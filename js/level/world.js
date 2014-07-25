
enumerator("CellType",[
	"Empty",
	"Impassable",
	"Unit"]);

enumerator("Events",[
	"TurnEnd"]);

/**
* @class Cell
* @brief A cell is a grid location in the world, can have visual attributes
* @author Daniël Konings
*/
var Cell = function(x,y,type,texture,prop)
{
	this._x = x;
	this._y = y;
	this._type = type || CellType.Empty;

	this._unit = undefined;
	this._texture = undefined;
	this._prop = undefined;

	if (texture !== undefined)
	{
		this._texture = new GameObject(32,32,texture);
		this._texture.setPosition(this._x,this._y);
		this._texture.setOffset(0.5,0.5,0.5);
	}

	this.show = function()
	{
		if (this._texture !== undefined)
		{
			this._texture.spawn();
		}
	}

	this.hide = function()
	{
		if (this._texture !== undefined)
		{
			this._texture.destroy();
		}
	}

	/// Sets a unit to this cell
	this.setUnit = function(unit)
	{
		this._unit = unit;
	}

	/// Returns the unit on this cell
	this.unit = function()
	{
		return this._unit;
	}

	/// Returns the x
	this.x = function()
	{
		return this._x;
	}

	/// Returns the y
	this.y = function()
	{
		return this._y;
	}

	/// Returns the type
	this.type = function()
	{
		return this._type;
	}

	/// Sets the type
	this.setType = function(type)
	{
		this._type = type;
	}

	/// Returns the entire position
	this.position = function()
	{
		return {x: this._x, y: this._y};
	}
}

/// Overrides the toString prototype function of the cell class
Cell.prototype.toString = function()
{
	return "Cell";
}

/**
* @class World
* @brief A class to create the world everything lives in
* @author Daniël Konings
*/
var World = function()
{
	this._cellSize = 32;

	this._enemies = [];
	this._cells = [];

	this._enemyTurn = -1;

	var xx,yy;

	for (var x = 0; x < 100; ++x)
	{
		this._cells[x] = [];

		for (var y = 0; y < 100; ++y)
		{
			xx = -RenderSettings.resolution().w/2 + x * this._cellSize + this._cellSize / 2;
			yy = RenderSettings.resolution().h/2 - y * this._cellSize + this._cellSize / 2 - this._cellSize;
			var length = Level.getLevelDefaults().background.length;
			var randomTexture = Level.getLevelDefaults().background[Math.floor(Math.random()*length)];

			this._cells[x][y] = new Cell(xx,yy,CellType.Empty,randomTexture);
		}
	}

	/// Returns the grid indices the mouse is on
	this.gridFromMouse = function()
	{
		var mouse = Mouse.position(Mouse.Screen);

		var mx = (mouse.x + 1) * RenderSettings.resolution().w/2;
		var my = (mouse.y + 1) * RenderSettings.resolution().h/2;

		var translation = StateManager.getState().camera().translation();

		mx += translation.x;
		my -= translation.y;

		var pos = this.gridFromWorld(mx,my);
		return {x: pos.x, y: pos.y};
	}

	/// Returns a grid position from a world position
	this.gridFromWorld = function(x, y)
	{
		return {x: Math.floor(x/this._cellSize), y: Math.floor(y/this._cellSize)};
	}

	/// Returns the world position a grid cell is on
	this.worldFromGrid = function(x, y)
	{
		return this._cells[x][y].position();
	}

	/// Returns the world cell size
	this.cellSize = function()
	{
		return this._cellSize;
	}

	/// Sets a cell type for a given x and y
	this.setCellType = function(x,y,type)
	{
		this._cells[x][y].setType(type);
	}

	this.cellType = function(x,y)
	{
		return this._cells[x][y].type();
	}

	/// Checks for an impassable cell
	this.isImpassable = function(x,y)
	{
		return this._cells[x][y].type() != CellType.Empty && this._cells[x][y].type() != CellType.Unit;
	}

	this.update = function(dt)
	{
		if (this._enemies.length === 0)
		{
			this._enemyTurn = -1
			return;
		}

		for (var i = 0; i < this._enemies.length; ++i)
		{
			this._enemies[i].update(dt);
		}

		if (this._enemyTurn != -1)
		{
			this._enemies[this._enemyTurn].doTurn();
			++this._enemyTurn;

			if (this._enemyTurn >= this._enemies.length)
			{
				this._enemyTurn = -1;
			}
		}
	}

	/// Is it the enemy turn?
	this.isEnemyTurn = function()
	{
		return this._enemyTurn != -1;
	}

	/// Starts the enemy turn
	this.startEnemyTurn = function()
	{
		this._enemyTurn = 0;
	}

	/// Returns a cell at a given index
	this.getCell = function(x,y)
	{	
		return this._cells[x][y];
	}

	/// Returns the width of the grid in indices
	this.width = function()
	{
		return this._cells.length;
	}

	/// Returns the height of the grid in indices
	this.height = function()
	{
		return this._cells[0].length;
	}

	this.draw = function(dt)
	{
		
	}

	this.destroy = function()
	{
		for (var i = this._enemies.length-1; i >= 0; --i)
		{
			this._enemies[i].destroy();
			this._enemies[i] = null;
			this._enemies.pop();
		}

		this._enemies = [];
	}

	Broadcaster.register(this,this.startEnemyTurn,Events.TurnEnd);
}

// Overrides the toString method of the world class
World.prototype.toString = function()
{
	return "World";
}