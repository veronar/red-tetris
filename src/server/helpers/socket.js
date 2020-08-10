exports.makeSocket = io => {
	let users = []
	io.on('connection', function (socket) {
		console.log("Socket connected: " + socket.id)
		let room = null;
		let nickname = null;
		socket.emit('connection')
		socket.on('action', (action) => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
		})
		socket.on('join', (r) => {
			let temp = r.split('[')
			room = temp[0][0] == '#' ? temp[0].substr(1) : temp[0]
			nickname = temp[1] ? temp[1].substr(0, temp[1].length - 1) : 'Anon'
			socket.join(room)
			users.push({ id: socket.id, nickname: nickname, room: room })
			io.to(room).emit('updateUsers', users.filter(e => e.room == room))

			// Total  users connected to room
			// io.of('/').in(room).clients(function (error, clients) {
			// 	console.log(clients)
			// });
		})
		socket.on('clearRow', () => {
			socket.to(room).emit('addRow')
		})
		socket.on('died', (id) => {
			socket.to(room).emit('deadUser', id)
		})
		socket.on('winner', (winner) => {
			socket.nsp.to(room).emit('setWinner', winner.nickname);
			// socket.to(room).emit('setWinner', winner.nickname)
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
		socket.on('disconnecting', () => {
			users.splice(users.findIndex(e => e.id == socket.id && e.room == room), 1)
			io.to(room).emit('updateUsers', users.filter(e => e.room == room))
		})
	})
}