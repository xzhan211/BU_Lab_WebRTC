/*global socket, video, config*/
let peerConnection;
let receivedPeerId = null;
let conn = null;
let peer = new Peer();

var embedded_video, container, camera, controls, scene;

embedded_video = document.createElement('video');


socket.on('offer', function(id, description) {
	peerConnection = new RTCPeerConnection(config);
	peerConnection.setRemoteDescription(description)
	.then(() => peerConnection.createAnswer())
	.then(sdp => peerConnection.setLocalDescription(sdp))
	.then(function () {
		socket.emit('answer', id, peerConnection.localDescription);
	});
	peerConnection.onaddstream = function(event) {
    container = document.createElement('div');
    document.body.appendChild(container);
    //scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x000000);
    //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    //camera.position.set(0, 0, 0);
    //embedded_video.id = "live_video";
    //embedded_video.setAttribute('playsinline', '');
    //embedded_video.autoplay = true;
    //embedded_video.muted = true;
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    controls = new THREE.DeviceOrientationControls(camera);
	  camera.target = new THREE.Vector3( 0, 0, 0 );

		scene = new THREE.Scene();
    embedded_video.srcObject = event.stream;
    //embedded_video.play();
		//video.srcObject = event.stream;
	};
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

embedded_video.addEventListener('loadedmetadata', function() {
  alert('VideoWidth: ' + this.videoWidth + ' videoHeight: ' + this.videoHeight);
});

/* What Adam added */

var camera, scene, renderer;

			var isUserInteracting = false,
				lon = 0, lat = 0,
				phi = 0, theta = 0,
				distance = 50,
				onPointerDownPointerX = 0,
				onPointerDownPointerY = 0,
				onPointerDownLon = 0,
				onPointerDownLat = 0;

			init();
			animate();


			function init() {

				var container, mesh;



				//container = document.getElementById( 'video_container' );

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
        controls = new THREE.DeviceOrientationControls(camera);
				camera.target = new THREE.Vector3( 0, 0, 0 );

			  scene = new THREE.Scene();

				var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
				// invert the geometry on the x-axis so that all of the faces point inward
				geometry.scale( - 1, 1, 1 );

				//var video = document.createElement('video'); // Changed this to instead grab the video
				// video.crossOrigin = 'anonymous';
				// video.width = 640;
				// video.height = 360;
				// video.loop = true;

				// video.muted = true;
				// video.setAttribute('autoplay')
				// video.muted = true;

				//video.src = document.getElementById('video');
				//video.setAttribute('playsinline', '' );
				//video.muted = true;
				//video.autoplay = true;
				//video.play();

        embedded_video.id = "live_video";
        embedded_video.setAttribute('playsinline', '');
        embedded_video.autoplay = true;
        embedded_video.muted = true;
        embedded_video.play();


				var texture = new THREE.VideoTexture( embedded_video );
				var material = new THREE.MeshBasicMaterial( { map: texture } );

				mesh = new THREE.Mesh( geometry, material );

				scene.add( mesh );

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				//container.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

      }
			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}


			function animate() {
				requestAnimationFrame( animate );
				update();

			}

			function update() {

				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

        if(conn != null){
          conn.send('---- phi, theta ----');
          conn.send(phi);
          conn.send(theta);
          conn.send('--------------------');
        }

				camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
				camera.position.y = distance * Math.cos( phi );
				camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

				camera.lookAt( camera.target );

				renderer.render( scene, camera );

			}





      socket.on('peerId_test', function(data) {
        receivedPeerId = data;
        console.log("This peerId is from broadcast part >> " + receivedPeerId);
        conn = peer.connect(receivedPeerId);
        conn.on('open', () => {
          conn.send('Done');
          user();
        });
      });

      function user(){
        conn.send("hi");
      }


/* End of what Adam added (Source: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_video_panorama_equirectangular.html) */




/*
  send message
*/
