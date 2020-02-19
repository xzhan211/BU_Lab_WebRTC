
    let playSelectedFile = function playSelectedFileInit(event) {
        var file = this.files[0];
        var type = file.type;
        var videoNode = document.querySelector('video');
        var canPlay = videoNode.canPlayType(type);
        canPlay = (canPlay === '' ? 'no' : canPlay);
        var message = 'Can play type "' + type + '": ' + canPlay;
        var isError = canPlay === 'no';
        if(isError){
            return;
        }
        var fileURL = URL.createObjectURL(file);
        videoNode.src = fileURL;
    }

    var URL = window.URL || window.webkitURL;

    let inputNode = document.querySelector('input');
    inputNode.addEventListener('change', playSelectedFile, false);
