var Classes = Classes || {
	warrior: {
		stats: {
			attackDamage: 5,
			magicDamage: 1,
			rangedDamage: 1,
			defense: 3,
			stamina: 4
		},

		startingItems: [
			"trainee_sword",
			"trainee_shield"
		]
	},

	wizard: {
		stats: {
			attackDamage: 1,
			magicDamage: 5,
			rangedDamage: 1,
			defense: 2,
			stamina: 5
		},

		startingItems: [
			"twig_wand",
			"scroll_spark"
		]
	},

	thief: {
		stats: {
			attackDamage: 3,
			magicDamage: 0,
			rangedDamage: 5,
			defense: 1,
			stamina: 5
		},

		startingItems: [
			"slingshot",
			"throwing_knife"
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

		startingItems: []
	},

	hardcore: {
		stats: {
			attackDamage: 1,
			magicDamage: 1,
			rangedDamage: 1,
			defense: 1,
			stamina: 1
		},

		startingItems: []
	}
}