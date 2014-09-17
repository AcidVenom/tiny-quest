var CharacterDefinitions = {
	player: 
	{
		texture: "textures/characters/hero/hero.png",
		hp: 25,
		stamina: Classes[Character.class].stats.stamina,
		mana: Classes[Character.class].stats.mana,
		attackDamage: Classes[Character.class].stats.attackDamage,
		rangedDamage: Classes[Character.class].stats.rangedDamage,
		magicDamage: Classes[Character.class].stats.magicDamage,
		defense: Classes[Character.class].stats.defense
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
			["rat_meat","Always"]
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
			["coins",1,3],
			["rat_meat","Always"]
		]
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
		]
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

CharacterDefinitions.updatePlayerStats = function()
{
	var definition = CharacterDefinitions["player"];

	definition.stamina = Classes[Character.class].stats.stamina;
	definition.mana = Classes[Character.class].stats.mana;
	definition.attackDamage = Classes[Character.class].stats.attackDamage;
	definition.rangedDamage = Classes[Character.class].stats.rangedDamage;
	definition.magicDamage = Classes[Character.class].stats.magicDamage;
	definition.defense = Classes[Character.class].stats.defense;
}