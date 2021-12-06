let rankButton, gameButton, aboutGameButton;
let showBoard;
let iframe;
let loadId;
let collapse1, collapse2, collapse3;
let aboutPage;
let loader;
let loadingFinished = false;

function start() {
  rankButton = document.getElementById("rank");
  gameButton = document.getElementById("game");
  aboutGameButton = document.getElementById("about");
  showBoard = document.getElementById("rankboard");
  iframe = document.getElementById("iframe");
  loadId = document.getElementById("loading");
  collapse1 = document.getElementById("collapse1");
  collapse2 = document.getElementById("collapse2");
  collapse3 = document.getElementById("collapse3");
  aboutPage = document.getElementById("aboutPage");
  loader = document.getElementById("loading-container");

  let rankMusic = new Audio("rankMusic.mp3");
  let clickMusic = new Audio("clickMusic.mp3");

  rankButton.addEventListener("click", showRank, false);
  gameButton.addEventListener("click", showGame, false);
  aboutGameButton.addEventListener("click", showAboutPage, false);
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

  load(loadId, 500);
}

async function getRank() {
  setTimeout(function(){
    console.log("I am the third log after 5 seconds");
},5000);

  let rankEasyShow = document.getElementById("rankEasyContent");
  let rankMiddleShow = document.getElementById("rankMiddleContent");
  let rankHardShow = document.getElementById("rankHardContent");
  let ranks = [rankEasyShow, rankMiddleShow, rankHardShow];

  let request = new XMLHttpRequest();
  let datastr;
  let len = 0;
  request.open(
    "get",
    "https://ntou-sell.herokuapp.com/backend/leaderboard/get",
    false
  );
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      let type = request.getResponseHeader("Content-Type");
      if (type.match(/^text/)) {
        datastr = JSON.parse(request.responseText);
        len = datastr.length;
        console.log(datastr);
      }
    }
  };
  request.send(null);
  //datastr.sort();

  let tmp = ["", "", ""];

  for (let i = 0; i < len; i++) {
    let stren = parseInt(datastr[i].strength);
    tmp[stren] += "<tr class='success'>";
    tmp[stren] += "<th>" + String(i + 1) + "</th>";
    tmp[stren] += "<th>" + datastr[i].player_name + "</th>";
    tmp[stren] += "<th>" + datastr[i].self_point + ":" + datastr[i].enemy_point + "</th>";
    tmp[stren] += "</tr>";
  }

  for (let i = 0; i < 3; i++) {
    ranks[i].innerHTML = tmp[i];
  }
}

function showAboutPage() {
  showBoard.setAttribute("style", "display:none;");
  aboutPage.setAttribute("style", "display:block;");
  iframe.setAttribute("style", "display:none;");
  loader.setAttribute("style", "display:none;");
}

function showGame() {
  if (!loadingFinished) {
    return;
  }
  iframe.setAttribute(
    "style",
    "display:block;width:72vw;height:40.5vw; border: none;box-sizing: border-box;border-radius: 7px;"
  );
  showBoard.setAttribute("style", "display:none;");
  aboutPage.setAttribute("style", "display:none;");
}

function showRank() {
  getRank();
  iframe.setAttribute("style", "display:none;");
  showBoard.setAttribute("style", "display:block;");
  aboutPage.setAttribute("style", "display:none;");
  loader.setAttribute("style", "display:none;");
  console.log("ggg")
  
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
      console.log("loading finish");
      loadingFinished = true;
      loader.setAttribute("style", "display:none");

      fadeIn(iframe, 1000);

      console.log(iframe.style.height);
      showGame();

      return;
    }

    loadId.innerHTML = arr2[timeForLoading++ % 4];
    setTimeout(next2, 200);
  }
  next2();
}

window.addEventListener("load", start, false);
