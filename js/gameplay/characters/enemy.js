var Enemy = function(level,x,y,key)
{
	this.__unit = new Unit(level,x,y,key);
	this._camera = level.camera();
	this._shouldMove = false;
	
	extend(this,this.__unit);

	this.getValidTile = function(x,y,tiles)
	{
		var tile = this._dungeon.tileAt(x,y);

		if (!tile.isImpassable())
		{
			tiles.push(tile);
		}
	}

	this.onArrived = function()
	{
		var x = this._indices.x;

		if (x < this._level.player().tile().indices().x)
		{
			this.setScale(32,32,32);
		}
		else
		{
			this.setScale(-32,32,32);
		}

		if (this._tile.visible())
		{
			this.spawn();
		}
		else
		{
			this.destroy();
		}

		this._shouldMove = false;
	}

	this.isNeighbourOfPlayer = function()
	{
		var pos = this._level.player().tile().indices();
		var x = pos.x;
		var y = pos.y;

		var check1 = this._dungeon.tileAt(x+1,y).unit() === this
		var check2 = this._dungeon.tileAt(x,y+1).unit() === this
		var check3 = this._dungeon.tileAt(x-1,y).unit() === this
		var check4 = this._dungeon.tileAt(x,y-1).unit() === this

		if (check1 || check2 || check3 || check4)
		{
			return true;
		}

		return false;
	}

	this.move = function()
	{
		this._shouldMove = true;
	}

	this.update = function(dt)
	{
		this.updateMovement(dt);
		
		if (this._shouldMove == true)
		{
			var self = this;
			var getNeighbours = function(tile)
			{
				var indices = tile.indices();
				var x = indices.x;
				var y = indices.y;
				var tiles = []

				self.getValidTile(x-1,y,tiles);
				self.getValidTile(x,y-1,tiles);
				self.getValidTile(x+1,y,tiles);
				self.getValidTile(x,y+1,tiles);

				return tiles;
			}

			var heuristic = function(from,to)
			{
				var fromPos = from.position();
				var toPos = to.position();

				return Math.distance(fromPos.x,fromPos.y,toPos.x,toPos.y);
			}

			if (!this.isNeighbourOfPlayer())
			{
				var neighbours = getNeighbours(this._level.player().tile());
				var lowestPath = undefined;
				for (var i = 0; i < neighbours.length; ++i)
				{
					var path = AStar.getPath(this.tile(),neighbours[i],getNeighbours,32,heuristic);

					if (path.length != 0)
					{
						if (lowestPath === undefined)
						{
							lowestPath = path;
						}
						else
						{
							if (path.length < lowestPath.length)
							{
								lowestPath = path;
							}
						}
					}
				}

				if (lowestPath !== undefined)
				{
					this.jumpTo(lowestPath[0].indices().x,lowestPath[0].indices().y);
				}
			}
			else
			{
				this._shouldMove = false;
			}
		}
	}

	this.shouldMove = function()
	{
		return this._shouldMove;
	}

	Broadcaster.register(this,Events.PlayerTurnEnded,this.move)
}