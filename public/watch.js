var video1 = document.getElementById('live_video1');
video1.width = 640;
video1.height = 360;
video1.loop = true;
video1.muted = true;
video1.controls = true;
video1.autoplay = true;
video1.setAttribute('playsinline', '');

let peerConnection;
socket.on('offer', function(id, description) {

  peerConnection = new RTCPeerConnection(config);
  peerConnection.setRemoteDescription(description)
  .then(() => peerConnection.createAnswer())
  .then(sdp => peerConnection.setLocalDescription(sdp))
  .then(function () {
    socket.emit('answer', id, peerConnection.localDescription);
  });

  peerConnection.onaddstream = function(event) {
      video1.srcObject = event.stream;


  }
  peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      socket.emit('candidate', id, event.candidate);
    }
  };
});

socket.on('candidate', function(id, candidate) {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  .catch(e => console.error(e));
});

socket.on('connect', function() {
  socket.emit('watcher');
});

socket.on('broadcaster', function() {
  socket.emit('watcher');
});

socket.on('bye', function() {
  peerConnection.close();
});
/*
let receivedPeerId = null;
let conn = null;
let peer = new Peer();

socket.on('peerId_test', function(data) {
    receivedPeerId = data;
    console.log("This peerId is from broadcast part >>  "+receivedPeerId);
    conn = peer.connect(receivedPeerId);
    conn.on('open', () => {
      //conn.send('Done');
    });
});
*/
