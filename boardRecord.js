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
function startBoardRecord(){
	boardRecord = document.getElementById("boardRecord");
	boardRecordName = document.getElementById("boardRecordName");
	player1 = document.getElementById("player1");
	player2 = document.getElementById("player2");
	player1pic = document.getElementById("player1pic");
	player2pic = document.getElementById("player2pic");
	nowPage = 0;
	getRecord();
	if(pageLength == 0){
		window.alert("norecord");
		
	}
	boardRecordShow();

	const fileUploader = document.querySelector('#file-uploader');

	fileUploader.addEventListener('change', (e) => {
  		console.log(e.target.files); // get file object
	});
}
function getRecord(){
	pageLength = localStorage.length;
	if(pageLength == 0)return;
	var count = 0;
	
	for(nowPage=0;nowPage<pageLength;nowPage++){
		
		
		for(i=0;i<pageLength;i++){
			var temp2 = localStorage.key(i).split("-");
			if(parseInt(temp2[1])==nowPage){
				console.log(nowPage);
				wholeBoards[count++] = localStorage.key(nowPage);
			}
		}
		

	}
	
	for(nowPage = 0;nowPage<pageLength;nowPage++){
		wholeBoards[nowPage] = JSON.parse(localStorage.getItem(wholeBoards[nowPage]));
		
	}
	console.log(wholeBoards);
	for(nowPage = 0;nowPage<pageLength;nowPage++){
		wholeBoardsMaxStep[nowPage] = wholeBoards[nowPage].boards.length;
		

	}
	nowPage = 0;
	nowStep = 0;
	console.log(nowPage);
	totalPage = wholeBoards.length;
	
	console.log("totalPage="+totalPage);
	console.log("nowStep="+nowStep);
	

}
function boardRecordShow(){
	console.log("ddd");
	console.log("nowstep="+nowStep);
	console.log("nowpage="+nowPage);
	
	var boardShow = "";
	var board = wholeBoards[nowPage].boards[nowStep];
	
	player1.innerHTML = judgePlayer(wholeBoards[nowPage].p1);
	player2.innerHTML = judgePlayer(wholeBoards[nowPage].p2);
	judgePlayerpic();
	console.log("p1"+wholeBoards[nowPage].p1);
	var count = 0;
	for(var j=0;j<8;j++){
		for(var k=0;k<8;k++){
			
			if(board[count] == 'X'){
				boardShow+="<img src = 'imgs/black.webp'>";

			}
			if(board[count] == 'O'){
				boardShow+="<img src = 'imgs/white.webp'>";
			}
			if(board[count] == '_'){
				boardShow+="<img src = 'imgs/none.webp'>";
			}
			count ++;
			
		}
		
		boardShow+="<br>";
	}
	
	boardRecord.innerHTML = boardShow;

}

function beforePage(){
	if(nowPage-1 <0){
		window.alert("最錢了");
		return;
	}
		
	nowPage--;
	nowStep = 0;
	boardRecordShow();
}

function nextPage(){
	if(nowPage+1>=pageLength){
		window.alert("最後了");
		return;
	}
	nowStep = 0;
	nowPage++;
	boardRecordShow();
}

function beforeStep(){
	if(nowStep-1<0){
		window.alert("第一步了");
		return;
	}
	nowStep--;
	boardRecordShow();
	
}
function nextStep(){
	if(nowStep+1>= wholeBoardsMaxStep[nowPage]){
		window.alert("最後一了");
		return;
	}
	nowStep++;
	boardRecordShow();
}
function firstStep(){
	nowStep = 0;
	boardRecordShow();
}
function lastStep(){
	nowStep = wholeBoardsMaxStep[nowPage]-1;
}
function exportRecord(){

}
function importRecord(){

}

function deleteAllRecord(){
	localStorage.clear();
}
function deleteThisRecord(){
	localStorage.removeItem(nowPage);
}
function judgePlayer(player){
	switch(player){
		case("human"):
			return "玩家";

		case("ai0"):
			return "弱";
		case("ai1"):
			return "中";
		case("ai2"):
			return "強";

		
	}
}
function judgePlayerpic(){
	if(wholeBoards[nowPage].first == "black"){
		player1pic.innerHTML = "<img src = 'imgs/black.webp'>";
		player2pic.innerHTML = "<img src = 'imgs/white.webp'>";

	}
	else{
		player1pic.innerHTML = "<img src = 'imgs/white.webp'>";
		player2pic.innerHTML = "<img src = 'imgs/black.webp'>";
	}
}
////////////////////////////////////////////////////download data

function saveTextAsFile() {
	_fileName = "record";
	_text = localStorage.getItem(localStorage.key(nowPage)); 
    var textFileAsBlob = new Blob([_text], {type:'text/plain'});

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




//////////////////////////////////////////////////////

window.addEventListener("load",startBoardRecord,false);