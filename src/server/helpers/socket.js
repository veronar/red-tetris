exports.makeSocket = io => {
	io.on('connection', function(socket){
	  loginfo("Socket connected: " + socket.id)
	  socket.on('action', (action) => {
		if(action.type === 'server/ping'){
		  socket.emit('action', {type: 'pong'})
		}
	  })
	})
  }