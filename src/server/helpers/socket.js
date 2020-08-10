exports.makeSocket = io => {
	io.on('connection', function (socket) {
		console.log("Socket connected: " + socket.id)
		let numSocs = null
		let room = null;
		socket.emit('connection')
		socket.on('action', (action) => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
		})
		socket.on('join', (r) => {
			socket.join(r)
			// Below give amount of users in current room
			room = r
			io.of('/').in(r).clients(function (error, clients) {
				numSocs = clients.length;
				io.to(r).emit('updateUsers', clients)
			});
		})
		socket.on('clearRow', () => {
			socket.to(Object.keys(socket.rooms)[0]).emit('addRow')
		})
		socket.on('endgame', () => {
			io.of('/').in(room).clients(function (error, clients) {
				if (clients.length - 2 == 0)
					socket.to(Object.keys(socket.rooms)[0]).emit('endgame')
			});
		})
		socket.on('start?', (room) => {
			io.to(room).emit('startiguess')
		})
	})
}