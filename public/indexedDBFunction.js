//'use strict';
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
   console.log("Your browser doesn't support a stable version of IndexedDB.")
}


/*
const employeeData = [
   { id: "00-01", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
   { id: "00-02", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
];
*/
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
    objectStore_laptop = db.createObjectStore("laptop", {keyPath: "unix_time_with_ms"});
  }

  if(!db.objectStoreNames.contains("mobile")){
    objectStore_mobile = db.createObjectStore("mobile", {keyPath: "unix_time_with_ms"});
  }
   /*
   for (var i in employeeData) {
      objectStore.add(employeeData[i])haha;
   }
   */
}

function indexedDBRead(tableName, keyValue) {
  //let kv = keyValue.toString();
  let transaction = db.transaction([tableName]);
  let objectStore = transaction.objectStore(tableName);
  let request = objectStore.get(keyValue);

  request.onerror = function(event) {
    console.log("Unable to retrieve daa from database!");
  };

  request.onsuccess = function(event) {
    // Do something with the request.result!
    console.log(tableName+": ");
    if(request.result) {
      if(tableName.localeCompare("laptop")===0){
        console.log("time: " + request.result.unix_time_with_ms + ", yaw: " + request.result.yaw + ", pitch: " + request.result.pitch);
      }else if(tableName.localeCompare("mobile")===0){
        console.log("time: " + request.result.unix_time_with_ms + ", quaternion: " + request.result.quaternion);
      }else
        console.log(keyValue + ", this primary key  couldn't be found in your database!");
    }
  };
}

function indexedDBReadAll(tableName) {
   let objectStore = db.transaction(tableName).objectStore(tableName);
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(tableName.localeCompare("laptop")===0){
        if (cursor) {
          console.log("time: " + cursor.key + ", yaw: " + cursor.value.yaw + ", pitch: " + cursor.value.pitch);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }else if(tableName.localeCompare("mobile")===0){
        if (cursor) {
          console.log("time: " + cursor.key + ", quaternion: " + cursor.value.quaternion);
          cursor.continue();
        } else {
          console.log("No more entries in " + tableName + "!");
        }
      }
   };
}

function indexedDBAdd(tableName, obj) {
  let request;
  let parseData = JSON.parse(obj);
  if(tableName.localeCompare("laptop")===0){
    request = db.transaction([tableName], "readwrite")
      .objectStore(tableName)
      .add({unix_time_with_ms: parseData.unix_time_with_ms, yaw: parseData.yaw, pitch: parseData.pitch});
    console.log("Add in DB >> " + parseData.unix_time_with_ms + " ::: " + parseData.yaw + " ::: " + parseData.pitch);
  }else if(tableName.localeCompare("mobile")===0){
    request = db.transaction([tableName], "readwrite")
      .objectStore(tableName)
      .add({unix_time_with_ms: parseData.unix_time_with_ms, quaternion: parseData.quaternion});
    console.log("Add in DB >> " + parseData.unix_time_with_ms + " ::: " + parseData.quaternion);
  }
  request.onsuccess = function(event) {
    console.log("New data has been added to your database.");
  };

  request.onerror = function(event) {
    console.log("Unable to add data in your database! ");
  };
}

function indexedDBRemove(tableName, keyValue) {
  var request = db.transaction([tableName], "readwrite")
   .objectStore(tableName)
   .delete(keyValue);

  request.onsuccess = function(event) {
    console.log(keyValue + "'s entry has been removed from your table: " + tableName);
  };
}
