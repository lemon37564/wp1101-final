let rankButton, gameButton, aboutGameButton;
let showBoard, history;
let historyPage;
let iframe;
let loadId;
let collapse1, collapse2, collapse3;
let aboutPage;
let loader;

function start() {
  rankButton = document.getElementById("rank");
  gameButton = document.getElementById("game");
  aboutGameButton = document.getElementById("about");
  showBoard = document.getElementById("rankboard");
  history = document.getElementById("history");
  iframe = document.getElementById("iframe");
  loadId = document.getElementById("loading");
  collapse1 = document.getElementById("collapse1");
  collapse2 = document.getElementById("collapse2");
  collapse3 = document.getElementById("collapse3");
  aboutPage = document.getElementById("aboutPage");
  historyPage = document.getElementById("historyPage");

  let rankMusic = new Audio("rankMusic.mp3");
  let clickMusic = new Audio("clickMusic.mp3");

  rankButton.addEventListener("click", showRank, false);
  gameButton.addEventListener("click", showGame, false);
  aboutGameButton.addEventListener("click", showAboutPage, false);
  history.addEventListener("click", showHistoryPage, false);
  let gameBackGroundMusic = document.getElementById("Test_Audio");

  //background music;
  document.addEventListener("click", function () {
    gameBackGroundMusic.muted = false;
    gameBackGroundMusic.play();
  });
  //other music
  collapse1.addEventListener(
    "click",
    function () {
      clickMusic.play();
    },
    false
  );
  collapse2.addEventListener(
    "click",
    function () {
      clickMusic.play();
    },
    false
  );
  collapse3.addEventListener(
    "click",
    function () {
      clickMusic.play();
    },
    false
  );

  // load(loadId, 500);
}

async function getRank() {
  let request = new XMLHttpRequest();
  document.getElementById("spinner").style.visibility = "visible";
  document.getElementById("menu1").style.visibility = "hidden";
  document.getElementById("menu2").style.visibility = "hidden";
  document.getElementById("menu3").style.visibility = "hidden";

  request.open(
    "get",
    "https://ntou-sell.herokuapp.com/backend/leaderboard/get"
  );
  request.onload = function () {
    if (request.readyState === 4 && request.status === 200) {
      let type = request.getResponseHeader("Content-Type");
      let data;

      if (type.match(/^text/)) {
        data = JSON.parse(request.responseText);
        console.log(data)
      }

      let rankEasyShow = document.getElementById("rankEasyContent");
      let rankMiddleShow = document.getElementById("rankMiddleContent");
      let rankHardShow = document.getElementById("rankHardContent");
      let ranks = [rankEasyShow, rankMiddleShow, rankHardShow];

      let tmp = ["", "", ""];
      let currentRank = [1, 1, 1];

      for (let i = 0; i < data.length; i++) {
        let stren = parseInt(data[i].strength);
        tmp[stren] += "<tr class='success'>";
        tmp[stren] += "<th>" + String(currentRank[stren]) + "</th>";
        tmp[stren] += "<th>" + data[i].player_name + "</th>";
        tmp[stren] +=
          "<th>" + data[i].self_point + ":" + data[i].enemy_point + "</th>";

        let date = new Date(data[i].game_date);

        tmp[stren] +=
          "<th>" +
          date.getFullYear() +
          "/" +
          String(date.getMonth()+1) +
          "/" +
          date.getDate() +
          "</th>";
        tmp[stren] += "</tr>";
        currentRank[stren] += 1;
      }

      for (let i = 0; i < 3; i++) {
        ranks[i].innerHTML = tmp[i];
      }

      document.getElementById("spinner").style.visibility = "hidden";
      document.getElementById("menu1").style.visibility = "visible";
      document.getElementById("menu2").style.visibility = "visible";
      document.getElementById("menu3").style.visibility = "visible";
    }
  };
  request.send(null);
}

function hideAll() {
  showBoard.style.display = "none";
  aboutPage.style.display = "none";
  iframe.style.display = "none";
  historyPage.style.display = "none";
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
  getRank();
  hideAll();
  showBoard.style.display = "block";
}

function showHistoryPage() {
  hideAll();
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
arr2 = ["loading", "loading.", "loading..", "loading..."];
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

window.addEventListener("load", start, false);
