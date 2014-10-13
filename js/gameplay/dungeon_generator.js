require("js/gameplay/tile");

enumerator("DungeonTiles",[
	"Empty",
	"Room",
	"Floor",
	"Wall"
])

var Room = function(x,y,w,h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.connections = [];
}

var DungeonGenerator = function(w,h,tileW,tileH,noRooms,minRoomW,minRoomH,maxRoomW,maxRoomH)
{
	this._definition = undefined;
	this._metrics = {w: w, h: h}
	this._tileSize = {w: tileW, h: tileH}

	this._numRooms = noRooms;
	this._currentRooms = 0;
	this._roomWidth = {min: minRoomW, max: maxRoomW}
	this._roomHeight = {min: minRoomH, max: maxRoomH}

	this._grid = [];
	this._rooms = [];

	this._chunk = undefined;

	this.tileAt = function(x,y)
	{
		if (x < 0 || y < 0 || x >= this._metrics.w || y >= this._metrics.h)
		{
			return undefined;
		}
		return this._grid[x][y];
	}

	this.setDefinition = function(def)
	{
		this._definition = def;
	}

	this.definition = function()
	{
		return this._definition;
	}

	this.destroy = function()
	{
		for (var x = 0; x < this._grid.length; ++x)
		{
			for (var y = 0; y < this._grid[0].length; ++y)
			{
				if (this._grid[x][y] != DungeonTiles.Empty)
				{
					this._grid[x][y].destroy();
				}
			}
		}
	}

	this.unload = function()
	{
		for (var key in this._definition.textures)
		{
			if (key != "wall_special")
			{
				for (var i = 0; i < this._definition.textures[key].length; ++i)
				{
					ContentManager.unload("texture",this._definition.textures[key][i][0]);
				}
			}
			else
			{
				for (var i = 0; i < this._definition.textures[key].tiles.length; ++i)
				{
					ContentManager.unload("texture",this._definition.textures[key].tiles[i][0]);
				}
			}
		}
	}

	this.generate = function()
	{
		for (var key in this._definition.textures)
		{
			if (key != "wall_special")
			{
				for (var i = 0; i < this._definition.textures[key].length; ++i)
				{
					ContentManager.load("texture",this._definition.textures[key][i][0]);
				}
			}
			else
			{
				for (var i = 0; i < this._definition.textures[key].tiles.length; ++i)
				{
					ContentManager.load("texture",this._definition.textures[key].tiles[i][0]);
				}
			}
		}
		for (var x = 0; x < this._metrics.w; ++x)
		{
			this._grid[x] = [];
			for (var y = 0; y < this._metrics.h; ++y)
			{
				this._grid[x][y] = DungeonTiles.Empty;
			}
		}

		
		while (this._currentRooms != this._numRooms)
		{
			this.fitRoom();
			++this._currentRooms;
		}

		this.connectRooms();
		this.placeWalls();

		Log.success("Successfully generated a dungeon");
	}

	this.fitRoom = function()
	{
		var w, h, x, y;
		var found = false;
		var failed = false;
		var attempts = 1;

		while (!found)
		{
			failed = false;

			w = Math.floor(Math.randomRange(this._roomWidth.min,this._roomWidth.max));
			h = Math.floor(Math.randomRange(this._roomHeight.min,this._roomHeight.max));

			x = Math.floor(Math.randomRange(1,this._metrics.w-w-1));
			y = Math.floor(Math.randomRange(2,this._metrics.h-h-1));

			for (var xx = x; xx < x+w; ++xx)
			{
				if (failed == true)
				{
					break;
				}
				for (var yy = y; yy < y+h; ++yy)
				{
					if (this._grid[xx][yy] != DungeonTiles.Empty)
					{
						Log.debug("Room did not fit");
						failed = true;
						++attempts;
						break;
					}
				}
			}

			if (!failed)
			{
				this._rooms.push(new Room(x,y,w,h));

				for (var xx = x; xx < x+w; ++xx)
				{
					for (var yy = y; yy < y+h; ++yy)
					{
						this.placeTile(xx,yy,DungeonTiles.Room);
					}
				}

				found = true;
			}
			else if (attempts > 9)
			{
				Log.fatal("Fitting took 10 attempts! The dungeon is probably not big enough for the number of rooms");
				break;
			}
		}

		Log.info("Fitting room took " + String(attempts) + " attempt(s)");
	}

	this.roomCenter = function(room)
	{
		return {x: Math.floor(room.x+room.w/2), y: Math.floor(room.y+room.h/2)}
	}

	this.findNearestRoom = function(roomA,condition)
	{
		var nearest = undefined;
		var nearestDistance = 0;
		var centerA = this.roomCenter(roomA);
		var centerB = undefined;
		var distance = 0;
		var roomB;

		for (var i = 0; i < this._rooms.length; ++i)
		{
			roomB = this._rooms[i];

			if (roomB == roomA)
			{
				continue;
			}

			if (condition(roomA,roomB) == false)
			{
				continue;
			}

			centerB = this.roomCenter(roomB);
			distance = Math.distance(centerA.x,centerA.y,centerB.x,centerB.y);
			if (nearest === undefined)
			{
				nearest = roomB;
				nearestDistance = distance;
			}
			else
			{
				if (distance < nearestDistance)
				{
					nearest = roomB;
					nearestDistance = distance;
				}
			}
		}

		return nearest;
	}

	this.placeTile = function(x,y,type)
	{
		var tile = new Tile(x,y,type,this._grid,this._definition.textures);
		this._grid[x][y] = tile;

		return tile;
	}

	this.connectRooms = function()
	{
		var condition = function(roomA,roomB)
		{
			for (var i = 0; i < roomA.connections.length; ++i)
			{
				if (roomA.connections[i] == roomB)
				{
					return false;
				}
			}

			return true;
		}

		var roomA,roomB,position,target;

		for (var i = 0; i < this._rooms.length; ++i)
		{
			roomA = this._rooms[i];

			if (roomA.connections.length < 3)
			{
				for (var i = 0; i < 3; ++i)
				{
					roomB = this.findNearestRoom(roomA,condition);
		
					roomA.connections.push(roomB);
					roomB.connections.push(roomA);
					if (roomA.connections.length > 2)
					{
						break;
					}
				}
			}
		}

		for (var i = 0; i < this._rooms.length; ++i)
		{
			roomA = this._rooms[i];

			for (var c = 0; c < roomA.connections.length; ++c)
			{
				roomB = roomA.connections[c];
				position = this.roomCenter(roomA);
				target = this.roomCenter(roomB);

				while (position.x != target.x)
				{
					if (position.x < target.x)
					{
						++position.x;
					}
					else if (position.x > target.x)
					{
						--position.x;
					}
					
					if (this._grid[position.x][position.y-1] != DungeonTiles.Floor && this._grid[position.x][position.y+1] != DungeonTiles.Floor)
					{
						if (this._grid[position.x][position.y] != DungeonTiles.Room && this._grid[position.x][position.y] == DungeonTiles.Empty)
						{
							this.placeTile(position.x,position.y,DungeonTiles.Floor);
						}
					}
				}

				while (position.y != target.y)
				{
					if (position.y < target.y)
					{
						++position.y;
					}
					else if (position.y > target.y)
					{
						--position.y;
					}
					
					if (this._grid[position.x-1][position.y] != DungeonTiles.Floor && this._grid[position.x+1][position.y] != DungeonTiles.Floor)
					{
						if (this._grid[position.x][position.y] != DungeonTiles.Room && this._grid[position.x][position.y] == DungeonTiles.Empty)
						{
							this.placeTile(position.x,position.y,DungeonTiles.Floor);
						}
					}
				}
			}
		}
	}

	this.placeWall = function(x,y,offsetX,offsetY)
	{
		if (this._grid[x+offsetX] != undefined)
		{
			if (this._grid[x+offsetX][y+offsetY] != undefined)
			{
				if (this._grid[x][y] == DungeonTiles.Empty && this._grid[x+offsetX][y+offsetY] != DungeonTiles.Empty && this._grid[x+offsetX][y+offsetY].type() != DungeonTiles.Wall)
				{
					this.placeTile(x,y,DungeonTiles.Wall);
				}
			}
		}
	}

	this.placeWalls = function()
	{
		for (var x = 0; x < this._grid.length; ++x)
		{
			for (var y = 0; y < this._grid[0].length; ++y)
			{
				this.placeWall(x,y,0,1);
				this.placeWall(x,y,0,-1);
				this.placeWall(x,y,1,0);
				this.placeWall(x,y,-1,0);
				this.placeWall(x,y,1,1);
				this.placeWall(x,y,-1,1);
				this.placeWall(x,y,-1,-1);
				this.placeWall(x,y,1,-1);
			}
		}
	}

	this.getChunk = function(x,y,w,h)
	{
		var chunk = [];

		var startX = Math.floor(x+0.5);
		var startY = Math.floor(y+0.5);

		if (startX < 0)
		{
			startX = 0;
		}

		if (startY < 0)
		{
			startY = 0;
		}

		var endX = startX+Math.floor(w+0.5);
		var endY = startY+Math.floor(h+0.5);

		if (endX > this._grid.length)
		{
			endX = this._grid.length;
		}

		if (endY > this._grid[0].length)
		{
			endY = this._grid[0].length;
		}
		
		var tile;

		for (var xx = startX; xx < endX; ++xx)
		{
			for (var yy = startY; yy < endY; ++yy)
			{
				tile = this.tileAt(xx,yy);
				if (tile != DungeonTiles.Empty)
				{
					chunk.push(tile);
				}
			}
		}

		return chunk;
	}

	this.getPlayerTile = function()
	{
		var found = false;
		for (var y = 0; y < this._grid[0].length; ++y)
		{
			if (found !== false)
			{
				break;
			}
			for (var x = 0; x < this._grid.length; ++x)
			{
				if (this._grid[x][y] != DungeonTiles.Empty && this._grid[x][y].type() == DungeonTiles.Room)
				{
					found = {x: x, y: y}
					break;
				}
			}
		}

		return found;
	}

	this.tileDistance = function(x1,y1,x2,y2)
	{
		return Math.abs(x2 - x1) + Math.abs(y2 - y1);
	}

	this.placeShopKeeper = function(x,y,minDistance)
	{
		minDistance = minDistance || 50;
		var room, center, found = false;
		for (var i = 0; i < this._rooms.length; ++i)
		{
			room = this._rooms[i];
			center = this.roomCenter(room);
			if (this.tileDistance(x,y,center.x,center.y) > minDistance)
			{
				found = true;
				break;
			}
		}

		if (found == true)
		{
			Log.success("Found a room for the shopkeeper");
			var tile = this._grid[center.x][center.y];
		}
		else
		{
			Log.info("Found no room for the shopkeeper");
		}
	}
}