'use strict';
let peer = new Peer();
peer.on('open', function(id){
  socket.emit('peerId_test', peer.id);
  console.log("receiveDemo id >> "+ peer.id);
});
peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    let d = new Date();
    console.log(data);
    console.log(d.getTime());
    add();
  });
});
