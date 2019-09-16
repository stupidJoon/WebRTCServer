var exports = module.exports = {};

function webRTC(io) {
  io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);

    socket.on('join', (room) => {
      if (room == 'caller' || room == 'callee') {
        socket.join(socket.rooms);
      }
      else {
        throw new Error('Neither Caller and Callee');
      }
      console.log(socket.id, 'is', room);
    });

    socket.on('offer', (offer) => {
      console.log('Offer', offer != null);
      io.sockets.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
      console.log('Answer', answer != null);
      io.sockets.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
      console.log(JSON.stringify(Object.keys(io.sockets.adapter.sids[socket.id])), 'Candidate', candidate != null);
      if (socket.rooms == 'caller') {
        io.to('callee').emit('candidate', candidate);
      }
      else if (socket.rooms == 'callee') {
        io.to('caller').emit('candidate', candidate);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected', socket.id);
    });
  });
}

module.exports.on = (io) => {
  webRTC(io)
}