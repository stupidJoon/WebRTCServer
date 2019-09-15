const RTC_CONFIGURATION = {
  iceServer: [{ urls: 'stun:stun.l.google.com:19302' },
  { url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com' }]
};

var socket = io.connect('http://54.180.57.73:3000');
var caller;

socket.on('answer', (answer) => {
  caller.setRemoteDescription(answer);
});

function sendOffer(offer) {
  socket.emit('offer', offer);
}
function sendCandidate(candidate) {
  socket.emit('candidate', candidate);
}
function getStream() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getDisplayMedia({ audio: false, video: true }).then((mediaStream) => {
      resolve(mediaStream);
    })
  });
}
function makePeerConnection(stream) {
  caller = new RTCPeerConnection(RTC_CONFIGURATION);
  caller.addStream(stream);
  caller.onicecandidate = (event) => {
    if (event.candidate != null) {
      sendCandidate(event.candidate);
    }
  }
  makeOffer()
}
function makeOffer() {
  caller.createOffer().then((offer) => {
    return caller.setLocalDescription(offer);
  }).then(() => {
    sendOffer(caller.localDescription);
  });
}

$(document).ready(() => {
  $("#share").click(() => {
    getStream().then((stream) => {
      $("#screen")[0].srcObject = stream;
      makePeerConnection(stream);
    });
  });
});