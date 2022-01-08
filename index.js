let showBoard;
let historyPage;
let iframe;
let loadId;
let aboutPage;
let loader;

function start() {
  showBoard = document.getElementById("rankboard");
  iframe = document.getElementById("iframe");
  aboutPage = document.getElementById("aboutPage");
  historyPage = document.getElementById("historyPage");

  let lang = navigator.language || navigator.userLanguage;
  changeLocal(lang);

  window.location.hash = "";
  setTimeout(loadResources, 10000);
}

let currentShow, currentMenu;

async function getRank(strength) {
  let request = new XMLHttpRequest();
  document.getElementById("spinner").style.visibility = "visible";
  let menu1 = document.getElementById("menu1");
  let menu2 = document.getElementById("menu2");
  let menu3 = document.getElementById("menu3");

  let rankEasyShow = document.getElementById("rankEasyContent");
  let rankMiddleShow = document.getElementById("rankMiddleContent");
  let rankHardShow = document.getElementById("rankHardContent");

  menu1.setAttribute("class", "tab-pane fade");
  menu2.setAttribute("class", "tab-pane fade");
  menu3.setAttribute("class", "tab-pane fade");

  switch (strength) {
    case 0:
      currentShow = rankEasyShow;
      currentMenu = menu1;
      break;
    case 1:
      currentShow = rankMiddleShow;
      currentMenu = menu2;
      break;
    case 2:
      currentShow = rankHardShow;
      currentMenu = menu3;
      break;
    default:
      return;
  }

  request.open(
    "get",
    "https://ntou-sell.herokuapp.com/backend/leaderboard/get?strength=" +
      String(strength) +
      "&amount=100"
  );
  request.onload = function () {
    if (request.readyState === 4 && request.status === 200) {
      let type = request.getResponseHeader("Content-Type");
      let data;

      if (type.match(/^text/)) {
        data = JSON.parse(request.responseText);
      }

      let tmp = "";
      let rank = 1;

      for (let i = 0; i < data.length; i++) {
        tmp += "<tr>";
        tmp += "<th>" + getRankPic(rank) + "</th>";
        tmp += "<th>" + escapeHTML(data[i].player_name) + "</th>";
        tmp +=
          "<th>" + data[i].self_point + ":" + data[i].enemy_point + "</th>";

        let date = new Date(data[i].game_date);

        tmp +=
          "<th>" +
          String(date.getFullYear()) +
          "/" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "/" +
          String(date.getDate()).padStart(2, "0") +
          "</th>";
        tmp += "</tr>";
        rank += 1;
      }

      currentShow.innerHTML = tmp;

      document.getElementById("spinner").style.visibility = "hidden";
      currentMenu.setAttribute("class", "tab-pane fade in active show");
    }
  };
  request.send(null);
}

function loadResources() {
  if (bgm != null) return;
  bgm = new Audio("gameBackGroundMusic.mp3");
  bgm.load();
}

function getRankPic(rank) {
  if (rank <= 3) {
    return "<img src='imgs/" + String(rank) + ".webp' class='rankPic'</img>";
  } else {
    return String(rank);
  }
}

function hideAll() {
  showBoard.style.display = "none";
  aboutPage.style.display = "none";
  iframe.style.display = "none";
  historyPage.style.display = "none";
  document.getElementById("easter-egg").style.display = "none";
}

function showAboutPage() {
  hideAll();
  aboutPage.style.display = "block";
}

function showGame() {
  hideAll();
  iframe.style.display = "block";
}

function showRank() {
  getRank(0);
  hideAll();
  showBoard.style.display = "block";
}

function showHistoryPage() {
  hideAll();
  startBoardRecord();
  historyPage.style.display = "block";
}

function surprise() {
  hideAll();
  document.getElementById("easter-egg").style.display = "inline-block";
  document.getElementById("easter-egg").contentWindow.nextImage();
  window.location.hash = "surprise";
}

let bgmIsPlaying = false;
let bgm = null;
let clickTimes = 0;

function bgmClick() {
  clickTimes++;
  if (clickTimes == 10) {
    document.getElementById("music-button").src =
      "imgs/1200px-Icon-round-Question_mark.webp";
    bgm.pause();
    bgmClick = surprise;
    return;
  }

  if (!bgmIsPlaying) {
    if (bgm == null) {
      bgm = new Audio("gameBackGroundMusic.mp3");
    }
    bgm.loop = true;
    bgm.play();
    document.getElementById("music-button").src = "imgs/pause.webp";
  } else {
    bgm.pause();
    document.getElementById("music-button").src = "imgs/play.webp";
  }
  bgmIsPlaying = !bgmIsPlaying;
}

function escapeHTML(raw) {
  return raw
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hashChange() {
  switch (window.location.hash) {
    case "": // index
      showGame();
      break;
    case "#rank":
      showRank();
      break;
    case "#record":
      showHistoryPage();
      break;
    case "#about":
      showAboutPage();
      break;
    default:
      break;
  }
}

function downloadPPT() {
  let a = document.getElementById("download-a");
  a.setAttribute("download", "期末報告第11組.pdf");
  a.href = "data/期末報告第11組.pdf";
  a.click();
}

function downloadRecordDemo() {
  let a = document.getElementById("download-a");
  a.setAttribute("download", "record-demo.json");
  a.href = "data/record-demo.json";
  a.click();
}

function downloadRecordDemoLarge() {
  let a = document.getElementById("download-a");
  a.setAttribute("download", "record-large.json");
  a.href = "data/record-brute.json";
  a.click();
}

window.addEventListener("load", start, false);
window.onhashchange = hashChange;
