var exports = module.exports = {};

function webRTC(io) {
  io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);

    socket.on('join', (room) => {
      if (room == "caller") {
        socket.join('caller');
      }
      else if (room == "callee") {
        socket.join('callee');
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
      console.log('Candidate', candidate != null);
      io.sockets.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
      console.log(socket.room, 'Socket Disconnected', socket.id);
    });
  });
}

module.exports.on = (io) => {
  webRTC(io)
}