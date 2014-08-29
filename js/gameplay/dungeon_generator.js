enumerator("DungeonTiles",[
	"Empty",
	"Room",
	"Wall"
])

var DungeonGenerator = function(w,h,tileW,tileH,noRooms,minRoomW,minRoomH,maxRoomW,maxRoomH)
{
	this._metrics = {w: w, h: h}
	this._tileSize = {w: tileW, h: tileH}

	this._numRooms = noRooms;
	this._currentRooms = 0;
	this._roomWidth = {min: minRoomW, max: maxRoomW}
	this._roomHeight = {min: minRoomH, max: maxRoomH}

	this._grid = [];

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

		Log.success("Successfully generated a dungeon");
	}

	this.fitRoom = function()
	{
		var w, h, x, y;
		var found = false;
		var failed = false;
		var attempts = 0;

		while (!found)
		{
			w = Math.floor(Math.randomRange(this._roomWidth.min,this._roomWidth.max));
			h = Math.floor(Math.randomRange(this._roomHeight.min,this._roomHeight.max));

			x = Math.floor(Math.randomRange(0,this._metrics.w-w));
			y = Math.floor(Math.randomRange(0,this._metrics.h-h));

			++attempts;

			for (var xx = x; xx < x+w; ++xx)
			{
				if (failed)
				{
					break;
				}

				for (var yy = y; yy < y+h; ++yy)
				{
					if (this._grid[xx][yy] != DungeonTiles.Empty)
					{
						Log.fatal("Room did not fit");
						failed = true;
						break;
					}
				}
			}

			if (!failed)
			{
				for (var xx = x; xx < x+w; ++xx)
				{
					for (var yy = y; yy < y+h; ++yy)
					{
						this._grid[xx][yy] = DungeonTiles.Room;
					}
				}

				found = true;
			}
		}

		Log.info("Fitting room took " + String(attempts) + " attempts");
	}
}