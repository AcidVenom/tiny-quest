var AStarNode = function(parent,g,h,data)
{
	this.parent = parent;
	this.G = g || 0;

	if (this.parent !== undefined)
	{
		this.G = this.parent.G + g;
	}

	this.H = h || 0;
	this.F = this.G + this.H;
	this.data = data;
}

var AStar = 
{
	_openList: [],
	_closedList: [],
	_from: undefined,
	_to: undefined,
	_current: undefined,

	getPath: function(from,to,getNeighbours,G,heuristic)
	{
		this._closedList = [];
		this._openList = [];

		this._from = new AStarNode(undefined,0,heuristic(from,to),from);
		this._to = new AStarNode(undefined,0,0,to);

		if (this._from.data == this._to.data)
		{
			return [];
		}

		this._current = this._from;

		this._openList.push(this._from);

		while(this._openList.length != 0)
		{
			this._current = this.findPath(this._current,getNeighbours,G,heuristic);

			if (this._current == undefined)
			{
				return [];
			}
			if (this._current.data == this._to.data)
			{
				this._to.parent = this._current;
				this._closedList.push(this._to)
				break;
			}
		}

		var last = this._closedList[this._closedList.length-1];
		var path = [];

		while(last.parent !== undefined)
		{
			path.push(last.data);
			last = last.parent;
		}

		path.reverse();

		this._closedList = [];
		this._openList = [];

		this._from = undefined;
		this._to = undefined;
		this._current = undefined;

		return path;
	},

	findPath: function(current,getNeighbours,G,heuristic)
	{

		var neighbours = getNeighbours(current.data);
		var col = Math.random();
		for (var i = 0; i < neighbours.length; ++i)
		{
			if (this.validateNeighbour(neighbours[i]) == true)
			{
				this._openList.push(new AStarNode(this._current,G,heuristic(neighbours[i],this._to.data),neighbours[i]));
			}
		}

		this.close(current);

		return this.getNodeWithLowestCost();
	},

	validateNeighbour: function(neighbour)
	{				
		for (var i = 0; i < this._openList.length; ++i)
		{
			var node = this._openList[i];

			if (neighbour == node.data)
			{
				return false;
			}
		}

		for (var i = 0; i < this._closedList.length; ++i)
		{
			var node = this._closedList[i];

			if (neighbour == node.data)
			{
				return false;
			}
		}

		return true;
	},

	close: function(node)
	{
		this._openList.splice(this._openList.indexOf(node),1);
		this._closedList.push(node);
	},

	getNodeWithLowestCost: function()
	{
		var lowestNode = undefined;

		for (var i = 0; i < this._openList.length; ++i)
		{
			var node = this._openList[i];
			if (lowestNode === undefined)
			{
				lowestNode = node;
				continue;
			}

			if (node.F < lowestNode.F)
			{
				lowestNode = node;
			}
		}

		return lowestNode;
	}
}