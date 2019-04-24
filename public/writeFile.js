'use strict';
let exportButton = document.getElementById("exportButton");


exportButton.onclick = function(){
      var content = "I like cat!";
      console.log(">>>> "+content);
      var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "file.txt");//saveAs(blob,filename)
};
