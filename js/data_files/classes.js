var Classes = {
	warrior: {
		stats: {
			attackDamage: 5,
			magicDamage: 1,
			rangedDamage: 1,
			defense: 3,
			stamina: 5
		},

		startingEquipment: [
			"trainee_sword",
			"trainee_shield"
		]
	},

	wizard: {
		stats: {
			attackDamage: 1,
			magicDamage: 6,
			rangedDamage: 1,
			defense: 1,
			stamina: 4
		},

		startingEquipment: [
			"twig_wand",
			["scroll_spark",1]
		]
	},

	thief: {
		stats: {
			attackDamage: 2,
			magicDamage: 1,
			rangedDamage: 4,
			defense: 2,
			stamina: 6
		},

		startingEquipment: [
			"slingshot",
			["throwing_knife",5]
		]
	},

	newborn: {
		stats: {
			attackDamage: 2,
			magicDamage: 2,
			rangedDamage: 2,
			defense: 3,
			stamina: 3
		},

		startingEquipment: []
	},

	hardcore: {
		stats: {
			attackDamage: 1,
			magicDamage: 1,
			rangedDamage: 1,
			defense: 1,
			stamina: 1
		},

		startingEquipment: []
	}
}