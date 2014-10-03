enumerator("BonusTypes",[
	"Increase",
	"Decrease",
	"Multiply"
	]);

var Bonus = function(name,value,type,condition)
{
	this._name = name;
	this._value = value;
	this._type = type;
	this._condition = condition || function(unit){ return true; }

	this.evaluate = function(unit)
	{
		return this._condition(unit);
	}

	this.name = function()
	{
		return this._name;
	}

	this.value = function()
	{
		return this._value;
	}

	this.type = function()
	{
		return this._type;
	}
}

var BonusHandler = function(unit)
{
	this._unit = unit;
	this._bonusses = [];

	this.setUnit = function(unit)
	{
		this._unit = unit;
	}

	this.addBonus = function(name,value,type,condition)
	{
		this._bonusses.push(new Bonus(name,value,type,condition));
	}

	this.update = function()
	{
		var effects = {
			attackDamage: 0,
			rangedDamage: 0,
			magicDamage: 0,
			defense: 0,
			maxStamina: 0,
			maxHealth: 0,
			maxMana: 0,
		}

		if (this._bonusses.length < 1)
		{
			return;
		}

		var doLast = [];

		for (var i = this._bonusses.length-1; i >= 0; --i)
		{
			var bonus = this._bonusses[i];

			if (bonus.evaluate(this._unit) == true)
			{
				if (bonus.type() == BonusTypes.Multiply)
				{
					doLast.push(bonus);
					continue;
				}

				var mod = bonus.type() == BonusTypes.Increase ? 1 : -1;
				effects[bonus.name()] += bonus.value() * mod;
			}
			else
			{
				this._bonusses.splice(i,1);
			}
		}

		for (var key in effects)
		{
			effects[key] += this._unit[key]();
		}

		for (var i = 0; i < doLast.length; ++i)
		{
			effects[bonus.name()] *= bonus.value();
		}

		this._unit.applyEffects(effects);
	}
}