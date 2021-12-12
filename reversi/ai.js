// const worker = new Worker("wasm_exec.js");

const go = new Go();

WebAssembly.instantiateStreaming(fetch("ai.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
  }
);

function start() {
    let requestLabel = document.getElementById("request");
  
    // polling
    window.setInterval(async function () {
      if (requestLabel.innerHTML != "") {
        req = requestLabel.innerHTML.split(" ");
        aiThink(req[0], req[1], req[2]);
        requestLabel.innerHTML = "";
      }
    }, 100);
  }
  
window.addEventListener("load", start, false);