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
	this._metrics = {w: w, h: h}
	this._tileSize = {w: tileW, h: tileH}

	this._numRooms = noRooms;
	this._currentRooms = 0;
	this._roomWidth = {min: minRoomW, max: maxRoomW}
	this._roomHeight = {min: minRoomH, max: maxRoomH}

	this._grid = [];

	this._tiles = [];
	this._rooms = [];

	this.generate = function()
	{
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

			x = Math.floor(Math.randomRange(0,this._metrics.w-w));
			y = Math.floor(Math.randomRange(0,this._metrics.h-h));

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
				var color = [
					Math.random(),
					Math.random(),
					Math.random()
				]

				this._rooms.push(new Room(x,y,w,h));

				for (var xx = x; xx < x+w; ++xx)
				{
					for (var yy = y; yy < y+h; ++yy)
					{
						this._grid[xx][yy] = DungeonTiles.Room;
						var tile = new GameObject(4,4);
						tile.setPosition(xx*4,yy*4);
						tile.spawn();

						tile.setBlend(color[0],color[1],color[2]);

						this._tiles.push(tile);
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

	this.drawConnections = function(dt)
	{
		for (var i = 0; i < this._rooms.length; ++i)
		{
			var roomA = this._rooms[i];
			
			for (var j = 0; j < roomA.connections.length; ++j)
			{
				var roomB = roomA.connections[j];
				var centerA = this.roomCenter(roomA);
				var centerB = this.roomCenter(roomB);

				Line.draw(centerA.x*4-_GLOBAL_["RenderWidth"]/2,_GLOBAL_["RenderHeight"]/2-centerA.y*4,100,1,0,0,centerB.x*4-_GLOBAL_["RenderWidth"]/2,_GLOBAL_["RenderHeight"]/2-centerB.y*4,100,1,0,0);
			}
		}
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

		for (var i = 0; i < this._rooms.length; ++i)
		{
			var roomB = this._rooms[i];

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
		this._grid[x][y] = type;
		var tile = new GameObject(4,4);
		tile.setPosition(x*4,y*4);
		tile.spawn();

		this._tiles.push(tile);
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

		for (var i = 0; i < this._rooms.length; ++i)
		{
			var roomA = this._rooms[i];

			if (roomA.connections.length < 3)
			{
				for (var i = 0; i < 3; ++i)
				{
					var roomB = this.findNearestRoom(roomA,condition);
		
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
			var roomA = this._rooms[i];

			for (var c = 0; c < roomA.connections.length; ++c)
			{
				var roomB = roomA.connections[c];
				var position = this.roomCenter(roomA);
				var target = this.roomCenter(roomB);

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
					
					if (this._grid[position.x][position.y] != DungeonTiles.Room)
					{
						this.placeTile(position.x,position.y,DungeonTiles.Floor);
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
					
					if (this._grid[position.x][position.y] != DungeonTiles.Room)
					{
						this.placeTile(position.x,position.y,DungeonTiles.Floor);
					}
				}
			}
		}
	}
}