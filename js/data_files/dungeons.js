var Dungeons = {
	default:
	{
		width: 50,
		height: 50,
		noRooms: 10,
		minRoomWidth: 5,
		minRoomHeight: 5,
		maxRoomWidth: 9,
		maxRoomHeight: 9,

		viewRange: 9
	},

	debug_dungeon:
	{
		width: 50,
		height: 50,
		noRooms: 10,
		minRoomWidth: 5,
		minRoomHeight: 5,
		maxRoomWidth: 9,
		maxRoomHeight: 9,

		textures: {
			wall: [
				["textures/dungeons/castle/dungeon_castle_wall.png",1]
			],
			wall_special: {
				modulo: 4,
				tiles: [
					["textures/dungeons/castle/dungeon_castle_wall_torch.png",2],
					["textures/dungeons/castle/dungeon_castle_wall_flag.png",1]
				]
			},
			room: [
				["textures/dungeons/castle/dungeon_castle_room.png",2],
				["textures/dungeons/castle/dungeon_castle_room_cracked.png",1]
			],
			floor: [
				["textures/dungeons/castle/dungeon_castle_floor.png",1]
			]
		},

		viewRange: 9
	}
}