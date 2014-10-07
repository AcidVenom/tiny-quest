ParticleDefinitions["on_death"] = {
	size: {w: 16, h: 16},
	type: ParticleType.SpawnCount,
	z: 999,
	texture: "textures/pfx/on_death.png",
	spawnCount: 10,
	lifeTime: 3,
	loop: false,
	spawnFunction: function(particle,params)
	{
		particle.offset = {x: 0.5, y: 0.5}
		particle.rotation.x = 0.1;
		particle.position.x += 16;
		particle.position.y -= 16;
		particle.velocity.y -= 200 + Math.randomRange(50,80);
		particle.speed = 20;
		particle.position.x += Math.randomRange(-24,24);
		particle.startX = particle.position.x;
		var randScale = Math.randomRange(1,1.5);
		particle.size = {w:randScale,h:randScale};
		var rand = Math.floor(Math.random()*2);

		switch(rand)
		{
			case 0:
				particle.direction = 1;
			break;

			case 1:
				particle.direction = -1;
			break;
		}
	},

	timeFunction: function(particle,time,params,dt)
	{
		particle.rotation.z = -Math.PI/4+Math.sin(time*10)*Math.PI/4*particle.direction;
		particle.rotation.x = time*Math.PI*10;
		particle.speed += dt*2000;
		particle.position.x = particle.startX + Math.sin(time*10)*40*particle.direction;

		if (time < 0.2)
		{
			particle.velocity.y += particle.speed*dt;
		}
		else
		{
			particle.velocity.y = 20;
		}

		particle.alpha = Math.lerp(1,0,time);
	},

	destroyOnEnd: true
}