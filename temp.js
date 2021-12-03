function start() {
	var rankButton = document.getElementById("rank");
	var gameButton = document.getElementById("game");
	var aboutGameButton = document.getElementById("aboutGame");
	var showBoard = document.getElementById("rankboard");
	var iframe = document.getElementById('iframe');
	var loadId = document.getElementById("loading");
	var collapse1 = document.getElementById("collapse1");
	var collapse2 = document.getElementById("collapse2");
	var collapse3 = document.getElementById("collapse3");
	var showAboutGameSen = document.getElementById("aboutGameBoard");
	var con = document.getElementById("container");

	var rankMusic = new Audio("rankMusic.mp3");
	var clickMusic = new Audio("clickMusic.mp3");

	rankButton.addEventListener("click", showRank, false);
	gameButton.addEventListener("click", showGame, false);
	aboutGameButton.addEventListener("click", showAboutGame, false);


	getRank();
	var gameBackGroundMusic = document.getElementById("Test_Audio");

	//background music;
	document.addEventListener("click", function () {
		gameBackGroundMusic.muted = false;
		gameBackGroundMusic.play();
	});
	//other music
	collapse1.addEventListener("click", function () { clickMusic.play() }, false);
	collapse2.addEventListener("click", function () { clickMusic.play() }, false);
	collapse3.addEventListener("click", function () { clickMusic.play() }, false);



	load(loadId, 500);
}
arrRankEasy = [{ "rank": 1, "name": "Dino", "score": 64 },
{ "rank": 2, "name": "Jim", "score": 54 },
{ "rank": 3, "name": "Dino", "score": 64 },
{ "rank": 4, "name": "Jim", "score": 54 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 }
];
arrRankMiddle = [{ "rank": 1, "name": "Dino", "score": 64 },
{ "rank": 2, "name": "Jim", "score": 54 },
{ "rank": 3, "name": "Dino", "score": 64 },
{ "rank": 4, "name": "Jim", "score": 54 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 }
];;
arrRankHard = [{ "rank": 1, "name": "Dino", "score": 64 },
{ "rank": 2, "name": "Jim", "score": 54 },
{ "rank": 3, "name": "Dino", "score": 64 },
{ "rank": 4, "name": "Jim", "score": 54 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 },
{ "rank": 5, "name": "Dino", "score": 64 }
];;

function getRank() {
	console.log("getting info");
	var request = new XMLHttpRequest;

	var rankEasyShow = document.getElementById("rankEasy");
	var rankMiddleShow = document.getElementById("rankMiddle");
	var rankHardShow = document.getElementById("rankHard");

	rankEasyShow.innerHTML = "<table class='tableShow'><thead><tr><th>Rank</th><th>Name</th><th>Score</th></tr></thead><tbody>";
	rankMiddleShow.innerHTML = "<table class='tableShow'><thead><tr><th>Rank</th><th>Name</th><th>Score</th></thead><tbody>";
	rankHardShow.innerHTML = "<table class='tableShow'><thead><tr><th>Rank</th><th>Name</th><th>Score</th></thead><tbody>";

	var datastr;
	var len = 0;
	request.open("get", "https://ntou-sell.herokuapp.com/backend/leaderboard/get", false);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {
			var type = request.getResponseHeader("Content-Type");
			if (type.match(/^text/)) {
				datastr = JSON.parse(request.responseText);
				len = datastr.length;
				console.log(datastr);


			}
		}

	}
	request.send(null);
	//datastr.sort();

	let easyTmp = "";
	let middlTmp = "";
	let hardTmp = "";

	for (let i = 0; i < len; i++) {
		let stren = parseInt(datastr[i].strength)
		if (stren == 0) {
			easyTmp += ("<tr class='success'>");
			easyTmp += "<td>" + "#" + "</td>";
			easyTmp += "<td>" + datastr[i].player_name + "</td>";
			easyTmp += "<td>" + datastr[i].self_point + ":" + datastr[i].enemy_point + "</td>";
			easyTmp += "</tr>";
		}else if (stren == 1) {
			middlTmp += ("<tr class='success'>");
			middlTmp += "<td>" + "#" + "</td>";
			middlTmp += "<td>" + datastr[i].player_name + "ssssssss</td>";
			middlTmp += "<td>" + datastr[i].self_point + ":" + datastr[i].enemy_point + "</td>";
			middlTmp += "</tr>";
		} else if (stren == 2) {
			hardTmp += ("<tr class='success'>");
			hardTmp += "<td>" + "#" + "</td>";
			hardTmp += "<td>" + datastr[i].player_name + "sssssss</td>";
			hardTmp += "<td>" + datastr[i].self_point + ":" + datastr[i].enemy_point + "</td>";
			hardTmp += "</tr>";
		}
	}
	easyTmp += "</tbody>";
	middlTmp += "</tbody>";
	hardTmp += "</tbody>";

	rankEasyShow.innerHTML += easyTmp;
	rankMiddleShow.innerHTML += middlTmp;
	rankHardShow.innerHTML += hardTmp;

	console.log("e" + rankEasyShow.innerHTML);
	console.log("m" + rankMiddleShow.innerHTML);
	console.log("h" + rankHardShow.innerHTML);
}
function showAboutGame() {
	var con = document.getElementById("container");
	var showBoard = document.getElementById("rankboard");
	var showAboutGameSen = document.getElementById("aboutGameBoard");
	showBoard.setAttribute("style", "display:none;");
	showAboutGameSen.setAttribute("style", "display:block");
	iframe.setAttribute("style", "display:none");
	con.setAttribute("style", "display:none");
	var sen = "";
	sen += "<h1 style='font-size:60px;text-align:center;'>關於作者</h1><br><br>";
	sen += "<h3> 沈彥昭 : 遊戲製作</h3><br>";
	sen += "<h3> 李佳勳 : 前端製作</h3><br><br><br>";
	sen += "<h3> 遊戲設計介紹:........................</h3>";
	showAboutGameSen.innerHTML = sen;


}
function showGame() {

	var showBoard = document.getElementById("rankboard");
	var showAboutGameSen = document.getElementById("aboutGameBoard");
	iframe.setAttribute("style", "display:block;width:72vw;height:40.5vw; border: none;box-sizing: border-box;border-radius: 7px;");
	showBoard.setAttribute("style", "display:none;");
	showAboutGameSen.setAttribute("style", "display:none;");

}
function showRank() {



	var con = document.getElementById("container");
	var showBoard = document.getElementById("rankboard");
	var showAboutGameSen = document.getElementById("aboutGameBoard");
	iframe.setAttribute("style", "display:none;");
	showBoard.setAttribute("style", "display:block;");
	showAboutGameSen.setAttribute("style", "display:none");
	con.setAttribute("style", "display:none");
	/*var rankEasyShow = document.getElementById("rankEasyShow.innerHTML");
	var rankEasyShow.innerHTML = "";
	
	rankEasyShow.innerHTML+="<table class='tableShow'>";
	rankEasyShow.innerHTML+="<thead><tr><th>Rank</th><th>Name</th><th>Score</th></thead>";
	rankEasyShow.innerHTML+="<tbody>";
	for(var i=0;i<arrRankEasy.length;i++){
		rankEasyShow.innerHTML+=("<tr class='"+"success"+"'>");
		rankEasyShow.innerHTML+="<td>"+arrRankEasy[i].rank+"</td>";
		rankEasyShow.innerHTML+="<td>"+arrRankEasy[i].name+"</td>";
	    
		rankEasyShow.innerHTML+="<td>"+arrRankEasy[i].score+"</td>"
		rankEasyShow.innerHTML+="</tr>"
	
	}
	rankEasyShow.innerHTML+="</tbody>";
	rankEasyShow.innerHTML = rankEasyShow.innerHTML;
	console.log(rankEasyShow.innerHTML);*/

}


function fadeIn(el, duration) {

	/*
	 * @param el - The element to be faded out.
	 * @param duration - Animation duration in milliseconds.
	 */

	var step = 10 / duration,
		opacity = 0;
	function next() {
		if (opacity >= 1) { return; }
		el.style.opacity = (opacity += step);
		setTimeout(next, 10);
	}
	next();
}
arr2 = ["loading", "loading.", "loading..", "loading..."];
var timeForLoading = 0;
var prepare = 0;

function load(loadId, duration) {


	function next2() {
		if (prepare++ > 25) {
			console.log("loading finish");
			var con = document.getElementById("container");
			con.setAttribute("style", "display:none");


			fadeIn(iframe, 1000);

			console.log(iframe.style.height);
			showGame();


			return;
		}

		loadId.innerHTML = arr2[(timeForLoading++) % 4];
		setTimeout(next2, 200);

	}
	next2();

}

window.addEventListener("load", start, false);


