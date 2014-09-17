enumerator("ItemTypes",[
	"Melee",
	"Ranged",
	"Equipment",
	"Consumable",
	"Misc"
]);

enumerator("ItemClass",[
	"Common",
	"Uncommon",
	"Rare",
	"Artifact",
	"Legendary"
]);

enumerator("ItemSlotType",[
	"MainHand",
	"OffHand",
	"Helmet",
	"Body",
	"Pocket",
	"None"
]);

var Items = {
	trainee_sword: {
		type: ItemTypes.Melee,
		class: ItemClass.Common,
		slot: ItemSlotType.MainHand,
		damage: 2,
		stackable: false
	},

	trainee_shield: {
		type: ItemTypes.Equipment,
		class: ItemClass.Common,
		slot: ItemSlotType.OffHand,
		defense: 2,
		stackable: false
	},

	slingshot: {
		type: ItemTypes.Ranged,
		class: ItemClass.Common,
		slot: ItemSlotType.MainHand,
		damage: 2,
		range: 4,
		stackable: false,
		projectile: true
	},

	throwing_knife: {
		type: ItemTypes.Consumable,
		class: ItemClass.Common,
		slot: ItemSlotType.Pocket,
		stackable: true
	},

	twig_wand: {
		type: ItemTypes.Ranged,
		class: ItemClass.Common,
		slot: ItemSlotType.MainHand,
		damage: 2,
		stackable: false
	},

	scroll_spark: {
		type: ItemTypes.Consumable,
		class: ItemClass.Common,
		slot: ItemSlotType.Pocket,
		stackable: true
	},

	coins: {
		type: ItemTypes.Misc,
		class: ItemClass.Common,
		slot: ItemSlotType.None,
		stackable: true
	},

	rat_meat: {
		type: ItemTypes.Misc,
		class: ItemClass.Common,
		slot: ItemSlotType.None,
		stackable: false
	}
}