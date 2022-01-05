let locale = "zh-TW";

function changeLocal(local) {
  locale = local;
  let language = document.getElementById("language");
  switch (local) {
    case "en":
      changeEn();
      language.setAttribute("src", "imgs/united-kingdom.webp");
      return;
    case "zh-TW":
      changeZh();
      language.setAttribute("src", "imgs/taiwan.webp");
      return;
    default:
      changeEn();
      language.setAttribute("src", "imgs/united-kingdom.webp");
      return;
  }
}

function reverseLanguage() {
  switch (locale) {
    case "en":
      locale = "zh-TW";
      break;
    case "zh-TW":
      locale = "en";
      break;
    default:
      locale = "en";
      break;
  }
  changeLocal(locale);
}

function changeEn() {
  changeTitleEn();
  changeNavBarEn();
  changeRankPageEn();
  changeAboutEn();
  changeChessRecordEn();
}

function changeZh() {
  changeTitleZh();
  changeNavBarZh();
  changeRankPageZh();
  changeAboutZh();
  changeChessRecordZh();
}

const navBarId = ["nav-game", "nav-rank", "nav-record", "nav-about"];
const navBarEn = ["Reversi", "Leaderboard", "Record", "About"];
const navBarZh = ["決戰黑白棋", "排行榜", "我的棋譜", "關於網站"];
function changeTitleEn() {
  document.title = "Reversi";
}
function changeTitleZh() {
  document.title = "黑白棋";
}
function changeNavBarEn() {
  for (let i = 0; i < navBarId.length; i++) {
    let dom = document.getElementById(navBarId[i]);
    if (dom) {
      dom.innerHTML = navBarEn[i];
    }
  }
}

function changeNavBarZh() {
  for (let i = 0; i < navBarId.length; i++) {
    let dom = document.getElementById(navBarId[i]);
    if (dom) {
      dom.innerHTML = navBarZh[i];
    }
  }
}

const rankPageId = [
  "rank-page-info",
  "ai-weak-label",
  "ai-medium-label",
  "ai-hard-label",
];
const rankPageEn = [
  "The ranking is evaluated as: your score/(your score+enemy's score)",
  "AI weak",
  "AI medium",
  "AI strong",
];
const rankPageZh = [
  "排名計算方式為: 己方分數/(己方分數+敵方分數)",
  "AI 弱",
  "AI 中",
  "AI 強",
];

function changeRankPageEn() {
  for (let i = 0; i < rankPageId.length; i++) {
    let dom = document.getElementById(rankPageId[i]);
    if (dom) {
      dom.innerHTML = rankPageEn[i];
    }
  }
  let all = document.getElementsByClassName("table-rank-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "Rank";
  }
  all = document.getElementsByClassName("table-name-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "Name";
  }
  all = document.getElementsByClassName("table-score-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "Score";
  }
  all = document.getElementsByClassName("table-date-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "Date";
  }
}

function changeRankPageZh() {
  for (let i = 0; i < rankPageId.length; i++) {
    let dom = document.getElementById(rankPageId[i]);
    if (dom) {
      dom.innerHTML = rankPageZh[i];
    }
  }
  let all = document.getElementsByClassName("table-rank-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "排行";
  }
  all = document.getElementsByClassName("table-name-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "名稱";
  }
  all = document.getElementsByClassName("table-score-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "分數";
  }
  all = document.getElementsByClassName("table-date-col");
  for (let i = 0; i < all.length; i++) {
    all[i].innerHTML = "遊玩日期";
  }
}

const aboutPageId = [
  "about-page-first-title",
  "about-page-1st-block1",
  "figcaption-1",
  "figcaption-2",
  "about-page-1st-block2",
  "about-page-2nd-block1",
  "about-page-second-title",
  "about-page-third-title",
  "about-page-fourth-title",
  "version-table-col1",
  "version-table-col2",
  "version-table-col3",
  "ver0.1-label",
  "ver0.2-label",
  "ver0.3-label",
  "ver0.4-label",
  "ver1.0-label",
  "about-page-fifth-title",
];
const aboutPageEn = [
  "Feature",
  "This site focuses on 3D Othello, which contains a variety of settings such as language, material, animation, shading, anti-aliasing, etc. Users can combine their favorite settings according to the computer performance.",
  "Fiber Texture",
  "Ceramic Texture",
  "The information is stored in the browser's own local storage, which is available on that page.<br>You can delete a specific game record or clear the entire record.<br>You can take your time to think and review the game after playing. Support for exporting and importing records to avoid losing all data when clearing the browser cache, and to take the data with you.<br>Display the score records of previous players against different levels of AI on the leaderboard, showing the player's name and date of play from highest to lowest score.<br>There are many tests on the site to minimize the amount of bugs.<br>RWD: It can be displayed on various devices, such as computers, tablets and cell phones.<br>Language internationalization: can switch between Chinese and English versions",
  "The front-end uses HTML, JavaScript, CSS, and bootstrap. blender.org's CSS (open source) is also introduced.<br>The backend is written in Go, and is hosted on heroku, with a postgreSQL database (heroku postgres).<br>The AI is written in Go language and compiled into WebAssembly to provide game calls. Since the AI takes a long time to think, Web Worker is used to avoid freezing the screen.<br>The game body uses WebAssembly and WebGL, which can provide better performance than JavaScript in most cases, depending on the user environment.<br>PWA: This site is a progressive web application, you can see the install button in the upper right corner of chrome, and then you can use it offline (the leaderboard is not available).<br>Historical games are stored in localStorage and available for download for backup purposes.<br><br>If there is any problem with the website, please report to &nbsp;<a target='_blank' href='https://github.com/lemon37564/wp1101-final/issues'>https://github.com/lemon37564/wp1101-final/issues</a>",
  "Technic",
  "Architecture/Flow Chart",
  "Version History",
  "Version",
  "Date",
  "Description",
  "Complete the backend; write basic HTML, JavaScript and CSS",
  "website hosted on Github Pages; the database is changed from SQLite to PostgreSQL",
  "The game body is completed; new record page",
  "PWA; Move AI from backend to frontend",
  "RWD；internationalization",
  "Authors",
];
const aboutPageZh = [
  "特色",
  "本網站主打3D黑白棋，其中包含豐富可設定項目如: 語言、材質、動畫、陰影、抗鋸齒等設定。使用者可依電腦效能去組合出自己喜歡的設定。",
  "纖維材質的棋子",
  "陶瓷材質的棋子",
  "提供儲存棋譜功能，資訊儲存在瀏覽器本身的local storage，可在棋譜頁面檢視。<br>可刪除特定一則遊玩紀錄或清空全部紀錄。<br>能夠在下完棋後慢慢思考與檢討。支援記錄匯出、匯入，避免清除瀏覽器快取時失去所有資料，也可以將資料帶著走。<br>在排行榜上顯示之前玩家對戰不同等級AI的分數紀錄，分數由高到低顯示該玩家的姓名及遊玩日期。<br>網站測試完善，以求將bug數量減到最低。<br>RWD: 響應在各種設備上，能在電腦，平板，手機上顯示。<br>語言國際化: 有中英文版本可以選擇。",
  "前端使用HTML, JavaScript, CSS，並使用bootstrap。此外，也引入了 <a target='_blank' href='https://www.blender.org/'>blender.org</a> 之CSS(開源)。<br>後端使用Go語言編寫，部屬在heroku上，資料庫使用postgreSQL(heroku postgres)。<br>AI使用Go語言編寫，編譯成WebAssembly提供遊戲呼叫。由於AI思考時間較長，使用Web Worker避免畫面凍結。<br>遊戲本體使用WebAssembly、WebGL製作，根據使用者環境不同，在大多數情況下能夠提供比JavaScript更好的效能來執行。<br>PWA: 本網站為progressive web application，在chrome的右上角可以看見安裝鍵，安裝後便可以離線使用(排行榜無法使用)<br>歷史棋譜存在localStorage中並提供下載，以便備份等用途。<br><br>若網站出現問題歡迎回報 &nbsp;<a target='_blank' href='https://github.com/lemon37564/wp1101-final/issues'>https://github.com/lemon37564/wp1101-final/issues</a>",
  "技術",
  "架構/流程圖",
  "開發記錄",
  "版本",
  "日期",
  "描述",
  "完成後端；撰寫基本HTML，JavaScript與CSS",
  "網站架設在Github Pages上；資料庫由SQLite改為PostgreSQL",
  "遊戲本體完成；新增棋譜頁面與功能",
  "PWA；AI由後端移至前端",
  "RWD；國際化",
  "作者",
];

function changeAboutEn() {
  for (let i = 0; i < aboutPageId.length; i++) {
    let dom = document.getElementById(aboutPageId[i]);
    if (dom) {
      dom.innerHTML = aboutPageEn[i];
    }
  }
}

function changeAboutZh() {
  for (let i = 0; i < aboutPageId.length; i++) {
    let dom = document.getElementById(aboutPageId[i]);
    if (dom) {
      dom.innerHTML = aboutPageZh[i];
    }
  }
}
const chessRecordId = [
  "Chess_record_Reminding",
  "jump-label",
  "previous-page-button",
  "next-page-button",
  "import-button",
  "save-file-button",
  "delete-this-button",
  "delete-all-button",
  "exampleModalLabel1",
  "exampleModalLabel2",
  "exampleModalLabel3",
  "Chess_record_Warning0",
  "Chess_record_Warning1",
  "Chess_record_Warning2",
  "Chess_record_Confirm1",
  "Chess_record_Confirm2",
  "Chess_record_Confirm3",
  "Chess_record_Cancel1",
  "Chess_record_Cancel2",
];
const chessRecordEn = [
  "This record is stored locally and not on the server, so deleting cookies will lose all records!<br>In addition, games between AIs will not be recorded.",
  "Jump to #",
  "Previous",
  "Next",
  "Import",
  "Export",
  "Delete one",
  "Delete all",
  "Info",
  "Info",
  "Info",
  "<h4>Are you sure you want to delete all records?<br> It cannot be restored!</h4>",
  "<h4>Are you sure you want to delete current record?<br> It cannot be restored!</h4>",
  "<h4>File format does not match or is corrupted</h4>",
  "Confirm",
  "Confirm",
  "Confirm",
  "Cancel",
  "Cancel",
];
const chessRecordZh = [
  "此記錄儲存在本地端而非伺服器，因此刪除Cookie將會遺失所有記錄! &nbsp; &nbsp; 此外，AI之間的對局不會被記錄。",
  "跳躍到第# 則記錄",
  "上一則",
  "下一則",
  "匯入紀錄",
  "匯出紀錄",
  "刪除本則紀錄",
  "刪除全部紀錄",
  "提示",
  "提示",
  "提示",
  "<h4>確定刪除全部記錄?<br>刪除後無法恢復!</h4>",
  "<h4>確定刪除本則記錄?<br>刪除後無法恢復!</h4>",
  "<h4>檔案格式錯誤或檔案毀損</h4>",
  "確認",
  "確認",
  "確認",
  "取消",
  "取消",
];

function changeChessRecordEn() {
  updateTopLabel();
  for (let i = 0; i < chessRecordId.length; i++) {
    let dom = document.getElementById(chessRecordId[i]);
    if (dom) {
      dom.innerHTML = chessRecordEn[i];
    }
  }
}

function changeChessRecordZh() {
  updateTopLabel();
  for (let i = 0; i < chessRecordId.length; i++) {
    let dom = document.getElementById(chessRecordId[i]);
    if (dom) {
      dom.innerHTML = chessRecordZh[i];
    }
  }
}
