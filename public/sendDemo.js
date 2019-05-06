'use strict';
/*
1. just copy below part in your js code
2. add your js file path in watch.html
*/
let receivedPeerId = null;
let conn = null;
let peer = new Peer();
let idCnt = 1;
socket.on('peerId_test', function(data) {
    receivedPeerId = data;
    console.log("This peerId is from broadcast part >>  "+receivedPeerId);
    conn = peer.connect(receivedPeerId);
    conn.on('open', () => {
      //conn.send('Done');
      console.log("Data channel ready!");
    });
});


/*
my example, how to use conn.send(msg)
1. load viewer side page first
2. then load broadcast side page
3. click "Clear Msgs" button in viewer side, send 0~9 to broadcast side
4. data can be dispalyed in console from broadcast side
*/
function user(){

    let obj = {
      unix_time_with_ms: idCnt,
      quaternion: [1111.1111, 2222.2222, 3333.3333, 4444.4444]
    }

  /*
    let obj = {
      unix_time_with_ms: idCnt,
      yaw: 200,
      pitch: 400
    }
  */

    conn.send(JSON.stringify(obj));
    idCnt++;


    /*
    let iter = setInterval(function(){
      let obj = {
        unix_time_with_ms: idCnt,
        quaternion: [1111.1111, 2222.2222, 3333.3333, 4444.4444]
      }
      conn.send(JSON.stringify(obj));
      idCnt++;
    }, 5);
    */
}

let sendMsgsButton = document.getElementById("sendButton");
sendMsgsButton.addEventListener('click', user);
