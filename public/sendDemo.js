'use strict';
/*
1. just copy below part in your js code
2. add your js file path in watch.html
*/
let receivedPeerId = null;
let conn = null;
let peer = new Peer();
let localPeerId = null;
//let receiveOnce = 0;


// I don't know why it has to use a setTimeout here...
setTimeout(function(){
  //console.log('step 1 > '+ socket.id);
  localPeerId = socket.id;
  socket.emit('request_broadcast_id', socket.id);
}, 1000);

socket.on('peerId_test', function(data) {
    //if(receiveOnce === 0){
      receivedPeerId = data;
      //receiveOnce = 1;
      console.log("This peerId is from broadcast part >>  "+receivedPeerId);
      conn = peer.connect(receivedPeerId);
      //let c = 10000000;
      //while(c-- > 0);
      //console.log('down >> '+conn);
      conn.on('open', () => {
        //conn.send('Done');
        console.log("Data channel ready!");
      });
    //}
});


/*
my example, how to use conn.send(msg)
1. load viewer side page first
2. then load broadcast side page
3. click "Clear Msgs" button in viewer side, send 0~9 to broadcast side
4. data can be dispalyed in console from broadcast side
*/
/*
function user(){
  // demo: mobile
    console.log("click send button");
    let idCnt = 1;
    let iter = setInterval(function(){
      let obj = {
        unix_time_with_ms: idCnt,
        quaternion: [1111, 1111, 1111, 1111],
        peer_id: localPeerId
      }
      conn.send(JSON.stringify(obj));
      idCnt++;
    }, 5);
}


function user2(){
    console.log("click clear button");
    let idCnt = 1;
    let iter = setInterval(function(){
      let obj = {
        unix_time_with_ms: idCnt,
        yaw: 9999,
        pitch: 8888,
        peer_id: localPeerId
      }
      conn.send(JSON.stringify(obj));
      idCnt++;
    }, 5);
}


let sendMsgsButton = document.getElementById("sendButton");
sendMsgsButton.addEventListener('click', user);



let clearMsgsButton = document.getElementById("clearMsgsButton");
clearMsgsButton.addEventListener('click', user2);
*/
