var boardRecord;
var nowPage;
var pageLength;
var nowStep;
var wholeBoards = [];
var wholeBoardsMaxStep = [];
var player1;
var player2;
var player1pic;
var player2pic;
var itemVsKey = [];
var gamesRecordTime;
function startBoardRecord() {
  boardRecord = document.getElementById("boardRecord");
  boardRecordName = document.getElementById("boardRecordName");
  player1 = document.getElementById("player1");
  player2 = document.getElementById("player2");
  player1pic = document.getElementById("player1pic");
  player2pic = document.getElementById("player2pic");
  gamesRecordTime = document.getElementById("gamesRecordTime");
  nowPage = 0;
  getRecord();

  boardRecordShow();

  const fileUploader = document.querySelector("#file-uploader");

  fileUploader.addEventListener("change", (e) => {
    showDataByText();
  });
}

function getRecord() {
  pageLength = localStorage.length;
  if (pageLength == 0) {
    // window.alert("norecord");
  }
  var count = 0;

  for (nowPage = 0; nowPage < pageLength; nowPage++) {
    for (i = 0; i < pageLength; i++) {
      var temp2 = localStorage.key(i).split("-");
      if (parseInt(temp2[1]) == nowPage) {
        itemVsKey[count] = nowPage;
       
        wholeBoards[count++] = localStorage.key(i);
      }
    }
  }

  for (nowPage = 0; nowPage < pageLength; nowPage++) {
    wholeBoards[nowPage] = JSON.parse(
      localStorage.getItem(wholeBoards[nowPage])
    );
  }
  
  for (nowPage = 0; nowPage < pageLength; nowPage++) {
    wholeBoardsMaxStep[nowPage] = wholeBoards[nowPage].boards.length;
  }
  nowPage = 0;
  nowStep = 0;
  //console.log(nowPage);
  totalPage = wholeBoards.length;

  console.log("totalPage=" + totalPage);
  console.log("nowStep=" + nowStep);
  boardRecordShow();
}

function boardRecordShow() {
  console.log("bordershow");

  var boardShow = "";
  player1.innerHTML = "";
  player2.innerHTML = "";
  player1pic.setAttribute("src","");
  player2pic.setAttribute("src","");

  if (pageLength == 0) return;
  gamesRecordTime.innerHTML = "本次遊玩時間"+wholeBoards[nowPage]["date"].year+"/"+wholeBoards[nowPage]["date"].month+"/"+wholeBoards[nowPage]["date"].day; 
  
  var board = wholeBoards[nowPage].boards[nowStep];

  player1.innerHTML = judgePlayer(wholeBoards[nowPage].p1);
  player2.innerHTML = judgePlayer(wholeBoards[nowPage].p2);
  judgePlayerpic();

  var count = 0;
  for (var j = 0; j < 8; j++) {
    for (var k = 0; k < 8; k++) {
      if (board[count] == "X") {
        boardShow += "<img src = 'imgs/black.webp' class='record-img'>";
      }
      if (board[count] == "O") {
        boardShow += "<img src = 'imgs/white.webp' class='record-img'>";
      }
      if (board[count] == "_") {
        boardShow += "<img src = 'imgs/none.webp' class='record-img'>";
      }
      count++;
    }

    boardShow += "<br>";
  }

  console.log("nowstep=" + nowStep);
  console.log("nowpage=" + nowPage);
  boardRecord.innerHTML = boardShow;
}

function beforePage() {
  if (nowPage - 1 < 0) {
    window.alert("最前面了");
    return;
  }

  nowPage--;
  nowStep = 0;
  boardRecordShow();
}

function nextPage() {
  if (nowPage + 1 >= pageLength) {
    window.alert("最後了");
    return;
  }
  nowStep = 0;
  nowPage++;
  boardRecordShow();
}

function beforeStep() {
  if (nowStep - 1 < 0) {
    window.alert("第一步");
    return;
  }
  nowStep--;
  boardRecordShow();
}

function nextStep() {
  if (nowStep + 1 >= wholeBoardsMaxStep[nowPage]) {
    window.alert("最後一步");
    return;
  }
  nowStep++;
  boardRecordShow();
}

function firstStep() {
  nowStep = 0;
  boardRecordShow();
}

function lastStep() {
  nowStep = wholeBoardsMaxStep[nowPage] - 1;
  boardRecordShow();
}

function exportRecord() {}

function importRecord() {}

function deleteAllRecord() {
  localStorage.clear();
  getRecord();
}

function deleteThisRecord() {
  localStorage.removeItem(itemVsKey[nowPage]);
  getRecord();
}

function judgePlayer(player) {
  switch (player) {
    case "human":
      return "玩家";

    case "ai0":
      return "弱";
    case "ai1":
      return "中";
    case "ai2":
      return "強";
  }
}

function judgePlayerpic() {
  if (wholeBoards[nowPage].first == "black") {
    player1pic.setAttribute("src","imgs/black.webp");
    player2pic.setAttribute("src","imgs/white.webp");
  } else {
    player1pic.setAttribute("src","imgs/white.webp");
    player2pic.setAttribute("src","imgs/black.webp");
  }
}
////////////////////////////////////////////////////download data

//console.log(JSON.stringify(localStorage));

data = JSON.stringify(localStorage);
localStorage = JSON.parse(data);

function saveTextAsFile() {
  _fileName = "record";
  var sentence = "";
  for (var i = 0; i < pageLength; i++) {
    sentence += localStorage.getItem(localStorage.key(i));
    sentence += "-----";
  }
  _text = sentence;
  var textFileAsBlob = new Blob([_text], { type: "text/plain" });

  var downloadLink = document.createElement("a");
  downloadLink.download = _fileName;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

///////////////////////////////////////////////////////

//////////////////////////////////////////////////////upload data

function showDataByText() {
  var resultFile = document.getElementById("file-uploader").files[0];
  var urlData;
  if (resultFile) {
    var reader = new FileReader();

    reader.readAsText(resultFile, "UTF-8");
    reader.onload = function (e) {
      urlData = this.result;
      var temp = urlData.split("-----");
      count = 0;
      for (var i = 0; i < temp.length - 1; i++) {
        str = "history-" + count;
        count++;
        console.log(temp[i]);
        localStorage.setItem(str, temp[i]);
      }
      //key = "history-" + localStorage.length;

      //console.log(urlData);
      //document.getElementById("result").innerHTML += urlData;
    };
  }

  getRecord();
}

//////////////////////////////////////////////////////

window.addEventListener("load", startBoardRecord, false);
