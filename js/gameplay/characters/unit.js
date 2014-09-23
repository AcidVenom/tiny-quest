require("js/data_files/character_definitions");

enumerator("UnitStates",[
	"Moving",
	"Attacking",
	"Idle",
	"Hit",
	"Dying"
	])

enumerator("UnitTypes",[
	"Player",
	"Enemy"
	])

enumerator("AttackType",[
	"Melee",
	"Ranged"
	])

var LoadedUnitTextures = {}
var UnitIDs = {}

var OverheadBar = function()
{
	this._frame = new GameObject(36,8);
	this._frame.setTexture("textures/ui/overhead_frame.png");

	this._bar = new GameObject(34,6);
	this._bar.setTexture("textures/ui/overhead_bar.png");

	this._bar.setZ(130);
	this._frame.setZ(120);

	this._bar.spawn();
	this._frame.spawn();

	this._bar.setOffset(0,0.5,0.5);
	this._frame.setOffset(0.5,0.5,0.5);

	this._z = 120;
	this._alpha = 0;

	this.destroy = function()
	{
		this._frame.destroy();
		this._bar.destroy();
	}

	this.spawn = function()
	{
		this._frame.spawn();
		this._bar.spawn();
	}

	this.setZ = function(z)
	{
		this._z = z;
	}

	this.setPosition = function(x,y)
	{
		this._frame.setTranslation(x,y+16,this._z);
		this._bar.setTranslation(x-17,y+16,this._z + 10);
	}

	this.setMinMax = function(min,max)
	{
		this._bar.setScale(min/max*34,0,6);
	}

	this.update = function(dt,unit)
	{
		var translation = unit.translation();
		this.setPosition(translation.x,translation.y);
		this.setMinMax(unit.health(),unit.maxHealth());
	}
}

var Unit = function(level,x,y,type,name)
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
	this._damageTimer = 0;
	this._jumpTimer = 0;
	this._attackTimer = 0;
	this._wobbleTimer = 0;
	this._deathTimer = 0;
	this._attacked = false;
	this._removed = false;
	this._attackType = {type: AttackType.Melee, texture: undefined};
	this._type = type;

	this._overHead = undefined;

	this._state = UnitStates.Idle;

	var unit = CharacterDefinitions[name];
	this._definition = unit;

	this._maxHealth = unit.hp;
	this._maxStamina = unit.stamina;
	this._maxMana = 10;

	this._health = this._maxHealth;
	this._stamina = this._maxStamina;
	this._mana = this._maxMana;

	this._attackDamage = unit.attackDamage;
	this._rangedDamage = unit.rangedDamage;
	this._magicDamage = unit.magicDamage;

	this._defense = unit.defense;
	this._projectile = undefined;

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

	this.type = function()
	{
		return this._type;
	}

	this.maxHealth = function()
	{
		return this._maxHealth;
	}

	this.health = function()
	{
		return this._health;
	}

	this.maxStamina = function()
	{
		return this._maxStamina;
	}

	this.stamina = function()
	{
		return this._stamina;
	}

	this.maxMana = function()
	{
		return this._maxMana;
	}

	this.mana = function()
	{
		return this._mana;
	}

	this.tile = function()
	{
		return this._tile;
	}

	this.position = function()
	{
		return this._position;
	}

	this.setPosition = function(x,y)
	{
		this._tile = this._dungeon.tileAt(x,y);
		this._tile.setUnit(this);

		this._position.x = this._tile.position().x;
		this._position.y = this._tile.position().y;
		this._indices.x = x;
		this._indices.y = y;

		this._setPosition(this._position.x+16,this._position.y-10-16);
		this.setZ(y/100+0.001);
	}

	this.jumpTo = function(x,y)
	{
		var tile = this._dungeon.tileAt(x,y);
		if (!tile.isImpassable() && this._state == UnitStates.Idle || x == this._indices.x && y == this._indices.y)
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

	this.getAttackType = function(type,texture)
	{
		return {
			type: type,
			texture: texture
		}
	}

	this.attackNode = function(x,y,attackType)
	{
		if (attackType === undefined)
		{
			this._attackType = {
				type: AttackType.Melee,
				texture: undefined
			}
		}
		else
		{
			this._attackType = attackType;
		}

		var tile = this._dungeon.tileAt(x,y);
		if (this._state == UnitStates.Idle)
		{
			if (this._attackType.type == AttackType.Ranged)
			{
				this._projectile = new GameObject(16,16);
				this._projectile.setTexture(this.getProjectile());
				this._projectile.spawn();
				this._projectile.setZ(900);
				this._projectile.setPosition(this._position.x+8,this._position.y-18);
			}
			this._attacked = false;
			this._state = UnitStates.Attacking;
			this._target = tile;
			this._attackTimer = 0;
		}
	}

	this.getProjectile = function()
	{
		Log.warning("Override this.getProjectile for an appropriate projectile, defaulting");
		return "textures/items/projectiles/slingshot_projectile.png";
	}

	this.state = function()
	{
		return this._state;
	}

	this.increaseHealth = function(amount)
	{
		if (this._health + amount > this._maxHealth)
		{
			this._health = this._maxHealth;
		}
		else
		{
			this._health += amount;
		}
	}

	this.decreaseHealth = function(amount)
	{
		if (this._health - amount < 0)
		{
			this._health = 0;
		}
		else
		{
			this._health -= amount;
		}
	}

	this.damage = function(amount)
	{
		var damage = amount - this._defense;

		if (damage <= 0)
		{
			damage = 1;
		}
		
		this.decreaseHealth(damage);
		
		this._state = UnitStates.Hit;

		this.setUniform("float", "Hit", 1);
		this._damageTimer = 0;
		this._level.shakeCamera(2,0.15);

		this.onHit(damage);
	}

	this.onHit = function(damage)
	{

	}

	this.update = function(dt)
	{
		this.updateMovement(dt);
	}

	this.updateMovement = function(dt)
	{
		if (this._health == 0 && this._state != UnitStates.Dying)
		{
			this._alpha = 1;
			this._state = UnitStates.Dying;
		}

		if (this._state == UnitStates.Dying)
		{
			if (this._deathTimer < Math.PI)
			{
				this._deathTimer += dt*5;
				this._alpha = Math.PI - this._deathTimer;

				var alpha = Math.floor(Math.sin(this._deathTimer*10)+1);
				this.setAlpha(alpha*this._alpha);

				this._setPosition(this._position.x+16,this._position.y-16-10);
			}
			else if (this._removed == false)
			{
				Log.info("Unit with name " + this.worldName() + " died");
				this.removeFromPlay();
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
		else if (this._state == UnitStates.Moving)
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

				var x = this._position.x;
				var y = this._position.y;

				if (this._attackType.type == AttackType.Melee)
				{
					x = Math.lerp(this._position.x,this._target.position().x,timer);
					y = Math.lerp(this._position.y,this._target.position().y,timer);
				}
				else if (this._projectile !== undefined)
				{
					var xx = Math.lerp(this._position.x+8,this._target.position().x+8,timer);
					var yy = Math.lerp(this._position.y-18,this._target.position().y-18,timer);

					this._projectile.setPosition(xx,yy);
				}
				
				if (x < this._position.x)
				{
					this.setScale(-32,32,32);
				}
				this._setPosition(x+16,y-16-10);

				if (this._attackTimer > Math.PI/2 && this._attacked == false)
				{
					if (this._target.unit() !== undefined)
					{
						if (this._attackType.type == AttackType.Melee)
						{
							this._target.unit().damage(this._attackDamage);
						}
						else if (this._attackType.type == AttackType.Ranged)
						{
							this._target.unit().damage(Math.floor(this._rangedDamage / 2));
						}
						else if (this._attackType.type == AttackType.Magic)
						{
							this._target.unit().damage(this._magicDamage);
						}
						this._attacked = true;
					}

					if (this._projectile !== undefined)
					{
						this._projectile.destroy();
						this._projectile = undefined;
					}
				}
			}
			else
			{
				this.setScale(32,32,32);
				this._state = UnitStates.Idle;
				this.onAttacked(this._target.unit());
			}
		}
		else
		{
			this._wobbleTimer += dt*4;
			var x = this._position.x;
			var y = this._position.y;

			this._setPosition(x+16,y-16-10-Math.abs(Math.sin(this._wobbleTimer)*3));
		}

		this._overHead.update(dt,this);
	}

	this.initialise = function()
	{
		this.setOffset(0.5,0.5,0.5);
		if (this._type == UnitTypes.Player)
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

		this._tile = this._dungeon.tileAt(x,y);
		this._overHead = new OverheadBar();

		this.jumpTo(x,y);

		Log.success("Created a unit with name " + name);
	}

	this.removeFromPlay = function()
	{
		if (this._type == UnitTypes.Enemy)
		{
			//Drop something here
		}
		if (this._tile)
		{
			this._tile.removeUnit();
		}
		this._removed = true;
		this._overHead.destroy();
		this.destroy();
	}

	this.removed = function()
	{
		return this._removed;
	}

	this.initialise();
}