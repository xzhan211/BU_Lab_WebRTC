'use strict';
let lastPeerId = null;
let peer = null; // own peer object
let conn = null;
//let recvIdInput = document.getElementById("receiver-id");
let status = document.getElementById("status");
let message = document.getElementById("message");
let sendMessageBox = document.getElementById("sendMessageBox");
let sendButton = document.getElementById("sendButton");
let clearMsgsButton = document.getElementById("clearMsgsButton");
let connectButton = document.getElementById("connect-button");
let cueString = "<span class=\"cueMsg\">Cue: </span>";


let peerId_test = null;
let receivedPeerId = null;

/**
* Create the Peer object for our end of the connection.
*
* Sets up callbacks that handle any events related to our
* peer object.
*/
function initialize() {
  // Create own peer object with connection to shared PeerJS server
  peer = new Peer(null, {
  debug: 2
  });
  peer.on('open', function (id) {
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
      console.log('Received null id from peer open');
      peer.id = lastPeerId;
    } else {
      lastPeerId = peer.id;
    }
    console.log('ID: ' + peer.id);
  });

  peer.on('disconnected', function () {
    status.innerHTML = "Connection lost. Please reconnect";
    console.log('Connection lost. Please reconnect');
    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });

  peer.on('close', function() {
    conn = null;
    status.innerHTML = "Connection destroyed. Please refresh";
    console.log('Connection destroyed');
  });

  peer.on('error', function (err) {
    console.log(err);
    alert('' + err);
  });
};

/**
* Create the connection between the two Peers.
*
* Sets up callbacks that handle any events related to the
* connection and data received on it.
*/

function join() {
  // Close old connection
  if (conn) {
    conn.close();
  }
  // Create connection to destination peer specified in the input field
  //conn = peer.connect(recvIdInput.value, {
  conn = peer.connect(receivedPeerId, {
    reliable: true
  });
  conn.on('open', function () {
    status.innerHTML = "Connected to: " + conn.peer;
    console.log("Connected to: " + conn.peer);
    // Check URL params for comamnds that should be sent immediately
    var command = getUrlParam("command");
    if (command)
    conn.send(command);
  });
  // Handle incoming data (messages only since this is the signal sender)
  conn.on('data', function (data) {
    console.log("receive data>> " + data);
    addMessage("<span class=\"peerMsg\">Peer:</span> " + data);
  });

  conn.on('close', function () {
    status.innerHTML = "Connection closed";
  });
};
/**
* Get first "GET style" parameter from href.
* This enables delivering an initial command upon page load.
*
* Would have been easier to use location.hash.
*/
function getUrlParam(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  let regexS = "[\\?&]" + name + "=([^&#]*)";
  let regex = new RegExp(regexS);
  let results = regex.exec(window.location.href);
  if (results == null)
    return null;
  else
    return results[1];
};

function addMessage(msg) {
  let now = new Date();
  let h = now.getHours();
  let m = addZero(now.getMinutes());
  let s = addZero(now.getSeconds());
  if (h > 12)
    h -= 12;
  else if (h === 0)
    h = 12;
  function addZero(t) {
    if (t < 10)
      t = "0" + t;
      return t;
  };
  message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
};

function clearMessages() {
  message.innerHTML = "";
  addMessage("Msgs cleared");
};

// Listen for enter in message box
sendMessageBox.onkeypress = function (e) {
  let event = e || window.event;
  let char = event.which || event.keyCode;
  if (char == '13')
  sendButton.click();
};

// Send message
sendButton.onclick = function () {
  if (conn.open) {
    let msg = sendMessageBox.value;
    sendMessageBox.value = "";
    conn.send(msg);
    console.log("Sent: " + msg);
    addMessage("<span class=\"selfMsg\">Self: </span> " + msg);
  }
};

// Clear messages box
clearMsgsButton.onclick = function () {
  clearMessages();
};

// Start peer connection on click
connectButton.addEventListener('click', join);
// Since all our callbacks are setup, start the process of obtaining an ID
initialize();

socket.on('peerId_test', function(data) {
  receivedPeerId = data;
  console.log("This peerId is from broadcast part >>  "+data);
});

//socket.emit('peerId_test', 'haha');
