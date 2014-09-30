ParticleDefinitions["on_hit"] = {
	size: {w: 6, h: 6},
	type: ParticleType.SpawnCount,
	z: 999,
	texture: "textures/pfx/on_hit.png",
	spawnCount: 12,
	lifeTime: 0.6,
	loop: false,
	spawnFunction: function(particle,params)
	{
		particle.position.y -= 16;
		particle.position.y -= Math.randomRange(-20,20);
		particle.position.x -= Math.randomRange(-5,5);
		particle.position.x += 16;
		particle.startY = particle.position.y;
		particle.offset.y = -0.5;
		particle.velocity.y = -250;
		particle.velocity.x = Math.randomRange(-30,30);
	},

	timeFunction: function(particle,time,params,dt)
	{
		particle.setAlpha(Math.sin(time*Math.PI));

		var scale = Math.lerp(1,0.5,time);
		particle.size.w = scale;
		particle.size.h = scale;

		particle.velocity.y += 800*dt;
	},

	destroyOnEnd: true
}