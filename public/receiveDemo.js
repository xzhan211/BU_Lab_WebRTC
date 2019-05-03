'use strict';
let peer = new Peer();
const queueSize = 200;
function Queue(){
  this.data = [];
}

Queue.prototype.addItem = function(record){
  this.data.unshift(record);
}

Queue.prototype.getItem = function(){
  return this.data.pop();
}

Queue.prototype.checkFirstItem = function(){
  return this.data[0];
}

Queue.prototype.size = function(){
  return this.data.length;
}

const q = new Queue();

peer.on('open', function(id){
  socket.emit('peerId_test', peer.id);
  console.log("broadcaster_side id >> "+ peer.id);
});

peer.on('connection', (conn) => {
  conn.on('data', (data) => {
    console.log("++++++++++++++");
    if(q.size() < queueSize){
      q.addItem(data);
      console.log("new item >> " + q.checkFirstItem());
      console.log("cur size >> " + q.size());

    }else{
      console.log("Queue is full, discard new data!");
    }
    let d = new Date();
    console.log("add time >> "+d.getTime());

    // store in DB
    indexedDBAdd("laptop", data);
  });
});

//let getItemButton = document.getElementById("clearMsgsButton");
//getItemButton.addEventListener('click', getAndRemoveItem);

//function getAndRemoveItem(){
/*
  let iter = setInterval(function(){
    console.log("--------------");
    if(q.size() > 0){
      console.log("remove item >> " + q.getItem());
      console.log("cur size >> " + q.size());
    }else
      console.log("queue is empty!");
    let d = new Date();
    console.log("remove time >>   "+d.getTime())
  }, 1000);
*/
//}

//getAndRemoveItem();


let readDBButton = document.getElementById("readDB");
let readAllDBButton = document.getElementById("readAllDB");
//let addDBButton = document.getElementById("addDB");
let removeDBButton = document.getElementById("removeDB");


readDBButton.addEventListener('click', readF);
readAllDBButton.addEventListener('click', readAllF);
//addDBButton.addEventListener('click', addF);
removeDBButton.addEventListener('click', removeF);

function readF(){
  console.log("readF");
  let tn = prompt("please input table name","mobile or laptop");
  let kv = prompt("please input key value", "eg. 10");
  indexedDBRead(tn, parseInt(kv));
}

function readAllF(){
  console.log("readAllF");
  let tn = prompt("please input table name","mobile or laptop");
  indexedDBReadAll(tn);
}

/*
function addF(){
  console.log("addF");
}
*/

function removeF(){
  console.log("removeF");
  let tn = prompt("please input table name","mobile or laptop");
  let kv = prompt("please input key value", "eg. 10");
  indexedDBRemove(tn, parseInt(kv));
}
