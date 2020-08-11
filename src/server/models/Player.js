class Player {
	constructor(id, nickname, room) {
		this.id = id;
		this.nickname = nickname;
		this.board = null;
		this.room = room;
	}
}

module.exports.Player = Player