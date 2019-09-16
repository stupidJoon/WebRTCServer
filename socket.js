var exports = module.exports = {};

let caller = [];
let callee = [];

function webRTC(io) {
  io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id);

    socket.on('join', (room) => {
      if (room == 'caller') {
        socket.join(room);
        caller.push(socket.id);
      }
      else if (room == 'callee') {
        socket.join(room);
        callee.push(socket.id);
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
      if (caller.includes(socket.id) == true) {
        io.to('callee').emit('candidate', candidate);
      }
      else if (callee.includes(socket.id) == true) {
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