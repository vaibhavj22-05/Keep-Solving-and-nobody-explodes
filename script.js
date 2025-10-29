
  // === Wire setup ===
  const wires = [
    { id: 'redWire', color: 'red', y: 80 },
    { id: 'blueWire', color: 'blue', y: 150 },
    { id: 'greenWire', color: 'lime', y: 220 },
  ];

  // === Question Bank ===
  const questionBank = [
    { q: "What is 5 + 3?", ans: 8 },
    { q: "What is 7 - 2?", ans: 5 },
    { q: "What is 9 × 2?", ans: 18 },
    { q: "What is 15 ÷ 3?", ans: 5 },
    { q: "What is 4 + 4?", ans: 8 },
  ];

  let correctWire = null;
  let gameStarted = false;

  // === Check which rule applies ===
  function determineRule() {
    const reds = wires.filter(w => w.color === 'red');
    const blueIndex = wires.findIndex(w => w.color === 'blue');
    const greenIndex = wires.findIndex(w => w.color === 'lime');

    if (reds.length === 2) return 'TWO_RED';
    if (Math.abs(blueIndex - greenIndex) === 1) return 'BLUE_GREEN_ADJ';
    return null;
  }

  // === Ask question and decide which wire is correct ===
  function askQuestion() {
    const rule = determineRule();
    const question = questionBank[Math.floor(Math.random() * questionBank.length)];
    const userAnswer = parseInt(prompt(`💣 ${question.q}`));

    if (isNaN(userAnswer)) {
      alert("Please enter a valid number!");
      return askQuestion();
    }

    if (rule === 'TWO_RED') {
      if (userAnswer % 2 === 1) {
        correctWire = 'redWire'; // 1st red
        alert("Rule 1: Answer is ODD → Cut the FIRST red wire!");
      } else {
        correctWire = 'redWire'; // only one red in this version
        alert("Rule 1: Answer is EVEN → Cut the LAST red wire!");
      }
    } else if (rule === 'BLUE_GREEN_ADJ') {
      if (userAnswer % 3 === 0) {
        correctWire = 'blueWire';
        alert("Rule 2: Multiple of 3 → Cut the BLUE wire!");
      } else {
        correctWire = 'greenWire';
        alert("Rule 2: Not a multiple of 3 → Cut the GREEN wire!");
      }
    } else {
      alert("No rule triggered. You’re lucky! Cut any wire 😄");
      correctWire = wires[Math.floor(Math.random() * wires.length)].id;
    }

    gameStarted = true;
  }

  // === Wire cutting visual ===
  function cutWire(wire) {
    if (!gameStarted) return alert("You must answer the question first!");
    const path = document.getElementById(wire.id);
    if (!path || path.dataset.cut === "true") return;
    path.dataset.cut = "true";

    if (wire.id === correctWire) {
      explodeEffect(false);
      path.remove();
      alert("✅ Correct wire cut! Bomb defused!");
    } else {
      explodeEffect(true);
      alert("💥 Wrong wire! The bomb exploded!");
    }
  }

  // === Explosion or defusal visual ===
  function explodeEffect(isExplosion) {
    document.body.style.backgroundColor = isExplosion ? "red" : "green";
    setTimeout(() => {
      document.body.style.backgroundColor = "#111";
    }, 500);
  }

  // === Event Listeners ===
  wires.forEach(wire => {
    const path = document.getElementById(wire.id);
    path.addEventListener('click', () => cutWire(wire));
  });

  // === Start Question Logic on Page Load ===
  window.onload = askQuestion;

