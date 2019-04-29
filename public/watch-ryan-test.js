/*global socket, video, config*/
      let peerConnection;
      var video1 = document.createElement('video');

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
            init();
            animate();
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

      var camera, scene, renderer, controls;

      function init(){
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

        controls = new THREE.DeviceOrientationControls( camera );

        scene = new THREE.Scene();

        var geometry = new THREE.SphereBufferGeometry(500, 60, 40);

        geometry.scale(-1, 1, 1);

        video1.crossOrigin = 'anonymous';
        video1.width = 640;
        video1.height = 360;
        video1.loop = true;
        video1.muted = true;
        video1.setAttribute('playsinline', '');
        video1.play();


        var texture = new THREE.VideoTexture(video1);
        var material = new THREE.MeshBasicMaterial( { map: texture } );

        mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

      }

      function animate(){
        window.requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }

      function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
