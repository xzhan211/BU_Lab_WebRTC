'use strict';
/*global socket, video, config*/
const peerConnections = {};

let bitRate = 0;
let frameRate = 0;

//camera selection
let videoSource;
let firstCamId;
let firstCamLabel;
let secondCamId;
let secondCamLabel;

let allID = new Map();

socket.on('answer', function(id, description) {
	peerConnections[id].setRemoteDescription(description);
});

socket.on('watcher', function(id) {
	const peerConnection = new RTCPeerConnection(config);
	peerConnections[id] = peerConnection;
	peerConnection.addStream(video.srcObject);
	peerConnection.createOffer()
	.then(sdp => {peerConnection.setLocalDescription(sdp); /*console.log(sdp)*/})
	.then(function () {
		socket.emit('offer', id, peerConnection.localDescription);
	});
	peerConnection.onicecandidate = function(event) {
		if (event.candidate) {
			socket.emit('candidate', id, event.candidate);
		}
	};
});

socket.on('candidate', function(id, candidate) {
	peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('bye', function(id) {
	peerConnections[id] && peerConnections[id].close();
	delete peerConnections[id];
});

// Resolution part
//const defaultButton = document.querySelector('#default');
const reloadButton = document.querySelector('#reload');
const oneKButton = document.querySelector('#oneK');
const onePfiveKButton = document.querySelector('#onePfiveK');
const hdButton = document.querySelector('#hd');
//const fullHdButton = document.querySelector('#full-hd');
const twoKButton = document.querySelector('#twoK');
const twoPfiveKButton = document.querySelector('#twoPfiveK');
const threeKButton = document.querySelector('#threeK');
const fourKButton = document.querySelector('#fourK');

reloadButton.onclick = () => {
    location.reload();
};

oneKButton.onclick = () => {
    console.log("click 1K");
      videoSource = videoSelect.value;
    getMedia(oneKConstraints);
    document.getElementById("resolution").innerHTML = "1K 960*480";
};

onePfiveKButton.onclick = () => {
    console.log("click 1.5K");
      videoSource = videoSelect.value;
    getMedia(onePfiveKConstraints);
    document.getElementById("resolution").innerHTML = "1.5K 1440*720";
};

hdButton.onclick = () => {
    console.log("click hd");
      videoSource = videoSelect.value;
    getMedia(hdConstraints);
    document.getElementById("resolution").innerHTML = "HD 1280*720";
};

/*
fullHdButton.onclick = () => {
    console.log("click fullHd");
      videoSource = videoSelect.value;
    getMedia(fullHdConstraints);
    document.getElementById("resolution").innerHTML = "FHD 1920*1080";
};
*/

twoKButton.onclick = () => {
    console.log("click 2K");
      videoSource = videoSelect.value;
    getMedia(twoKConstraints);
    document.getElementById("resolution").innerHTML = "2K 1920*960";
};


twoPfiveKButton.onclick = () => {
    console.log("click 2.5K");
      videoSource = videoSelect.value;
    getMedia(twoPfiveKConstraints);
    document.getElementById("resolution").innerHTML = "2.5K 2560*1280";
};

threeKButton.onclick = () => {
    console.log("click 3K");
      videoSource = videoSelect.value;
    getMedia(threeKConstraints);
    document.getElementById("resolution").innerHTML = "3K 2880*1440";
};


fourKButton.onclick = () => {
    console.log("click 4K");
      videoSource = videoSelect.value;
    getMedia(fourKConstraints);
    document.getElementById("resolution").innerHTML = "4K 3840*1920";
};




const oneKConstraints = {
    video: {
        width: {exact: 960},
        height: {exact: 480},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

const onePfiveKConstraints = {
    video: {
        width: {exact: 1440},
        height: {exact: 720},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

const hdConstraints = {
    video: {
        width: {exact: 1280},
        height: {exact: 720},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

/*
const fullHdConstraints = {
    video: {
        width: {exact: 1920},
        height: {exact: 1080},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};
*/

const twoKConstraints = {
    video: {
        width: {exact: 1920},
        height: {exact: 960},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

const twoPfiveKConstraints = {
    video: {
        width: {exact: 2560},
        height: {exact: 1280},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

const threeKConstraints = {
    video: {
        width: {exact: 2880},
        height: {exact: 1440},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

const fourKConstraints = {
    video: {
        width: {exact: 3840},
        height: {exact: 1920},
        deviceId: videoSource ? {exact: videoSource} : undefined
    }
};

/*
If no camera exists with this resolution or higher,
then the returned promise will be rejected with OverconstrainedError,
and the user will not be prompted.
example1:
{
  audio: true,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 776, ideal: 720, max: 1080 }
  }
}

example2, set frame rate
var constraints = { video: { frameRate: { ideal: 10, max: 15 } } };
*/
function getMedia(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
	  video.srcObject = stream;
	  socket.emit('broadcaster');
    }).catch(error => console.error(error));
}


/*
Frame rate
Bit rate
*/
/*
const test1 = document.querySelector('#set');
test1.onclick = () => {
    getFrameRate();
};
const test2 = document.querySelector('#default');
test2.onclick = () => {
    getBitRate();
    //getCamIDs();
};

function getFrameRate(){
  let frameRate = document.getElementById("frameRate").value;
  console.log("frame rate >> "+ frameRate);
  //console.log(allID);
}

function getBitRate(){
  let bitRate = document.getElementById("bitRate").value;
  console.log("bit rate >> "+ bitRate);
}
*/

/*
camera select, local camera vs extend camerat
*/
//get camera devices id list
const videoSelect = document.querySelector('#videoSource');
function getCamIDs(){
  navigator.mediaDevices.enumerateDevices()
  .then(function(deviceInfos){
    for(let i=0; i<deviceInfos.length; i++){
      const deviceInfo = deviceInfos[i];
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if(deviceInfo.kind === 'videoinput'){
        option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    }
    //console.log(deviceInfos);
  });
}


/*
Receive text
*/


/*
running every time
*/
getCamIDs();
