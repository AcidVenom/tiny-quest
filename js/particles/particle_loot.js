ParticleDefinitions["loot"] = {
	size: {w: 32, h: 32},
	type: ParticleType.SpawnCount,
	z: 999,
	texture: "textures/pfx/on_heal.png",
	spawnCount: 1,
	lifeTime: 0.6,
	loop: false,
	spawnFunction: function(particle,params)
	{
		particle.offset = {x: 0.5, y: 0.5}
		particle.setTexture(params.texture);
		particle.target = {x: particle.position.x - 290 + 16 + Math.randomRange(-16,16), y: particle.position.y - 150 - 16 + Math.randomRange(-16,16)}
		particle.start = {x: particle.position.x+16, y: particle.position.y-16}
		particle.size = {w: 0, h: 0}
		particle.dir = Math.floor(Math.random()+0.5);
	},

	timeFunction: function(particle,time,params,dt)
	{
		var e = particle.dir == 0 ? Math.easeOutQuadratic(time, 0, 1, 1) : Math.easeInQuadratic(time, 0, 1, 1);

		particle.position.y = Math.easeToInterpolation(particle.start.y,particle.target.y,e);
		particle.position.x = Math.lerp(particle.start.x,particle.target.x,time);

		var size = Math.lerp(0, 1, Math.sin(time*Math.PI));
		particle.size.w = size*1.25;
		particle.size.h = size*1.25;
	},

	destroyOnEnd: true
}