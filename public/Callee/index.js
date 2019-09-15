const RTC_CONFIGURATION = {
  iceServer: [{ urls: 'stun:stun.l.google.com:19302' },
  { url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com' }]
};

var socket = io.connect('http://54.180.57.73:3000');
var callee;

socket.on('offer', (offer) => {
  callee.setRemoteDescription(offer);
  makeAnswer()
});
socket.on('candidate', (candidate) => {
  callee.addIceCandidate(candidate);
});

function makePeerConnection() {
  callee = new RTCPeerConnection(RTC_CONFIGURATION);
  callee.onaddstream = (event) => {
    $("#screen")[0].srcObject = event.stream;
  };
}
function sendAnswer(answer) {
  socket.emit('answer', answer);
}
function makeAnswer() {
  callee.createAnswer().then((answer) => {
    return callee.setLocalDescription(answer);
  }).then(() => {
    sendAnswer(callee.localDescription);
  });
}

$(document).ready(() => {
  makePeerConnection();
});