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

  let collapse1 = document.getElementById("collapse1");
  let collapse2 = document.getElementById("collapse2");
  let collapse3 = document.getElementById("collapse3");

  let rankMusic = new Audio("rankMusic.mp3");
  let clickMusic = new Audio("clickMusic.mp3");

  let gameBackGroundMusic = document.getElementById("Test_Audio");

  //background music;
  document.addEventListener("click", function () {
    // gameBackGroundMusic.muted = false;
    // gameBackGroundMusic.play();
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

  window.location.hash = "";
}

async function getRank(strength) {
  let request = new XMLHttpRequest();
  document.getElementById("spinner").style.visibility = "visible";
  document.getElementById("menu1").style.visibility = "hidden";
  document.getElementById("menu2").style.visibility = "hidden";
  document.getElementById("menu3").style.visibility = "hidden";

  let rankEasyShow = document.getElementById("rankEasyContent");
  let rankMiddleShow = document.getElementById("rankMiddleContent");
  let rankHardShow = document.getElementById("rankHardContent");
  let currentShow;

  switch (strength) {
    case 0:
      currentShow = rankEasyShow;
      break;
    case 1:
      currentShow = rankMiddleShow;
      break;
    case 2:
      currentShow = rankHardShow;
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
        tmp += "<th>" + data[i].player_name + "</th>";
        tmp +=
          "<th>" + data[i].self_point + ":" + data[i].enemy_point + "</th>";

        let date = new Date(data[i].game_date);

        tmp +=
          "<th>" +
          date.getFullYear() +
          "/" +
          String(date.getMonth() + 1) +
          "/" +
          date.getDate() +
          "</th>";
        tmp += "</tr>";
        rank += 1;
      }

      currentShow.innerHTML = tmp;

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
    document.getElementById("easter-egg").style.display = "block";
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
  easterEgg.setAttribute("style", "display: none");
  easterEgg.setAttribute("allowfullscreen", "true");
  easterEgg.muted = false;

  document.getElementById("pages").insertBefore(easterEgg, iframe);

  window.setTimeout(function () {
    hideAll();
    easterEgg.style.display = "block";
  }, 600);
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
