exports.makeSocket = io => {
	let users = [];
	const Player = require('../models/Player').Player;
	io.on('connection', function (socket) {
		let room = null;
		let nickname = null;
		socket.emit('connection')
		socket.on('action', (action) => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
		})
		socket.on('join', (r) => {
			let temp = r.split('[');
			room = temp[0][0] == '#' ? temp[0].substr(1) : temp[0]
			nickname = temp[1] ? temp[1].substr(0, temp[1].length - 1) : 'Anon'
			socket.join(room)
			let what = new Player(socket.id, nickname, room)
			users.push(what)
			what = null
			io.to(room).emit('updateUsers', users.filter(e => e.room == room))
		})
		socket.on('updatePlayer', (p) => {
			users = users.map(e => {
				if (e.id === socket.id)
					e.board = [...p]
				return e
			})
			io.to(room).emit('updateUsers', users.filter(e => e.room == room))
		})
		socket.on('clearRow', () => {
			socket.to(room).emit('addRow')
		})
		socket.on('died', (id) => {
			socket.to(room).emit('deadUser', id)
		})
		socket.on('winner', (winner) => {
			socket.nsp.to(room).emit('setWinner', winner.nickname);
		})
		socket.on('endgame', () => {
			io.of('/').in(room).clients(function (error, clients) {
				if (clients.length - 2 == 0)
					socket.to(Object.keys(socket.rooms)[0]).emit('endgame')
			});
		})
		socket.on('start?', (r) => {
			io.to(r).emit('startiguess')
		})
		socket.on('disconnect', () => {
			users.splice(users.findIndex(e => e.id == socket.id && e.room == room), 1)
			socket.to(room).emit('deadUser', socket.id)
		})
	})
}