const worker = new Worker("wasm_exec.js");

function start() {
  let requestLabel = document.getElementById("request");
  // polling
  window.setInterval(async function () {
    if (requestLabel.innerHTML != "") {
      req = requestLabel.innerHTML;
      worker.postMessage(req);
      requestLabel.innerHTML = "";
    }
  }, 100);
}

window.addEventListener("load", start, false);

worker.addEventListener("message", function (msg) {
  let resultLabel = document.getElementById("result");
  resultLabel.innerHTML = msg.data;
});
