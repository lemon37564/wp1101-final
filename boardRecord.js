let boardRecord;
let player1;
let player2;
let player1pic;
let player2pic;
let gamesRecordTime;

let blackCounter;
let whiteCounter;

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
  blackCounter = document.getElementById("black-count");
  whiteCounter = document.getElementById("white-count");

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
  checkCanChangeStep();
}

function initShow() {
  if (storageKeys.length == 0) {
    hideEverythingExceptImportButton();
    return;
  }
  showEverything();

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

function hideEverythingExceptImportButton() {
  gamesRecordTime.innerHTML = "沒有遊戲記錄，快去玩幾場吧～";
  gamesRecordTime.style.float = "none";
  //document.getElementById("total-count-show").style.display = "none";
  let all = document.getElementsByClassName("record-page-button");
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "none";
  }
  document.getElementById("record-page-top-button").style.display = "none";
  document.getElementById("record-page-bottom-button").style.justifyContent =
    "center";
  blackCounter.style.display = "none";
  whiteCounter.style.display = "none";
  document.getElementById("jump-function-label").style.display = "none";
}

function showEverything() {
  gamesRecordTime.style.float = "left";
  //document.getElementById("total-count-show").style.display = "block";
  let all = document.getElementsByClassName("record-page-button");
  for (let i = 0; i < all.length; i++) {
    all[i].style.display = "block";
  }
  document.getElementById("record-page-top-button").style.display = "flex";
  document.getElementById("record-page-bottom-button").style.justifyContent =
    "space-between";
  blackCounter.style.display = "block";
  whiteCounter.style.display = "block";
  document.getElementById("jump-function-label").style.display = "block";
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
  const language = {
    record: { en: "Record", "zh-TW": "紀錄" },
    total: { en: "total", "zh-TW": "共有" },
    records: { en: "records", "zh-TW": "筆紀錄" },
    date: { en: "date", "zh-TW": "時間" },
    order1: { en: "", "zh-TW": "先手:" },
    order2: { en: "", "zh-TW": "後手:" },
  };
  gamesRecordTime.innerHTML =
    language["record"][locale] +
    " #" +
    String(storageKeys.length - currentIndex) +
    "/#" +
    String(storageKeys.length) +
    language["records"][locale] +
    "<br>" +
    language["date"][locale] +
    ":" +
    storageData[currentIndex]["date"].year +
    "/" +
    storageData[currentIndex]["date"].month +
    "/" +
    storageData[currentIndex]["date"].day +
    "&nbsp;&nbsp;&nbsp;" +
    hour +
    ":" +
    minute;

  // document.getElementById("total-count-show").innerHTML =
  //  "共有 " + String(storageKeys.length) + " 筆記錄";

  player1.innerHTML =
    language["order1"][locale] +
    " " +
    judgePlayer(storageData[currentIndex]["p1"]);
  player2.innerHTML =
    language["order2"][locale] +
    " " +
    judgePlayer(storageData[currentIndex]["p2"]);
  judgePlayerpic();
}

function boardRecordShow() {
  if (storageKeys.length == 0) {
    return;
  }

  let board = storageData[currentIndex]["boards"][currentStep];
  let count = 0;
  let blackCount = 0;
  let whiteCount = 0;

  for (let j = 0; j < 8; j++) {
    for (let k = 0; k < 8; k++) {
      let cell = document.getElementById("cell" + String(j) + String(k));
      if (board[count] == "X") {
        if (cell.src != "imgs/black.webp") {
          cell.src = "imgs/black.webp";
        }
        blackCount++;
      } else if (board[count] == "O") {
        if (cell.src != "imgs/white.webp") {
          cell.src = "imgs/white.webp";
        }
        whiteCount++;
      } else if (board[count] == "_" && cell.src != "imgs/none.webp") {
        cell.src = "imgs/none.webp";
      }
      count++;
    }
  }

  blackCounter.innerHTML = String(blackCount);
  whiteCounter.innerHTML = String(whiteCount);
}

function jumpPage(value) {
  document.getElementById("jump-input").value = "";
  if (value[0] == "#") {
    value = value.substring(1, value.length);
  }
  let valueInt = parseInt(value);
  if (isNaN(valueInt)) {
    return;
  }
  if (valueInt <= 0 || valueInt > storageKeys.length) {
    return;
  }
  currentIndex = storageKeys.length - valueInt;
  currentStep = 0;
  updateTopLabel();
  boardRecordShow();
  checkCanChangeStep();
  checkCanChangePage();
}

function beforePage() {
  currentIndex--;
  currentStep = 0;
  updateTopLabel();
  boardRecordShow();
  checkCanChangeStep();
  checkCanChangePage();
}

function nextPage() {
  currentIndex++;
  currentStep = 0;
  updateTopLabel();
  boardRecordShow();
  checkCanChangeStep();
  checkCanChangePage();
}

function checkCanChangePage() {
  let next = document.getElementById("next-page-button");
  let prev = document.getElementById("previous-page-button");
  if (currentIndex == storageKeys.length - 1) {
    next.setAttribute("disabled", "");
    next.setAttribute("class", "btn btn-outline-info");
  } else {
    next.removeAttribute("disabled");
    next.setAttribute("class", "btn btn-info");
  }
  if (currentIndex == 0) {
    prev.setAttribute("disabled", "");
    prev.setAttribute("class", "btn btn-outline-info");
  } else {
    prev.removeAttribute("disabled");
    prev.setAttribute("class", "btn btn-info");
  }
}

function beforeStep() {
  currentStep--;
  boardRecordShow();
  checkCanChangeStep();
}

function nextStep() {
  currentStep++;
  boardRecordShow();
  checkCanChangeStep();
}

function firstStep() {
  currentStep = 0;
  boardRecordShow();
  checkCanChangeStep();
}

function lastStep() {
  currentStep = storageData[currentIndex]["boards"].length - 1;
  boardRecordShow();
  checkCanChangeStep();
}

function checkCanChangeStep() {
  if (storageKeys.length == 0) {
    return;
  }

  if (currentStep == 0) {
    document.getElementById("first-step-button").style.visibility = "hidden";
    document.getElementById("previous-step-button").style.visibility = "hidden";
  } else {
    document.getElementById("first-step-button").style.visibility = "visible";
    document.getElementById("previous-step-button").style.visibility =
      "visible";
  }

  if (currentStep == storageData[currentIndex]["boards"].length - 1) {
    document.getElementById("next-step-button").style.visibility = "hidden";
    document.getElementById("last-step-button").style.visibility = "hidden";
  } else {
    document.getElementById("next-step-button").style.visibility = "visible";
    document.getElementById("last-step-button").style.visibility = "visible";
  }
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
      return locale == "zh-TW" ? "玩家" : "player";
    case "ai0":
      return locale == "zh-TW" ? "AI 弱" : "AI weak";
    case "ai1":
      return locale == "zh-TW" ? "AI 中" : "AI medium";
    case "ai2":
      return locale == "zh-TW" ? "AI 強" : "AI strong";
    default:
      return locale == "zh-TW" ? "未知" : "unknown";
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
  input.setAttribute("accept", ".json");

  input.onchange = (_) => {
    // you can use this method to get file and perform respective operations
    resultFile = input.files[0];

    if (resultFile) {
      var reader = new FileReader();

      reader.readAsText(resultFile, "UTF-8");

      reader.onload = function (e) {
        try {
          let data = JSON.parse(this.result);
          for (let i in data) {
            localStorage.setItem(i, data[i]);
          }
        } catch (err) {
          document.getElementById("wrongFile-button").click();
        }

        try {
          initialize();
          boardRecordShow();
        } catch (err) {
          localStorage.clear();
          document.getElementById("wrongFile-button").click();
        }
      };
    }
  };
  input.click();
}
//////////////////////////////////////////////////////
