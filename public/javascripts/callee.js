const RTC_CONFIGURATION = {
  iceServer: [
    {url:'stun:stun01.sipphone.com'},
    {url:'stun:stun.ekiga.net'},
    {url:'stun:stun.fwdnet.net'},
    {url:'stun:stun.ideasip.com'},
    {url:'stun:stun.iptel.org'},
    {url:'stun:stun.rixtelecom.se'},
    {url:'stun:stun.schlund.de'},
    {url:'stun:stun.l.google.com:19302'},
    {url:'stun:stun1.l.google.com:19302'},
    {url:'stun:stun2.l.google.com:19302'},
    {url:'stun:stun3.l.google.com:19302'},
    {url:'stun:stun4.l.google.com:19302'},
    {url:'stun:stunserver.org'},
    {url:'stun:stun.softjoys.com'},
    {url:'stun:stun.voiparound.com'},
    {url:'stun:stun.voipbuster.com'},
    {url:'stun:stun.voipstunt.com'},
    {url:'stun:stun.voxgratia.org'},
    {url:'stun:stun.xten.com'},
    {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
    },
    {
        url: 'turn:192.158.29.39:3478?transport=tcp',
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