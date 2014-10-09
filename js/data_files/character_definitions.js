var CharacterDefinitions = {
	player: 
	{
		texture: "textures/characters/hero/hero.png",
		hp: 20,
		stamina: 0,
		mana: 0,
		attackDamage: 0,
		rangedDamage: 0,
		magicDamage: 0,
		defense: 0
	},

	mouse_grey:
	{
		texture: "textures/characters/mice/mouse_grey.png",
		hp: 4,
		stamina: 2,
		mana: 0,
		attackDamage: 2,
		rangedDamage: 0,
		magicDamage: 0,
		defense: 1,
		drops: [
			["rat_meat","Always",[1,1]]
		]
	},

	mouse_brown:
	{
		texture: "textures/characters/mice/mouse_brown.png",
		hp: 4,
		stamina: 2,
		mana: 0,
		attackDamage: 4,
		rangedDamage: 0,
		magicDamage: 0,
		defense: 1,
		drops: [
			["coins",1,[1,3]],
			["rat_meat","Always",[1,1]]
		],
		dropChance: 0.8
	},

	slime_blue:
	{
		texture: "textures/characters/slimes/slime_blue.png",
		hp: 15,
		stamina: 2,
		mana: 0,
		attackDamage: 2,
		rangedDamage: 0,
		magicDamage: 0,
		defense: 2,
		drops: [
			["coins",1,[1,9]]
		]
	},

	slime_green:
	{
		texture: "textures/characters/slimes/slime_green.png",
		hp: 12,
		stamina: 2,
		mana: 0,
		attackDamage: 3,
		rangedDamage: 0,
		magicDamage: 0,
		defense: 2,
		drops: [
			["coins",1,[1,9]]
		],
		dropChance: 0.5
	},

	beetle_brown:
	{
		texture: "textures/characters/beetles/beetle_brown.png",
		hp: 10,
		stamina: 2,
		mana: 0,
		attackDamage: 6,
		rangedDamage: 0,
		magicDamage: 0,
		defense: 3
	}
}