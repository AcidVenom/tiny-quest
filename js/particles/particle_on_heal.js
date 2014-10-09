ParticleDefinitions["on_heal"] = {
	size: {w: 16, h: 16},
	type: ParticleType.SpawnCount,
	z: 999,
	texture: "textures/pfx/on_heal.png",
	spawnCount: 5,
	lifeTime: 1,
	loop: false,
	spawnFunction: function(particle,params)
	{
		particle.offset = {x: -0.5, y: -0.5}
		particle.velocity.y = -60;
		particle.position.x += Math.randomRange(-16,16);
		particle.position.y += Math.randomRange(-4,4);
	},

	timeFunction: function(particle,time,params,dt)
	{
		particle.alpha = Math.lerp(1,0,time);
	},

	destroyOnEnd: true
}