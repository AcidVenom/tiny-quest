ParticleDefinitions["smoke"] = {
	size: {w: 16, h: 16},
	type: ParticleType.SpawnCount,
	z: 999,
	texture: "textures/pfx/smoke_puff.png",
	spawnCount: 4,
	lifeTime: 2,
	loop: true,
	spawnFunction: function(particle,params)
	{
		particle.velocity.y = Math.randomRange(-5,-10);
		particle.velocity.x = Math.randomRange(-8,8);
		particle.position.y += Math.randomRange(0,-10);
	},

	timeFunction: function(particle,time,params,dt)
	{
		particle.setAlpha(Math.sin(time*Math.PI));
	},

	destroyOnEnd: false
}