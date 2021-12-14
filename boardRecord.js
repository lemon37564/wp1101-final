let boardRecord;
let player1;
let player2;
let player1pic;
let player2pic;
let gamesRecordTime;

let storageKeys = [];
let storageData = [];
let currentIndex;
let currentStep;

function startBoardRecord() {
  boardRecord = document.getElementById("boardRecord");
  player1 = document.getElementById("player1");
  player2 = document.getElementById("player2");
  player1pic = document.getElementById("player1pic");
  player2pic = document.getElementById("player2pic");
  gamesRecordTime = document.getElementById("gamesRecordTime");

  getStorage();
  currentIndex = 0;
  currentStep = 0;

  initShow();
  boardRecordShow();

  const fileUploader = document.querySelector("#file-uploader");

  /*fileUploader.addEventListener("change", (e) => {
    showDataByText();
  });*/
}

function getStorage() {
  if (localStorage.length == 0) {
    return;
    // window.alert("norecord");
  }

  for (let i = 0; i < localStorage.length; i++) {
    storageKeys[i] = localStorage.key(i);
  }
  storageKeys.sort(function (a, b) {
    let numA = parseInt(a.split("-")[1]);
    let numB = parseInt(b.split("-")[1]);
    return numB - numA;
  });

  for (let i = 0; i < storageKeys.length; i++) {
    let data = localStorage[storageKeys[i]];
    storageData[i] = JSON.parse(data);
  }
  console.log(storageData);
}

function initShow() {
  if (storageKeys.length == 0) {
    return;
  }

  let boardShow = "";
  for (let j = 0; j < 8; j++) {
    for (let k = 0; k < 8; k++) {
      boardShow +=
        "<img src = 'imgs/none.webp' class='record-img' id='cell" +
        String(j) +
        String(k) +
        "'>";
    }
    boardShow += "<br>";
  }
  boardRecord.innerHTML = boardShow;

  gamesRecordTime.innerHTML =
    "記錄 #" +
    String(storageKeys.length - currentIndex) +
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;時間" +
    storageData[currentIndex]["date"].year +
    "/" +
    storageData[currentIndex]["date"].month +
    "/" +
    storageData[currentIndex]["date"].day +
    "&nbsp;&nbsp;&nbsp;&nbsp;" +
    storageData[currentIndex]["date"].hour +
    ":" +
    storageData[currentIndex]["date"].minute;

  player1.innerHTML = judgePlayer(storageData[currentIndex]["p1"]);
  player2.innerHTML = judgePlayer(storageData[currentIndex]["p2"]);
  judgePlayerpic();
}

function boardRecordShow() {
  if (storageKeys.length == 0) {
    return;
  }

  let board = storageData[currentIndex]["boards"][currentStep];
  let count = 0;

  for (let j = 0; j < 8; j++) {
    for (let k = 0; k < 8; k++) {
      let cell = document.getElementById("cell" + String(j) + String(k));
      if (board[count] == "X" && cell.src != "imgs/black.webp") {
        cell.src = "imgs/black.webp";
      } else if (board[count] == "O" && cell.src != "imgs/white.webp") {
        cell.src = "imgs/white.webp";
      } else if (board[count] == "_" && cell.src != "imgs/none.webp") {
        cell.src = "imgs/none.webp";
      }
      count++;
    }
  }
}

function beforePage() {
  if (currentIndex - 1 < 0) {
    window.alert("最前面了");
    return;
  }
  currentIndex--;
  currentStep = 0;
  initShow();
  boardRecordShow();
}

function nextPage() {
  if (currentIndex + 1 >= storageKeys.length) {
    window.alert("最後了");
    return;
  }
  currentIndex++;
  currentStep = 0;
  initShow();
  boardRecordShow();
}

function beforeStep() {
  if (currentStep - 1 < 0) {
    window.alert("第一步");
    return;
  }
  currentStep--;
  boardRecordShow();
}

function nextStep() {
  if (currentStep + 1 >= storageData[currentIndex]["boards"].length) {
    window.alert("最後一步");
    return;
  }
  currentStep++;
  boardRecordShow();
}

function firstStep() {
  currentStep = 0;
  boardRecordShow();
}

function lastStep() {
  currentStep = storageData[currentIndex]["boards"].length - 1;
  boardRecordShow();
}

function deleteAllRecord() {
  localStorage.clear();
  boardRecord.innerHTML = "";
  gamesRecordTime.innerHTML = "";
  player1.innerHTML = "";
  player2.innerHTML = "";
  player1pic.setAttribute("src", "");
  player2pic.setAttribute("src", "");
}

function deleteThisRecord() {
  localStorage.removeItem("history-" + String(storageKeys[currentIndex]));

  // only one data
  if (storageData.length == 1) {
    deleteAllRecord();
    return;
  }
  // if current index is final one, prevent index out of range. and return directly. renaming not needed.
  if (currentIndex == storageData.length - 1) {
    currentIndex--;
    getStorage();
    initShow();
    boardRecordShow();
    return;
  }

  // rename historys.
  for (let i = currentIndex; i >= 0; i--) {
    let tmp = localStorage.getItem(storageKeys[i - 1]);
    localStorage.setItem(storageKeys[i], tmp);
  }
  localStorage.removeItem(storageKeys[0]);

  getStorage();
  initShow();
  boardRecordShow();
}

function judgePlayer(player) {
  switch (player) {
    case "human":
      return "玩家";
    case "ai0":
      return "AI 弱";
    case "ai1":
      return "AI 中";
    case "ai2":
      return "AI 強";
  }
}

function judgePlayerpic() {
  if (storageData[currentIndex]["first"] == "black") {
    player1pic.setAttribute("src", "imgs/black.webp");
    player2pic.setAttribute("src", "imgs/white.webp");
  } else {
    player1pic.setAttribute("src", "imgs/white.webp");
    player2pic.setAttribute("src", "imgs/black.webp");
  }
}
////////////////////////////////////////////////////download data

function saveTextAsFile() {
  _fileName = "record";
  let data = JSON.stringify(localStorage);
  let textFileAsBlob = new Blob([data], { type: "text/plain" });

  let downloadLink = document.createElement("a");
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

function importData() {
  let input = document.createElement("input");

  input.type = "file";
  input.onchange = (_) => {
    // you can use this method to get file and perform respective operations
    console.log("input" + input.files[0]);
    resultFile = input.files[0];
    if (resultFile) {
      var reader = new FileReader();

      reader.readAsText(resultFile, "UTF-8");
      reader.onload = function (e) {
        let data = JSON.parse(this.result);

        for(let i in data) {
          localStorage.setItem(i, data[i]);
        }
      };
    }
    
  }
  input.click();
}
//////////////////////////////////////////////////////

window.addEventListener("load", startBoardRecord, false);
