const RTC_CONFIGURATION = {
  iceServer: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      urls: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }
  ]
};

var socket = io.connect('https://sunrintv.kro.kr');
var callee;

socket.on('offer', (offer) => {
  console.log(offer);
  callee.setRemoteDescription(offer);
  makeAnswer()
});
socket.on('candidate', (candidate) => {
  console.log(candidate);
  callee.addIceCandidate(candidate);
});

function sendAnswer(answer) {
  socket.emit('answer', answer);
}
function sendCandidate(candidate) {
  socket.emit('candidate', candidate);
}
function makePeerConnection() {
  callee = new RTCPeerConnection(RTC_CONFIGURATION);
  callee.onaddstream = (event) => {
    $("#screen")[0].srcObject = event.stream;
  };
  callee.onicecandidate = (event) => {
    if (event.candidate != null) {
      sendCandidate(event.candidate);
    }
  }
}
function makeAnswer() {
  callee.createAnswer().then((answer) => {
    return callee.setLocalDescription(answer);
  }).then(() => {
    sendAnswer(callee.localDescription);
  });
}

$(document).ready(() => {
  socket.emit('join', 'callee');
  makePeerConnection();
});