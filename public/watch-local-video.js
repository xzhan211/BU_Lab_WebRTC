    var video1 = document.getElementById('live_video1');

    video1.width = 640;
    video1.height = 640;
    video1.loop = true;
    video1.muted = false;
    video1.controls = true;
    //video1.setAttribute('playsinline', '');


    let vShader = "";
    let hShader = "";
    let iter = null;

    let fakeFlag = false;
    let fakeData = [];

    let peerConnection;

    var camera, scene, renderer, controls, mobile;

    var player = videojs('#live_video1', {
      techOrder: ['html5']
    });

    var is_full_screen = false;

    var isUserInteracting = false,
      lon = 0,
      lat = 0,
      phi = 0,
      theta = 0,
      distance = 50,
      onPointerDownPointerX = 0,
      onPointerDownPointerY = 0,
      onPointerDownLon = 0,
      onPointerDownLat = 0;

    function isMobile() {
      var check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i
          .test(a) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
          .test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    }


    function init() {
      mobile = isMobile();

      container = document.getElementById('container');
      camera = new THREE.PerspectiveCamera(90, player.currentWidth() / player.currentHeight(), 1, 10000);
      if (mobile) {
        controls = new THREE.DeviceOrientationControls(camera);
      } else {
        camera.target = new THREE.Vector3(0, 0, 0);
      }

      scene = new THREE.Scene();

      var geometry = new THREE.SphereBufferGeometry( 100, 5, 5)
      var texture = new THREE.VideoTexture(player.el().getElementsByTagName('video')[0]);

      material = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          map: {
            type: 't',
            value: texture
          }
        },
        vertexShader: vShader,
        fragmentShader: hShader
      });

      mesh = new THREE.Mesh(geometry, material);

      scene.add(mesh);
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(player.currentWidth(), player.currentHeight(), false);

      var renderedCanvas = renderer.domElement;

      renderedCanvas.setAttribute('style', 'width: 100%; height: 100%; position: absolute; top:0;');
      player.el().insertBefore(renderedCanvas, player.el().firstChild);
      player.el().getElementsByTagName('video')[0].style.display = 'none';
      player.el().getElementsByTagName('video')[0].play();

      document.addEventListener('mousedown', onDocumentMouseDown, false);
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      document.addEventListener('mouseup', onDocumentMouseUp, false);
      document.addEventListener('wheel', onDocumentMouseWheel, false);
    }

    document.addEventListener('fullscreenchange', fullscreenHandler);

    function fullscreenHandler(event) {
      const width = player.currentWidth();
      const height = player.currentHeight();

      is_full_screen = (is_full_screen)? false:true;

      if (is_full_screen) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);

      } else {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }
    }


    function onDocumentMouseDown(event) {

      event.preventDefault();

      isUserInteracting = true;

      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

    }

    function onDocumentMouseMove(event) {

      if (isUserInteracting === true) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

      }

    }

    function onDocumentMouseUp() {

      isUserInteracting = false;

    }

    function onDocumentMouseWheel(event) {

      distance += event.deltaY * 0.05;

      distance = THREE.Math.clamp(distance, 1, 50);

    }


    function animate() {
      window.requestAnimationFrame(animate);

      if (mobile) {
        controls.update();
        renderer.render(scene, camera);
      }else{
        update();
      }

    }

    function update() {

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.Math.degToRad(90 - lat);
      theta = THREE.Math.degToRad(lon);


      camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
      camera.position.y = distance * Math.cos(phi);
      camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(camera.target);

      renderer.render(scene, camera);

    }



    let playSelectedFile = function playSelectedFileInit(event) {

        let vSelect = document.getElementById('vShader');
        let vIndex = vSelect.selectedIndex;
        let vVal = vSelect.options[vIndex].value;

        let hSelect = document.getElementById('hShader');
        let hIndex = hSelect.selectedIndex;
        let hVal = hSelect.options[hIndex].value;

        console.log("V Shader :"+vVal);
        console.log("H Shader :"+hVal);

        if(vVal == 1)
            vShader = vertex_shader;

        if(hVal == 1)
            hShader = fragmentShader_equi;
        else if(hVal == 2)
            hShader = fragmentShader_baseball_equi_v2;
        else if(hVal == 3)
            hShader = fragmentShader_baseball_equi;


        var file = this.files[0];
        var type = file.type;
        var videoNode = video1;
        var canPlay = videoNode.canPlayType(type);
        canPlay = (canPlay === '' ? 'no' : canPlay);
        var message = 'Can play type "' + type + '": ' + canPlay;
        var isError = canPlay === 'no';
        if(isError){
            return;
        }
        var fileURL = URL.createObjectURL(file);
        videoNode.src = fileURL;

        init();
        animate();
    }

    var URL = window.URL || window.webkitURL;

    let inputNode = document.querySelector('input');
    inputNode.addEventListener('change', playSelectedFile, false);
