// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import socket from "../../socket";

// export default function WireRealistic() {
//   const [correctWire, setCorrectWire] = useState("");
//   const [status, setStatus] = useState("");
//   const [wireSetup, setWireSetup] = useState([]);
//   const [disabled, setDisabled] = useState(false);
//   const navigate = useNavigate();

//   // 🔊 Play sound helper
//   const playSound = (src) => {
//     const audio = new Audio(src);
//     audio.volume = 0.6;
//     audio.play();
//   };
//   // Notify the server that the "wire" module opened
// useEffect(() => {
//   const roomCode = localStorage.getItem("roomCode"); // should already be set when joining/creating room
//   if (roomCode) {
//     socket.emit("moduleOpened", { roomCode, moduleId: "wires" });
//     console.log("📡 Module Opened: wires");
//   }
// }, []);



//   // 🧩 Logic to determine the correct wire
//   function determineCorrectWire(wires, answer) {
//     if (!wires || wires.length === 0) return [];

//     const countColor = (color) => wires.filter((w) => w.color === color).length;
//     const hasColor = (color) => wires.some((w) => w.color === color);
//     const getIndex = (color, fromEnd = false) => {
//       const arr = wires.map((w) => w.color);
//       const idx = fromEnd ? arr.lastIndexOf(color) : arr.indexOf(color);
//       return idx !== -1 ? idx : 0;
//     };

//     // --------------------------
//     // 3-WIRE CASE
//     // --------------------------
//     if (wires.length === 3) {
//       const reds = countColor("red");

//       // Rule 1: Two Red Wires
//       if (reds === 2) {
//         return answer % 2 === 1
//           ? [wires[0].id]
//           : [wires[wires.length - 1].id];
//       }

//       // Rule 2: Blue and Green Adjacent
//       for (let i = 0; i < wires.length - 1; i++) {
//         if (
//           (wires[i].color === "blue" && wires[i + 1].color === "green") ||
//           (wires[i].color === "green" && wires[i + 1].color === "blue")
//         ) {
//           return answer % 3 === 0
//             ? [wires.find((w) => w.color === "blue").id]
//             : [wires.find((w) => w.color === "green").id];
//         }
//       }

//       // Rule 3: Default
//       return answer > 5 ? [wires[1].id] : [wires[wires.length - 1].id];
//     }

//     // --------------------------
//     // 4-WIRE CASE
//     // --------------------------
//     if (wires.length === 4) {
//       // Rule 1: No Yellow Wire
//       if (!hasColor("yellow")) {
//         const multiple2 = answer % 2 === 0;
//         const multiple3 = answer % 3 === 0;

//         if (multiple2 && multiple3) return [wires[0].id];
//         if (multiple2) return [wires[0].id];
//         if (multiple3) return [wires[1].id];
//         return [wires[1].id];
//       }

//       // Rule 2: More Than One Green Wire
//       if (countColor("green") >= 2) {
//         if (answer % 2 === 0) {
//           const firstGreen = wires.find((w) => w.color === "green");
//           return firstGreen ? [firstGreen.id] : [wires[0].id];
//         } else {
//           const idx = getIndex("green", true);
//           return [wires[idx].id];
//         }
//       }

//       // Rule 3: Default
//       return answer % 2 === 0 ? [wires[0].id] : [wires[1].id];
//     }

//     // --------------------------
//     // 5-WIRE CASE
//     // --------------------------
//     if (wires.length === 5) {
//       const colorCounts = {};
//       wires.forEach((w) => {
//         colorCounts[w.color] = (colorCounts[w.color] || 0) + 1;
//       });

//       const uniqueColorCount = Object.keys(colorCounts).length;

//       // Rule 1: 1 Black or 1 Red Wire
//       if (countColor("black") === 1 || countColor("red") === 1) {
//         if (countColor("black") === 1) {
//           const cube = Math.round(Math.cbrt(answer || 1));
//           const idx = Math.min(cube - 1, wires.length - 1);
//           return [wires[idx]?.id || wires[0].id];
//         } else {
//           const square = Math.round(Math.sqrt(answer || 1));
//           const idx = Math.min(square - 1, wires.length - 1);
//           return [wires[idx]?.id || wires[0].id];
//         }
//       }

//       // Rule 2: 3 same + 2 different
//       const dominantColor = Object.keys(colorCounts).find(
//         (c) => colorCounts[c] === 3
//       );
//       if (dominantColor) {
//         if (dominantColor === "red") {
//           const idx = getIndex("red", true);
//           return [wires[idx].id];
//         }
//         if (dominantColor === "blue") {
//           return [wires[1].id];
//         }

//         const blackIdx = (() => {
//           let count = 0;
//           for (let i = 0; i < wires.length; i++) {
//             if (wires[i].color === "black") {
//               count++;
//               if (count === 3) return i;
//             }
//           }
//           return -1;
//         })();

//         if (blackIdx > 0) {
//           const uniqueColor = Object.keys(colorCounts).find(
//             (c) => colorCounts[c] === 1
//           );
//           const uniqueIdx = getIndex(uniqueColor);
//           if (uniqueIdx !== -1 && uniqueIdx < blackIdx) {
//             return [wires[uniqueIdx].id];
//           }
//         }
//       }

//       // Rule 3: 2 same + 2 same + 1 different
//       const pairColors = Object.keys(colorCounts).filter(
//         (c) => colorCounts[c] === 2
//       );
//       const uniqueColor = Object.keys(colorCounts).find(
//         (c) => colorCounts[c] === 1
//       );
//       if (pairColors.length === 2 && uniqueColor) {
//         const uniqueIdx = getIndex(uniqueColor);
//         if (uniqueIdx === 2) return [wires[uniqueIdx].id];
//         if (uniqueIdx === 0 || uniqueIdx === 4) {
//           const oppositePairColor = pairColors[uniqueIdx === 0 ? 1 : 0];
//           const allOfOpposite = wires
//             .map((w, i) => ({ ...w, i }))
//             .filter((w) => w.color === oppositePairColor);
//           if (allOfOpposite.length > 1) {
//             return [allOfOpposite[0].id];
//           }
//         }
//         return [wires[3].id];
//       }

//       // Rule 4: 2 same + 3 different
//       const repeated = Object.keys(colorCounts).find(
//         (c) => colorCounts[c] === 2
//       );
//       if (repeated) {
//         if (repeated === "red") {
//           return [wires[getIndex("red")].id];
//         } else if (repeated === "blue") {
//           const idx = getIndex("blue");
//           return [wires[idx].id];
//         } else if (repeated === "green") {
//           return [wires[2].id];
//         } else {
//           return [wires[wires.length - 1].id];
//         }
//       }

//       // Rule 5: All different
//       if (uniqueColorCount === 5) {
//         const primaryColors = ["red", "blue", "yellow"];
//         const secondaryColors = ["green"];

//         if (primaryColors.includes(wires[0].color)) return [wires[4].id];
//         if (secondaryColors.includes(wires[2].color)) return [wires[2].id];
//         if (wires[4].color === "red") return [wires[2].id];

//         const idx = Math.min((answer || 1) - 1, wires.length - 1);
//         return [wires[idx].id];
//       }
//     }

//     return [wires[0].id];
//   }

//   // 🧠 Reset session
//   useEffect(() => {
//     const sessionMarker = sessionStorage.getItem("sessionActive");
//     if (!sessionMarker) {
//       sessionStorage.setItem("sessionActive", "true");
//       localStorage.removeItem("wireSetup");
//       localStorage.removeItem("correctWire");
//       localStorage.removeItem("wires_moduleCompleted");
//       localStorage.removeItem("wires_moduleStatus");
//     }
//   }, []);

//   // 🧩 Initialize wires
//   useEffect(() => {
//     const completed = localStorage.getItem("wires_moduleCompleted");
//     if (completed === "true") {
//       const prevStatus =
//         localStorage.getItem("wires_moduleStatus") || "defused";
//       setStatus(prevStatus);
//       setDisabled(true);
//       return;
//     }

//     const savedSetup = localStorage.getItem("wireSetup");
//     const savedCorrect = localStorage.getItem("correctWire");

//     if (savedSetup && savedCorrect) {
//       setWireSetup(JSON.parse(savedSetup));
//       setCorrectWire(savedCorrect);
//     } else {
//       const colors = ["red", "blue", "green", "yellow", "white", "black"];
//       const wireCount = Math.floor(Math.random() * 3) + 3;
//       const shuffled = [...colors]
//         .sort(() => 0.5 - Math.random())
//         .slice(0, wireCount);
//       const positions = [70, 130, 190, 250, 310];
//       const wires = shuffled.map((color, i) => ({
//         id: `${color}Wire${i}`,
//         y: positions[i],
//         color,
//       }));

//       // 🧮 Generate or fetch answer
//       const answer = parseInt(localStorage.getItem("mathAnswer"));
//       if (!answer) {
//         console.error("No answer received from backend for this question!");
//         return;
//       }

//       const correct = determineCorrectWire(wires, answer);
//       setWireSetup(wires);
//       setCorrectWire(correct);

//       localStorage.setItem("wireSetup", JSON.stringify(wires));
//       localStorage.setItem("correctWire", correct);
//     }
//   }, []);

//   // 🪓 Wire cutting logic
//   useEffect(() => {
//     if (wireSetup.length === 0 || disabled) return;

//     wireSetup.forEach((wire) => {
//       const path = document.getElementById(wire.id);
//       if (path) path.addEventListener("click", () => cutWire(wire));
//     });

//     function cutWire(wire) {
//       if (status || disabled) return;
//       const path = document.getElementById(wire.id);
//       if (!path || path.dataset.cut === "true") return;
//       path.dataset.cut = "true";

//       const svg = path.parentNode;
//       path.remove();

//       const createPath = (d, color) => {
//         const newPath = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "path"
//         );
//         newPath.setAttribute("d", d);
//         newPath.setAttribute("stroke", color);
//         newPath.setAttribute("stroke-width", 6);
//         newPath.setAttribute("fill", "none");
//         newPath.setAttribute("stroke-linecap", "round");
//         newPath.classList.add("wire-shadow");
//         return newPath;
//       };

//       const leftPath = createPath(
//         `M 20 ${wire.y} C 150 ${wire.y - 40}, 200 ${wire.y + 10}, 250 ${
//           wire.y - 20
//         }`,
//         wire.color
//       );
//       const rightPath = createPath(
//         `M 270 ${wire.y + 10} C 320 ${wire.y + 40}, 400 ${wire.y - 20}, 500 ${
//           wire.y
//         }`,
//         wire.color
//       );

//       const spark = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle"
//       );
//       spark.setAttribute("cx", 260);
//       spark.setAttribute("cy", wire.y);
//       spark.setAttribute("r", 5);
//       spark.classList.add("spark");

//       svg.appendChild(leftPath);
//       svg.appendChild(rightPath);
//       svg.appendChild(spark);
//       setTimeout(() => spark.remove(), 600);

//       if (wire.id === correctWire) {
//         setStatus("defused");
//         localStorage.setItem("wires_moduleCompleted", "true");
//         localStorage.setItem("wires_moduleStatus", "defused");
//       } else {
//         setStatus("exploded");
//         playSound("/sounds/explosion.mp3");
//         localStorage.setItem("wires_moduleCompleted", "true");
//         localStorage.setItem("wires_moduleStatus", "exploded");
//         setTimeout(() => navigate("/exploded"), 1500);
//       }
//       setDisabled(true);
//     }

//     return () => {
//       wireSetup.forEach((wire) => {
//         const path = document.getElementById(wire.id);
//         if (path) path.removeEventListener("click", () => cutWire(wire));
//       });
//     };
//   }, [wireSetup, correctWire, status, disabled, navigate]);

//   return (
//     <div className="relative w-[520px] h-[340px] rounded-2xl border-[3px] border-gray-700 overflow-hidden bg-[#1b1b1b] shadow-[inset_0_0_30px_#000,0_0_20px_#000] flex flex-col items-center justify-center">
//       {/* STOP Button */}
//       <button
//         disabled={disabled}
//         className={`absolute bottom-[20px] right-[20px] px-6 py-2 font-bold rounded-full transition ${
//           disabled
//             ? "bg-gray-700 text-gray-400 cursor-not-allowed"
//             : "bg-red-600 text-white shadow-[0_0_15px_red] hover:bg-red-800"
//         }`}
//         onClick={() => {
//           if (!status && !disabled) {
//             setStatus("exploded");
//             setDisabled(true);
//             playSound("/sounds/explosion.mp3");
//             localStorage.setItem("wires_moduleCompleted", "true");
//             localStorage.setItem("wires_moduleStatus", "exploded");
//             setTimeout(() => navigate("/exploded"), 1500);
//           }
//         }}
//       >
//         STOP
//       </button>

//       {/* Wire End Nodes */}
//       {wireSetup.map((wire, i) => (
//         <React.Fragment key={i}>
//           <div
//             className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
//             style={{
//               left: "10px",
//               top: `${wire.y - 10}px`,
//               background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
//             }}
//           />
//           <div
//             className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
//             style={{
//               right: "10px",
//               top: `${wire.y - 10}px`,
//               background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
//             }}
//           />
//         </React.Fragment>
//       ))}

//       {/* SVG Wires */}
//       <svg
//         id="wires"
//         className="absolute top-0 left-0 w-[520px] h-[340px] cursor-pointer"
//       >
//         {wireSetup.map((wire) => (
//           <path
//             key={wire.id}
//             id={wire.id}
//             className="wire-shadow"
//             d={`M 20 ${wire.y} C 150 ${wire.y - 40}, 300 ${wire.y + 40}, 500 ${wire.y}`}
//             stroke={wire.color}
//             strokeWidth="6"
//             fill="none"
//             strokeLinecap="round"
//           />
//         ))}
//       </svg>

//       {/* ✅ Result Overlay */}
//       {status && (
//         <div
//           className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
//             status === "defused"
//               ? "text-green-400 bg-black/70"
//               : "text-red-500 bg-black/70"
//           }`}
//         >
//           {status === "defused" ? "✅ MODULE SOLVED" : "💥 BOMB EXPLODED"}
//         </div>
//       )}

//       <style>{`
//         .spark {
//           fill: yellow;
//           opacity: 0.9;
//           animation: sparkAnim 0.5s ease-out forwards;
//         }
//         @keyframes sparkAnim {
//           0% { transform: scale(1); opacity: 1; }
//           100% { transform: scale(3); opacity: 0; }
//         }
//         .wire-shadow {
//           filter: drop-shadow(0 0 2px #000);
//         }
//       `}</style>
//     </div>
//   );
// }





























// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import socket from "../../socket";

// export default function WireRealistic() {
//   const [correctWire, setCorrectWire] = useState("");
//   const [status, setStatus] = useState("");
//   const [wireSetup, setWireSetup] = useState([]);
//   const [disabled, setDisabled] = useState(false);
//   const [serverAnswer, setServerAnswer] = useState(null); // NEW: store backend answer
//   const navigate = useNavigate();

//   // 🔊 Play sound helper
//   const playSound = (src) => {
//     const audio = new Audio(src);
//     audio.volume = 0.6;
//     audio.play();
//   };

//   // Notify the server that the "wire" module opened
//   useEffect(() => {
//     const roomCode = localStorage.getItem("roomCode"); // should already be set when joining/creating room
//     if (roomCode) {
//       socket.emit("moduleOpened", { roomCode, moduleId: "wires" });
//       console.log("📡 Module Opened: wires");
//     }
//   }, []);

//   // 🧩 Logic to determine the correct wire
//   function determineCorrectWire(wires, answer) {
//     if (!wires || wires.length === 0) return [];

//     const countColor = (color) => wires.filter((w) => w.color === color).length;
//     const hasColor = (color) => wires.some((w) => w.color === color);
//     const getIndex = (color, fromEnd = false) => {
//       const arr = wires.map((w) => w.color);
//       const idx = fromEnd ? arr.lastIndexOf(color) : arr.indexOf(color);
//       return idx !== -1 ? idx : 0;
//     };

//     // --------------------------
//     // 3-WIRE CASE
//     // --------------------------
//     if (wires.length === 3) {
//       const reds = countColor("red");

//       if (reds === 2) {
//         return answer % 2 === 1
//           ? [wires[0].id]
//           : [wires[wires.length - 1].id];
//       }

//       for (let i = 0; i < wires.length - 1; i++) {
//         if (
//           (wires[i].color === "blue" && wires[i + 1].color === "green") ||
//           (wires[i].color === "green" && wires[i + 1].color === "blue")
//         ) {
//           return answer % 3 === 0
//             ? [wires.find((w) => w.color === "blue").id]
//             : [wires.find((w) => w.color === "green").id];
//         }
//       }

//       return answer > 5 ? [wires[1].id] : [wires[wires.length - 1].id];
//     }

//     // --------------------------
//     // 4-WIRE CASE
//     // --------------------------
//     if (wires.length === 4) {
//       if (!hasColor("yellow")) {
//         const multiple2 = answer % 2 === 0;
//         const multiple3 = answer % 3 === 0;

//         if (multiple2 && multiple3) return [wires[0].id];
//         if (multiple2) return [wires[0].id];
//         if (multiple3) return [wires[1].id];
//         return [wires[1].id];
//       }

//       if (countColor("green") >= 2) {
//         if (answer % 2 === 0) {
//           const firstGreen = wires.find((w) => w.color === "green");
//           return firstGreen ? [firstGreen.id] : [wires[0].id];
//         } else {
//           const idx = getIndex("green", true);
//           return [wires[idx].id];
//         }
//       }

//       return answer % 2 === 0 ? [wires[0].id] : [wires[1].id];
//     }

//     // --------------------------
//     // 5-WIRE CASE
//     // --------------------------
//     if (wires.length === 5) {
//       const colorCounts = {};
//       wires.forEach((w) => {
//         colorCounts[w.color] = (colorCounts[w.color] || 0) + 1;
//       });

//       const uniqueColorCount = Object.keys(colorCounts).length;

//       if (countColor("black") === 1 || countColor("red") === 1) {
//         if (countColor("black") === 1) {
//           const cube = Math.round(Math.cbrt(answer || 1));
//           const idx = Math.min(cube - 1, wires.length - 1);
//           return [wires[idx]?.id || wires[0].id];
//         } else {
//           const square = Math.round(Math.sqrt(answer || 1));
//           const idx = Math.min(square - 1, wires.length - 1);
//           return [wires[idx]?.id || wires[0].id];
//         }
//       }

//       const dominantColor = Object.keys(colorCounts).find(
//         (c) => colorCounts[c] === 3
//       );
//       if (dominantColor) {
//         if (dominantColor === "red") return [wires[getIndex("red", true)].id];
//         if (dominantColor === "blue") return [wires[1].id];

//         const blackIdx = (() => {
//           let count = 0;
//           for (let i = 0; i < wires.length; i++) {
//             if (wires[i].color === "black") {
//               count++;
//               if (count === 3) return i;
//             }
//           }
//           return -1;
//         })();

//         if (blackIdx > 0) {
//           const uniqueColor = Object.keys(colorCounts).find(
//             (c) => colorCounts[c] === 1
//           );
//           const uniqueIdx = getIndex(uniqueColor);
//           if (uniqueIdx !== -1 && uniqueIdx < blackIdx) {
//             return [wires[uniqueIdx].id];
//           }
//         }
//       }

//       const pairColors = Object.keys(colorCounts).filter((c) => colorCounts[c] === 2);
//       const uniqueColor = Object.keys(colorCounts).find((c) => colorCounts[c] === 1);
//       if (pairColors.length === 2 && uniqueColor) {
//         const uniqueIdx = getIndex(uniqueColor);
//         if (uniqueIdx === 2) return [wires[uniqueIdx].id];
//         if (uniqueIdx === 0 || uniqueIdx === 4) {
//           const oppositePairColor = pairColors[uniqueIdx === 0 ? 1 : 0];
//           const allOfOpposite = wires
//             .map((w, i) => ({ ...w, i }))
//             .filter((w) => w.color === oppositePairColor);
//           if (allOfOpposite.length > 1) return [allOfOpposite[0].id];
//         }
//         return [wires[3].id];
//       }

//       const repeated = Object.keys(colorCounts).find((c) => colorCounts[c] === 2);
//       if (repeated) {
//         if (repeated === "red") return [wires[getIndex("red")].id];
//         if (repeated === "blue") return [wires[getIndex("blue")].id];
//         if (repeated === "green") return [wires[2].id];
//         return [wires[wires.length - 1].id];
//       }

//       if (uniqueColorCount === 5) {
//         const primaryColors = ["red", "blue", "yellow"];
//         const secondaryColors = ["green"];
//         if (primaryColors.includes(wires[0].color)) return [wires[4].id];
//         if (secondaryColors.includes(wires[2].color)) return [wires[2].id];
//         if (wires[4].color === "red") return [wires[2].id];
//         const idx = Math.min((answer || 1) - 1, wires.length - 1);
//         return [wires[idx].id];
//       }
//     }

//     return [wires[0].id];
//   }

//   // 🧠 Reset session
//   useEffect(() => {
//     const sessionMarker = sessionStorage.getItem("sessionActive");
//     if (!sessionMarker) {
//       sessionStorage.setItem("sessionActive", "true");
//       localStorage.removeItem("wireSetup");
//       localStorage.removeItem("correctWire");
//       localStorage.removeItem("wires_moduleCompleted");
//       localStorage.removeItem("wires_moduleStatus");
//     }
//   }, []);

//   // 🧩 Listen for backend answer
//   useEffect(() => {
//     const handleWireAnswer = (data) => {
//       if (data.moduleId === "wires") {
//         setServerAnswer(data.correctAnswer);
//         localStorage.setItem("mathAnswer", data.correctAnswer);
//       }
//     };
//     socket.on("wire-answer", handleWireAnswer);
//     return () => socket.off("wire-answer", handleWireAnswer);
//   }, []);

//   // 🧩 Initialize wires only after receiving backend answer
//   useEffect(() => {
//     if (serverAnswer === null) return; // wait for backend

//     const completed = localStorage.getItem("wires_moduleCompleted");
//     if (completed === "true") {
//       const prevStatus = localStorage.getItem("wires_moduleStatus") || "defused";
//       setStatus(prevStatus);
//       setDisabled(true);
//       return;
//     }

//     const savedSetup = localStorage.getItem("wireSetup");
//     const savedCorrect = localStorage.getItem("correctWire");

//     if (savedSetup && savedCorrect) {
//       setWireSetup(JSON.parse(savedSetup));
//       setCorrectWire(savedCorrect);
//     } else {
//       const colors = ["red", "blue", "green", "yellow", "white", "black"];
//       const wireCount = Math.floor(Math.random() * 3) + 3;
//       const shuffled = [...colors].sort(() => 0.5 - Math.random()).slice(0, wireCount);
//       const positions = [70, 130, 190, 250, 310];
//       const wires = shuffled.map((color, i) => ({
//         id: `${color}Wire${i}`,
//         y: positions[i],
//         color,
//       }));

//       const correct = determineCorrectWire(wires, serverAnswer);
//       setWireSetup(wires);
//       setCorrectWire(correct);

//       localStorage.setItem("wireSetup", JSON.stringify(wires));
//       localStorage.setItem("correctWire", correct);
//     }
//   }, [serverAnswer]);

//   // 🪓 Wire cutting logic
//   useEffect(() => {
//     if (wireSetup.length === 0 || disabled) return;

//     wireSetup.forEach((wire) => {
//       const path = document.getElementById(wire.id);
//       if (path) path.addEventListener("click", () => cutWire(wire));
//     });

//     function cutWire(wire) {
//       if (status || disabled) return;
//       const path = document.getElementById(wire.id);
//       if (!path || path.dataset.cut === "true") return;
//       path.dataset.cut = "true";

//       const svg = path.parentNode;
//       path.remove();

//       const createPath = (d, color) => {
//         const newPath = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "path"
//         );
//         newPath.setAttribute("d", d);
//         newPath.setAttribute("stroke", color);
//         newPath.setAttribute("stroke-width", 6);
//         newPath.setAttribute("fill", "none");
//         newPath.setAttribute("stroke-linecap", "round");
//         newPath.classList.add("wire-shadow");
//         return newPath;
//       };

//       const leftPath = createPath(
//         `M 20 ${wire.y} C 150 ${wire.y - 40}, 200 ${wire.y + 10}, 250 ${wire.y - 20}`,
//         wire.color
//       );
//       const rightPath = createPath(
//         `M 270 ${wire.y + 10} C 320 ${wire.y + 40}, 400 ${wire.y - 20}, 500 ${wire.y}`,
//         wire.color
//       );

//       const spark = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "circle"
//       );
//       spark.setAttribute("cx", 260);
//       spark.setAttribute("cy", wire.y);
//       spark.setAttribute("r", 5);
//       spark.classList.add("spark");

//       svg.appendChild(leftPath);
//       svg.appendChild(rightPath);
//       svg.appendChild(spark);
//       setTimeout(() => spark.remove(), 600);

//       if (wire.id === correctWire) {
//         setStatus("defused");
//         localStorage.setItem("wires_moduleCompleted", "true");
//         localStorage.setItem("wires_moduleStatus", "defused");
//       } else {
//         setStatus("exploded");
//         playSound("/sounds/explosion.mp3");
//         localStorage.setItem("wires_moduleCompleted", "true");
//         localStorage.setItem("wires_moduleStatus", "exploded");
//         setTimeout(() => navigate("/exploded"), 1500);
//       }
//       setDisabled(true);
//     }

//     return () => {
//       wireSetup.forEach((wire) => {
//         const path = document.getElementById(wire.id);
//         if (path) path.removeEventListener("click", () => cutWire(wire));
//       });
//     };
//   }, [wireSetup, correctWire, status, disabled, navigate]);

//   return (
//     <div className="relative w-[520px] h-[340px] rounded-2xl border-[3px] border-gray-700 overflow-hidden bg-[#1b1b1b] shadow-[inset_0_0_30px_#000,0_0_20px_#000] flex flex-col items-center justify-center">
//       {/* STOP Button */}
//       <button
//         disabled={disabled}
//         className={`absolute bottom-[20px] right-[20px] px-6 py-2 font-bold rounded-full transition ${
//           disabled
//             ? "bg-gray-700 text-gray-400 cursor-not-allowed"
//             : "bg-red-600 text-white shadow-[0_0_15px_red] hover:bg-red-800"
//         }`}
//         onClick={() => {
//           if (!status && !disabled) {
//             setStatus("exploded");
//             setDisabled(true);
//             playSound("/sounds/explosion.mp3");
//             localStorage.setItem("wires_moduleCompleted", "true");
//             localStorage.setItem("wires_moduleStatus", "exploded");
//             setTimeout(() => navigate("/exploded"), 1500);
//           }
//         }}
//       >
//         STOP
//       </button>

//       {/* Wire End Nodes */}
//       {wireSetup.map((wire, i) => (
//         <React.Fragment key={i}>
//           <div
//             className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
//             style={{
//               left: "10px",
//               top: `${wire.y - 10}px`,
//               background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
//             }}
//           />
//           <div
//             className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
//             style={{
//               right: "10px",
//               top: `${wire.y - 10}px`,
//               background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
//             }}
//           />
//         </React.Fragment>
//       ))}

//       {/* SVG Wires */}
//       <svg
//         id="wires"
//         className="absolute top-0 left-0 w-[520px] h-[340px] cursor-pointer"
//       >
//         {wireSetup.map((wire) => (
//           <path
//             key={wire.id}
//             id={wire.id}
//             className="wire-shadow"
//             d={`M 20 ${wire.y} C 150 ${wire.y - 40}, 300 ${wire.y + 40}, 500 ${wire.y}`}
//             stroke={wire.color}
//             strokeWidth="6"
//             fill="none"
//             strokeLinecap="round"
//           />
//         ))}
//       </svg>

//       {/* ✅ Result Overlay */}
//       {status && (
//         <div
//           className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
//             status === "defused"
//               ? "text-green-400 bg-black/70"
//               : "text-red-500 bg-black/70"
//           }`}
//         >
//           {status === "defused" ? "✅ MODULE SOLVED" : "💥 BOMB EXPLODED"}
//         </div>
//       )}

//       <style>{`
//         .spark {
//           fill: yellow;
//           opacity: 0.9;
//           animation: sparkAnim 0.5s ease-out forwards;
//         }
//         @keyframes sparkAnim {
//           0% { transform: scale(1); opacity: 1; }
//           100% { transform: scale(3); opacity: 0; }
//         }
//         .wire-shadow {
//           filter: drop-shadow(0 0 2px #000);
//         }
//       `}</style>
//     </div>
//   );
// }














import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WireRealistic() {
  const [correctWire, setCorrectWire] = useState([]);
  const [status, setStatus] = useState("");
  const [wireSetup, setWireSetup] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  // 🔊 Play sound helper
  const playSound = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.6;
    audio.play();
  };

  // 🧠 Determine correct wire logic
  function determineCorrectWire(wires, answer = Math.floor(Math.random() * 10) + 1) {
    const countColor = (color) => wires.filter((w) => w.color === color).length;
    const hasColor = (color) => wires.some((w) => w.color === color);
    const getIndex = (color, fromEnd = false) => {
      const arr = wires.map((w) => w.color);
      return fromEnd ? arr.lastIndexOf(color) : arr.indexOf(color);
    };

    // --------------------------
    // 3-WIRE CASE
    // --------------------------
    if (wires.length === 3) {
      const reds = countColor("red");

      // Rule 1: Two Red Wires
      if (reds === 2) {
        return answer % 2 === 1
          ? [wires[0].id]
          : [wires[wires.length - 1].id];
      }

      // Rule 2: Blue and Green Adjacent
      for (let i = 0; i < wires.length - 1; i++) {
        if (
          (wires[i].color === "blue" && wires[i + 1].color === "green") ||
          (wires[i].color === "green" && wires[i + 1].color === "blue")
        ) {
          return answer % 3 === 0
            ? [wires.find((w) => w.color === "blue").id]
            : [wires.find((w) => w.color === "green").id];
        }
      }

      // Rule 3: Default
      return answer > 5 ? [wires[1].id] : [wires[wires.length - 1].id];
    }

    // --------------------------
    // 4-WIRE CASE
    // --------------------------
    if (wires.length === 4) {
      // Rule 1: No Yellow Wire
      if (!hasColor("yellow")) {
        const multiple2 = answer % 2 === 0;
        const multiple3 = answer % 3 === 0;

        if (multiple2 && multiple3) {
          return [wires[0].id];
        } else if (multiple2) {
          return [wires[0].id];
        } else if (multiple3) {
          return [wires[1].id];
        } else {
          return [wires[1].id];
        }
      }

      // Rule 2: More Than One Green Wire
      if (countColor("green") >= 2) {
        if (answer % 2 === 0) {
          const firstGreen = wires.find((w) => w.color === "green");
          return firstGreen ? [firstGreen.id] : [wires[0].id];
        } else {
          const idx = getIndex("green", true);
          return [wires[idx].id];
        }
      }

      // Rule 3: Default
      if (answer % 2 === 0) {
        return [wires[0].id];
      } else {
        return [wires[1].id];
      }
    }

    // --------------------------
    // 5-WIRE CASE
    // --------------------------
    if (wires.length === 5) {
      const colorCounts = {};
      wires.forEach((w) => {
        colorCounts[w.color] = (colorCounts[w.color] || 0) + 1;
      });

      const uniqueColorCount = Object.keys(colorCounts).length;

      // Rule 1: 1 Black or 1 Red Wire
      if (countColor("black") === 1 || countColor("red") === 1) {
        if (countColor("black") === 1) {
          const cube = Math.round(Math.cbrt(answer));
          const idx = Math.min(cube - 1, wires.length - 1);
          return [wires[idx].id];
        } else {
          const square = Math.round(Math.sqrt(answer));
          const idx = Math.min(square - 1, wires.length - 1);
          return [wires[idx].id];
        }
      }

      // Rule 2: 3 same + 2 different
      const dominantColor = Object.keys(colorCounts).find(
        (c) => colorCounts[c] === 3
      );
      if (dominantColor) {
        if (dominantColor === "red") {
          const idx = getIndex("red", true);
          return [wires[idx].id];
        }
        if (dominantColor === "blue") {
          return [wires[1].id];
        }

        const blackIdx = (() => {
          let count = 0;
          for (let i = 0; i < wires.length; i++) {
            if (wires[i].color === "black") {
              count++;
              if (count === 3) return i;
            }
          }
          return -1;
        })();

        if (blackIdx > 0) {
          const uniqueColor = Object.keys(colorCounts).find(
            (c) => colorCounts[c] === 1
          );
          const uniqueIdx = getIndex(uniqueColor);
          if (uniqueIdx !== -1 && uniqueIdx < blackIdx) {
            return [wires[uniqueIdx].id];
          }
        }
      }

      // Rule 3: 2 same + 2 same + 1 different
      const pairColors = Object.keys(colorCounts).filter(
        (c) => colorCounts[c] === 2
      );
      const uniqueColor = Object.keys(colorCounts).find(
        (c) => colorCounts[c] === 1
      );
      if (pairColors.length === 2 && uniqueColor) {
        const uniqueIdx = getIndex(uniqueColor);
        if (uniqueIdx === 2) return [wires[uniqueIdx].id];
        if (uniqueIdx === 0 || uniqueIdx === 4) {
          const oppositePairColor = pairColors[uniqueIdx === 0 ? 1 : 0];
          const allOfOpposite = wires
            .map((w, i) => ({ ...w, i }))
            .filter((w) => w.color === oppositePairColor);
          if (allOfOpposite.length > 1) {
            return [allOfOpposite[0].id];
          }
        }
        return [wires[3].id];
      }

      // Rule 4: All different
      if (uniqueColorCount === 5) {
        const idx = Math.min(answer - 1, wires.length - 1);
        return [wires[idx].id];
      }
    }

    return [wires[0].id];
  }

  // 🧠 Reset if new session
  useEffect(() => {
    const sessionMarker = sessionStorage.getItem("sessionActive");
    if (!sessionMarker) {
      sessionStorage.setItem("sessionActive", "true");
      localStorage.removeItem("wireSetup");
      localStorage.removeItem("correctWire");
      localStorage.removeItem("wires_moduleCompleted");
      localStorage.removeItem("wires_moduleStatus");
    }
  }, []);

  // 🧩 Initialize wires
  useEffect(() => {
    const completed = localStorage.getItem("wires_moduleCompleted");
    if (completed === "true") {
      const prevStatus =
        localStorage.getItem("wires_moduleStatus") || "defused";
      setStatus(prevStatus);
      setDisabled(true);
      return;
    }

    const savedSetup = localStorage.getItem("wireSetup");
    const savedCorrect = localStorage.getItem("correctWire");

    if (savedSetup && savedCorrect) {
      setWireSetup(JSON.parse(savedSetup));
      setCorrectWire(JSON.parse(savedCorrect));
    } else {
      const colors = ["red", "blue", "green", "yellow", "white", "black"];
      const wireCount = Math.floor(Math.random() * 3) + 3;
      const shuffled = [...colors]
        .sort(() => 0.5 - Math.random())
        .slice(0, wireCount);
      const positions = [70, 130, 190, 250, 310];
      const wires = shuffled.map((color, i) => ({
        id: `${color}Wire${i}`,
        y: positions[i],
        color,
      }));

      const correct = determineCorrectWire(wires);
      setWireSetup(wires);
      setCorrectWire(correct);

      localStorage.setItem("wireSetup", JSON.stringify(wires));
      localStorage.setItem("correctWire", JSON.stringify(correct));
    }
  }, []);

  // 🧩 Wire cutting logic
  useEffect(() => {
    if (wireSetup.length === 0 || disabled) return;

    wireSetup.forEach((wire) => {
      const path = document.getElementById(wire.id);
      if (path) path.addEventListener("click", () => cutWire(wire));
    });

    function cutWire(wire) {
      if (status || disabled) return;
      const path = document.getElementById(wire.id);
      if (!path || path.dataset.cut === "true") return;
      path.dataset.cut = "true";

      const svg = path.parentNode;
      path.remove();

      const createPath = (d, color) => {
        const newPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        newPath.setAttribute("d", d);
        newPath.setAttribute("stroke", color);
        newPath.setAttribute("stroke-width", 6);
        newPath.setAttribute("fill", "none");
        newPath.setAttribute("stroke-linecap", "round");
        newPath.classList.add("wire-shadow");
        return newPath;
      };

      const leftPath = createPath(
        `M 20 ${wire.y} C 150 ${wire.y - 40}, 200 ${wire.y + 10}, 250 ${
          wire.y - 20
        }`,
        wire.color
      );
      const rightPath = createPath(
        `M 270 ${wire.y + 10} C 320 ${wire.y + 40}, 400 ${wire.y - 20}, 500 ${
          wire.y
        }`,
        wire.color
      );

      const spark = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      spark.setAttribute("cx", 260);
      spark.setAttribute("cy", wire.y);
      spark.setAttribute("r", 5);
      spark.classList.add("spark");

      svg.appendChild(leftPath);
      svg.appendChild(rightPath);
      svg.appendChild(spark);
      setTimeout(() => spark.remove(), 600);

      const isCorrect =
        Array.isArray(correctWire) && correctWire.includes(wire.id);

      if (isCorrect) {
        setStatus("defused");
        localStorage.setItem("wires_moduleCompleted", "true");
        localStorage.setItem("wires_moduleStatus", "defused");
      } else {
        setStatus("exploded");
        playSound("/sounds/explosion.mp3");
        localStorage.setItem("wires_moduleCompleted", "true");
        localStorage.setItem("wires_moduleStatus", "exploded");
        setTimeout(() => navigate("/exploded"), 1500); // 🔥 Redirect after 1.5s
      }
      setDisabled(true);
    }

    return () => {
      wireSetup.forEach((wire) => {
        const path = document.getElementById(wire.id);
        if (path) path?.removeEventListener("click", () => cutWire(wire));
      });
    };
  }, [wireSetup, correctWire, status, disabled, navigate]);

  return (
    <div className="relative w-[520px] h-[340px] rounded-2xl border-[3px] border-gray-700 overflow-hidden bg-[#1b1b1b] shadow-[inset_0_0_30px_#000,0_0_20px_#000] flex flex-col items-center justify-center">
      {/* STOP Button */}
      <button
        disabled={disabled}
        className={`absolute bottom-[20px] right-[20px] px-6 py-2 font-bold rounded-full transition ${
          disabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-red-600 text-white shadow-[0_0_15px_red] hover:bg-red-800"
        }`}
        onClick={() => {
          if (!status && !disabled) {
            setStatus("exploded");
            setDisabled(true);
            playSound("/sounds/explosion.mp3");
            localStorage.setItem("wires_moduleCompleted", "true");
            localStorage.setItem("wires_moduleStatus", "exploded");
            setTimeout(() => navigate("/exploded"), 1500);
          }
        }}
      >
        STOP
      </button>

      {/* Wire End Nodes */}
      {wireSetup.map((wire, i) => (
        <React.Fragment key={i}>
          <div
            className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
            style={{
              left: "10px",
              top: `${wire.y - 10}px`,
              background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
          <div
            className="absolute w-[20px] h-[20px] rounded-full border-2 border-[#222]"
            style={{
              right: "10px",
              top: `${wire.y - 10}px`,
              background: "radial-gradient(circle at 30% 30%, #bbb, #555)",
            }}
          />
        </React.Fragment>
      ))}

      {/* SVG Wires */}
      <svg
        id="wires"
        className="absolute top-0 left-0 w-[520px] h-[340px] cursor-pointer"
      >
        {wireSetup.map((wire) => (
          <path
            key={wire.id}
            id={wire.id}
            className="wire-shadow"
            d={`M 20 ${wire.y} C 150 ${wire.y - 40}, 300 ${wire.y + 40}, 500 ${wire.y}`}
            stroke={wire.color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* ✅ Result Overlay */}
      {status && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${
            status === "defused"
              ? "text-green-400 bg-black/70"
              : "text-red-500 bg-black/70"
          }`}
        >
          {status === "defused" ? "✅ MODULE SOLVED" : "💥 BOMB EXPLODED"}
        </div>
      )}

      <style>{`
        .spark {
          fill: yellow;
          opacity: 0.9;
          animation: sparkAnim 0.5s ease-out forwards;
        }
        @keyframes sparkAnim {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .wire-shadow {
          filter: drop-shadow(0 0 2px #000);
        }
      `}</style>
    </div>
  );
}


