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

	items:
	{
		equipped:
		{
			mainHand: undefined,
			offHand: undefined,
			helmet: undefined,
			body: undefined,
			pocket: undefined
		},

		inventory: undefined
	},

	blend: [1,1,1]
}