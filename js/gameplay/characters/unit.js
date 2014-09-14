require("js/data_files/character_definitions");

enumerator("UnitStates",[
	"Moving",
	"Attacking",
	"Idle",
	"Hit"
	])

var LoadedUnitTextures = {}
var UnitIDs = {
}

var Unit = function(level,x,y,name)
{
	if (UnitIDs[name] === undefined)
	{
		UnitIDs[name] = 0;
	}
	else
	{
		UnitIDs[name] += 1;
	}
	this._level = level;
	this._dungeon = level.dungeon();
	this._tile = undefined;
	this._name = name;
	this._worldName = this._name + "_" + String(UnitIDs[name]);
	this._position = {x: 0, y: 0}
	this._indices = {x: 0, y: 0}
	this._target = undefined;
	this._damageTimer = 1;
	this._jumpTimer = 1;
	this._attackTimer = 1;
	this._wobbleTimer = 0;

	this._maxHealth = 100;
	this._maxStamina = 30;
	this._maxMana = 10;

	this._health = this._maxHealth;
	this._stamina = this._maxStamina;
	this._mana = this._maxMana;

	this._state = UnitStates.Idle;

	var unit = CharacterDefinitions[name];

	if (unit === undefined)
	{
		Log.error("Character with name " + name + " does not exist! Defaulting");
		unit = CharacterDefinitions["player"];
	}

	var texture = CharacterDefinitions[name].texture;

	if (LoadedUnitTextures[texture] === undefined)
	{
		LoadedUnitTextures[texture] = true;
		ContentManager.load("texture",texture);
	}
	
	this.__gameObject = new GameObject(32,32,texture);
	this.__gameObject.spawn();

	extend(this,this.__gameObject);

	this.setShader("shaders/unitshading.fx");
	this.setUniform("float", "Hit", 0);

	this._setPosition = this.setPosition;

	this.tile = function()
	{
		return this._tile;
	}

	this.setPosition = function(x,y)
	{
		this._tile = this._dungeon.tileAt(x,y);
		this._tile.setUnit(this);

		this._position = this._tile.position();
		this._indices.x = x;
		this._indices.y = y;

		this._setPosition(this._position.x+16,this._position.y-10-16);
		this.setZ(y/100+0.001);
	}

	this.jumpTo = function(x,y)
	{
		var tile = this._dungeon.tileAt(x,y);
		if (!tile.isImpassable() && this._state == UnitStates.Idle)
		{
			this._jumpTimer = 0;
			this._target = tile;
			this._state = UnitStates.Moving;
			
			if (this._tile !== undefined)
			{
				this._tile.removeUnit();
			}
			tile.setUnit(this);

			if (x < this._indices.x)
			{
				this.setScale(-32,32,32);
			}
			else
			{
				this.setScale(32,32,32);
			}

			return true;
		}

		return false;
	}

	this.initialise = function()
	{
		this.setOffset(0.5,0.5,0.5);
		if (name == "player")
		{
			this.setBlend(Character.blend[0],Character.blend[1],Character.blend[2]);
		}

		if (this._dungeon.tileAt(x,y) == DungeonTiles.Empty)
		{
			Log.error("Tried to place unit on an empty dungeon tile");
		}
		else
		{
			this.setPosition(x,y);
		}

		Log.success("Created a unit with name " + name);
	}

	this.name = function()
	{
		return this._name;
	}

	this.worldName = function()
	{
		return this._worldName;
	}

	this.onArrived = function()
	{
		//Log.debug("Unit " + this._name + " arrived on tile " + this._tile.indices().x + "," + this._tile.indices().y);
	}

	this.onAttacked = function(target)
	{

	}

	this.attackNode = function(x,y)
	{
		var tile = this._dungeon.tileAt(x,y);
		if (this._state == UnitStates.Idle && tile.unit() !== undefined)
		{
			this._state = UnitStates.Attacking;
			this._target = tile;
			this._attackTimer = 0;
		}
	}

	this.state = function()
	{
		return this._state;
	}

	this.damage = function(amount)
	{
		this._state = UnitStates.Hit;
		this.setUniform("float", "Hit", 1);
		this._damageTimer = 0;
		this._level.shakeCamera(2,0.15);
	}

	this.update = function(dt)
	{
		this.updateMovement(dt);
	}

	this.updateMovement = function(dt)
	{
		if (this._state == UnitStates.Moving)
		{
			if (this._jumpTimer < 1)
			{
				this._jumpTimer += dt*5;
				var x = Math.lerp(this._position.x,this._target.position().x,this._jumpTimer);
				var y = Math.lerp(this._position.y,this._target.position().y,this._jumpTimer);

				this._setPosition(x+16,y-16-10-Math.sin(this._jumpTimer*Math.PI)*15);
				this.setZ(y/32/100+0.001)
			}
			else
			{
				this.setPosition(this._target.indices().x,this._target.indices().y);
				this._state = UnitStates.Idle;
				this._wobbleTimer = 0;
				this.onArrived();
			}
		}
		else if (this._state == UnitStates.Attacking)
		{
			if (this._attackTimer < Math.PI)
			{
				var timer = Math.abs(Math.sin(this._attackTimer))
				this._attackTimer += dt*15;
				var x = Math.lerp(this._position.x,this._target.position().x,timer);
				var y = Math.lerp(this._position.y,this._target.position().y,timer);

				if (x < this._position.x)
				{
					this.setScale(-32,32,32);
				}
				this._setPosition(x+16,y-16-10);

				if (this._attackTimer > Math.PI/2 && this._target.unit().state() != UnitStates.Hit)
				{
					this._target.unit().damage(10);
				}
			}
			else
			{
				this.setScale(32,32,32);
				this.onAttacked(this._target.unit());
				this._state = UnitStates.Idle;
			}
		}
		else if (this._state == UnitStates.Hit)
		{
			if (this._damageTimer < Math.PI/2)
			{
				this._damageTimer += dt*7;
				var x = this._position.x;
				var y = this._position.y;

				this._setPosition(x+16,y-16-10-Math.sin(this._damageTimer*2)*20);
			}
			else
			{
				this._state = UnitStates.Idle;
				this.setUniform("float", "Hit", 0);
			}
		}
		else
		{
			this._wobbleTimer += dt*4;
			var x = this._position.x;
			var y = this._position.y;

			this._setPosition(x+16,y-16-10-Math.abs(Math.sin(this._wobbleTimer)*3));
		}
	}

	this.initialise();
}