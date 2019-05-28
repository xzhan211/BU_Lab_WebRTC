//"use strict";
const credentials = require('./credentials');
const express = require('express');
const app = express();
let broadcaster;
let server;
let port;
let broadcastId;
if (credentials.key && credentials.cert) {
  const https = require('https');
  server = https.createServer(credentials, app);
  port = 666; // we use this, since in Chrome, it is required to use 'https' when calling local camera
} else {
  const http = require('http');
  server = http.createServer(app);
  port = 3000;
}
const io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
io.sockets.on('error', e => console.log(e));
io.sockets.on('connection', function (socket) {
  console.log("test>> a user connected");
  socket.on('broadcaster', function () {
    broadcaster = socket.id;
    //console.log("broadcast socket id > "+ broadcaster);
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', function () {
    broadcaster && socket.to(broadcaster).emit('watcher', socket.id);
  });
  socket.on('offer', function (id /* of the watcher */, message) {
    socket.to(id).emit('offer', socket.id /* of the broadcaster */, message);
  });
  socket.on('answer', function (id /* of the broadcaster */, message) {
    socket.to(id).emit('answer', socket.id /* of the watcher */, message);
  });
  socket.on('candidate', function (id, message) {
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('disconnect', function() {
    console.log('test>> a user disconnected');
    broadcaster && socket.to(broadcaster).emit('bye', socket.id);
  });
  //test zxy
  socket.on('peerId_test', function(peerId, clientId){
    //console.log('step 3 peer id > '+ peerId);
    //console.log('step 3 socket id > '+ clientId);
    socket.to(clientId).emit('peerId_test', peerId);
  });

  socket.on('request_broadcast_id', function (clientId) {
    console.log("step 2 > "+ clientId);
    broadcaster && socket.to(broadcaster).emit('request_broadcast_id', clientId);
  });

  socket.on('set_broadcast_id', function(){
    broadcastId = socket.id;
    console.log("step 0 > " + broadcaster);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
