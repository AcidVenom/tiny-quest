var Character = Character || {
	class: "warrior",

	statIncreases:
	{
		attackDamage: 0,
		magicDamage: 0,
		rangedDamage: 0,
		defense: 0,
		stamina: 0
	},

	equipped:
	[
		"wooden_sword"
	],

	inventory: 
	[
		"broken_sword",
		"leather_body",
		"leather_helmet",
		"minor_health_potion",
		"minor_health_potion",
		"minor_health_potion",
		"minor_health_potion",
		"minor_health_potion",
		"minor_health_potion"
	],

	coins: 0,
	blend: [1,1,1],
	sliderRgb: [0.8,0.8,0.8],
	hair: 0
}

Character.calculateStats = function()
{
	var stats = Classes[Character.class].stats;

	return {
		attackDamage: stats.attackDamage + Character.statIncreases.attackDamage,
		magicDamage: stats.magicDamage + Character.statIncreases.magicDamage,
		rangedDamage: stats.rangedDamage + Character.statIncreases.rangedDamage,
		defense: stats.defense + Character.statIncreases.defense,
		stamina: stats.stamina + Character.statIncreases.stamina
	}
}