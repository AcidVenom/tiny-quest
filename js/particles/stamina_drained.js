ParticleDefinitions["stamina_drained"] = {
	size: {w: 32, h: 32},
	type: ParticleType.SpawnCount,
	z: 999,
	texture: "textures/pfx/out_of_stamina.png",
	spawnCount: 1,
	lifeTime: 0.5,
	loop: false,
	spawnFunction: function(particle)
	{
		particle.position.y -= 20;
		particle.startY = particle.position.y;
		particle.offset.y = -0.5
		particle.setAlpha(1);
	},

	timeFunction: function(particle,time)
	{
		particle.setAlpha(Math.sin(time*Math.PI*2));
		particle.position.y = Math.lerp(particle.startY,particle.startY+40,time);
	},

	destroyOnEnd: true
}