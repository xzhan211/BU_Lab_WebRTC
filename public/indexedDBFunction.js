//'use strict';
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const downloadSize = 12000;

if (!window.indexedDB) {
   console.log("Your browser doesn't support a stable version of IndexedDB.")
}


navigator.webkitTemporaryStorage.queryUsageAndQuota (
  function(usedBytes, grantedBytes) {
    console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
  },
  function(e) { console.log('Error', e);  }
);


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
  let transaction = db.transaction([tableName]);
  let objectStore = transaction.objectStore(tableName);
  let request = objectStore.get(keyValue);

  request.onerror = function(event) {
    console.log("Unable to retrieve daa from database!");
  };

  request.onsuccess = await function(event) {
    // Do something with the request.result!
    console.log(tableName+": ");
    if(request.result) {
      if(tableName.localeCompare("laptop")===0){
        console.log("time: " + request.result.unix_time_with_ms + ", yaw: " + request.result.yaw + ", pitch: " + request.result.pitch + ", peerId: " + request.result.peer_id);
      }else if(tableName.localeCompare("mobile")===0){
        console.log("time: " + request.result.unix_time_with_ms + ", quaternion: " + request.result.quaternion + ", peerId: " + request.result.peer_id);
      }else
        console.log(keyValue + ", this primary key  couldn't be found in your database!");
    }
  };

}

async function indexedDBReadAll(tableName) {
   let objectStore = db.transaction(tableName).objectStore(tableName);
   objectStore.openCursor().onsuccess = await function(event) {
      var cursor = event.target.result;
      if(tableName.localeCompare("laptop")===0){
        if (cursor) {
          console.log("time: " + cursor.key + ", yaw: " + cursor.value.yaw + ", pitch: " + cursor.value.pitch + ", peerId: " + cursor.value.peer_id);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }else if(tableName.localeCompare("mobile")===0){
        if (cursor) {
          console.log("time: " + cursor.key + ", quaternion: " + cursor.value.quaternion + ", peerId: " + cursor.value.peer_id);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }
   };
}

async function indexedDBAdd(tableName, obj) {
  let request;
  if(tableName.localeCompare("laptop")===0){
    request = await db.transaction([tableName], "readwrite")
      .objectStore(tableName)
    .add({unix_time_with_ms: obj.unix_time_with_ms, yaw: obj.yaw, pitch: obj.pitch, peerId: obj.peer_id});
    await console.log("Add in DB >> " + obj.unix_time_with_ms + " ::: " + obj.yaw + " ::: " + obj.pitch + " ::: " + obj.peer_id);
  }else if(tableName.localeCompare("mobile")===0){
    request = await db.transaction([tableName], "readwrite")
      .objectStore(tableName)
    .add({unix_time_with_ms: obj.unix_time_with_ms, quaternion: obj.quaternion, peerId: obj.peer_id});
    await console.log("Add in DB >> " + obj.unix_time_with_ms + " ::: " + obj.quaternion + " ::: " + obj.peer_id);
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
  var request = await db.transaction([tableName], "readwrite")
   .objectStore(tableName)
   .delete(keyValue);
  /*
  request.onsuccess = function(event) {
    console.log(keyValue + "'s entry has been removed from your table: " + tableName);
  };
  */
  request.onerror = function(event) {
    console.log("Unable to delete data from your database! ");
  };
}

async function indexedDBRemoveAll(tableName) {
   let objectStore = db.transaction(tableName, 'readwrite').objectStore(tableName);
   let request = objectStore.clear();
   request.onsuccess = await function(event){
      console.log("all data are cleared in "+tableName);
   };
   /*
   objectStore.openCursor().onsuccess = await function(event) {
      var cursor = event.target.result;
      if(tableName.localeCompare("laptop")===0){
        if (cursor) {
          indexedDBRemove("laptop", cursor.key);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }else if(tableName.localeCompare("mobile")===0){
        if (cursor) {
          indexedDBRemove("mobile", cursor.key);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }
   };
   */
}

async function indexedDBDownload(tableName) {
  let objectStore = db.transaction(tableName).objectStore(tableName);
  let arr = [];
  console.log("downloading...please wait...");
  objectStore.openCursor().onsuccess = await function(event) {
      //let arr = [];
      let cursor = event.target.result;
      if(tableName.localeCompare("laptop")===0){
        if (cursor) {
          arr.push(cursor.key + '-' + cursor.value.yaw + '-' + cursor.value.pitch + '-' + cursor.value.peerId);
          //indexedDBRemove("laptop", cursor.key);
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
          arr.push(cursor.key + '-' + cursor.value.quaternion + '-' + cursor.value.peerId);
          //indexedDBRemove("mobile", cursor.key);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
          indexedDBRemoveAll('mobile');
          let buffer = new Blob([arr], {type: "text/plain;charset=utf-8"});
          saveAs(buffer, "mobileData.txt");
          console.log("download ok!");
        }
          //console.log(arr);
      }
      //console.log(arr);
      //if(arr.length === downloadSize){
        /*
        let buffer = new Blob([arr], {type: "text/plain;charset=utf-8"});
        if(tableName.localeCompare("laptop")===0){
          saveAs(buffer, "laptopData.txt");
        }else if(tableName.localeCompare("mobile")===0){
          saveAs(buffer, "mobileData.txt");
        }
        */
      //}
  };
}
