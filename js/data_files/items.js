enumerator("ItemSlot",[
	"MainHand",
	"OffHand",
	"Helmet",
	"Body",
	"Consumable"])

/*
	Structure:
	texture: "path/to/texture.png",
	stackable: true/false,
	
	---------------------
	either:

	equip = {
		slot: ItemSlot.MainHand, (Or any other slot)
		attackDamage: 1,		 (The bonus this item gives, can be all stats)
		range: true/false		 (If this item can be ranged with)
	}

	----------------------
	or:

	use = {
		health = 2
		stamina = 2
	}

	----------------------
	or:

	Nothing, useless

	----------------------
	
	canSell: true/false
	value: 100

*/

var Items = {
	wooden_sword: {
		texture: "textures/items/wooden_sword.png",
		stackable: false,
		equip: {
			apply:
			{
				attackDamage: [2,"Increase"]
			},
			slot: ItemSlot.MainHand,
			range: false
		},

		canSell: true,
		value: 4
	},

	rat_meat: {
		texture: "textures/items/rat_meat.png",
		stackable: false,
		use: {
			health: 3
		},

		canSell: true,
		value: 1
	}
}