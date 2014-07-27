
/**
* @class Player : Unit
* @brief The player itself
* @author Daniël Konings
*/
var Player = function(world,cellX,cellY)
{
	Log.debug("Created a player");
	extend(this, new Unit(world,UnitType.Player,"textures/characters/hero/hero.png"));

	this.setName("Player");

	this._weapon = new GameObject(24, 24, "textures/weapons/junk/wooden_sword.png");
	this._weapon.setZ(3);

	this._weapon.setName("Weapon");
	this._weapon.setOffset(0.5,0.5,0.5);
	this._weapon.spawn();

	this._selector = new GameObject(32,32);
	this._selector.setOffset(0.5,0.5,0.5);
	this._selector.setBlend(1,0,0,1);
	this._selector.setZ(100);
	this._selector.setAlpha(0.2);

	this._selector.spawn();

	this._selector.setName("Selector");
	this._chunk = undefined;

	this._camTimer = 0;
	this._camStart = {x: 0, y: -32}

	this.getChunk = function()
	{
		var cells = [];
		var currentTile = this.currentTile();

		for (var x = currentTile.x-this._world.chunkWidth(); x < currentTile.x+this._world.chunkWidth()+1; ++x)
		{
			for (var y = currentTile.y-this._world.chunkHeight(); y < currentTile.y+this._world.chunkHeight()+1; ++y)
			{
				if (x >= 0 && y >= 0 && x < this._world.width() && y < this._world.height())
				{
					cells.push(this._world.getCell(x,y));
				}
			}
		}

		return cells;
	}

	this._setTile = this.setTile;

	this.setTile = function(x, y)
	{
		if (this._chunk !== undefined)
		{
			for (var i = 0; i < this._chunk.length; ++i)
			{
				this._chunk[i].hide();
			}
		}

		this._setTile(x,y);
		this._chunk = this.getChunk();

		for (var i = 0; i < this._chunk.length; ++i)
		{
			this._chunk[i].show();
		}
	}

	this.setTile(10, 8);
	if (cellX !== undefined && cellY !== undefined)
	{
		this.setTile(cellX, cellY);
	}

	/// When the player's turn ends
	this.onMoved = function()
	{
		Broadcaster.broadcast(Events.TurnEnd);
	}

	/// When the player's turn ends by an attack
	this.onAttacked = function()
	{
		Broadcaster.broadcast(Events.TurnEnd);
	}

	this._destroyUnit = this.destroy;

	this.destroy = function()
	{
		this._selector.destroy();
		this._selector = null;
		this._weapon.destroy();
		this._weapon = null;
		this._destroyUnit();
	}

	this.moveSelfAndCamera = function(x,y)
	{
		if(this.moveTo(x,y))
		{
			var camTranslation = StateManager.getState().camera().translation();

			this._camStart = {x: camTranslation.x, y: camTranslation.y}
			this._camTimer = 0;
		}
	}

	this.handleMovement = function()
	{
		if (Keyboard.isDown("W") && this._state == UnitState.Idle && !this._world.isEnemyTurn())
		{
			var index = this.currentTile();

			this.moveSelfAndCamera(index.x,index.y-1);
		}

		if (Keyboard.isDown("S") && this._state == UnitState.Idle && !this._world.isEnemyTurn())
		{
			var index = this.currentTile();

			this.moveSelfAndCamera(index.x,index.y+1);
		}

		if (Keyboard.isDown("A") && this._state == UnitState.Idle && !this._world.isEnemyTurn())
		{
			var index = this.currentTile();

			this.moveSelfAndCamera(index.x-1,index.y);
		}

		if (Keyboard.isDown("D") && this._state == UnitState.Idle && !this._world.isEnemyTurn())
		{
			var index = this.currentTile();

			this.moveSelfAndCamera(index.x+1,index.y);
		}

		if ((Mouse.isPressed(1) || Mouse.isDoubleClicked(1)) && this._state == UnitState.Idle && !this._world.isEnemyTurn())
		{
			var index = this._world.gridFromMouse();
			
			this.moveSelfAndCamera(index.x,index.y);
		}

		if (Mouse.isPressed(0) || Mouse.isDoubleClicked(0) && this._state == UnitState.Idle && !this._world.isEnemyTurn()) 
		{
			var index = this._world.gridFromMouse();
			this.attackNode(index.x,index.y);
		}
	}

	/// Updates the player object
	this.update = function(dt)
	{	
		this.updatePosition(dt);

		var translation = this.translation();

		if (this._camTimer < 1)
		{
			var camera = StateManager.getState().camera();

			// var posX = Math.easeInOutQuintic(this._camStart.x,translation.x,this._camTimer,1);
			// var posY = Math.easeInOutQuintic(this._camStart.y,translation.y,this._camTimer,1);

			var pos = Math.lerp(this._camStart.x,this._camStart.y,translation.x-this._world.cellSize()/2,translation.y- this._jump,this._camTimer);

			camera.setTranslation(pos.x,pos.y,-100);

			this._camTimer += dt*2;
		}

		this._weapon.setPosition(translation.x + 12*Math.abs(this._xScale)/this._xScale, translation.y + 2 - this._wobble*1.5);
		this._weapon.setZ(this.currentTile().y+1)

		if (this._state != UnitState.Attacking)
		{
			this.handleMovement();

			if (Keyboard.isDown("W") || Keyboard.isDown("A") || Keyboard.isDown("S") || Keyboard.isDown("D"))
			{
				this._selector.setAlpha(0);
				return;
			}

			// Retrieves the mouse position, makes it relative and highlights the grid cell under the mouse
			var mouse = this._world.gridFromMouse();
			if (mouse.x < this._world.chunkWidth()-1 || mouse.y < this._world.chunkHeight() || mouse.x >= this._world.width()-this._world.chunkWidth() || mouse.y >= this._world.height()-this._world.chunkHeight())
			{
				this._selector.setAlpha(0);
				return;
			}
			var worldPos = this._world.worldFromGrid(mouse.x, mouse.y);

			var x = worldPos.x;
			var y = worldPos.y;

			var col = {r: 0, g: 0, b: 0};

			var currentTile = this.currentTile();

			if (this._world.isImpassable(mouse.x,mouse.y) || 
				(!this.isNeighbourTile(mouse.x,mouse.y) && this._world.cellType(mouse.x,mouse.y) != CellType.Unit) ||
				(mouse.x == currentTile.x && mouse.y == currentTile.y))
			{
				col.r = 1;
			}
			else if(this._world.cellType(mouse.x,mouse.y) != CellType.Unit)
			{
				col.g = 1;
			}
			else if(this.isNeighbourTile(mouse.x,mouse.y))
			{
				col.r = 1;
				col.g = 1;
			}
			else
			{
				col.r = 1;
			}

			this._selector.setAlpha(0.2);
			this._selector.setPosition(x,y);
			this._selector.setBlend(col.r,col.g,0,1);
			DrawRectangle(x - this._world.cellSize() / 2, y + this._world.cellSize() / 2, x + this._world.cellSize() / 2, y - this._world.cellSize() / 2, 9, col.r, col.g, col.b);
		}
		else
		{
			this._selector.setAlpha(0);
		}
	}
}

// Overrides the toString method of the player class
Player.prototype.toString = function()
{
	return "Player";
}