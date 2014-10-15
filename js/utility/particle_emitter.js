var ParticleProcessor = {
	_emitters: [],

	update: function(dt)
	{
		for (var i = this._emitters.length-1; i >= 0; --i)
		{
			this._emitters[i].update(dt);
			if (this._emitters[i].destroyed() == true)
			{
				this._emitters.splice(i,1);
			}
		}
	},

	clear: function()
	{
		this._emitters = [];
	},

	addEmitter: function(emitter)
	{
		this._emitters.push(emitter);
	}
}

var Particle = function(x,y,z,w,h,texture,emitter)
{
	this.__gameObject = new GameObject(w,h,texture);
	extend(this,this.__gameObject);
	this.position = {x: x, y: y}
	this.offset = {x: 0, y: 0}
	this.z = z;
	this.setZ(this.z);
	this.lifeTime = 0;
	this.maxLifeTime = emitter.lifeTime();
	this._destroyed = false;
	this.setPosition(x,y);
	this.setOffset(this.offset.x,0,this.offset.y);
	this.spawn();
	this.velocity = {x: 0, y: 0}
	this.size = {w: 1, h: 1}
	this.rotation = {x: 0, y: 0, z: 0}
	this.alpha = 1;
	this._scale = {w: w, h: h}
	this.params = emitter.params() || {}

	emitter.spawnFunction(this,this.params);

	this._destroy = this.destroy;
	this.destroy = function()
	{
		this._destroy();
		this._destroyed = true;
	}

	this.destroyed = function()
	{
		return this._destroyed;
	}

	this.update = function(dt)
	{
		this.setOffset(this.offset.x,0,this.offset.y);
		this.setPosition(this.position.x,this.position.y);
		this.setScale(this._scale.w*this.size.w, 0, this._scale.h*this.size.h);
		this.setRotation(this.rotation.x,this.rotation.y,this.rotation.z);
		this.setAlpha(this.alpha);

		if (this.lifeTime <= this.maxLifeTime)
		{
			emitter.timeFunction(this,this.lifeTime/this.maxLifeTime,this.params,dt);
			this.position.x += this.velocity.x*dt;
			this.position.y += this.velocity.y*dt;
			this.lifeTime += dt
		}
		else
		{
			this.destroy();
		}
	}
}

enumerator("ParticleType", [
	"OverTime",
	"SpawnCount"
	]);

var ParticleEmitter = function(definition,params)
{
	this._type = definition.type;
	this._position = definition.position || {x: 0, y: 0};
	this._z = definition.z;
	this._size = definition.size || {w: 32, h: 32};
	this._texture = definition.texture || undefined;
	this.spawnFunction = definition.spawnFunction || function(){};
	this.timeFunction = definition.timeFunction || function(){};
	this._time = 0;
	this._lifeTime = definition.lifeTime;
	this._particles = [];
	this._spawnCount = definition.spawnCount;
	this._spawnOn = 0;
	this._started = false;
	this._destroyed = false;
	this._loop = definition.loop;
	this._destroyOnEnd = definition.destroyOnEnd || false;
	this._params = params || {}

	this.setZ = function(z)
	{
		this._z = z;
	}

	this.start = function()
	{
		this.emit();
		this._time = 0;
		this._started = true;
	}

	this.stop = function()
	{
		this._started = false;
	}

	this.setTime = function(value)
	{
		this._time = value;
		if (this._time > 1)
		{
			this._time = 0;
		}
	}

	this.setPosition = function(x,y)
	{
		this._position = {x: x, y: y}
	}

	this.lifeTime = function()
	{
		return this._lifeTime;
	}

	this.params = function()
	{
		return this._params;
	}

	this.setParameter = function(name,value)
	{
		this._params[name] = value;
	}

	this.emit = function()
	{
		if (this._type == ParticleType.SpawnCount)
		{
			for (var i = 0; i < this._spawnCount; ++i)
			{
				this._particles.push(new Particle(this._position.x,this._position.y,this._z,this._size.w,this._size.h,this._texture,this));
			}
		}
		else
		{
			this._spawnOn = 1 / this._spawnCount;
		}
	}

	this.destroy = function()
	{
		this._destroyed = true;
	}

	this.destroyed = function()
	{
		return this._destroyed;
	}

	this.update = function(dt)
	{
		if (this._time <= 1)
		{
			this._time += dt/this._lifeTime;

			if (this._type == ParticleType.OverTime)
			{
				if (this._time % this._spawnOn < 0.1)
				{
					this._particles.push(new Particle(this._position.x,this._position.y,this._z,this._size.w,this._size.h,this._texture,this));
				}
			}
		}
		else if (this._started == true)
		{
			if (this._loop == true)
			{
				this.emit();
				this._time = 0;
			}
			else if (this._destroyOnEnd == true)
			{
				if (this._particles.length < 1)
				{
					this.destroy();
				}
			}
		}
		for (var i = this._particles.length-1; i >= 0; --i)
		{
			if (this._particles[i].destroyed())
			{
				this._particles.splice(i,1);
			}
			else
			{
				this._particles[i].update(dt);
			}
		}
	}

	ParticleProcessor.addEmitter(this);
}