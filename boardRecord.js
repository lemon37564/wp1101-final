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

  initialize();
  boardRecordShow();
}

function initialize() {
  currentIndex = 0;
  currentStep = 0;
  storageKeys = [];
  storageData = [];

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

  initShow();
  updateTopLabel();
  checkCanChangePage();
}

function initShow() {
  if (storageKeys.length == 0) {
    gamesRecordTime.innerHTML = "沒有遊戲記錄，快去玩幾場吧～";
    document.getElementById("previous-page-button").style.display = "none";
    document.getElementById("previous-page-button").style.display = "none";
    document.getElementById("first-step-button").style.display = "none";
    document.getElementById("previous-step-button").style.display = "none";
    document.getElementById("next-step-button").style.display = "none";
    document.getElementById("last-step-button").style.display = "none";
    document.getElementById("next-page-button").style.display = "none";
    document.getElementById("delete-all-button").style.display = "none";
    document.getElementById("delete-this-button").style.display = "none";
    document.getElementById("save-file-button").style.display = "none";
    document.getElementById("total-count-show").style.display = "none";
    return;
  }

  document.getElementById("previous-page-button").style.display = "block";
  document.getElementById("previous-page-button").style.display = "block";
  document.getElementById("first-step-button").style.display = "block";
  document.getElementById("previous-step-button").style.display = "block";
  document.getElementById("next-step-button").style.display = "block";
  document.getElementById("last-step-button").style.display = "block";
  document.getElementById("next-page-button").style.display = "block";
  document.getElementById("delete-all-button").style.display = "inline-block";
  document.getElementById("delete-this-button").style.display = "inline-block";
  document.getElementById("save-file-button").style.display = "inline-block";
  document.getElementById("total-count-show").style.display = "block";

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
}

function updateTopLabel() {
  if (storageKeys.length == 0) {
    return;
  }

  let hour = String(storageData[currentIndex]["date"].hour);
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  let minute = String(storageData[currentIndex]["date"].minute);
  if (minute.length == 1) {
    minute = "0" + minute;
  }

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
    hour +
    ":" +
    minute;

  document.getElementById("total-count-show").innerHTML =
    "共有 " + String(storageKeys.length) + " 筆記錄";

  player1.innerHTML = "先手: " + judgePlayer(storageData[currentIndex]["p1"]);
  player2.innerHTML = "後手: " + judgePlayer(storageData[currentIndex]["p2"]);
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
  currentIndex--;
  currentStep = 0;
  updateTopLabel();
  boardRecordShow();
  checkCanChangePage();
}

function nextPage() {
  currentIndex++;
  currentStep = 0;
  updateTopLabel();
  boardRecordShow();
  checkCanChangePage();
}

function checkCanChangePage() {
  let next = document.getElementById("next-page-button");
  let prev = document.getElementById("previous-page-button");
  if (currentIndex == storageKeys.length - 1) {
    next.setAttribute("disabled", "");
  } else {
    next.removeAttribute("disabled");
  }
  if (currentIndex == 0) {
    prev.setAttribute("disabled", "");
  } else {
    prev.removeAttribute("disabled");
  }
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
  initialize();
}

function deleteThisRecord() {
  // only one data
  if (storageData.length == 1) {
    deleteAllRecord();
    return;
  }
  // if current index is final one, prevent index out of range. and return directly. renaming not needed.
  if (currentIndex == 0) {
    localStorage.removeItem(String(storageKeys[currentIndex]));
    initialize();
    updateTopLabel();
    boardRecordShow();
    return;
  }

  // rename historys.
  for (let i = currentIndex; i >= 0; i--) {
    let tmp = localStorage.getItem(storageKeys[i - 1]);
    localStorage.setItem(storageKeys[i], tmp);
  }
  localStorage.removeItem(storageKeys[0]);

  let tmp = currentIndex; // reserve current index
  initialize();
  if (tmp >= storageKeys.length) {
    tmp = storageKeys.length - 1;
  }
  currentIndex = tmp;
  boardRecordShow();
  checkCanChangePage(); // needed
  updateTopLabel(); // needed
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
  let data = JSON.stringify(localStorage);
  let textFileAsBlob = new Blob([data], { type: "application/json" });
  let dateTime = new Date();

  let downloadLink = document.createElement("a");
  downloadLink.download =
    "record-" +
    String(dateTime.getFullYear()) +
    String(dateTime.getMonth() + 1).padStart(2, "0") +
    String(dateTime.getDate()).padStart(2, "0") +
    "-" +
    String(dateTime.getHours()).padStart(2, "0") +
    String(dateTime.getMinutes()).padStart(2, "0") +
    String(dateTime.getSeconds()).padStart(2, "0");
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
    resultFile = input.files[0];
    if (resultFile) {
      var reader = new FileReader();

      reader.readAsText(resultFile, "UTF-8");
      reader.onload = function (e) {
        let data = JSON.parse(this.result);

        for (let i in data) {
          localStorage.setItem(i, data[i]);
        }
        initialize();
        boardRecordShow();
      };
    }
  };
  input.click();
}
//////////////////////////////////////////////////////

window.addEventListener("load", startBoardRecord, false);
