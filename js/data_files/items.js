enumerator("ItemSlot",[
	"MainHand",
	"OffHand",
	"Helmet",
	"Body",
	"Consumable"])

enumerator("ItemRarity",[
	"Common",
	"Uncommon",
	"Rare",
	"Artifact",
	"Legendary"])

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
		texture: "textures/items/common/wooden_sword.png",
		stackable: false,
		rarity: ItemRarity.Common,
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

	leather_helmet: {
		texture: "textures/items/common/leather_helmet.png",
		stackable: false,
		rarity: ItemRarity.Common,
		equip: {
			apply:
			{
				maxHealth: [2,"Increase"],
				defense: [1,"Increase"]
			},
			slot: ItemSlot.Helmet
		},

		canSell: true,
		value: 7
	},

	leather_body: {
		texture: "textures/items/common/leather_body.png",
		stackable: false,
		rarity: ItemRarity.Common,
		equip: {
			apply:
			{
				maxHealth: [5,"Increase"],
				defense: [2,"Increase"]
			},
			slot: ItemSlot.Body
		},

		canSell: true,
		value: 12
	},

	broken_sword: {
		texture: "textures/items/common/broken_sword.png",
		stackable: false,
		rarity: ItemRarity.Common,
		equip: {
			apply:
			{
				attackDamage: [1,"Increase"]
			},
			slot: ItemSlot.MainHand,
			range: false
		},

		canSell: true,
		value: 1
	},

	rat_meat: {
		texture: "textures/items/common/rat_meat.png",
		stackable: false,
		rarity: ItemRarity.Common,
		use: {
			health: 1
		},

		canSell: true,
		value: 1
	},

	minor_health_potion: {
		texture: "textures/items/common/minor_health_potion.png",
		stackable: true,
		rarity: ItemRarity.Common,
		use: {
			health: 5
		},

		canSell: true,
		value: 2
	},

	coins: {
		texture: "textures/items/coins.png",
		stackable: true,
		rarity: ItemRarity.Common,
		use: {

		},
		canSell: false,
		value: 1
	}
}