const colors = ["red", "blue", "green", "yellow", "black", "white"];
let wires = [];
let correctCuts = [];

document.getElementById("generateBtn").addEventListener("click", generateWires);

function generateWires() {
  const wireCount = parseInt(document.getElementById("wireCount").value);
  const answer = parseInt(document.getElementById("answerInput").value);
  const wireArea = document.getElementById("wireArea");
  wireArea.innerHTML = "";
  wires = [];
  correctCuts = [];

  // random wire setup
  for (let i = 0; i < wireCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    wires.push(color);
    const wireEl = document.createElement("div");
    wireEl.classList.add("wire");
    wireEl.style.backgroundColor = color;
    wireEl.dataset.index = i + 1;
    wireEl.addEventListener("click", () => cutWire(i + 1));
    wireArea.appendChild(wireEl);
  }

  // apply rule logic based on wireCount
  if (wireCount === 4) applyFourWireLogic(answer);
  else if (wireCount === 5) applyFiveWireLogic(answer);
}
