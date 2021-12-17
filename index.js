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

  window.location.hash = "";
  setTimeout(function () {
    bgm = new Audio("gameBackGroundMusic.mp3");
    bgm.load();
  }, 10000);
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
        tmp += "<th>" + String(rank) + "</th>";
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

function hideAll() {
  showBoard.style.display = "none";
  aboutPage.style.display = "none";
  iframe.style.display = "none";
  historyPage.style.display = "none";
  try {
    document.getElementById("easter-egg").style.display = "none";
  } catch {}
}

function showAboutPage() {
  hideAll();
  aboutPage.style.display = "block";
}

function showGame() {
  hideAll();
  iframe.style.display = "inline-block";
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

function fadeIn(el, duration) {
  /*
   * @param el - The element to be faded out.
   * @param duration - Animation duration in milliseconds.
   */

  let step = 10 / duration,
    opacity = 0;
  function next() {
    if (opacity >= 1) {
      return;
    }
    el.style.opacity = opacity += step;
    setTimeout(next, 10);
  }
  next();
}

let timeForLoading = 0;
let prepare = 0;

function load(loadId, duration) {
  function next2() {
    if (prepare++ > 25) {
      loadingFinished = true;
      //loader = document.getElementById("loading-container");
      //loader.setAttribute("style", "display:none");

      fadeIn(iframe, 1000);

      showGame();

      return;
    }

    loadId.innerHTML = arr2[timeForLoading++ % 4];
    setTimeout(next2, 200);
  }
  next2();
}

function surprise() {
  if (document.getElementById("easter-egg") != null) {
    hideAll();
    document.getElementById("easter-egg").style.display = "inline-block";
    window.location.hash = "surprise";
    return;
  }

  let easterEgg = document.createElement("iframe");
  easterEgg.setAttribute("class", "game");
  easterEgg.setAttribute("id", "easter-egg");
  easterEgg.setAttribute(
    "src",
    "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  );
  easterEgg.setAttribute("title", "YouTube video player");
  easterEgg.setAttribute("frameborder", "0");
  easterEgg.setAttribute(
    "allow",
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  );
  easterEgg.setAttribute(
    "style",
    "display: none; width: calc(70vw); height: calc(70vw * 9 / 16);"
  );
  easterEgg.setAttribute("allowfullscreen", "true");
  easterEgg.muted = false;

  document.getElementById("pages").insertBefore(easterEgg, iframe);

  window.setTimeout(function () {
    hideAll();
    easterEgg.style.display = "inline-block";
  }, 600);
}

let bgmIsPlaying = false;
let bgm = null;
let clickTimes = 0;

function bgmClick() {
  clickTimes++;
  if (clickTimes == 10) {
    document.getElementById("music-button").src =
      "imgs/1200px-Icon-round-Question_mark.png";
    bgm.pause();
    bgmClick = surprise;
    return;
  }

  if (!bgmIsPlaying) {
    if (bgm == null) {
      bgm = new Audio("gameBackGroundMusic.mp3");
    }
    bgm.play();
    document.getElementById("music-button").src = "imgs/pause.png";
  } else {
    bgm.pause();
    document.getElementById("music-button").src = "imgs/play.png";
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

window.addEventListener("load", start, false);
window.onhashchange = hashChange;
