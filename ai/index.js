let urlParams = new URLSearchParams(window.location.search);
let board = urlParams.get("board");
let color = urlParams.get("color");
let strength = urlParams.get("strength");

const go = new Go();

WebAssembly.instantiateStreaming(fetch("ai.wasm"), go.importObject).then(
  (result) => {
    go.run(result.instance);
    aiThink(board, color, strength);
  }
);
