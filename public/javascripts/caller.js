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
var caller;

socket.on('answer', (answer) => {
  console.log(answer);
  caller.setRemoteDescription(answer);
});
socket.on('candidate', (candidate) => {
  console.log(candidate);
  caller.addIceCandidate(candidate);
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
  socket.emit('join', 'caller');
  $("#share").click(() => {
    getStream().then((stream) => {
      $("#screen")[0].srcObject = stream;
      makePeerConnection(stream);
    });
  });
});