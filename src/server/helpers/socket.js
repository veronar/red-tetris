exports.makeSocket = io => {
	let users = []
	io.on('connection', function (socket) {
		console.log("Socket connected: " + socket.id)
		let numSocs = null
		let room = null;
		let nickname = null;
		socket.emit('connection')
		socket.on('action', (action) => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
		})
		socket.on('join', (r) => {
			let test = r.split('[')
			let tempRoom = test[0][0] == '#' ? test[0].substr(1) : test[0]
			nickname = test[1] ? test[1].substr(0, test[1].length - 1) : 'Anon'
			socket.join(tempRoom)
			// Below give amount of users in current room
			room = tempRoom
			io.of('/').in(room).clients(function (error, clients) {
				users.push({ id: socket.id, nickname: nickname, room: room })
				io.to(room).emit('updateUsers', users.filter(e => e.room == room))
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
		socket.on('start?', (r) => {
			io.to(r).emit('startiguess')
		})
		socket.on('disconnecting', () => {
			let room = Object.keys(socket.rooms)[0]
			io.of('/').in(room).clients(function (error, clients) {
				users.splice(users.findIndex(e => e.id == socket.id && e.room == room), 1)
				io.to(room).emit('updateUsers', users.filter(e => e.room == room))
			});
		})
	})
}