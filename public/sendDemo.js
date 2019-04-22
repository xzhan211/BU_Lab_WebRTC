'use strict';

/*
class SenderAPI{
  constructor(){
    this.conn = null;
  }

  init(){
    let peer = new Peer();
    console.log("XXX-> "+ peer);
    let flag = true;
    socket.on('peerId_test', function(data) {
      let receivedPeerId = data;
      console.log("This peerId is from broadcast part >>  "+receivedPeerId);
      this.conn = peer.connect(receivedPeerId);
      this.conn.on('open', () => {
        this.conn.send('Done');
      });
    });
  }


  async sendParameter(parameter){
    if(this.conn === null)
    console.log("**** " + parameter);
    if(this.conn !== null)
    this.conn.send(parameter);
  }
}
*/



/*
1. just copy below part in your js code
2. add your js file path in watch.html
*/
let receivedPeerId = null;
let conn = null;
let peer = new Peer();

socket.on('peerId_test', function(data) {
    receivedPeerId = data;
    console.log("This peerId is from broadcast part >>  "+receivedPeerId);
    conn = peer.connect(receivedPeerId);
    conn.on('open', () => {
      conn.send('Done');
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
  for(let i=0; i<10; i++)
    conn.send(i);
}

let clearMsgsButton = document.getElementById("clearMsgsButton");
clearMsgsButton.addEventListener('click', user);
