//'use strict';
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

let largeArr_laptop = [];
let largeArr_mobile = [];

if (!window.indexedDB) {
   console.log("Your browser doesn't support a stable version of IndexedDB.")
}

window.indexedDB.deleteDatabase('webrtcDB');


navigator.webkitTemporaryStorage.queryUsageAndQuota (
  function(usedBytes, grantedBytes) {
    console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
  },
  function(e) { console.log('Error', e);  }
);


let time = new Date();
console.log("time >> "+time.getTime());
let db;
let request = window.indexedDB.open("webrtcDB", 1);

request.onerror = function(event) {
   console.log("Error, cannot open the webrtcDB!");
};

request.onsuccess = function(event) {
   db = request.result;
   console.log("Success, webrtcDB ready!");
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  let objectStore_laptop;
  let objectStore_mobile;
  if(!db.objectStoreNames.contains("laptop")){
    //objectStore_laptop = db.createObjectStore("laptop", {keyPath: "unix_time_with_ms"});
    objectStore_laptop = db.createObjectStore("laptop", {autoIncrement: true});
  }

  if(!db.objectStoreNames.contains("mobile")){
    //objectStore_mobile = db.createObjectStore("mobile", {keyPath: "unix_time_with_ms"});
    objectStore_mobile = db.createObjectStore("mobile", {autoIncrement: true});
  }
}
async function indexedDBRead(tableName, keyValue) {
  //let kv = keyValue.toString();
  let transaction = db.transaction([tableName], 'readonly');
  let objectStore = transaction.objectStore(tableName);
  let request = objectStore.get(keyValue);

  request.onerror = function(event) {
    console.log("Unable to retrieve data from database!");
  };

  request.onsuccess = await function(event) {
    // Do something with the request.result!
    console.log(tableName+": ");
    if(request.result) {
      if(tableName.localeCompare("laptop")===0){
        console.log("time: " + request.result.time + ", yaw: " + request.result.yaw + ", pitch: " + request.result.pitch + ", peerId: " + request.result.peerId);
      }else if(tableName.localeCompare("mobile")===0){
        console.log("time: " + request.result.time + ", quaternion: " + request.result.quaternion + ", peerId: " + request.result.peerId);
      }else
        console.log(keyValue + ", this primary key couldn't be found in your database!");
    }
  };
}

/*
async function indexedDBReadAll(tableName) {
   let objectStore = db.transaction(tableName).objectStore(tableName);
   objectStore.openCursor().onsuccess = await function(event) {
      var cursor = event.target.result;
      if(tableName.localeCompare("laptop")===0){
        if (cursor) {
          console.log("key: " + cursor.key + ", time: " + cursor.value.time + ", yaw: " + cursor.value.yaw + ", pitch: " + cursor.value.pitch + ", peerId: " + cursor.value.peerId);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }else if(tableName.localeCompare("mobile")===0){
        if (cursor) {
          console.log("key: " + cursor.key + ", time: " + cursor.value.time + ", quaternion: " + cursor.value.quaternion + ", peerId: " + cursor.value.peerId);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }
   };
}
*/

async function indexedDBReadAll(tableName) {
  let transaction = db.transaction([tableName], 'readonly');
  let objectStore = transaction.objectStore(tableName);
  objectStore.getAll().onsuccess = function(event){
    console.log(event.target.result);
    /*
    for( e of event.target.result){
      console.log(e);
    }
    */
  };
}





async function indexedDBAdd(tableName, obj) {
  let request;
  if(tableName.localeCompare("laptop")===0){
    request = await db.transaction([tableName], "readwrite")
      .objectStore(tableName)
    .add({time: obj.unix_time_with_ms, yaw: obj.yaw, pitch: obj.pitch, peerId: obj.peer_id});
    largeArr_laptop.push(JSON.stringify({time: obj.unix_time_with_ms, yaw: obj.yaw, pitch: obj.pitch, peerId: obj.peer_id}));
    //await console.log("Add in DB >> " + obj.unix_time_with_ms + " ::: " + obj.yaw + " ::: " + obj.pitch + " ::: " + obj.peer_id);
  }else if(tableName.localeCompare("mobile")===0){
    request = await db.transaction([tableName], "readwrite")
      .objectStore(tableName)
    .add({time: obj.unix_time_with_ms, quaternion: obj.quaternion, peerId: obj.peer_id});
    largeArr_mobile.push(JSON.stringify({time: obj.unix_time_with_ms, quaternion: obj.quaternion, peerId: obj.peer_id}));
    //await console.log("Add in DB >> " + obj.unix_time_with_ms + " ::: " + obj.quaternion + " ::: " + obj.peer_id);
  }
  /*
  request.onsuccess = await function(event) {
    console.log("New data has been added to your database.");
  };
  */
  request.onerror = function(event) {
    console.log("Unable to add data in your database! ");
  };
}

async function indexedDBRemove(tableName, keyValue) {
  /*
  var request = await db.transaction([tableName], "readwrite")
   .objectStore(tableName)
   .delete(keyValue);

  request.onsuccess = function(event) {
    console.log(keyValue + "'s entry has been removed from your table: " + tableName);
  };

  request.onerror = function(event) {
    console.log("Unable to delete data from your database! ");
  };
  */
  console.log('remove this function');
}

async function indexedDBRemoveAll(tableName) {
   let objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
   let request = objectStore.clear();
   request.onsuccess = await function(event){
      console.log("all data are cleared in "+tableName);
   };
}

async function indexedDBDownload(tableName) {
  let objectStore = db.transaction(tableName).objectStore(tableName);
  let arr = [];
  console.log("downloading...please wait...");
  //better solution
  /*
  objectStore.getAll().onsuccess = function(event){
    console.log("No more entries in " + tableName + "!");

    for(e of event.target.result){
      arr.push(JSON.stringify(e));
    }

    let buffer = new Blob([arr], {type: "text/plain;charset=utf-8"});
    if(tableName.localeCompare("laptop") === 0){
      saveAs(buffer, "laptopData.txt");
    }else if(tableName.localeCompare("mobile") === 0){
      saveAs(buffer, "mobileData.txt");
    }
    console.log("download ok!");
    indexedDBRemoveAll(tableName);
  };
  */

  //using large array as buffer
  if(tableName.localeCompare("laptop") === 0){
    let buffer1 = new Blob([largeArr_laptop], {type: "text/plain;charset=utf-8"});
    saveAs(buffer1, "laptopData.txt");
    largeArr_laptop = [];
  }else if(tableName.localeCompare("mobile") === 0){
    let buffer2 = new Blob([largeArr_mobile], {type: "text/plain;charset=utf-8"});
    saveAs(buffer2, "mobileData.txt");
    largeArr_mobile = [];
  }
  console.log("download ok!");
  indexedDBRemoveAll(tableName);

  //poor solution
  /*
  objectStore.openCursor().onsuccess = await function(event) {
      let cursor = event.target.result;
      if(tableName.localeCompare("laptop")===0){
        if (cursor) {
          arr.push(cursor.key + '@' + cursor.value.time + '@' + cursor.value.yaw + '@' + cursor.value.pitch + '@' + cursor.value.peerId);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
          indexedDBRemoveAll('laptop');
          let buffer = new Blob([arr], {type: "text/plain;charset=utf-8"});
          saveAs(buffer, "laptopData.txt");
          console.log("download ok!");
        }
      }else if(tableName.localeCompare("mobile")===0){
        if (cursor) {
          arr.push(cursor.key + '@' + cursor.value.time + '@' + cursor.value.quaternion + '@' + cursor.value.peerId);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
          indexedDBRemoveAll('mobile');
          let buffer = new Blob([arr], {type: "text/plain;charset=utf-8"});
          saveAs(buffer, "mobileData.txt");
          console.log("download ok!");
        }
      }
  };
  */
}
