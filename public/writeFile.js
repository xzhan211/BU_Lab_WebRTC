'use strict';
let exportButton = document.getElementById("exportButton");


exportButton.onclick = function(){
      var content = "I like cat!";
      let arr = ['cat', 'dog\\\n'];
      arr.push("hen");
      console.log(">>>> "+content);
      var blob = new Blob([arr], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "file.txt");//saveAs(blob,filename)
};
