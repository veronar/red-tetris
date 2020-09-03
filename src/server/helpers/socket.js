const { Game } = require("../models/Game");

exports.makeSocket = (io) => {
	const generateShapes = require("./pieceHelper");
	let users = [];
	const Player = require("../models/Player").Player;
	io.on("connection", function (socket) {
		let room = new Game().room;
		let nickname = null;
		socket.emit("connection");
		socket.on("action", (action) => {
			if (action.type === "server/ping") {
				socket.emit("action", { type: "pong" });
			}
		});
		/*
		** Join is called when a user joins the room. First thing it does it take the url and split it.
		** #12[fwmoor] becomes 12 and fwmoor. I removed the hash from the room so if the url was 12[fwmoor]
		** it would still see it as 12 and fwmoor. This was done for faster testing as hash based url
		** things are annoying. After it splits the url, it joings the rool (with #12[fwmoor] it would join
		** room 12. A new Player is then created with the sockets id and nickname and we give it a empty board.
		** the user is then pushed into an array of all the users from all the rooms. The users in the room
		** specified are used as a param in the emit to everyone in the room.
		*/
		socket.on("join", (r) => {
			let temp = r.split("[");
			room = temp[0][0] == "#" ? temp[0].substr(1) : temp[0];
			nickname = temp[1] ? temp[1].substr(0, temp[1].length - 1) : "Anon";
			socket.join(room);
			let what = new Player(socket.id, nickname, room);
			users.push(what);
			what = null;
			io.to(room).emit(
				"updateUsers",
				users.filter((e) => e.room == room)
			);
		});
		/*
		** This emit is used to update the users array in this file with the user's data from the front. 
		** Everytime the user's board is updated, this function is called to change the value of the board
		** in the array. The users in the room are used as a param in the emit to everyone in the room.
		*/
		socket.on("updatePlayer", (p) => {
			users = users.map((e) => {
				if (e.id === socket.id) e.board = [...p];
				return e;
			});
			io.to(room).emit(
				"updateUsers",
				users.filter((e) => e.room == room)
			);
		});
		/*
		** clearRow is called when a user has a full line of tetrominos and the line goes away. Before
		** going away, it calls clearRow which emits addRow to all the other players in the room.
		** addRow adds the solid line on all other player boards.
		*/
		socket.on("clearRow", () => {
			socket.to(room).emit("addRow");
		});
		/*
		** When a player dies, died is called. died emits deadUser to all other players updating their boards
		** and removing the dead player from the current match.
		*/
		socket.on("died", (id) => {
			socket.to(room).emit("deadUser", id);
		});
		/*
		** When only 1 player is left, winner is called. Winner emits setWinner to all players in the room.
		** setWinner stops the game and updates the text to say who one the game.
		*/
		socket.on("winner", (winner) => {
			socket.nsp.to(room).emit("setWinner", winner.nickname);
		});
		/*
		** endgame is called to end the game. It's called and then it calls endgame which stops the game and resets
		** everything on the front.
		*/
		socket.on("endgame", () => {
			io.of("/")
				.in(room)
				.clients(function (error, clients) {
					if (clients.length - 2 == 0)
						socket.to(Object.keys(socket.rooms)[0]).emit("endgame");
				});
		});
		/*
		** receive shapes calls receive shapes which generates the shapes for everyone.
		*/
		socket.on("receive shapes", (room) => {
			io.to(room).emit("receive shapes", generateShapes());
		});
		/*
		** start? calles startiguess which starts the game for everyone in the room at the same time.
		*/
		socket.on("start?", (r) => {
			io.to(r).emit("startiguess", r);
		});
		/*
		** disconnect removes the user from the array and calles deadUser with the users id when the user disconnects
		** from the room or page.
		*/
		socket.on("disconnect", () => {
			users.splice(
				users.findIndex((e) => e.id == socket.id && e.room == room),
				1
			);
			socket.to(room).emit("deadUser", socket.id);
		});
	});
};
