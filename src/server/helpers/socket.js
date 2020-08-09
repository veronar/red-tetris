exports.makeSocket = io => {
	io.on('connection', function (socket) {
		console.log("Socket connected: " + socket.id)
		socket.emit('connection')
		socket.on('action', (action) => {
			if (action.type === 'server/ping') {
				socket.emit('action', { type: 'pong' })
			}
		})
		socket.on('join', (room) => {
			socket.join(room)
			// Below give amount of users in current room
			// io.of('/').in(room).clients(function (error, clients) {
			// 	console.log(clients.length);
			// });
		})
		socket.on('test', () => {
			socket.to(Object.keys(socket.rooms)[0]).emit('idk')
		})
	})
}