enumerator("ItemTypes",[
	"Melee",
	"Ranged",
	"Equipment",
	"Consumable"
]);

enumerator("ItemClass",[
	"Common",
	"Uncommon",
	"Rare",
	"Artifact",
	"Legendary"
]);

enumerator("ItemSlot",[
	"MainHand",
	"OffHand",
	"Helmet",
	"Body",
	"Pocket"
]);

var Items = {
	trainee_sword: {
		type: ItemTypes.Melee,
		class: ItemClass.Common,
		slot: ItemSlot.MainHand,
		damage: 2,
		stackable: false
	},

	trainee_shield: {
		type: ItemTypes.Equipment,
		class: ItemClass.Common,
		slot: ItemSlot.OffHand,
		defense: 2,
		stackable: false
	},

	slingshot: {
		type: ItemTypes.Ranged,
		class: ItemClass.Common,
		slot: ItemSlot.MainHand,
		damage: 2,
		stackable: false
	},

	throwing_knife: {
		type: ItemTypes.Consumable,
		class: ItemClass.Common,
		slot: ItemSlot.Pocket,
		stackable: true
	},

	twig_wand: {
		type: ItemTypes.Ranged,
		class: ItemClass.Common,
		slot: ItemSlot.MainHand,
		damage: 2,
		stackable: false
	},

	scroll_spark: {
		type: ItemTypes.Consumable,
		class: ItemClass.Common,
		slot: ItemSlot.Pocket,
		stackable: true
	}
}