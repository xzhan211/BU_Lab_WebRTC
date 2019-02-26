'use strict';
let lastPeerId = null;
let peer = null; // Own peer object
let peerId = null;
let conn = null;
let recvId = document.getElementById("receiver-id");
let status = document.getElementById("status");
let message = document.getElementById("message");
let sendMessageBox = document.getElementById("sendMessageBox");
let sendButton = document.getElementById("sendButton");
let clearMsgsButton = document.getElementById("clearMsgsButton");
/**
* Create the Peer object for our end of the connection.
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
    recvId.innerHTML = "ID: " + peer.id;
    status.innerHTML = "Awaiting connection...";
  });

  peer.on('connection', function (c) {
    // Allow only a single connection
    if (conn) {
      c.on('open', function() {
        c.send("Already connected to another client");
        setTimeout(function() { c.close(); }, 500);
      });
      return;
    }
    conn = c;
    console.log("Connected to: " + conn.peer);
    status.innerHTML = "Connected"
    ready();
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
}


function clearMessages() {
  message.innerHTML = "";
  addMessage("Msgs cleared");
}

// Listen for enter
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
    console.log("Sent: " + msg)
    addMessage("<span class=\"selfMsg\">Self: </span>" + msg);
  }
};

// Clear messages box
clearMsgsButton.onclick = function () {
  clearMessages();
};
initialize();
